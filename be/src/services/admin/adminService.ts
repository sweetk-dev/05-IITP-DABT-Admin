import bcrypt from 'bcrypt';
import { appLogger } from '../../utils/logger';
import { 
    COMMON_CODE_GROUPS,
    AdminProfileRes,
    ErrorCode,
    CODE_SYS_WORK_TYPES
} from '@iitp-dabt/common';
import { 
sysAdmAccountRepository
} from '../../repositories/sysAdmAccountRepository';
import { 
  commonCodeRepository
} from '../../repositories/sysCommonCodeRepository';
import { ResourceError, BusinessError, ValidationError } from '../../utils/customErrors';

export const adminService = {
    
    // 관리자 정보 조회
    async getAdminById(adminId: number): Promise<AdminProfileRes> {
        try {
            const admin = await sysAdmAccountRepository.findAdminById(adminId);
            if (!admin) {
                throw new ResourceError(
                    ErrorCode.ADMIN_NOT_FOUND,
                    '관리자를 찾을 수 없습니다.',
                    'admin',
                    adminId
                );
            }

            const roleCode = await commonCodeRepository.findCommonCodeById(COMMON_CODE_GROUPS.SYS_ADMIN_ROLES, admin.roles);

            return {
                adminId: admin.admId,
                loginId: admin.loginId,
                name: admin.name,
                affiliation: admin.affiliation,
                role: admin.roles,
                roleName: roleCode ? roleCode.codeNm : 'Etc Admin',
                createdAt: admin.createdAt.toISOString()
            };

        } catch (error) {
            if (error instanceof ResourceError) {
                throw error;
            }
            appLogger.error('관리자 정보 조회 서비스 오류:', { error, adminId });
            throw new BusinessError(
                ErrorCode.DATABASE_ERROR,
                '관리자 정보 조회 중 오류가 발생했습니다.',
                { adminId, originalError: error }
            );
        }
    },

    // 관리자 프로필 업데이트
    async updateAdminProfile(adminId: number, updateData: { name: string; affiliation?: string; }): Promise<void> {
        try {  
            const admin = await sysAdmAccountRepository.findAdminById(adminId);
            if (!admin) {
                throw new ResourceError(
                    ErrorCode.ADMIN_NOT_FOUND,
                    '수정할 관리자를 찾을 수 없습니다.',
                    'admin',
                    adminId
                );
            }

            // 프로필 업데이트
            const updated = await sysAdmAccountRepository.updateAdmin(adminId, {
                name: updateData.name,
                affiliation: updateData.affiliation,
                updatedBy: CODE_SYS_WORK_TYPES.USER 
            });

            if (!updated) {
                throw new BusinessError(
                    ErrorCode.ADMIN_UPDATE_FAILED,
                    '관리자 프로필 업데이트 중 오류가 발생했습니다.',
                    { adminId, updateData }
                );
            }

            appLogger.info('관리자 프로필 업데이트 성공', { adminId, updateData });
        } catch (error) {
            if (error instanceof ResourceError || error instanceof BusinessError) {
                throw error;
            }
            appLogger.error('관리자 프로필 업데이트 서비스 오류:', { error, adminId, updateData });
            throw new BusinessError(
                ErrorCode.DATABASE_ERROR,
                '관리자 프로필 업데이트 중 오류가 발생했습니다.',
                { adminId, updateData, originalError: error }
            );
        }
    },

    // 관리자 비밀번호 변경
    async changeAdminPassword(adminId: number, currentPassword: string, newPassword: string): Promise<void> {
        try {
            const admin = await sysAdmAccountRepository.findAdminById(adminId);
            if (!admin) {
                throw new ResourceError(
                    ErrorCode.ADMIN_NOT_FOUND,
                    '비밀번호를 변경할 관리자를 찾을 수 없습니다.',
                    'admin',
                    adminId
                );
            }

            // 현재 비밀번호 확인
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
            if (!isCurrentPasswordValid) {
                throw new ValidationError(
                    ErrorCode.ACCOUNT_PASSWORD_INVALID,
                    '현재 비밀번호가 올바르지 않습니다.',
                    'currentPassword'
                );
            }

            // 새 비밀번호 해시화
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // 비밀번호 업데이트
            const updated = await sysAdmAccountRepository.updateAdminPassword(adminId, hashedNewPassword, CODE_SYS_WORK_TYPES.USER);
            if (!updated) {
                throw new BusinessError(
                    ErrorCode.ADMIN_PASSWORD_CHANGE_FAILED,
                    '관리자 비밀번호 변경 중 오류가 발생했습니다.',
                    { adminId }
                );
            }

            appLogger.info('관리자 비밀번호 변경 성공', { adminId });
        } catch (error) {
            if (error instanceof ResourceError || error instanceof ValidationError || error instanceof BusinessError) {
                throw error;
            }
            appLogger.error('관리자 비밀번호 변경 서비스 오류:', { error, adminId });
            throw new BusinessError(
                ErrorCode.DATABASE_ERROR,
                '관리자 비밀번호 변경 중 오류가 발생했습니다.',
                { adminId, originalError: error }
            );
        }
    }
} as const;


