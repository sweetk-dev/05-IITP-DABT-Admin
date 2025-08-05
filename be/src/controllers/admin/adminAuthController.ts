import { Request, Response } from 'express';
import { ErrorCode, COMMON_CODE_GROUPS, AUTH_API_MAPPING, API_URLS } from '@iitp-dabt/common';
import { sendError, sendSuccess } from '../../utils/errorHandler';
import { loginAdmin, logout, refreshAdminToken } from '../../services/admin/adminAuthService';
import { appLogger } from '../../utils/logger';
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
    const apiKey = `POST ${API_URLS.AUTH.ADMIN.LOGIN}`;
    const mapping = AUTH_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || '관리자 로그인'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });
    
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
      if (errorMsg.includes('ErrorCode.')) {
        const errorCode = errorMsg.split('ErrorCode.')[1];
        sendError(res, ErrorCode[errorCode as keyof typeof ErrorCode]);
      } else {
        sendError(res, ErrorCode.LOGIN_FAILED);
      }
    } else {
      sendError(res, ErrorCode.LOGIN_FAILED);
    }
  }
};

/**
 * 관리자 로그아웃
 * API: POST /api/auth/admin/logout
 * 매핑: AUTH_API_MAPPING[`POST ${API_URLS.AUTH.ADMIN.LOGOUT}`]
 */
export const adminLogout = async (req: Request<{}, {}, AdminLogoutReq>, res: Response) => {
  try {
    const apiKey = `POST ${API_URLS.AUTH.ADMIN.LOGOUT}`;
    const mapping = AUTH_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || '관리자 로그아웃'}`, {
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

    if(userType !== USER_TYPE_ADMIN) {
      return sendError(res, ErrorCode.ACCESS_DENIED);
    }

      
    const result = await logout(userId, userType, '관리자 로그아웃', ipAddr, userAgent);

    const response: AdminLogoutRes = {
      success: result.success,
      message: result.message
    };

    sendSuccess(res, response, undefined, 'ADMIN_LOGOUT', { userId, userType });
  } catch (error) {
    appLogger.error('Error in adminLogout:', error);
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
    const apiKey = `POST ${API_URLS.AUTH.ADMIN.REFRESH}`;
    const mapping = AUTH_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || '관리자 토큰 갱신'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });
    
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