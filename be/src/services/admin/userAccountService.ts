import { UserAccountListQuery, 
  UserAccountCreateReq, UserAccountUpdateReq, 
  UserAccountPasswordChangeReq, UserAccountStatusUpdateReq, 
  UserAccountCheckEmailReq,
   ErrorCode } from '@iitp-dabt/common';
import bcrypt from 'bcrypt';
import { appLogger } from '../../utils/logger';
import { ResourceError, BusinessError } from '../../utils/customErrors';
import { openApiUserRepository } from '../../repositories/openApiUserRepository';
import { BCRYPT_SALT_ROUNDS } from '../../constants/security';  
import { arrayBuffer } from 'stream/consumers';
import { UserAccountListRes, UserAccountListItem,
  UserAccountDetailRes
 } from '@iitp-dabt/common';



export const userAccountService = {
  // 사용자 계정 목록 조회
  async getUserAccountList(query: UserAccountListQuery): Promise<UserAccountListRes> {
    try {
      const { page = 1, limit = 10, search, status, email } = query;
      const offset = (page - 1) * limit;

      const result = await openApiUserRepository.findUsers({
        offset,
        limit,
        search,
        status,
        email
      });

      const total = await openApiUserRepository.countUserAccounts({
        search,
        status,
        email
      });

      // 사용자 ID 목록 추출
      const userIds = result.map(user => user.userId);

      // 사용자별 OpenAPI 키 개수를 한 번에 조회 (성능 최적화)
      const keyCounts = await openApiUserRepository.getUserOpenApiKeyCounts(userIds);

      // OpenApiUser를 UserAccountListItem으로 변환
      const items: UserAccountListItem[] = result.map(user => ({
        userId: user.userId,
        loginId: user.loginId,
        name: user.userName,
        status: user.status,
        latestKeyCreatedAt: user.latestKeyCreatedAt?.toISOString(),
        latestLoginAt: user.latestLoginAt?.toISOString(),
        keyCount: keyCounts.get(user.userId) || 0,
        delYn: user.delYn,
        createdAt: user.createdAt.toISOString()
      }));

      return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      appLogger.error('사용자 계정 목록 조회 서비스 오류:', { error, query });
      throw new BusinessError(
        ErrorCode.DATABASE_ERROR,
        '사용자 계정 목록 조회 중 오류가 발생했습니다.',
        { query, originalError: error }
      );
    }
  },

  // 사용자 계정 상세 조회
  async getUserAccountDetail(userId: number): Promise<UserAccountDetailRes> {
    try {
      const user = await openApiUserRepository.findUserAccountById(userId);
      if (!user) {
        throw new ResourceError(
          ErrorCode.ACCOUNT_NOT_FOUND,
          '사용자 계정을 찾을 수 없습니다.',
          'user',
          userId
        );
      }

      // OpenAPI 키 개수 조회
      const openApiKeyCount = await openApiUserRepository.countUserOpenApiKeys(userId);

      return {
        user: {
          userId: user.userId,
          loginId: user.loginId,
          name: user.userName, 
          status: user.status,
          affiliation: user.affiliation,
          note: user.note,
          latestKeyCreatedAt: user.latestKeyCreatedAt?.toISOString(),
          latestLoginAt: user.latestLoginAt?.toISOString(),
          keyCount: openApiKeyCount,
          delYn: user.delYn,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt?.toISOString(),
          deletedAt: user.deletedAt?.toISOString(),
          createdBy: user.createdBy,
          updatedBy: user.updatedBy,
          deletedBy: user.deletedBy
        }
      };
    } catch (error) {
      if (error instanceof ResourceError) {
        throw error;
      }
      appLogger.error('사용자 계정 상세 조회 서비스 오류:', { error, userId });
      throw new BusinessError(
        ErrorCode.DATABASE_ERROR,
        '사용자 계정 상세 조회 중 오류가 발생했습니다.',
        { userId, originalError: error }
      );
    }
  },

  // 사용자 계정 생성
  async createUserAccount(data: UserAccountCreateReq, actorTag: string): Promise<{ userId: number }> {
    try {
      // 비밀번호 해시화
      const hashedPassword = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);

      const result = await openApiUserRepository.createUserAccount({
        loginId: data.loginId,
        password: hashedPassword,
        name: data.name, 
        status: data.status || 'A', // 기본값: 활성
        createdBy: actorTag 
      });

      return result;
    } catch (error) {
      appLogger.error('사용자 계정 생성 서비스 오류:', { error, data: { ...data, password: '[HIDDEN]' } });
      throw new BusinessError(
        ErrorCode.ACCOUNT_CREATE_FAILED,
        '사용자 계정 생성 중 오류가 발생했습니다.',
        { data: { ...data, password: '[HIDDEN]' }, originalError: error }
      );
    }
  },

  // 사용자 계정 수정
  async updateUserAccount(userId: number, data: UserAccountUpdateReq, actorTag: string) {
    try {
      const updateData: any = {};
      
      if (data.name !== undefined) updateData.userName = data.name; // name을 userName으로 매핑
      if (data.status !== undefined) updateData.status = data.status;
      if (data.affiliation !== undefined) updateData.affiliation = data.affiliation;
      if (data.note !== undefined) updateData.note = data.note;

      updateData.updatedBy = actorTag; 
      updateData.updatedAt = new Date();

      await openApiUserRepository.updateUserAccount(userId, updateData);
    } catch (error) {
      appLogger.error('사용자 계정 수정 서비스 오류:', { error, userId, data });
      throw error;
    }
  },

  // 사용자 계정 삭제
  async deleteUserAccount(userId: number, actorTag: string) {
    try {
      await openApiUserRepository.deleteUserAccount(userId, actorTag); 
    } catch (error) {
      appLogger.error('사용자 계정 삭제 서비스 오류:', { error, userId });
      throw error;
    }
  },


  // 사용자 계정 목록 삭제
  async deleteUserAccountList(userIds: number[], actorTag: string) {  
    try {
      const deleteCount = await openApiUserRepository.deleteUserAccountList(userIds, actorTag); 
      if (deleteCount === 0) {
        throw new ResourceError(
          ErrorCode.ACCOUNT_NOT_FOUND,
          '삭제할 사용자 계정을 찾을 수 없습니다.',
          'user',
          userIds.toString()
        );
      }
    } catch (error) {
      appLogger.error('사용자 계정 목록 삭제 서비스 오류:', { error, userIds });
      throw error;
    }
  },




  // 사용자 계정 비밀번호 변경
  async changeUserPassword(userId: number, data: UserAccountPasswordChangeReq, actorTag: string) {
    try {
      // 비밀번호 해시화
      const hashedPassword = await bcrypt.hash(data.newPassword, BCRYPT_SALT_ROUNDS);

      await openApiUserRepository.updatePassword(userId, hashedPassword, actorTag); 
    } catch (error) {
      appLogger.error('사용자 계정 비밀번호 변경 서비스 오류:', { error, userId, data: { ...data, newPassword: '[HIDDEN]' } });
      throw error;
    }
  },

  // 사용자 계정 상태 업데이트
  async updateUserStatus(userId: number, data: UserAccountStatusUpdateReq, actorTag: string) {
    try {
      const updateData: any = {
        status: data.status,
        updatedBy: actorTag,
        updatedAt: new Date()
      };

      if (data.reason) {
        // 상태 변경 사유를 note 필드에 저장
        updateData.note = data.reason;
      }

      await openApiUserRepository.updateUserAccount(userId, updateData);
    } catch (error) {
      appLogger.error('사용자 계정 상태 업데이트 서비스 오류:', { error, userId, data });
      throw error;
    }
  },

  // 사용자 계정 이메일 중복 체크
  async checkUserEmail(data: UserAccountCheckEmailReq) {
    try {
      const existingAccount = await openApiUserRepository.findUserByEmail(data.email);
      
      return {
        available: !existingAccount
      };
    } catch (error) {
      appLogger.error('사용자 계정 이메일 중복 체크 서비스 오류:', { error, data });
      throw error;
    }
  }
} as const;

