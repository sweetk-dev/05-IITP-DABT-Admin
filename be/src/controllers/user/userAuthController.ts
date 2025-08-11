import { Request, Response } from 'express';
import { ErrorCode, AUTH_API_MAPPING, API_URLS } from '@iitp-dabt/common';
import { sendError, sendSuccess, sendValidationError, sendDatabaseError } from '../../utils/errorHandler';
import { loginUser, logout, refreshUserToken } from '../../services/user/userAuthService';
import { appLogger } from '../../utils/logger';
import { 
  extractUserIdFromRequest,
  extractUserTypeFromRequest,
  extractClientIP,
  normalizeUserAgent,
  normalizeErrorMessage,
  USER_TYPE_GENERAL
} from '../../utils/commonUtils';
import { 
  UserLoginReq, 
  UserLoginRes, 
  UserLogoutReq, 
  UserLogoutRes,
  UserRefreshTokenReq,
  UserRefreshTokenRes
} from '@iitp-dabt/common';

/**
 * 사용자 로그인
 * API: POST /api/auth/user/login
 * 매핑: AUTH_API_MAPPING[`POST ${API_URLS.AUTH.USER.LOGIN}`]
 */
export const userLogin = async (req: Request<{}, {}, UserLoginReq>, res: Response) => {
  try {
    const apiKey = `POST ${API_URLS.AUTH.USER.LOGIN}`;
    const mapping = AUTH_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || '사용자 로그인'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });
    
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
    appLogger.error('User login error:', error);
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '로그인', '사용자');
      }
      const errorCode = parseInt(errorMsg);
      if (!isNaN(errorCode)) {
        return sendError(res, errorCode);
      }
    }
    sendError(res, ErrorCode.LOGIN_FAILED);
  }
};

/**
 * 사용자 토큰 갱신
 * API: POST /api/auth/user/refresh
 * 매핑: AUTH_API_MAPPING[`POST ${API_URLS.AUTH.USER.REFRESH}`]
 */
export const userRefreshToken = async (req: Request<{}, {}, UserRefreshTokenReq>, res: Response) => {
  try {
    const apiKey = `POST ${API_URLS.AUTH.USER.REFRESH}`;
    const mapping = AUTH_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || '사용자 토큰 갱신'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });
    
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
    appLogger.error('User refresh token error:', error);
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '토큰 갱신', '사용자');
      }
      const errorCode = parseInt(errorMsg);
      if (!isNaN(errorCode)) {
        return sendError(res, errorCode);
      }
    }
    sendError(res, ErrorCode.INVALID_TOKEN);
  }
};

/**
 * 사용자 로그아웃
 * API: POST /api/auth/user/logout
 * 매핑: AUTH_API_MAPPING[`POST ${API_URLS.AUTH.USER.LOGOUT}`]
 */
export const userLogout = async (req: Request<{}, {}, UserLogoutReq>, res: Response) => {
  try {
    const apiKey = `POST ${API_URLS.AUTH.USER.LOGOUT}`;
    const mapping = AUTH_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || '사용자 로그아웃'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });
    
    const userId = extractUserIdFromRequest(req);
    const userType = extractUserTypeFromRequest(req);
    const ipAddr = extractClientIP(req);
    const userAgent = normalizeUserAgent(req.headers['user-agent']);

    // userId가 null인 경우 처리
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

     if(userType !== USER_TYPE_GENERAL) {
          return sendError(res, ErrorCode.ACCESS_DENIED);
        }

    const result = await logout(userId, userType, '사용자 로그아웃', ipAddr, userAgent);

    const response: UserLogoutRes = {
      success: result.success,
      message: result.message
    };

    sendSuccess(res, response, undefined, 'USER_LOGOUT', { userId, userType });
  } catch (error) {
    appLogger.error('User logout error:', error);
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '로그아웃', '사용자');
      }
    }
    sendError(res, ErrorCode.LOGOUT_FAILED);
  }
}; 