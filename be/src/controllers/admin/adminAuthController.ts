import { Request, Response } from 'express';
import { ErrorCode, COMMON_CODE_GROUPS } from '@iitp-dabt/common';
import { sendError, sendSuccess } from '../../utils/errorHandler';
import { loginAdmin, logout, refreshAdminToken } from '../../services/admin/adminAuthService';
import { appLogger } from '../../utils/logger';
import { getAdminRoleCodeName } from '../../services/common/commonCodeService';
import { trimStringFieldsExcept } from '../../utils/trimUtils';
import {
  AdminLoginReq,
  AdminLoginRes,
  AdminLogoutReq,
  AdminLogoutRes,
  AdminRefreshTokenReq,
  AdminRefreshTokenRes,
  ApiResponse
} from '@iitp-dabt/common';

// 관리자 로그인
export const adminLogin = async (req: Request<{}, {}, AdminLoginReq>, res: Response) => {
  try {
    // trim 처리 적용 (비밀번호 제외)
    const { loginId, password } = trimStringFieldsExcept(req.body, ['password']);
    const ipAddr = req.ip || req.connection.remoteAddress || '';
    const userAgent = req.headers['user-agent'] as string;

    const result = await loginAdmin(loginId, password, ipAddr, userAgent);

    const roleName = result.roleCode ? await getAdminRoleCodeName(result.roleCode) : '관리자';

    const response: AdminLoginRes = {
      token: result.token,
      refreshToken: result.refreshToken,
      admin: {
        adminId: result.userId,
        name: result.name || '',
        role: roleName
      }
    };
    sendSuccess(res, response, undefined, 'ADMIN_LOGIN', { userId: result.userId, loginId });
  } catch (error) {
    appLogger.error('Error in adminLogin:', error);
    if (error instanceof Error && error.message.includes('ErrorCode.')) {
      const errorCode = error.message.split('ErrorCode.')[1];
      sendError(res, ErrorCode[errorCode as keyof typeof ErrorCode]);
    } else {
      sendError(res, ErrorCode.LOGIN_FAILED);
    }
  }
};

// 관리자 로그아웃
export const adminLogout = async (req: Request<{}, {}, AdminLogoutReq>, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    await logout(userId, 'A');
    sendSuccess(res, { success: true, message: '로그아웃되었습니다.' } as AdminLogoutRes, undefined, 'ADMIN_LOGOUT', { userId });
  } catch (error) {
    appLogger.error('Error in adminLogout:', error);
    sendError(res, ErrorCode.LOGOUT_FAILED);
  }
};

// 관리자 토큰 갱신
export const adminRefresh = async (req: Request<{}, {}, AdminRefreshTokenReq>, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const result = await refreshAdminToken(refreshToken);
    const response: AdminRefreshTokenRes = {
      token: result.token,
      refreshToken: result.refreshToken
    };
    sendSuccess(res, response, undefined, 'ADMIN_REFRESH', { userId: result.userId });
  } catch (error) {
    appLogger.error('Error in adminRefresh:', error);
    sendError(res, ErrorCode.LOGIN_FAILED);
  }
}; 