import { Request, Response } from 'express';
import { ErrorCode, isValidPassword } from '@iitp-dabt/common';
import { sendError, sendValidationError, sendDatabaseError, sendSuccess } from '../../utils/errorHandler';
import { findAdminById, updateAdmin, updateAdminPassword } from '../../repositories/sysAdmAccountRepository';
import { getAdminRoleCodeName } from '../../services/common/commonCodeService';
import { appLogger } from '../../utils/logger';
import bcrypt from 'bcrypt';
import { 
  AdminProfileRes,
  AdminProfileUpdateReq,
  AdminProfileUpdateRes,
  AdminPasswordChangeReq,
  AdminPasswordChangeRes
} from '@iitp-dabt/common';

// 관리자 프로필 조회 (필요한 정보만)
export const getAdminProfile = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.userId;
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    const admin = await findAdminById(adminId);
    if (!admin) {
      return sendError(res, ErrorCode.ADMIN_NOT_FOUND);
    }

    const roleName = admin.roles ? await getAdminRoleCodeName(admin.roles) : '관리자';

    const response: AdminProfileRes = {
      adminId: admin.admId,
      loginId: admin.loginId,
      name: admin.name,
      role: roleName,
      affiliation: admin.affiliation,
      createdAt: admin.createdAt.toISOString()
    };

    sendSuccess(res, response, undefined, 'ADMIN_PROFILE_VIEW', {
      adminId: admin.admId,
      loginId: admin.loginId
    });
  } catch (error) {
    appLogger.error('관리자 프로필 조회 중 오류 발생', { error, adminId: req.user?.userId });
    sendDatabaseError(res, '조회', '관리자 프로필');
  }
};

// 관리자 프로필 변경
export const updateAdminProfile = async (req: Request<{}, {}, AdminProfileUpdateReq>, res: Response) => {
  try {
    const adminId = req.user?.userId;
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    const { name, affiliation } = req.body;

    // 필수 필드 검증
    if (!name) {
      return sendValidationError(res, 'name', '이름이 필요합니다.');
    }

    const admin = await findAdminById(adminId);
    if (!admin) {
      return sendError(res, ErrorCode.ADMIN_NOT_FOUND);
    }

    // 프로필 업데이트
    await updateAdmin(adminId, {
      name: name,
      affiliation: affiliation,
      updatedBy: 'BY-ADMIN'
    });

    const response: AdminProfileUpdateRes = {
      success: true,
      message: '프로필이 성공적으로 업데이트되었습니다.'
    };

    appLogger.info('관리자 프로필 업데이트 성공', {
      adminId: adminId,
      name: name,
      affiliation: affiliation
    });

    sendSuccess(res, response, '프로필이 성공적으로 업데이트되었습니다.', 'ADMIN_PROFILE_UPDATE', {
      adminId: adminId,
      name: name,
      affiliation: affiliation
    });
  } catch (error) {
    appLogger.error('관리자 프로필 업데이트 중 오류 발생', { error, adminId: req.user?.userId });
    sendDatabaseError(res, '업데이트', '관리자 프로필');
  }
};

// 관리자 비밀번호 변경
export const changeAdminPassword = async (req: Request<{}, {}, AdminPasswordChangeReq>, res: Response) => {
  try {
    const adminId = req.user?.userId;
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    const { currentPassword, newPassword } = req.body;

    // 필수 필드 검증
    if (!currentPassword) {
      return sendValidationError(res, 'currentPassword', '현재 비밀번호가 필요합니다.');
    }
    if (!newPassword) {
      return sendValidationError(res, 'newPassword', '새 비밀번호가 필요합니다.');
    }

    // common 패키지의 비밀번호 강도 검증 사용
    if (!isValidPassword(newPassword)) {
      return sendError(res, ErrorCode.USER_PASSWORD_TOO_WEAK);
    }

    const admin = await findAdminById(adminId);
    if (!admin) {
      return sendError(res, ErrorCode.ADMIN_NOT_FOUND);
    }

    // 현재 비밀번호 확인
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isCurrentPasswordValid) {
      return sendError(res, ErrorCode.USER_PASSWORD_INCORRECT);
    }

    // 새 비밀번호 해시화
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 비밀번호 업데이트
    await updateAdminPassword(adminId, hashedNewPassword, 'BY-ADMIN');

    const response: AdminPasswordChangeRes = {
      success: true,
      message: '비밀번호가 성공적으로 변경되었습니다.'
    };

    appLogger.info('관리자 비밀번호 변경 성공', {
      adminId: adminId
    });

    sendSuccess(res, response, '비밀번호가 성공적으로 변경되었습니다.', 'ADMIN_PASSWORD_CHANGE', {
      adminId: adminId
    });
  } catch (error) {
    appLogger.error('관리자 비밀번호 변경 중 오류 발생', { error, adminId: req.user?.userId });
    sendDatabaseError(res, '변경', '관리자 비밀번호');
  }
}; 