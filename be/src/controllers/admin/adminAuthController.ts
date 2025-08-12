import { Request, Response } from 'express';
import { ErrorCode, COMMON_CODE_GROUPS, AUTH_API_MAPPING, API_URLS } from '@iitp-dabt/common';
import { sendError, sendSuccess, sendValidationError, sendDatabaseError } from '../../utils/errorHandler';
import { loginAdmin, logout, refreshAdminToken } from '../../services/admin/adminAuthService';
import { appLogger } from '../../utils/logger';
import { logApiCall } from '../../utils/apiLogger';
import { getAdminRoleCodeName } from '../../services/common/commonCodeService';
import { 
  extractUserIdFromRequest,
  extractUserTypeFromRequest,
  extractClientIP,
  normalizeUserAgent,
  normalizeErrorMessage,
  USER_TYPE_ADMIN
} from '../../utils/commonUtils';
import {
  AdminLoginReq,
  AdminLoginRes,
  AdminLogoutReq,
  AdminLogoutRes,
  AdminRefreshTokenReq,
  AdminRefreshTokenRes,
  ApiResponse
} from '@iitp-dabt/common';

/**
 * 관리자 로그인
 * API: POST /api/auth/admin/login
 * 매핑: AUTH_API_MAPPING[`POST ${API_URLS.AUTH.ADMIN.LOGIN}`]
 */
export const adminLogin = async (req: Request<{}, {}, AdminLoginReq>, res: Response) => {
  try {
    logApiCall('POST', API_URLS.AUTH.ADMIN.LOGIN, AUTH_API_MAPPING as any, '관리자 로그인');
    
    const { loginId, password } = req.body;
    const ipAddr = extractClientIP(req);
    const userAgent = normalizeUserAgent(req.headers['user-agent']);

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
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '로그인', '관리자');
      }
      if (errorMsg.includes('ErrorCode.')) {
        const errorCode = errorMsg.split('ErrorCode.')[1];
        return sendError(res, ErrorCode[errorCode as keyof typeof ErrorCode]);
      }
    }
    sendError(res, ErrorCode.LOGIN_FAILED);
  }
};

/**
 * 관리자 로그아웃
 * API: POST /api/auth/admin/logout
 * 매핑: AUTH_API_MAPPING[`POST ${API_URLS.AUTH.ADMIN.LOGOUT}`]
 */
export const adminLogout = async (req: Request<{}, {}, AdminLogoutReq>, res: Response) => {
  try {
    logApiCall('POST', API_URLS.AUTH.ADMIN.LOGOUT, AUTH_API_MAPPING as any, '관리자 로그아웃');
    
    const userId = extractUserIdFromRequest(req);
    const userType = extractUserTypeFromRequest(req);
    const ipAddr = extractClientIP(req);
    const userAgent = normalizeUserAgent(req.headers['user-agent']);

    // userId가 null인 경우 처리
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if(userType !== USER_TYPE_ADMIN) {
      return sendError(res, ErrorCode.ACCESS_DENIED);
    }

      
    const result = await logout(userId, userType, '관리자 로그아웃', ipAddr, userAgent);

    sendSuccess(res, undefined, undefined, 'ADMIN_LOGOUT', { userId, userType });
  } catch (error) {
    appLogger.error('Error in adminLogout:', error);
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '로그아웃', '관리자');
      }
    }
    sendError(res, ErrorCode.LOGOUT_FAILED);
  }
};

/**
 * 관리자 토큰 갱신
 * API: POST /api/auth/admin/refresh
 * 매핑: AUTH_API_MAPPING[`POST ${API_URLS.AUTH.ADMIN.REFRESH}`]
 */
export const adminRefresh = async (req: Request<{}, {}, AdminRefreshTokenReq>, res: Response) => {
  try {
    logApiCall('POST', API_URLS.AUTH.ADMIN.REFRESH, AUTH_API_MAPPING as any, '관리자 토큰 갱신');
    
    const { refreshToken } = req.body;

    const result = await refreshAdminToken(refreshToken);
    const response: AdminRefreshTokenRes = {
      token: result.token,
      refreshToken: result.refreshToken
    };
    sendSuccess(res, response, undefined, 'ADMIN_REFRESH', { userId: result.userId });
  } catch (error) {
    appLogger.error('Error in adminRefresh:', error);
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '토큰 갱신', '관리자');
      }
    }
    sendError(res, ErrorCode.LOGIN_FAILED);
  }
}; 