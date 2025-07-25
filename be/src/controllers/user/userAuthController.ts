import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError, sendSuccess } from '../../utils/errorHandler';
import { loginUser, logout } from '../../services/user/userAuthService';
import { UserLoginRequest, UserLoginResponse, UserLogoutRequest, UserLogoutResponse } from '../../types/user';

// 사용자 로그인
export const userLogin = async (req: Request<{}, {}, UserLoginRequest>, res: Response) => {
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

    const response: UserLoginResponse = {
      token: result.token,
      userId: result.userId,
      userType: result.userType as 'U',
      email: result.email || '',
      name: result.name || ''
    };

    sendSuccess(res, response, undefined, 'USER_LOGIN', { userId: result.userId, email });
  } catch (error) {
    sendError(res, ErrorCode.LOGIN_FAILED);
  }
};

// 사용자 로그아웃
export const userLogout = async (req: Request<{}, {}, UserLogoutRequest>, res: Response) => {
  try {
    const { userId, userType } = req.body;
    const ipAddr = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = await logout(userId, userType, '사용자 로그아웃', ipAddr, userAgent);

    const response: UserLogoutResponse = {
      success: result.success,
      message: result.message
    };

    sendSuccess(res, response, undefined, 'USER_LOGOUT', { userId, userType });
  } catch (error) {
    sendError(res, ErrorCode.LOGOUT_FAILED);
  }
}; 