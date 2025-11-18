import { AdminAccountListQuery, AdminAccountCreateReq, 
  AdminAccountUpdateReq, AdminAccountPasswordChangeReq, 
  AdminAccountRoleUpdateReq, AdminAccountCheckEmailReq,
  AdminAccountListDeleteReq,
  ErrorCode
} from '@iitp-dabt/common';
import bcrypt from 'bcrypt';
import { appLogger } from '../../utils/logger';
import { ResourceError, BusinessError } from '../../utils/customErrors';
import { sysAdmAccountRepository } from '../../repositories/sysAdmAccountRepository';
import { BCRYPT_SALT_ROUNDS } from '../../constants/security';
import { AdminAccountListRes, AdminAccountListItem, AdminAccountDetailRes} from '@iitp-dabt/common';

export const adminAccountService = {
  // 운영자 계정 목록 조회
  async getAdminAccountList(query: AdminAccountListQuery): Promise<AdminAccountListRes> {
    try {
      const { page = 1, limit = 10, search, status, role, affiliation } = query;
      const offset = (page - 1) * limit;

      const result = await sysAdmAccountRepository.findAdminAccounts({
        offset,
        limit,
        search,
        status,
        role,
        affiliation
      });

      const total = await sysAdmAccountRepository.countAdminAccounts({
        search,
        status,
        role,
        affiliation
      });

      // SysAdmAccount를 AdminAccountListItem으로 변환
      const items: AdminAccountListItem[] = result.map(operator => ({
        adminId: operator.admId,
        loginId: operator.loginId,
        name: operator.name,
        role: operator.roles,
        roleName: operator.roles, // TODO: 역할 코드명으로 변환 필요
        status: operator.status,
        delYn: operator.delYn,
        createdAt: operator.createdAt.toISOString(),
        lastLoginAt: operator.latestLoginAt?.toISOString()
      }));

      return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      appLogger.error('운영자 계정 목록 조회 서비스 오류:', { error, query });
      throw new BusinessError(
        ErrorCode.DATABASE_ERROR,
        '운영자 계정 목록 조회 중 오류가 발생했습니다.',
        { query, originalError: error }
      );
    }
  },

  // 운영자 계정 상세 조회
  async getAdminAccountDetail(adminId: number): Promise<AdminAccountDetailRes> {
    try {
      const operator = await sysAdmAccountRepository.findAdminById(adminId);
      if (!operator) {
        throw new ResourceError(
          ErrorCode.ADMIN_NOT_FOUND,
          '운영자 계정을 찾을 수 없습니다.',
          'admin',
          adminId
        );
      }

      return {
        admin: {
          adminId: operator.admId,
          loginId: operator.loginId,
          name: operator.name,
          role: operator.roles,
          roleName: operator.roles, // TODO: 역할 코드명으로 변환 필요
          affiliation: operator.affiliation,
          description: operator.description,
          note: operator.note,
          status: operator.status,
          delYn: operator.delYn,
          createdAt: operator.createdAt.toISOString(),
          updatedAt: operator.updatedAt?.toISOString(),
          deletedAt: operator.deletedAt?.toISOString(),
          lastLoginAt: operator.latestLoginAt?.toISOString(),
          createdBy: operator.createdBy,
          updatedBy: operator.updatedBy,
          deletedBy: operator.deletedBy
        }
      };
    } catch (error) {
      if (error instanceof ResourceError) {
        throw error;
      }
      appLogger.error('운영자 계정 상세 조회 서비스 오류:', { error, adminId });
      throw new BusinessError(
        ErrorCode.DATABASE_ERROR,
        '운영자 계정 상세 조회 중 오류가 발생했습니다.',
        { adminId, originalError: error }
      );
    }
  },

  // 운영자 계정 생성
  async createAdminAccount(data: AdminAccountCreateReq, actorTag: string) {
    try {
      // 비밀번호 해시화
      const hashedPassword = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);

      const result = await sysAdmAccountRepository.createAdmin({
        loginId: data.loginId,
        password: hashedPassword,
        name: data.name,
        role: data.role,
        affiliation: data.affiliation,
        description: data.description,
        note: data.note,
        createdBy: actorTag
      });

      return { adminId: result.admId };
    } catch (error) {
      appLogger.error('운영자 계정 생성 서비스 오류:', { error, data: { ...data, password: '[HIDDEN]' } });
      throw new BusinessError(
        ErrorCode.ADMIN_CREATE_FAILED,
        '운영자 계정 생성 중 오류가 발생했습니다.',
        { data: { ...data, password: '[HIDDEN]' }, originalError: error }
      );
    }
  },

  // 운영자 계정 수정
  async updateAdminAccount(adminId: number, data: AdminAccountUpdateReq, actorTag: string) {
    try {
      const updateData: any = {};
      
      if (data.name !== undefined) updateData.name = data.name;
      if (data.role !== undefined) updateData.role = data.role;
      if (data.affiliation !== undefined) updateData.affiliation = data.affiliation;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.note !== undefined) updateData.note = data.note;
      if (data.status !== undefined) updateData.status = data.status;

      updateData.updatedBy = actorTag; 
      updateData.updatedAt = new Date();

      await sysAdmAccountRepository.updateAdmin(adminId, updateData);
    } catch (error) {
      appLogger.error('운영자 계정 수정 서비스 오류:', { error, adminId, data });
      throw error;
    }
  },

  // 운영자 계정 삭제
  async deleteAdminAccount(adminId: number, actorTag: string) {
    try {
      await sysAdmAccountRepository.deleteAdmin(adminId, actorTag);
    } catch (error) {
      appLogger.error('운영자 계정 삭제 서비스 오류:', { error, adminId });
      throw error;
    }
  },




  // 운영자 계정 목록 삭제
  async deleteAdminAccountList(data: AdminAccountListDeleteReq, actorTag: string) {
    try { 
      const { adminIds } = data;

      const deleteCount = await sysAdmAccountRepository.deleteAdminList(adminIds, actorTag);
      if (deleteCount === 0) {
        throw new ResourceError(
          ErrorCode.ADMIN_NOT_FOUND,
          '삭제할 운영자 계정을 찾을 수 없습니다.',
          'admin',
          adminIds.toString()
        );
      }
    } catch (error) {
      appLogger.error('운영자 계정 목록 삭제 서비스 오류:', { error, data });
      throw new BusinessError(
        ErrorCode.ADMIN_DELETE_FAILED,
        '운영자 계정 목록 삭제 중 오류가 발생했습니다.', 
        { data, originalError: error }
      );
    }
  },





  // 운영자 계정 비밀번호 변경
  async changeAdminPassword(adminId: number, data: AdminAccountPasswordChangeReq, actorTag: string) {
    try {
      // 비밀번호 해시화
      const hashedPassword = await bcrypt.hash(data.newPassword, BCRYPT_SALT_ROUNDS);

      await sysAdmAccountRepository.updateAdminPassword(adminId, hashedPassword, actorTag); 
    } catch (error) {
      appLogger.error('운영자 계정 비밀번호 변경 서비스 오류:', { error, adminId, data: { ...data, newPassword: '[HIDDEN]' } });
      throw error;
    }
  },

  // 운영자 계정 역할 업데이트
  async updateAdminRole(adminId: number, data: AdminAccountRoleUpdateReq, actorTag: string) {
    try {
      const updateData: any = {
        role: data.role,
        updatedBy: actorTag, // TODO: 실제 로그인한 관리자 ID로 변경
        updatedAt: new Date()
      };

      if (data.reason) {
        updateData.note = data.reason;
      }

      await sysAdmAccountRepository.updateAdmin(adminId, updateData);
    } catch (error) {
      appLogger.error('운영자 계정 역할 업데이트 서비스 오류:', { error, adminId, data });
      throw error;
    }
  },

  // 운영자 계정 이메일 중복 체크
  async checkAdminEmail(data: AdminAccountCheckEmailReq) {
    try {
      const existingAccount = await sysAdmAccountRepository.findAdminByLoginId(data.loginId);
      
      return {
        available: !existingAccount
      };
    } catch (error) {
      appLogger.error('운영자 계정 이메일 중복 체크 서비스 오류:', { error, data });
      throw error;
    }
  }
} as const;


