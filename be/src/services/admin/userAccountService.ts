import { UserAccountListQuery, 
  UserAccountCreateReq, UserAccountUpdateReq, 
  UserAccountPasswordChangeReq, UserAccountStatusUpdateReq, 
  UserAccountCheckEmailReq,
   ErrorCode } from '@iitp-dabt/common';
import bcrypt from 'bcrypt';
import { appLogger } from '../../utils/logger';
import { ResourceError, BusinessError } from '../../utils/customErrors';
import { openApiUserRepository } from '../../repositories/openApiUserRepository';
// [추가 2026-10] 사용자 비활성/정지/삭제 시 그 사용자의 인증 키를 함께 비활성화하기 위해 사용
import { deactivateAuthKeysByUserIds } from '../../repositories/openApiAuthKeyRepository';
import sequelize from '../../models';
import { BCRYPT_SALT_ROUNDS } from '../../constants/security';  
import { arrayBuffer } from 'stream/consumers';
import { UserAccountListRes, UserAccountListItem,
  UserAccountDetailRes
 } from '@iitp-dabt/common';



/**
 * [추가 2026-10] Open API 사용자 상태가 '활성(A)'이 아닌 값으로 바뀌는 요청인지 판단
 *  - 사용자 상태 코드: A=활성, I=비활성, S=정지 (관리자 화면 UserEdit/UserCreate 선택지 기준)
 *  - 외부 Open API 서버는 키 소유자 상태가 'A' 인지도 확인하지만, 키 테이블의 active_yn 도 실제 상태와
 *    맞춰 두어야 관리 화면·통계·다른 소비처에서 "사용 중인 키"로 오인되지 않는다.
 */
const isNonActiveUserStatus = (status?: string): boolean => status !== undefined && status !== 'A';

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

      // [수정 2026-10] 상태를 비활성(I)/정지(S)로 바꾸면 그 사용자의 활성 키도 같은 트랜잭션에서 active_yn='N' 으로 내린다.
      //  - 사용자 UPDATE 와 키 비활성화 중 하나라도 실패하면 둘 다 롤백된다.
      //  - 상태를 다시 활성(A)으로 바꿔도 키는 자동으로 켜지지 않는다(관리자가 키별로 다시 활성화).
      await sequelize.transaction(async (transaction) => {
        const updated = await openApiUserRepository.updateUserAccount(userId, updateData, transaction);
        if (updated && isNonActiveUserStatus(data.status)) {
          const deactivated = await deactivateAuthKeysByUserIds([userId], actorTag, transaction);
          appLogger.info('사용자 상태 변경에 따른 인증 키 비활성화', { userId, status: data.status, deactivated });
        }
      });
    } catch (error) {
      appLogger.error('사용자 계정 수정 서비스 오류:', { error, userId, data });
      throw error;
    }
  },

  // 사용자 계정 삭제
  async deleteUserAccount(userId: number, actorTag: string) {
    try {
      // [수정 2026-10] 사용자 삭제와 그 사용자의 활성 키 비활성화(active_yn='N')를 한 트랜잭션으로 처리한다.
      //  - 키 행 자체는 삭제하지 않는다(이력 보존). 외부 Open API 인증은 active_yn='Y' 를 요구하므로 차단된다.
      await sequelize.transaction(async (transaction) => {
        const deleted = await openApiUserRepository.deleteUserAccount(userId, actorTag, transaction);
        if (deleted) {
          const deactivated = await deactivateAuthKeysByUserIds([userId], actorTag, transaction);
          appLogger.info('사용자 삭제에 따른 인증 키 비활성화', { userId, deactivated });
        }
      });
    } catch (error) {
      appLogger.error('사용자 계정 삭제 서비스 오류:', { error, userId });
      throw error;
    }
  },


  // 사용자 계정 목록 삭제
  async deleteUserAccountList(userIds: number[], actorTag: string) {  
    try {
      // [수정 2026-10] 사용자 일괄 삭제와 해당 사용자들의 활성 키 비활성화를 한 트랜잭션으로 처리한다.
      const deleteCount = await sequelize.transaction(async (transaction) => {
        const count = await openApiUserRepository.deleteUserAccountList(userIds, actorTag, transaction);
        if (count > 0) {
          const deactivated = await deactivateAuthKeysByUserIds(userIds, actorTag, transaction);
          appLogger.info('사용자 일괄 삭제에 따른 인증 키 비활성화', { userIds, deactivated });
        }
        return count;
      });
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

      // [수정 2026-10] 상태를 비활성(I)/정지(S)로 바꾸면 그 사용자의 활성 키도 같은 트랜잭션에서 active_yn='N' 으로 내린다.
      //  (계정 수정 API 와 같은 규칙. 다시 활성(A)으로 바꿔도 키는 자동으로 켜지지 않는다.)
      await sequelize.transaction(async (transaction) => {
        const updated = await openApiUserRepository.updateUserAccount(userId, updateData, transaction);
        if (updated && isNonActiveUserStatus(data.status)) {
          const deactivated = await deactivateAuthKeysByUserIds([userId], actorTag, transaction);
          appLogger.info('사용자 상태 변경에 따른 인증 키 비활성화', { userId, status: data.status, deactivated });
        }
      });
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

