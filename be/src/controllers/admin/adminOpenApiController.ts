import { Request, Response } from 'express';
import { ErrorCode, ADMIN_API_MAPPING, API_URLS } from '@iitp-dabt/common';
import { sendError, sendSuccess, sendValidationError, sendDatabaseError } from '../../utils/errorHandler';
import { 
  getOpenApiList, 
  getOpenApiDetail, 
  createOpenApi, 
  updateOpenApi, 
  deleteOpenApi,
  extendOpenApiKey,
  getOpenApiStats
} from '../../services/admin/adminOpenApiService';
import { appLogger } from '../../utils/logger';
import { logApiCall } from '../../utils/apiLogger';
import { 
  extractUserIdFromRequest
} from '../../utils/commonUtils';
import { getNumberQuery, getStringQuery } from '../../utils/queryParsers';
import { BusinessError, ResourceError } from '../../utils/customErrors';
import { getActorTag } from '../../utils/auth';
import type {
  AdminOpenApiListQuery,
  AdminOpenApiListRes,
  AdminOpenApiDetailParams,
  AdminOpenApiDetailRes,
  AdminOpenApiCreateReq,
  AdminOpenApiCreateRes,
  AdminOpenApiUpdateReq,
  AdminOpenApiDeleteParams,
  AdminOpenApiExtendReq,
  AdminOpenApiExtendRes,
  AdminOpenApiStatsRes
} from '@iitp-dabt/common';
import { toAdminOpenApiKeyItem } from '../../mappers/openApiMapper';

/**
 * OpenAPI 목록 조회 (관리자용)
 * API: GET /api/admin/open-api
 * 매핑: ADMIN_API_MAPPING[`GET ${API_URLS.ADMIN.OPEN_API.LIST}`]
 */
export const getOpenApiListForAdmin = async (req: Request<{}, {}, {}, AdminOpenApiListQuery>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.ADMIN.OPEN_API.LIST, ADMIN_API_MAPPING as any, 'OpenAPI 목록 조회 (관리자용)');

    const page = getNumberQuery(req.query, 'page', 1)!;
    const limit = getNumberQuery(req.query, 'limit', 10)!;
    const search = getStringQuery(req.query, 'searchKeyword');
    const status = getStringQuery(req.query, 'activeYn');
    
    const adminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    const result = await getOpenApiList({
      page,
      limit,
      search,
      status
    });

    const response: AdminOpenApiListRes = {
      items: result.openApis.map(toAdminOpenApiKeyItem),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit)
    };

    sendSuccess(res, response, undefined, 'ADMIN_OPEN_API_LIST_VIEW', { adminId, count: response.items.length }, true);
  } catch (error) {
    appLogger.error('관리자 OpenAPI 목록 조회 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    
    // ✅ customErrors 처리
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.DATABASE_ERROR) {
        return sendDatabaseError(res, '조회', 'OpenAPI 목록');
      }
      return sendError(res, error.errorCode, error.message);
    }
    
    if (error instanceof ResourceError) {
      return sendError(res, error.errorCode, error.message);
    }
    
    // 기타 예상치 못한 에러
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * OpenAPI 상세 조회 (관리자용)
 * API: GET /api/admin/open-api/:keyId
 * 매핑: ADMIN_API_MAPPING[`GET ${API_URLS.ADMIN.OPEN_API.DETAIL}`]
 */
export const getOpenApiDetailForAdmin = async (req: Request<AdminOpenApiDetailParams>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.ADMIN.OPEN_API.DETAIL, ADMIN_API_MAPPING as any, 'OpenAPI 상세 조회 (관리자용)');

    const { keyId } = req.params;
    const adminId = extractUserIdFromRequest(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!keyId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }
    
    const api = await getOpenApiDetail(parseInt(keyId));
    const response: AdminOpenApiDetailRes = { authKey: toAdminOpenApiKeyItem(api) };
    sendSuccess(res, response, undefined, 'ADMIN_OPEN_API_DETAIL_VIEW', { adminId, keyId });
  } catch (error) {
    appLogger.error('관리자 OpenAPI 상세 조회 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    
    // ✅ customErrors 처리
    if (error instanceof ResourceError) {
      if (error.errorCode === ErrorCode.OPEN_API_NOT_FOUND) {
        return sendError(res, ErrorCode.OPEN_API_NOT_FOUND);
      }
      return sendError(res, error.errorCode, error.message);
    }
    
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.DATABASE_ERROR) {
        return sendDatabaseError(res, '조회', 'OpenAPI 상세');
      }
      return sendError(res, error.errorCode, error.message);
    }
    
    // 기타 예상치 못한 에러
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * OpenAPI 생성 (관리자용)
 * API: POST /api/admin/open-api
 * 매핑: ADMIN_API_MAPPING[`POST ${API_URLS.ADMIN.OPEN_API.CREATE}`]
 */
export const createOpenApiForAdmin = async (req: Request<{}, {}, AdminOpenApiCreateReq>, res: Response) => {
  try {
    logApiCall('POST', API_URLS.ADMIN.OPEN_API.CREATE, ADMIN_API_MAPPING as any, 'OpenAPI 생성 (관리자용)');

    const apiData = req.body;
    const adminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!apiData.userId || !apiData.keyName) {
      return sendValidationError(res, 'general', '사용자 ID와 키 이름은 필수입니다.');
    }

    const result = await createOpenApi(apiData, actorTag);
    const response: AdminOpenApiCreateRes = { 
      keyId: result.keyId, 
      authKey: result.authKey 
    };
    sendSuccess(res, response, undefined, 'ADMIN_OPEN_API_CREATED', { adminId, userId: apiData.userId });
  } catch (error) {
    appLogger.error('관리자 OpenAPI 생성 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    
    // ✅ customErrors 처리
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.OPEN_API_CREATE_FAILED) {
        return sendError(res, ErrorCode.OPEN_API_CREATE_FAILED);
      }
      return sendError(res, error.errorCode, error.message);
    }
    
    if (error instanceof ResourceError) {
      return sendError(res, error.errorCode, error.message);
    }
    
    // 기타 예상치 못한 에러
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * OpenAPI 수정 (관리자용)
 * API: PUT /api/admin/open-api/:apiId
 * 매핑: ADMIN_API_MAPPING[`PUT ${API_URLS.ADMIN.OPEN_API.UPDATE}`]
 */
export const updateOpenApiForAdmin = async (req: Request<{ apiId: string }, {}, AdminOpenApiUpdateReq>, res: Response) => {
  try {
    logApiCall('PUT', API_URLS.ADMIN.OPEN_API.UPDATE, ADMIN_API_MAPPING as any, 'OpenAPI 수정 (관리자용)');

    const { apiId } = req.params;
    const updateData = req.body;
    const adminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!apiId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    await updateOpenApi(parseInt(apiId), updateData, actorTag);
    sendSuccess(res, undefined, undefined, 'ADMIN_OPEN_API_UPDATED', { adminId, keyId: apiId });
  } catch (error) {
    appLogger.error('관리자 OpenAPI 수정 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    
    // ✅ customErrors 처리
    if (error instanceof ResourceError) {
      if (error.errorCode === ErrorCode.OPEN_API_NOT_FOUND) {
        return sendError(res, ErrorCode.OPEN_API_NOT_FOUND);
      }
      return sendError(res, error.errorCode, error.message);
    }
    
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.OPEN_API_UPDATE_FAILED) {
        return sendError(res, ErrorCode.OPEN_API_UPDATE_FAILED);
      }
      return sendError(res, error.errorCode, error.message);
    }
    
    // 기타 예상치 못한 에러
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * OpenAPI 삭제 (관리자용)
 * API: DELETE /api/admin/open-api/:apiId
 * 매핑: ADMIN_API_MAPPING[`DELETE ${API_URLS.ADMIN.OPEN_API.DELETE}`]
 */
export const deleteOpenApiForAdmin = async (
  req: Request<{ keyId: string }, {}, AdminOpenApiDeleteParams>,
  res: Response
) => {
  try {
    logApiCall('DELETE', API_URLS.ADMIN.OPEN_API.DELETE, ADMIN_API_MAPPING as any, 'OpenAPI 삭제 (관리자용)');

    const { keyId } = req.params;
    const adminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!keyId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const parsedKeyId = parseInt(keyId);
    if (!parsedKeyId || Number.isNaN(parsedKeyId) || parsedKeyId <= 0) {
      return sendValidationError(res, 'keyId', '유효하지 않은 인증키 ID입니다.');
    }

    // Body로 keyId가 넘어오는 경우 DTO와의 정합성 확인 (선택적)
    if (req.body && typeof req.body.keyId === 'number' && req.body.keyId !== parsedKeyId) {
      return sendValidationError(res, 'keyId', '요청 경로와 본문의 keyId가 일치해야 합니다.');
    }

    await deleteOpenApi(parsedKeyId, actorTag);

    sendSuccess(res, undefined, undefined, 'ADMIN_OPEN_API_DELETED', { adminId, keyId: parsedKeyId });
  } catch (error) {
    appLogger.error('관리자 OpenAPI 삭제 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    
    // ✅ customErrors 처리
    if (error instanceof ResourceError) {
      if (error.errorCode === ErrorCode.OPEN_API_NOT_FOUND) {
        return sendError(res, ErrorCode.OPEN_API_NOT_FOUND);
      }
      return sendError(res, error.errorCode, error.message);
    }
    
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.OPEN_API_DELETE_FAILED) {
        return sendError(res, ErrorCode.OPEN_API_DELETE_FAILED);
      }
      return sendError(res, error.errorCode, error.message);
    }
    
    // 기타 예상치 못한 에러
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * OpenAPI 키 기간 연장 (관리자용)
 * API: POST /api/admin/open-api/:keyId/extend
 * 매핑: ADMIN_API_MAPPING[`POST ${API_URLS.ADMIN.OPEN_API.EXTEND}`]
 */
export const extendOpenApiAdmin = async (req: Request<{ keyId: string }, {}, { startDt?: string; endDt?: string; updatedBy?: string }>, res: Response) => {
  try {
    logApiCall('POST', API_URLS.ADMIN.OPEN_API.EXTEND, ADMIN_API_MAPPING as any, 'OpenAPI 키 기간 연장 (관리자용)');

    const { keyId } = req.params;
    const extendData = req.body;
    const adminId = extractUserIdFromRequest(req);
    const actorTag = getActorTag(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!keyId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    if (!extendData.startDt || !extendData.endDt) {
      return sendValidationError(res, 'period', '시작일과 종료일이 필요합니다.');
    }

    // ✅ service를 통해 키 기간 연장 처리
    const result = await extendOpenApiKey(parseInt(keyId), {
      startDt: extendData.startDt,
      endDt: extendData.endDt
    }, actorTag);
    
    const response: AdminOpenApiExtendRes = { 
      startDt: result.startDt?.toISOString(), 
      endDt: result.endDt?.toISOString() 
    };

    sendSuccess(res, response, undefined, 'ADMIN_OPEN_API_EXTENDED', { adminId, keyId, startDt: extendData.startDt, endDt: extendData.endDt });
  } catch (error) {
    appLogger.error('관리자 OpenAPI 키 기간 연장 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    
    // ✅ customErrors 처리
    if (error instanceof ResourceError) {
      if (error.errorCode === ErrorCode.OPEN_API_NOT_FOUND) {
        return sendError(res, ErrorCode.OPEN_API_NOT_FOUND);
      }
      return sendError(res, error.errorCode, error.message);
    }
    
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.OPEN_API_UPDATE_FAILED) {
        return sendError(res, ErrorCode.OPEN_API_UPDATE_FAILED);
      }
      return sendError(res, error.errorCode, error.message);
    }
    
    // 기타 예상치 못한 에러
    sendError(res, ErrorCode.OPEN_API_EXTENDED_FAILED);
  }
};

/**
 * OpenAPI 상태 조회 (관리자용)
 * API: GET /api/admin/open-api/status
 * 매핑: ADMIN_API_MAPPING[`GET ${API_URLS.ADMIN.OPEN_API.STATUS}`]
 */
export const statusOpenApiAdmin = async (req: Request, res: Response) => {
  try {
    logApiCall('GET', API_URLS.ADMIN.OPEN_API.STATUS, ADMIN_API_MAPPING as any, 'OpenAPI 상태 조회 (관리자용)');

    const adminId = extractUserIdFromRequest(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    // OpenAPI 상태 통계 조회 서비스 호출
    const stats = await getOpenApiStats();

    const response: AdminOpenApiStatsRes = {
      total: stats.totalKeys,
      active: stats.activeKeys,
      expired: stats.expiredKeys,
      inactive: stats.suspendedKeys
    };

    sendSuccess(res, response, undefined, 'ADMIN_OPEN_API_STATUS_VIEW', { adminId });
  } catch (error) {
    appLogger.error('관리자 OpenAPI 상태 조회 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    
    // ✅ customErrors 처리
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.DATABASE_ERROR) {
        return sendDatabaseError(res, '조회', 'OpenAPI 상태');
      }
      return sendError(res, error.errorCode, error.message);
    }
    
    if (error instanceof ResourceError) {
      return sendError(res, error.errorCode, error.message);
    }
    
    // 기타 예상치 못한 에러
    sendError(res, ErrorCode.OPEN_API_NOT_FOUND);
  }
};