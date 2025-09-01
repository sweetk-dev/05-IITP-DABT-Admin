import e, { Request, Response } from 'express';
import { ErrorCode, ADMIN_API_MAPPING, API_URLS } from '@iitp-dabt/common';
import { sendError, sendSuccess, sendValidationError, sendDatabaseError } from '../../utils/errorHandler';
import { getAdminRole, isAdmin, getActorTag } from '../../utils/auth';
import { appLogger } from '../../utils/logger';
import { logApiCall } from '../../utils/apiLogger';
import { extractUserIdFromRequest, normalizeErrorMessage } from '../../utils/commonUtils';
import { getNumberQuery, getStringQuery } from '../../utils/queryParsers';
import type {
  UserAccountListQuery,
  UserAccountListRes,
  UserAccountDetailParams,
  UserAccountDetailRes,
  UserAccountCreateReq,
  UserAccountCreateRes,
  UserAccountUpdateParams,
  UserAccountUpdateReq,
  UserAccountDeleteParams,
  UserAccountListDeleteReq,
  UserAccountPasswordChangeParams,
  UserAccountPasswordChangeReq,
  UserAccountStatusUpdateParams,
  UserAccountStatusUpdateReq,
  UserAccountCheckEmailReq,
  UserAccountCheckEmailRes
} from '@iitp-dabt/common';
import { userAccountService } from '../../services/admin/userAccountService';

/**
 * 사용자 계정 목록 조회 (일반 Admin도 접근 가능)
 * API: GET /api/admin/user-accounts
 * 매핑: ADMIN_API_MAPPING[`GET ${API_URLS.ADMIN.USER_ACCOUNT.LIST}`]
 */
export const getUserAccountList = async (req: Request<{}, {}, {}, UserAccountListQuery>, res: Response) => {
  let adminId: number | null;
  
  try {
    logApiCall('GET', API_URLS.ADMIN.USER_ACCOUNT.LIST, ADMIN_API_MAPPING as any, '사용자 계정 목록 조회 (일반 Admin도 접근 가능)');

    // Admin 권한 체크 (일반 Admin도 접근 가능)
    const adminRole = getAdminRole(req);
    if (!isAdmin(adminRole)) {
      return sendError(res, ErrorCode.FORBIDDEN, 'Admin 권한이 필요합니다.');
    }

    const page = getNumberQuery(req.query, 'page', 1)!;
    const limit = getNumberQuery(req.query, 'limit', 10)!;
    const search = getStringQuery(req.query, 'search');
    const status = getStringQuery(req.query, 'status');
    const email = getStringQuery(req.query, 'email');
    const phone = getStringQuery(req.query, 'phone');
    
    adminId = extractUserIdFromRequest(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }
    
    const result = await userAccountService.getUserAccountList({
      page,
      limit,
      search,
      status,
      email,
      phone
    });

    const response: UserAccountListRes = {
      items: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    };

    sendSuccess(res, response, undefined, 'USER_ACCOUNT_LIST_VIEW', { adminId, count: result.items.length }, true);
  } catch (error) {
    appLogger.error('사용자 계정 목록 조회 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '조회', '사용자 계정 목록');
      }
    }
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * 사용자 계정 상세 조회 (일반 Admin도 접근 가능)
 * API: GET /api/admin/user-accounts/:userId
 * 매핑: ADMIN_API_MAPPING[`GET ${API_URLS.ADMIN.USER_ACCOUNT.DETAIL}`]
 */
export const getUserAccountDetail = async (req: Request<UserAccountDetailParams>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.ADMIN.USER_ACCOUNT.DETAIL, ADMIN_API_MAPPING as any, '사용자 계정 상세 조회 (일반 Admin도 접근 가능)');

    // Admin 권한 체크 (일반 Admin도 접근 가능)
    const adminRole = getAdminRole(req);
    if (!isAdmin(adminRole)) {
      return sendError(res, ErrorCode.FORBIDDEN, 'Admin 권한이 필요합니다.');
    }

    const { userId } = req.params;
    const currentAdminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    if (!currentAdminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!userId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }
    
    const result = await userAccountService.getUserAccountDetail(Number(userId));

    if (!result) {
      return sendError(res, ErrorCode.ACCOUNT_NOT_FOUND);
    }

    const response: UserAccountDetailRes = result;

    sendSuccess(res, response, undefined, 'USER_ACCOUNT_DETAIL_VIEW', { adminId: currentAdminId, userId: Number(userId) });
  } catch (error) {
    appLogger.error('사용자 계정 상세 조회 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '조회', '사용자 계정 상세');
      }
    }
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * 사용자 계정 생성 (일반 Admin도 접근 가능)
 * API: POST /api/admin/user-accounts
 * 매핑: ADMIN_API_MAPPING[`POST ${API_URLS.ADMIN.USER_ACCOUNT.CREATE}`]
 */
export const createUserAccount = async (req: Request<{}, {}, UserAccountCreateReq>, res: Response) => {
  try {
    logApiCall('POST', API_URLS.ADMIN.USER_ACCOUNT.CREATE, ADMIN_API_MAPPING as any, '사용자 계정 생성 (일반 Admin도 접근 가능)');

    // Admin 권한 체크 (일반 Admin도 접근 가능)
    const adminRole = getAdminRole(req);
    if (!isAdmin(adminRole)) {
      return sendError(res, ErrorCode.FORBIDDEN, 'Admin 권한이 필요합니다.');
    }

    const userData = req.body;
    const adminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!userData.loginId || !userData.password || !userData.name) {
      return sendValidationError(res, 'general', '로그인 ID(이메일), 비밀번호, 이름 필수입니다.');
    }

    const result = await userAccountService.createUserAccount(userData, actorTag);

    sendSuccess(res, result, undefined, 'USER_ACCOUNT_CREATED', { adminId, userId: result.userId });
  } catch (error) {
    appLogger.error('사용자 계정 생성 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '생성', '사용자 계정');
      }
    }
    sendError(res, ErrorCode.ACCOUNT_CREATE_FAILED);
  }
};

/**
 * 사용자 계정 수정 (일반 Admin도 접근 가능)
 * API: PUT /api/admin/user-accounts/:userId
 * 매핑: ADMIN_API_MAPPING[`PUT ${API_URLS.ADMIN.USER_ACCOUNT.UPDATE}`]
 */
export const updateUserAccount = async (req: Request<UserAccountUpdateParams, {}, UserAccountUpdateReq>, res: Response) => {
  try {
    logApiCall('PUT', API_URLS.ADMIN.USER_ACCOUNT.UPDATE, ADMIN_API_MAPPING as any, '사용자 계정 수정 (일반 Admin도 접근 가능)');

    // Admin 권한 체크 (일반 Admin도 접근 가능)
    const adminRole = getAdminRole(req);
    if (!isAdmin(adminRole)) {
      return sendError(res, ErrorCode.FORBIDDEN, 'Admin 권한이 필요합니다.');
    }



    const { userId } = req.params;
    const updateData = req.body;
    const currentAdminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    if (!currentAdminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!userId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    await userAccountService.updateUserAccount(Number(userId), updateData, actorTag);

    sendSuccess(res, null, undefined, 'USER_ACCOUNT_UPDATED', { adminId: currentAdminId, userId: Number(userId) });
  } catch (error) {
    appLogger.error('사용자 계정 수정 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '수정', '사용자 계정');
      }
    }
    sendError(res, ErrorCode.ACCOUNT_UPDATE_FAILED);
  }
};

/**
 * 사용자 계정 삭제 (일반 Admin도 접근 가능)
 * API: DELETE /api/admin/user-accounts/:userId
 * 매핑: ADMIN_API_MAPPING[`DELETE ${API_URLS.ADMIN.USER_ACCOUNT.DELETE}`]
 */
export const deleteUserAccount = async (req: Request<UserAccountDeleteParams>, res: Response) => {
  try {
    logApiCall('DELETE', API_URLS.ADMIN.USER_ACCOUNT.DELETE, ADMIN_API_MAPPING as any, '사용자 계정 삭제 (일반 Admin도 접근 가능)');

    // Admin 권한 체크 (일반 Admin도 접근 가능)
    const adminRole = getAdminRole(req);
    if (!isAdmin(adminRole)) {
      return sendError(res, ErrorCode.FORBIDDEN, 'Admin 권한이 필요합니다.');
    }

    const { userId } = req.params;
    const currentAdminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    if (!currentAdminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!userId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    await userAccountService.deleteUserAccount(Number(userId), actorTag);

    sendSuccess(res, null, undefined, 'USER_ACCOUNT_DELETED', { adminId: currentAdminId, userId: Number(userId) });
  } catch (error) {
    appLogger.error('사용자 계정 삭제 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '삭제', '사용자 계정');
      }
    }
    sendError(res, ErrorCode.ACCOUNT_DELETE_FAILED);
  }
};


/**
 * 사용자 계정 목록 삭제 (일반 Admin도 접근 가능)
 * API: POST /api/admin/accounts/user/delete
 * 매핑: ADMIN_API_MAPPING[`POST ${API_URLS.ADMIN.USER_ACCOUNT.LIST_DELETE}`] 
 */
export const deleteUserAccountList = async (req: Request<{}, {}, UserAccountListDeleteReq>, res: Response) => {
  try {
    logApiCall('POST', API_URLS.ADMIN.USER_ACCOUNT.LIST_DELETE, ADMIN_API_MAPPING as any, '사용자 계정 목록 삭제 (일반 Admin도 접근 가능)');

    // Admin 권한 체크 (일반 Admin도 접근 가능)
    const adminRole = getAdminRole(req);
    if (!isAdmin(adminRole)) {
      return sendError(res, ErrorCode.FORBIDDEN, 'Admin 권한이 필요합니다.');
    }

    const { userIds } = req.body;
    const currentAdminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    if (!currentAdminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return sendValidationError(res, 'general', '삭제할 사용자 ID 목록이 필요합니다.');
    }

    const deletedCount = await userAccountService.deleteUserAccountList(userIds, actorTag);

    sendSuccess(res, { deletedCount }, undefined, 'USER_ACCOUNT_LIST_DELETED', { adminId: currentAdminId, requestedCount: userIds.length, deletedCount });
  } catch (error) { 
    appLogger.error('사용자 계정 목록 삭제 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '삭제', '사용자 계정 목록');
      }
    }
    sendError(res, ErrorCode.ACCOUNT_DELETE_FAILED);
  }
};



/**
 * 사용자 계정 비밀번호 변경 (일반 Admin도 접근 가능)
 * API: PUT /api/admin/user-accounts/:userId/password
 * 매핑: ADMIN_API_MAPPING[`PUT ${API_URLS.ADMIN.USER_ACCOUNT.PASSWORD_CHANGE}`]
 */
export const changeUserPassword = async (req: Request<UserAccountPasswordChangeParams, {}, UserAccountPasswordChangeReq>, res: Response) => {
  try {
    logApiCall('PUT', API_URLS.ADMIN.USER_ACCOUNT.PASSWORD_CHANGE, ADMIN_API_MAPPING as any, '사용자 계정 비밀번호 변경 (일반 Admin도 접근 가능)');

    // Admin 권한 체크 (일반 Admin도 접근 가능)
    const adminRole = getAdminRole(req);
    if (!isAdmin(adminRole)) {
      return sendError(res, ErrorCode.FORBIDDEN, 'Admin 권한이 필요합니다.');
    }

    const { userId } = req.params;
    const passwordData = req.body;
    const currentAdminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    if (!currentAdminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!userId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    if (!passwordData.newPassword) {
      return sendValidationError(res, 'general', '새 비밀번호는 필수입니다.');
    }

    await userAccountService.changeUserPassword(Number(userId), passwordData, actorTag);

    sendSuccess(res, null, undefined, 'USER_ACCOUNT_PASSWORD_CHANGED', { adminId: currentAdminId, userId: Number(userId) });
  } catch (error) {
    appLogger.error('사용자 계정 비밀번호 변경 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '비밀번호 변경', '사용자 계정');
      }
    }
    sendError(res, ErrorCode.ACCOUNT_UPDATE_FAILED);
  }
};

/**
 * 사용자 계정 상태 업데이트 (일반 Admin도 접근 가능)
 * API: PUT /api/admin/user-accounts/:userId/status
 * 매핑: ADMIN_API_MAPPING[`PUT ${API_URLS.ADMIN.USER_ACCOUNT.STATUS_UPDATE}`]
 */
export const updateUserStatus = async (req: Request<UserAccountStatusUpdateParams, {}, UserAccountStatusUpdateReq>, res: Response) => {
  try {
    logApiCall('PUT', API_URLS.ADMIN.USER_ACCOUNT.STATUS_UPDATE, ADMIN_API_MAPPING as any, '사용자 계정 상태 업데이트 (일반 Admin도 접근 가능)');

    // Admin 권한 체크 (일반 Admin도 접근 가능)
    const adminRole = getAdminRole(req);
    if (!isAdmin(adminRole)) {
      return sendError(res, ErrorCode.FORBIDDEN, 'Admin 권한이 필요합니다.');
    }

    const { userId } = req.params;
    const statusData = req.body;
    const currentAdminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    if (!currentAdminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!userId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    if (!statusData.status) {
      return sendValidationError(res, 'general', '상태는 필수입니다.');
    }

    await userAccountService.updateUserStatus(Number(userId), statusData, actorTag);

    sendSuccess(res, null, undefined, 'USER_ACCOUNT_STATUS_UPDATED', { adminId: currentAdminId, userId: Number(userId) });
  } catch (error) {
    appLogger.error('사용자 계정 상태 업데이트 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '상태 업데이트', '사용자 계정');
      }
    }
    sendError(res, ErrorCode.ACCOUNT_UPDATE_FAILED);
  }
};

/**
 * 사용자 계정 이메일 중복 체크 (일반 Admin도 접근 가능)
 * API: POST /api/admin/user-accounts/email/check
 * 매핑: ADMIN_API_MAPPING[`POST ${API_URLS.ADMIN.USER_ACCOUNT.CHECK_EMAIL}`]
 */
export const checkUserEmail = async (req: Request<{}, {}, UserAccountCheckEmailReq>, res: Response) => {
  try {
    logApiCall('POST', API_URLS.ADMIN.USER_ACCOUNT.CHECK_EMAIL, ADMIN_API_MAPPING as any, '사용자 계정 이메일 중복 체크 (일반 Admin도 접근 가능)');

    // Admin 권한 체크 (일반 Admin도 접근 가능)
    const adminRole = getAdminRole(req);
    if (!isAdmin(adminRole)) {
      return sendError(res, ErrorCode.FORBIDDEN, 'Admin 권한이 필요합니다.');
    }

    const emailData = req.body;
    const adminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!emailData.email) {
      return sendValidationError(res, 'general', '이메일은 필수입니다.');
    }

    const result = await userAccountService.checkUserEmail(emailData);

    const response: UserAccountCheckEmailRes = result;

    sendSuccess(res, response, undefined, 'USER_ACCOUNT_EMAIL_CHECKED', { adminId, email: emailData.email });
  } catch (error) {
    appLogger.error('사용자 계정 이메일 중복 체크 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '이메일 중복 체크', '사용자 계정');
      }
    }
    sendError(res, ErrorCode.ACCOUNT_EMAIL_DUPLICATE);
  }
};
