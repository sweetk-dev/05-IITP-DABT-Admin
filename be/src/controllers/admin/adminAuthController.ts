import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError, sendSuccess } from '../../utils/errorHandler';
import { loginAdmin, logout } from '../../services/admin/adminAuthService';
import { 
  AdminLoginReq, 
  AdminLoginRes, 
  AdminLogoutReq, 
  AdminLogoutRes 
} from '@iitp-dabt/common';

// 관리자 로그인
export const adminLogin = async (req: Request<{}, {}, AdminLoginReq>, res: Response) => {
  try {
    const { loginId, password } = req.body;
    const ipAddr = req.ip || req.connection.remoteAddress || '';
    const userAgent = req.headers['user-agent'] as string;

    const result = await loginAdmin(loginId, password, ipAddr, userAgent);

    const response: AdminLoginRes = {
      token: result.token,
      userId: result.userId,
      userType: result.userType as 'A',
      loginId: result.loginId || '',
      name: result.name || ''
    };

    sendSuccess(res, response, undefined, 'ADMIN_LOGIN', { userId: result.userId, loginId });
  } catch (error) {
    sendError(res, ErrorCode.LOGIN_FAILED);
  }
};

// 관리자 로그아웃
export const adminLogout = async (req: Request<{}, {}, AdminLogoutReq>, res: Response) => {
  try {
    const { userId, userType } = req.body;
    const ipAddr = req.ip || req.connection.remoteAddress || '';
    const userAgent = req.headers['user-agent'] as string;

    const result = await logout(userId, userType, '관리자 로그아웃', ipAddr, userAgent);

    const response: AdminLogoutRes = {
      success: result.success,
      message: result.message
    };

    sendSuccess(res, response, undefined, 'ADMIN_LOGOUT', { userId, userType });
  } catch (error) {
    sendError(res, ErrorCode.LOGOUT_FAILED);
  }
}; 