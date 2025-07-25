import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError } from '../../utils/errorHandler';
import { loginAdmin, logout } from '../../services/admin/adminAuthService';
import { appLogger } from '../../utils/logger';

// 관리자 로그인
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { loginId, password } = req.body;
    const ipAddr = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    if (!loginId) {
      return sendError(res, ErrorCode.ADMIN_ID_REQUIRED);
    }
    if (!password) {
      return sendError(res, ErrorCode.ADMIN_PASSWORD_REQUIRED);
    }

    const result = await loginAdmin(loginId, password, ipAddr, userAgent);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    appLogger.error('Admin login error:', error);
    sendError(res, ErrorCode.LOGIN_FAILED);
  }
};

// 관리자 로그아웃
export const adminLogout = async (req: Request, res: Response) => {
  try {
    const { userId, userType } = req.body;
    const ipAddr = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = await logout(userId, userType, '관리자 로그아웃', ipAddr, userAgent);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    appLogger.error('Admin logout error:', error);
    sendError(res, ErrorCode.LOGOUT_FAILED);
  }
}; 