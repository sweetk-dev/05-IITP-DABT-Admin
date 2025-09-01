import { Request, Response } from 'express';
import { ErrorCode, ADMIN_API_MAPPING, API_URLS } from '@iitp-dabt/common';
import { sendError, sendSuccess, sendValidationError, sendDatabaseError } from '../../utils/errorHandler';
import { getAdminRole, isSAdmin } from '../../utils/auth';
import { appLogger } from '../../utils/logger';
import { logApiCall } from '../../utils/apiLogger';
import { extractUserIdFromRequest, normalizeErrorMessage } from '../../utils/commonUtils';
import { getNumberQuery, getStringQuery } from '../../utils/queryParsers';
import { getActorTag } from '../../utils/auth';
import type {
  AdminAccountListQuery,
  AdminAccountListRes,
  AdminAccountDetailParams,
  AdminAccountDetailRes,
  AdminAccountCreateReq,
  AdminAccountCreateRes,
  AdminAccountUpdateParams,
  AdminAccountUpdateReq,
  AdminAccountDeleteParams,
  AdminAccountListDeleteReq,
  AdminAccountPasswordChangeParams,
  AdminAccountPasswordChangeReq,
  AdminAccountRoleUpdateParams,
  AdminAccountRoleUpdateReq,
  AdminAccountCheckEmailReq,
  AdminAccountCheckEmailRes
} from '@iitp-dabt/common';
import { adminAccountService } from '../../services/admin/adminAccountService';


/**
 * 운영자 계정 목록 조회 (S-Admin 전용)
 * API: GET /api/admin/admin-accounts
 * 매핑: ADMIN_API_MAPPING[`GET ${API_URLS.ADMIN.ADMIN_ACCOUNT.LIST}`]
 */
export const getAdminAccountList = async (req: Request<{}, {}, {}, AdminAccountListQuery>, res: Response) => {
  let adminId: number | null;
  
  try {
    logApiCall('GET', API_URLS.ADMIN.ADMIN_ACCOUNT.LIST, ADMIN_API_MAPPING as any, '운영자 계정 목록 조회 (S-Admin 전용)');

    // S-ADMIN 권한 체크
    const adminRole = getAdminRole(req as any);
    if (!isSAdmin(adminRole)) {
      return sendError(res, ErrorCode.FORBIDDEN, 'S-ADMIN 권한이 필요합니다.');
    }

    const page = getNumberQuery(req.query, 'page', 1)!;
    const limit = getNumberQuery(req.query, 'limit', 10)!;
    const search = getStringQuery(req.query, 'search');
    const status = getStringQuery(req.query, 'status');
    const role = getStringQuery(req.query, 'role');
    const affiliation = getStringQuery(req.query, 'affiliation');
    
    adminId = extractUserIdFromRequest(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }
    
    const result = await adminAccountService.getAdminAccountList({
      page,
      limit,
      search,
      status,
      role,
      affiliation
    });

    const response: AdminAccountListRes = {
      items: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    };

    sendSuccess(res, response, undefined, 'ADMIN_ACCOUNT_LIST_VIEW', { adminId, count: result.items.length }, true);
  } catch (error) {
    appLogger.error('운영자 계정 목록 조회 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '조회', '운영자 계정 목록');
      }
    }
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * 운영자 계정 상세 조회 (S-Admin 전용)
 * API: GET /api/admin/admin-accounts/:adminId
 * 매핑: ADMIN_API_MAPPING[`GET ${API_URLS.ADMIN.ADMIN_ACCOUNT.DETAIL}`]
 */
export const getAdminAccountDetail = async (req: Request<AdminAccountDetailParams>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.ADMIN.ADMIN_ACCOUNT.DETAIL, ADMIN_API_MAPPING as any, '운영자 계정 상세 조회 (S-Admin 전용)');

    // S-ADMIN 권한 체크
    const adminRole = getAdminRole(req as any);
    if (!isSAdmin(adminRole)) {
      return sendError(res, ErrorCode.FORBIDDEN, 'S-ADMIN 권한이 필요합니다.');
    }

    const { adminId } = req.params;
    const currentAdminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    if (!currentAdminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!adminId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }
    
    const result = await adminAccountService.getAdminAccountDetail(Number(adminId));

    if (!result) {
      return sendError(res, ErrorCode.ACCOUNT_NOT_FOUND);
    }

    const response: AdminAccountDetailRes = result;

    sendSuccess(res, response, undefined, 'ADMIN_ACCOUNT_DETAIL_VIEW', { adminId: currentAdminId, operatorId: Number(adminId) });
  } catch (error) {
    appLogger.error('운영자 계정 상세 조회 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '조회', '운영자 계정 상세');
      }
    }
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * 운영자 계정 생성 (S-Admin 전용)
 * API: POST /api/admin/admin-accounts
 * 매핑: ADMIN_API_MAPPING[`POST ${API_URLS.ADMIN.ADMIN_ACCOUNT.CREATE}`]
 */
export const createAdminAccount = async (req: Request<{}, {}, AdminAccountCreateReq>, res: Response) => {
  try {
    logApiCall('POST', API_URLS.ADMIN.ADMIN_ACCOUNT.CREATE, ADMIN_API_MAPPING as any, '운영자 계정 생성 (S-Admin 전용)');

    // S-ADMIN 권한 체크
    const adminRole = getAdminRole(req as any);
    if (!isSAdmin(adminRole)) {
      return sendError(res, ErrorCode.FORBIDDEN, 'S-ADMIN 권한이 필요합니다.');
    }

    const operatorData = req.body;
    const adminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!operatorData.loginId || !operatorData.password || !operatorData.name || !operatorData.role) {
      return sendValidationError(res, 'general', '로그인 ID, 비밀번호, 이름, 역할은 필수입니다.');
    }

    const result = await adminAccountService.createAdminAccount(operatorData, actorTag);

    const response: AdminAccountCreateRes = result;

    sendSuccess(res, response, undefined, 'ADMIN_ACCOUNT_CREATED', { adminId, operatorId: result.adminId });
  } catch (error) {
    appLogger.error('운영자 계정 생성 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '생성', '운영자 계정');
      }
    }
    sendError(res, ErrorCode.ACCOUNT_CREATE_FAILED);
  }
};

/**
 * 운영자 계정 수정 (S-Admin 전용)
 * API: PUT /api/admin/admin-accounts/:adminId
 * 매핑: ADMIN_API_MAPPING[`PUT ${API_URLS.ADMIN.ADMIN_ACCOUNT.UPDATE}`]
 */
export const updateAdminAccount = async (req: Request<AdminAccountUpdateParams, {}, AdminAccountUpdateReq>, res: Response) => {
  try {
    logApiCall('PUT', API_URLS.ADMIN.ADMIN_ACCOUNT.UPDATE, ADMIN_API_MAPPING as any, '운영자 계정 수정 (S-Admin 전용)');

    // S-ADMIN 권한 체크
    const adminRole = getAdminRole(req as any);
    if (!isSAdmin(adminRole)) {
      return sendError(res, ErrorCode.FORBIDDEN, 'S-ADMIN 권한이 필요합니다.');
    }

    const { adminId } = req.params;
    const updateData = req.body;
    const currentAdminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    if (!currentAdminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!adminId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    await adminAccountService.updateAdminAccount(Number(adminId), updateData, actorTag);

    sendSuccess(res, null, undefined, 'ADMIN_ACCOUNT_UPDATED', { adminId: currentAdminId, operatorId: Number(adminId) });
  } catch (error) {
    appLogger.error('운영자 계정 수정 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '수정', '운영자 계정');
      }
    }
    sendError(res, ErrorCode.ACCOUNT_UPDATE_FAILED);
  }
};

/**
 * 운영자 계정 삭제 (S-Admin 전용)
 * API: DELETE /api/admin/admin-accounts/:adminId
 * 매핑: ADMIN_API_MAPPING[`DELETE ${API_URLS.ADMIN.ADMIN_ACCOUNT.DELETE}`]
 */
export const deleteAdminAccount = async (req: Request<AdminAccountDeleteParams>, res: Response) => {
  try {
    logApiCall('DELETE', API_URLS.ADMIN.ADMIN_ACCOUNT.DELETE, ADMIN_API_MAPPING as any, '운영자 계정 삭제 (S-Admin 전용)');

    // S-ADMIN 권한 체크
    const adminRole = getAdminRole(req as any);
    if (!isSAdmin(adminRole)) {
      return sendError(res, ErrorCode.FORBIDDEN, 'S-ADMIN 권한이 필요합니다.');
    }

    const { adminId } = req.params;
    const currentAdminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    if (!currentAdminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!adminId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    await adminAccountService.deleteAdminAccount(Number(adminId), actorTag);

    sendSuccess(res, null, undefined, 'ADMIN_ACCOUNT_DELETED', { adminId: currentAdminId, operatorId: Number(adminId) });
  } catch (error) {
    appLogger.error('운영자 계정 삭제 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '삭제', '운영자 계정');
      }
    }
    sendError(res, ErrorCode.ACCOUNT_DELETE_FAILED);
  }
};


/** 
 * 운영자 계정 목록 삭제 (S-Admin 전용)
 * API: POST /api/admin/admin-accounts
 * 매핑: ADMIN_API_MAPPING[`POST ${API_URLS.ADMIN.ADMIN_ACCOUNT.LIST_DELETE]}`]
 */
export const deleteAdminAccountList = async (req: Request<{}, {}, AdminAccountListDeleteReq>, res: Response) => { 
  try {
    logApiCall('POST', API_URLS.ADMIN.ADMIN_ACCOUNT.LIST_DELETE, ADMIN_API_MAPPING as any, '운영자 계정 목록 삭제 (S-Admin 전용)');

    // S-ADMIN 권한 체크
    const adminRole = getAdminRole(req as any);
    if (!isSAdmin(adminRole)) {
      return sendError(res, ErrorCode.FORBIDDEN, 'S-ADMIN 권한이 필요합니다.');
    }

    const data = req.body;
    const currentAdminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    if (!currentAdminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!data.adminIds || data.adminIds.length === 0) {
      return sendValidationError(res, 'general', '삭제할 운영자 계정 ID 목록은 필수입니다.');
    }

    await adminAccountService.deleteAdminAccountList(data, actorTag);

    sendSuccess(res, null, undefined, 'ADMIN_ACCOUNT_LIST_DELETED', { adminId: currentAdminId, deletedCount: data.adminIds.length });
  } catch (error) {
    appLogger.error('운영자 계정 목록 삭제 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '삭제', '운영자 계정 목록');
      }
    }
    sendError(res, ErrorCode.ACCOUNT_DELETE_FAILED);
  }
};





/**
 * 운영자 계정 비밀번호 변경 (S-Admin 전용)
 * API: PUT /api/admin/admin-accounts/:adminId/password
 * 매핑: ADMIN_API_MAPPING[`PUT ${API_URLS.ADMIN.ADMIN_ACCOUNT.PASSWORD_CHANGE}`]
 */
export const changeAdminAccountPassword = async (req: Request<AdminAccountPasswordChangeParams, {}, AdminAccountPasswordChangeReq>, res: Response) => {
  try {
    logApiCall('PUT', API_URLS.ADMIN.ADMIN_ACCOUNT.PASSWORD_CHANGE, ADMIN_API_MAPPING as any, '운영자 계정 비밀번호 변경 (S-Admin 전용)');

    // S-ADMIN 권한 체크
    const adminRole = getAdminRole(req as any);
    if (!isSAdmin(adminRole)) {
      return sendError(res, ErrorCode.FORBIDDEN, 'S-ADMIN 권한이 필요합니다.');
    }

    const { adminId } = req.params;
    const passwordData = req.body;
    const currentAdminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    if (!currentAdminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!adminId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    if (!passwordData.newPassword) {
      return sendValidationError(res, 'general', '새 비밀번호는 필수입니다.');
    }

    await adminAccountService.changeAdminPassword(Number(adminId), passwordData, actorTag);

    sendSuccess(res, null, undefined, 'ADMIN_ACCOUNT_PASSWORD_CHANGED', { adminId: currentAdminId, operatorId: Number(adminId) });
  } catch (error) {
    appLogger.error('운영자 계정 비밀번호 변경 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '비밀번호 변경', '운영자 계정');
      }
    }
    sendError(res, ErrorCode.ACCOUNT_UPDATE_FAILED);
  }
};

/**
 * 운영자 계정 역할 업데이트 (S-Admin 전용)
 * API: PUT /api/admin/admin-accounts/:adminId/role
 * 매핑: ADMIN_API_MAPPING[`PUT ${API_URLS.ADMIN.ADMIN_ACCOUNT.ROLE_UPDATE}`]
 */
export const updateAdminRole = async (req: Request<AdminAccountRoleUpdateParams, {}, AdminAccountRoleUpdateReq>, res: Response) => {
  try {
    logApiCall('PUT', API_URLS.ADMIN.ADMIN_ACCOUNT.ROLE_UPDATE, ADMIN_API_MAPPING as any, '운영자 계정 역할 업데이트 (S-Admin 전용)');

    // S-ADMIN 권한 체크
    const adminRole = getAdminRole(req as any);
    if (!isSAdmin(adminRole)) {
      return sendError(res, ErrorCode.FORBIDDEN, 'S-ADMIN 권한이 필요합니다.');
    }

    const { adminId } = req.params;
    const roleData = req.body;
    const currentAdminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    if (!currentAdminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!adminId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    if (!roleData.role) {
      return sendValidationError(res, 'general', '역할은 필수입니다.');
    }

    await adminAccountService.updateAdminRole(Number(adminId), roleData, actorTag);

    sendSuccess(res, null, undefined, 'ADMIN_ACCOUNT_ROLE_UPDATED', { adminId: currentAdminId, operatorId: Number(adminId) });
  } catch (error) {
    appLogger.error('운영자 계정 역할 업데이트 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '역할 업데이트', '운영자 계정');
      }
    }
    sendError(res, ErrorCode.ACCOUNT_UPDATE_FAILED);
  }
};

/**
 * 운영자 계정 이메일 중복 체크 (S-Admin 전용)
 * API: POST /api/admin/admin-accounts/email/check
 * 매핑: ADMIN_API_MAPPING[`POST ${API_URLS.ADMIN.ADMIN_ACCOUNT.CHECK_EMAIL}`]
 */
export const checkAdminEmail = async (req: Request<{}, {}, AdminAccountCheckEmailReq>, res: Response) => {
  try {
    logApiCall('POST', API_URLS.ADMIN.ADMIN_ACCOUNT.CHECK_EMAIL, ADMIN_API_MAPPING as any, '운영자 계정 이메일 중복 체크 (S-Admin 전용)');

    // S-ADMIN 권한 체크
    const adminRole = getAdminRole(req as any);
    if (!isSAdmin(adminRole)) {
      return sendError(res, ErrorCode.FORBIDDEN, 'S-ADMIN 권한이 필요합니다.');
    }

    const emailData = req.body;
    const adminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!emailData.loginId) {
      return sendValidationError(res, 'general', '로그인 ID는 필수입니다.');
    }

    const result = await adminAccountService.checkAdminEmail(emailData);

    const response: AdminAccountCheckEmailRes = result;

    sendSuccess(res, response, undefined, 'ADMIN_ACCOUNT_EMAIL_CHECKED', { adminId, loginId: emailData.loginId });
  } catch (error) {
    appLogger.error('운영자 계정 이메일 중복 체크 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '이메일 중복 체크', '운영자 계정');
      }
    }
    sendError(res, ErrorCode.ACCOUNT_EMAIL_DUPLICATE);
  }
};
