import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError } from '../../utils/errorHandler';
import { loginUser, logout } from '../../services/user/userAuthService';

// 사용자 로그인
export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const ipAddr = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    if (!email) {
      return sendError(res, ErrorCode.USER_EMAIL_REQUIRED);
    }
    if (!password) {
      return sendError(res, ErrorCode.USER_PASSWORD_REQUIRED);
    }

    const result = await loginUser(email, password, ipAddr, userAgent);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('User login error:', error);
    sendError(res, ErrorCode.LOGIN_FAILED);
  }
};

// 사용자 로그아웃
export const userLogout = async (req: Request, res: Response) => {
  try {
    const { userId, userType } = req.body;
    const ipAddr = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = await logout(userId, userType, '사용자 로그아웃', ipAddr, userAgent);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('User logout error:', error);
    sendError(res, ErrorCode.LOGOUT_FAILED);
  }
}; 