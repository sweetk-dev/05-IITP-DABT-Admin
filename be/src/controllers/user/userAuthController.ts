import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError, sendSuccess } from '../../utils/errorHandler';
import { loginUser, logout, refreshUserToken } from '../../services/user/userAuthService';
import { appLogger } from '../../utils/logger';
import { 
  extractUserIdFromRequest,
  extractUserTypeFromRequest,
  extractClientIP,
  normalizeUserAgent,
  normalizeErrorMessage
} from '../../utils/commonUtils';
import { 
  UserLoginReq, 
  UserLoginRes, 
  UserLogoutReq, 
  UserLogoutRes,
  UserRefreshTokenReq,
  UserRefreshTokenRes
} from '@iitp-dabt/common';

// 사용자 로그인
export const userLogin = async (req: Request<{}, {}, UserLoginReq>, res: Response) => {
  try {
    const { email, password } = req.body;
    const ipAddr = extractClientIP(req);
    const userAgent = normalizeUserAgent(req.headers['user-agent']);

    const result = await loginUser(email, password, ipAddr, userAgent);

    const response: UserLoginRes = {
      token: result.token,
      refreshToken: result.refreshToken,
      user: {
        userId: result.userId,
        name: result.name || '',
        phone: undefined // TODO: phone 정보 추가 필요
      }
    };

    sendSuccess(res, response, undefined, 'USER_LOGIN', { userId: result.userId, email });
  } catch (error) {
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      const errorCode = parseInt(errorMsg);
      if (!isNaN(errorCode)) {
        sendError(res, errorCode);
      } else {
        appLogger.error('User login error:', error);
        sendError(res, ErrorCode.LOGIN_FAILED);
      }
    } else {
      appLogger.error('User login unknown error:', error);
      sendError(res, ErrorCode.LOGIN_FAILED);
    }
  }
};

// 사용자 토큰 갱신
export const userRefreshToken = async (req: Request<{}, {}, UserRefreshTokenReq>, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const ipAddr = extractClientIP(req);
    const userAgent = normalizeUserAgent(req.headers['user-agent']);

    const result = await refreshUserToken(refreshToken, ipAddr, userAgent);

    const response: UserRefreshTokenRes = {
      token: result.token,
      refreshToken: result.refreshToken
    };

    sendSuccess(res, response, undefined, 'USER_TOKEN_REFRESH', { userId: result.userId });
  } catch (error) {
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      const errorCode = parseInt(errorMsg);
      if (!isNaN(errorCode)) {
        sendError(res, errorCode);
      } else {
        sendError(res, ErrorCode.INVALID_TOKEN);
      }
    } else {
      sendError(res, ErrorCode.INVALID_TOKEN);
    }
  }
};

// 사용자 로그아웃
export const userLogout = async (req: Request<{}, {}, UserLogoutReq>, res: Response) => {
  try {
    const userId = extractUserIdFromRequest(req);
    const userType = extractUserTypeFromRequest(req);
    const ipAddr = extractClientIP(req);
    const userAgent = normalizeUserAgent(req.headers['user-agent']);

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