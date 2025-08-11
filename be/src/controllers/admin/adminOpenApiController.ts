import { Request, Response } from 'express';
import { ErrorCode, ADMIN_API_MAPPING, API_URLS } from '@iitp-dabt/common';
import { sendError, sendSuccess, sendValidationError, sendDatabaseError } from '../../utils/errorHandler';
import { 
  getOpenApiList, 
  getOpenApiDetail, 
  createOpenApi, 
  updateOpenApi, 
  deleteOpenApi
} from '../../services/admin/adminOpenApiService';
import { appLogger } from '../../utils/logger';
import { 
  extractUserIdFromRequest,
  normalizeErrorMessage
} from '../../utils/commonUtils';
import type {
  AdminOpenApiListReq, 
  AdminOpenApiListRes, 
  AdminOpenApiDetailReq, 
  AdminOpenApiDetailRes,
  AdminOpenApiCreateReq,
  AdminOpenApiCreateRes,
  AdminOpenApiUpdateReq,
  AdminOpenApiUpdateRes,
  AdminOpenApiDeleteRes,
  AdminOpenApiStatsRes
} from '@iitp-dabt/common';

/**
 * OpenAPI 목록 조회 (관리자용)
 * API: GET /api/admin/open-api
 * 매핑: ADMIN_API_MAPPING[`GET ${API_URLS.ADMIN.OPEN_API.LIST}`]
 */
export const getOpenApiListForAdmin = async (req: Request<{}, {}, {}, AdminOpenApiListReq>, res: Response) => {
  try {
    const apiKey = `GET ${API_URLS.ADMIN.OPEN_API.LIST}`;
    const mapping = ADMIN_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || 'OpenAPI 목록 조회 (관리자용)'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });

    const { page = 1, limit = 10, search, status } = req.query;
    const adminId = extractUserIdFromRequest(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    const result = await getOpenApiList({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search,
      status
    });

    const response: AdminOpenApiListRes = {
      openApis: result.openApis.map(api => ({
        apiId: api.apiId,
        userId: api.userId,
        keyName: api.keyName,
        keyDesc: api.keyDesc,
        startDt: api.startDt?.toISOString(),
        endDt: api.endDt?.toISOString(),
        status: api.status,
        hitCnt: api.hitCnt,
        createdAt: api.createdAt.toISOString(),
        updatedAt: api.updatedAt?.toISOString()
      })),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit)
    };

    sendSuccess(res, response, undefined, 'ADMIN_OPEN_API_LIST_VIEW', { adminId, count: result.openApis.length }, true);
  } catch (error) {
    appLogger.error('관리자 OpenAPI 목록 조회 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '조회', 'OpenAPI 목록');
      }
    }
    sendError(res, ErrorCode.OPEN_API_NOT_FOUND);
  }
};

/**
 * OpenAPI 상세 조회 (관리자용)
 * API: GET /api/admin/open-api/:apiId
 * 매핑: ADMIN_API_MAPPING[`GET ${API_URLS.ADMIN.OPEN_API.DETAIL}`]
 */
export const getOpenApiDetailForAdmin = async (req: Request<AdminOpenApiDetailReq>, res: Response) => {
  try {
    const apiKey = `GET ${API_URLS.ADMIN.OPEN_API.DETAIL}`;
    const mapping = ADMIN_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || 'OpenAPI 상세 조회 (관리자용)'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });

    const { apiId } = req.params;
    const adminId = extractUserIdFromRequest(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!apiId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }
    
    const api = await getOpenApiDetail(parseInt(apiId));
    if (!api) {
      return sendError(res, ErrorCode.OPEN_API_NOT_FOUND);
    }

    const response: AdminOpenApiDetailRes = {
      openApi: {
        apiId: api.apiId,
        userId: api.userId,
        keyName: api.keyName,
        keyDesc: api.keyDesc,
        startDt: api.startDt?.toISOString(),
        endDt: api.endDt?.toISOString(),
        status: api.status,
        hitCnt: api.hitCnt,
        createdAt: api.createdAt.toISOString(),
        updatedAt: api.updatedAt?.toISOString()
      }
    };

    sendSuccess(res, response, undefined, 'ADMIN_OPEN_API_DETAIL_VIEW', { adminId, apiId });
  } catch (error) {
    appLogger.error('관리자 OpenAPI 상세 조회 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '조회', 'OpenAPI 상세');
      }
    }
    sendError(res, ErrorCode.OPEN_API_NOT_FOUND);
  }
};

/**
 * OpenAPI 생성 (관리자용)
 * API: POST /api/admin/open-api
 * 매핑: ADMIN_API_MAPPING[`POST ${API_URLS.ADMIN.OPEN_API.CREATE}`]
 */
export const createOpenApiForAdmin = async (req: Request<{}, {}, AdminOpenApiCreateReq>, res: Response) => {
  try {
    const apiKey = `POST ${API_URLS.ADMIN.OPEN_API.CREATE}`;
    const mapping = ADMIN_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || 'OpenAPI 생성 (관리자용)'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });

    const apiData = req.body;
    const adminId = extractUserIdFromRequest(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!apiData.userId || !apiData.keyName || !apiData.extensionDays) {
      return sendValidationError(res, 'general', '사용자 ID, 키 이름, 연장 일수는 필수입니다.');
    }

    const newApi = await createOpenApi(apiData, adminId);

    const response: AdminOpenApiCreateRes = {
      apiId: newApi.apiId,
      message: 'OpenAPI가 성공적으로 생성되었습니다.'
    };

    sendSuccess(res, response, response.message, 'ADMIN_OPEN_API_CREATED', { adminId, apiId: newApi.apiId });
  } catch (error) {
    appLogger.error('관리자 OpenAPI 생성 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '생성', 'OpenAPI');
      }
    }
    sendError(res, ErrorCode.OPEN_API_CREATE_FAILED);
  }
};

/**
 * OpenAPI 수정 (관리자용)
 * API: PUT /api/admin/open-api/:apiId
 * 매핑: ADMIN_API_MAPPING[`PUT ${API_URLS.ADMIN.OPEN_API.UPDATE}`]
 */
export const updateOpenApiForAdmin = async (req: Request<{ apiId: string }, {}, AdminOpenApiUpdateReq>, res: Response) => {
  try {
    const apiKey = `PUT ${API_URLS.ADMIN.OPEN_API.UPDATE}`;
    const mapping = ADMIN_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || 'OpenAPI 수정 (관리자용)'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });

    const { apiId } = req.params;
    const updateData = req.body;
    const adminId = extractUserIdFromRequest(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!apiId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const updatedApi = await updateOpenApi(parseInt(apiId), updateData, adminId);

    const response: AdminOpenApiUpdateRes = {
      apiId: updatedApi.apiId,
      message: 'OpenAPI가 성공적으로 수정되었습니다.'
    };

    sendSuccess(res, response, response.message, 'ADMIN_OPEN_API_UPDATED', { adminId, apiId });
  } catch (error) {
    appLogger.error('관리자 OpenAPI 수정 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '수정', 'OpenAPI');
      }
    }
    sendError(res, ErrorCode.OPEN_API_UPDATE_FAILED);
  }
};

/**
 * OpenAPI 삭제 (관리자용)
 * API: DELETE /api/admin/open-api/:apiId
 * 매핑: ADMIN_API_MAPPING[`DELETE ${API_URLS.ADMIN.OPEN_API.DELETE}`]
 */
export const deleteOpenApiForAdmin = async (req: Request<{ apiId: string }>, res: Response) => {
  try {
    const apiKey = `DELETE ${API_URLS.ADMIN.OPEN_API.DELETE}`;
    const mapping = ADMIN_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || 'OpenAPI 삭제 (관리자용)'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });

    const { apiId } = req.params;
    const adminId = extractUserIdFromRequest(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!apiId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    await deleteOpenApi(parseInt(apiId), adminId);

    const response: AdminOpenApiDeleteRes = {
      apiId: parseInt(apiId),
      message: 'OpenAPI가 성공적으로 삭제되었습니다.'
    };

    sendSuccess(res, response, response.message, 'ADMIN_OPEN_API_DELETED', { adminId, apiId });
  } catch (error) {
    appLogger.error('관리자 OpenAPI 삭제 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '삭제', 'OpenAPI');
      }
    }
    sendError(res, ErrorCode.OPEN_API_DELETE_FAILED);
  }
};