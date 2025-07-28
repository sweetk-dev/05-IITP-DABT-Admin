import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError, sendSuccess } from '../../utils/errorHandler';
import { findAdminById } from '../../repositories/sysAdmAccountRepository';
import { getAdminRoleCodeName } from '../../services/common/commonCodeService';
import { appLogger } from '../../utils/logger';
import { AdminProfileRes } from '@iitp-dabt/common';

// 관리자 프로필 조회
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
      description: admin.description,
      status: admin.status,
      createdAt: admin.createdAt.toISOString(),
      lastLoginAt: admin.latestLoginAt?.toISOString()
    };

    sendSuccess(res, response, undefined, 'ADMIN_PROFILE_VIEW', {
      adminId: admin.admId,
      loginId: admin.loginId
    });
  } catch (error) {
    appLogger.error('관리자 프로필 조회 중 오류 발생', { error, adminId: req.user?.userId });
    sendError(res, ErrorCode.INTERNAL_SERVER_ERROR);
  }
}; 