import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError, sendSuccess } from '../../utils/errorHandler';
import { loginUser, logout } from '../../services/user/userAuthService';
import { 
  UserLoginReq, 
  UserLoginRes, 
  UserLogoutReq, 
  UserLogoutRes 
} from '@iitp-dabt/common';

// 사용자 로그인
export const userLogin = async (req: Request<{}, {}, UserLoginReq>, res: Response) => {
  try {
    const { email, password } = req.body;
    const ipAddr = req.ip || req.connection.remoteAddress || '';
    const userAgent = req.headers['user-agent'] as string;

    const result = await loginUser(email, password, ipAddr, userAgent);

    const response: UserLoginRes = {
      token: result.token,
      refreshToken: '', // TODO: refreshToken 구현 필요
      user: {
        userId: result.userId,
        email: result.email || '',
        name: result.name || '',
        phone: undefined // TODO: phone 정보 추가 필요
      }
    };

    sendSuccess(res, response, undefined, 'USER_LOGIN', { userId: result.userId, email });
  } catch (error) {
    sendError(res, ErrorCode.LOGIN_FAILED);
  }
};

// 사용자 로그아웃
export const userLogout = async (req: Request<{}, {}, UserLogoutReq>, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const userType = (req as any).user?.userType;
    const ipAddr = req.ip || req.connection.remoteAddress || '';
    const userAgent = req.headers['user-agent'] as string;

    const result = await logout(userId, userType, '사용자 로그아웃', ipAddr, userAgent);

    const response: UserLogoutRes = {
      success: result.success,
      message: result.message
    };

    sendSuccess(res, response, undefined, 'USER_LOGOUT', { userId, userType });
  } catch (error) {
    sendError(res, ErrorCode.LOGOUT_FAILED);
  }
}; 