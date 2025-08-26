import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { 
  AdminProfileRes, 
  AdminProfileUpdateReq, 
  AdminPasswordChangeReq,
  ErrorCode,
  ADMIN_API_MAPPING,
  API_URLS,
  isValidPassword 
} from '@iitp-dabt/common';
import { adminService } from '../../services/admin/adminService';
import { 
  sendSuccess, 
  sendError, 
  sendValidationError, 
  sendDatabaseError 
} from '../../utils/errorHandler';
import { appLogger } from '../../utils/logger';
import { logApiCall } from '../../utils/apiLogger';
import { 
  extractUserIdFromRequest
} from '../../utils/commonUtils';
import { BusinessError, ResourceError } from '../../utils/customErrors';

/**
 * 관리자 프로필 조회
 * API: GET /api/admin/profile
 * 매핑: ADMIN_API_MAPPING[`GET ${API_URLS.ADMIN.PROFILE}`]
 */
export const getAdminProfile = async (req: Request, res: Response) => {
  try {
    logApiCall('GET', API_URLS.ADMIN.PROFILE, ADMIN_API_MAPPING as any, '관리자 프로필 조회');
    
    const adminId = extractUserIdFromRequest(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    const admin = await adminService.getAdminById(adminId);
    if (!admin) {
      return sendError(res, ErrorCode.ADMIN_NOT_FOUND);
    }

    const response: AdminProfileRes = {
      adminId: admin.adminId,
      loginId: admin.loginId,
      name: admin.name,
      affiliation: admin.affiliation,
      role: admin.role,
      roleName: admin.roleName,
      createdAt: admin.createdAt
    };

    sendSuccess(res, response, undefined, 'ADMIN_PROFILE_VIEW', {
      adminId: admin.adminId,
      name: admin.name,
      affiliation: admin.affiliation
    });
  } catch (error) {
    appLogger.error('관리자 프로필 조회 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    
    // ✅ customErrors 처리
    if (error instanceof ResourceError) {
      if (error.errorCode === ErrorCode.ADMIN_NOT_FOUND) {
        return sendError(res, ErrorCode.ADMIN_NOT_FOUND);
      }
      return sendError(res, error.errorCode, error.message);
    }
    
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.DATABASE_ERROR) {
        return sendDatabaseError(res, '조회', '관리자 프로필');
      }
      return sendError(res, error.errorCode, error.message);
    }
    
    // 기타 예상치 못한 에러
    sendDatabaseError(res, '조회', '관리자 프로필');
  }
};

/**
 * 관리자 프로필 변경
 * API: PUT /api/admin/profile
 * 매핑: ADMIN_API_MAPPING[`PUT ${API_URLS.ADMIN.PROFILE}`]
 */
export const updateAdminProfile = async (req: Request<{}, {}, AdminProfileUpdateReq>, res: Response) => {
  try {
    logApiCall('PUT', API_URLS.ADMIN.PROFILE, ADMIN_API_MAPPING as any, '관리자 프로필 변경');
    
    const adminId = extractUserIdFromRequest(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    const { name, affiliation } = req.body;

    // 필수 필드 검증
    if (!name) {
      return sendValidationError(res, 'name', '이름이 필요합니다.');
    }

    // ✅ service를 통해 프로필 업데이트 처리
    await adminService.updateAdminProfile(adminId, { name, affiliation });

    appLogger.info('관리자 프로필 업데이트 성공', {
      adminId: adminId,
      name: name,
      affiliation: affiliation
    });

    sendSuccess(res, undefined, undefined, 'ADMIN_PROFILE_UPDATE', {
      adminId: adminId,
      name: name,
      affiliation: affiliation
    });
  } catch (error) {
    appLogger.error('관리자 프로필 업데이트 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    
    // ✅ customErrors 처리
    if (error instanceof ResourceError) {
      if (error.errorCode === ErrorCode.ADMIN_NOT_FOUND) {
        return sendError(res, ErrorCode.ADMIN_NOT_FOUND);
      }
      return sendError(res, error.errorCode, error.message);
    }
    
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.DATABASE_ERROR) {
        return sendDatabaseError(res, '업데이트', '관리자 프로필');
      }
      return sendError(res, error.errorCode, error.message);
    }
    
    // 기타 예상치 못한 에러
    sendDatabaseError(res, '업데이트', '관리자 프로필');
  }
};

/**
 * 관리자 비밀번호 변경
 * API: PUT /api/admin/password
 * 매핑: ADMIN_API_MAPPING[`PUT ${API_URLS.ADMIN.PASSWORD}`]
 */
export const changeAdminPassword = async (req: Request<{}, {}, AdminPasswordChangeReq>, res: Response) => {
  try {
    logApiCall('PUT', API_URLS.ADMIN.PASSWORD, ADMIN_API_MAPPING as any, '관리자 비밀번호 변경');
    
    const adminId = extractUserIdFromRequest(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    const { currentPassword, newPassword } = req.body;

    // 필수 필드 검증
    if (!currentPassword) {
      return sendValidationError(res, 'currentPassword', '현재 비밀번호가 필요합니다.');
    }
    if (!newPassword) {
      return sendValidationError(res, 'newPassword', '새 비밀번호가 필요합니다.');
    }

    // common 패키지의 비밀번호 강도 검증 사용
    if (!isValidPassword(newPassword)) {
      return sendError(res, ErrorCode.USER_PASSWORD_TOO_WEAK);
    }

    // ✅ service를 통해 비밀번호 변경 처리
    await adminService.changeAdminPassword(adminId, currentPassword, newPassword);

    appLogger.info('관리자 비밀번호 변경 성공', {
      adminId: adminId
    });

    sendSuccess(res, undefined, undefined, 'ADMIN_PASSWORD_CHANGE', {
      adminId: adminId
    });
  } catch (error) {
    appLogger.error('관리자 비밀번호 변경 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    
    // ✅ customErrors 처리
    if (error instanceof ResourceError) {
      if (error.errorCode === ErrorCode.ADMIN_NOT_FOUND) {
        return sendError(res, ErrorCode.ADMIN_NOT_FOUND);
      }
      return sendError(res, error.errorCode, error.message);
    }
    
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.DATABASE_ERROR) {
        return sendDatabaseError(res, '변경', '관리자 비밀번호');
      }
      return sendError(res, error.errorCode, error.message);
    }
    
    // 기타 예상치 못한 에러
    sendDatabaseError(res, '변경', '관리자 비밀번호');
  }
}; 