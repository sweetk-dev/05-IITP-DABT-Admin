import { Request, Response } from 'express';
import { 
  UserOpenApiListReq, 
  UserOpenApiListRes, 
  UserOpenApiDetailReq, 
  UserOpenApiDetailRes,
  UserOpenApiCreateReq, 
  UserOpenApiCreateRes, 
  UserOpenApiDeleteReq, 
  UserOpenApiDeleteRes,
  UserOpenApiExtendReq, 
  UserOpenApiExtendRes,
  ErrorCode,
  USER_API_MAPPING,
  API_URLS,
  isValidApiKeyName,
  isValidApiKeyDesc,
  isValidDate
} from '@iitp-dabt/common';
import { UserOpenApiService } from '../../services/user/userOpenApiService';
import { 
  sendSuccess, 
  sendError, 
  sendValidationError, 
  sendDatabaseError 
} from '../../utils/errorHandler';
import { appLogger } from '../../utils/logger';
import { 
  extractUserIdFromRequest, 
  validateAndParseNumber, 
  normalizeErrorMessage 
} from '../../utils/commonUtils';

/**
 * 사용자 OpenAPI 인증키 목록 조회
 * API: GET /api/user/open-api
 * 매핑: USER_API_MAPPING[`GET ${API_URLS.USER.OPEN_API.LIST}`]
 */
export const getUserOpenApiList = async (req: Request<{}, {}, UserOpenApiListReq>, res: Response) => {
  try {
    const apiKey = `GET ${API_URLS.USER.OPEN_API.LIST}`;
    const mapping = USER_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || '사용자 OpenAPI 인증키 목록 조회'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });

    const userId = extractUserIdFromRequest(req);
    
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    // 기본 파라미터 검증 (현재는 특별한 파라미터가 없지만 향후 확장성을 위해)
    const params = req.body;

    const response = await UserOpenApiService.getUserOpenApiList(userId, params);

    const result: UserOpenApiListRes = {
      authKeys: response.authKeys
    };

    sendSuccess(res, result, undefined, 'USER_OPENAPI_LIST_VIEW', {
      userId: userId
    });
  } catch (error) {
    appLogger.error('사용자 OpenAPI 인증키 목록 조회 중 오류 발생', { error, userId: extractUserIdFromRequest(req) });
    
    if (error instanceof Error) {
      return sendValidationError(res, 'general', normalizeErrorMessage(error));
    }
    
    sendDatabaseError(res, '조회', '사용자 OpenAPI 인증키 목록');
  }
};

/**
 * 사용자 OpenAPI 인증키 상세 조회
 * API: GET /api/user/open-api/:keyId
 * 매핑: USER_API_MAPPING[`GET ${API_URLS.USER.OPEN_API.DETAIL}`]
 */
export const getUserOpenApiDetail = async (req: Request<{ keyId: string }>, res: Response) => {
  try {
    const apiKey = `GET ${API_URLS.USER.OPEN_API.DETAIL}`;
    const mapping = USER_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || '사용자 OpenAPI 인증키 상세 조회'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });

    const userId = extractUserIdFromRequest(req);
    
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    // 기본 파라미터 검증
    const { keyId: keyIdParam } = req.params;
    
    if (!keyIdParam) {
      return sendValidationError(res, 'keyId', '인증키 ID가 필요합니다.');
    }

    const keyId = validateAndParseNumber(keyIdParam, 1);
    if (!keyId) {
      return sendValidationError(res, 'keyId', '유효하지 않은 인증키 ID입니다.');
    }

    const response = await UserOpenApiService.getUserOpenApiDetail(userId, keyId);

    const result: UserOpenApiDetailRes = {
      authKey: response.authKey
    };

    sendSuccess(res, result, undefined, 'USER_OPENAPI_DETAIL_VIEW', {
      userId: userId,
      keyId: keyId
    });
  } catch (error) {
    appLogger.error('사용자 OpenAPI 인증키 상세 조회 중 오류 발생', { error, userId: extractUserIdFromRequest(req) });
    
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('인증키를 찾을 수 없습니다')) {
        return sendError(res, ErrorCode.USER_NOT_FOUND);
      }
      if (errorMsg.includes('접근 권한이 없습니다')) {
        return sendError(res, ErrorCode.FORBIDDEN);
      }
      return sendValidationError(res, 'general', errorMsg);
    }
    
    sendDatabaseError(res, '조회', '사용자 OpenAPI 인증키 상세');
  }
};

/**
 * 사용자 OpenAPI 인증키 생성
 * API: POST /api/user/open-api
 * 매핑: USER_API_MAPPING[`POST ${API_URLS.USER.OPEN_API.CREATE}`]
 */
export const createUserOpenApi = async (req: Request<{}, {}, UserOpenApiCreateReq>, res: Response) => {
  try {
    const apiKey = `POST ${API_URLS.USER.OPEN_API.CREATE}`;
    const mapping = USER_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || '사용자 OpenAPI 인증키 생성'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });

    const userId = extractUserIdFromRequest(req);
    
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    // 기본 파라미터 검증
    const { keyName, keyDesc, startDt, endDt } = req.body;

    if (!keyName) {
      return sendValidationError(res, 'keyName', '인증키 이름이 필요합니다.');
    }

    if (!isValidApiKeyName(keyName)) {
      return sendValidationError(res, 'keyName', '인증키 이름 형식이 올바르지 않습니다.');
    }

    if (keyDesc && !isValidApiKeyDesc(keyDesc)) {
      return sendValidationError(res, 'keyDesc', '인증키 설명 형식이 올바르지 않습니다.');
    }

    if (startDt && !isValidDate(startDt)) {
      return sendValidationError(res, 'startDt', '시작일 형식이 올바르지 않습니다.');
    }

    if (endDt && !isValidDate(endDt)) {
      return sendValidationError(res, 'endDt', '종료일 형식이 올바르지 않습니다.');
    }

    const response = await UserOpenApiService.createUserOpenApi(userId, {
      keyName,
      keyDesc,
      startDt,
      endDt
    });

    const result: UserOpenApiCreateRes = {
      keyId: response.keyId,
      authKey: response.authKey,
      message: response.message
    };

    sendSuccess(res, result, result.message, 'USER_OPENAPI_CREATE', {
      userId: userId,
      keyName: keyName
    });
  } catch (error) {
    appLogger.error('사용자 OpenAPI 인증키 생성 중 오류 발생', { error, userId: extractUserIdFromRequest(req) });
    
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('이미 존재하는 인증키 이름입니다')) {
        return sendValidationError(res, 'apiKeyName', errorMsg);
      }
      return sendValidationError(res, 'general', errorMsg);
    }
    
    sendDatabaseError(res, '생성', '사용자 OpenAPI 인증키');
  }
};

/**
 * 사용자 OpenAPI 인증키 삭제
 * API: DELETE /api/user/open-api/:keyId
 * 매핑: USER_API_MAPPING[`DELETE ${API_URLS.USER.OPEN_API.DELETE}`]
 */
export const deleteUserOpenApi = async (req: Request<{ keyId: string }>, res: Response) => {
  try {
    const apiKey = `DELETE ${API_URLS.USER.OPEN_API.DELETE}`;
    const mapping = USER_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || '사용자 OpenAPI 인증키 삭제'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });

    const userId = extractUserIdFromRequest(req);
    
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    // 기본 파라미터 검증
    const { keyId: keyIdParam } = req.params;
    
    if (!keyIdParam) {
      return sendValidationError(res, 'keyId', '인증키 ID가 필요합니다.');
    }

    const keyId = validateAndParseNumber(keyIdParam, 1);
    if (!keyId) {
      return sendValidationError(res, 'keyId', '유효하지 않은 인증키 ID입니다.');
    }

    const response = await UserOpenApiService.deleteUserOpenApi(userId, keyId);

    const result: UserOpenApiDeleteRes = {
      message: response.message
    };

    sendSuccess(res, result, result.message, 'USER_OPENAPI_DELETE', {
      userId: userId,
      keyId: keyId
    });
  } catch (error) {
    appLogger.error('사용자 OpenAPI 인증키 삭제 중 오류 발생', { error, userId: extractUserIdFromRequest(req) });
    
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('인증키를 찾을 수 없습니다')) {
        return sendError(res, ErrorCode.USER_NOT_FOUND);
      }
      if (errorMsg.includes('접근 권한이 없습니다')) {
        return sendError(res, ErrorCode.FORBIDDEN);
      }
      return sendValidationError(res, 'general', errorMsg);
    }
    
    sendDatabaseError(res, '삭제', '사용자 OpenAPI 인증키');
  }
};

/**
 * 사용자 OpenAPI 인증키 기간 연장
 * API: PUT /api/user/open-api/:keyId/extend
 * 매핑: USER_API_MAPPING[`PUT ${API_URLS.USER.OPEN_API.EXTEND}`]
 */
export const extendUserOpenApi = async (req: Request<{ keyId: string }, {}, UserOpenApiExtendReq>, res: Response) => {
  try {
    const apiKey = `PUT ${API_URLS.USER.OPEN_API.EXTEND}`;
    const mapping = USER_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || '사용자 OpenAPI 인증키 기간 연장'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });

    const userId = extractUserIdFromRequest(req);
    
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    // 기본 파라미터 검증
    const { keyId: keyIdParam } = req.params;
    const { extensionDays } = req.body;
    
    if (!keyIdParam) {
      return sendValidationError(res, 'keyId', '인증키 ID가 필요합니다.');
    }

    const keyId = validateAndParseNumber(keyIdParam, 1);
    if (!keyId) {
      return sendValidationError(res, 'keyId', '유효하지 않은 인증키 ID입니다.');
    }

    if (!extensionDays) {
      return sendValidationError(res, 'extensionDays', '연장 일수가 필요합니다.');
    }

    if (extensionDays !== 90 && extensionDays !== 365) {
      return sendValidationError(res, 'extensionDays', '연장 일수는 90일 또는 365일이어야 합니다.');
    }

    const response = await UserOpenApiService.extendUserOpenApi(userId, { keyId, extensionDays });

    const result: UserOpenApiExtendRes = {
      message: response.message,
      newEndDt: response.newEndDt
    };

    sendSuccess(res, result, result.message, 'USER_OPENAPI_EXTEND', {
      userId: userId,
      keyId: keyId,
      extensionDays: extensionDays
    });
  } catch (error) {
    appLogger.error('사용자 OpenAPI 인증키 기간 연장 중 오류 발생', { error, userId: extractUserIdFromRequest(req) });
    
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('인증키를 찾을 수 없습니다')) {
        return sendError(res, ErrorCode.USER_NOT_FOUND);
      }
      if (errorMsg.includes('접근 권한이 없습니다')) {
        return sendError(res, ErrorCode.FORBIDDEN);
      }
      return sendValidationError(res, 'general', errorMsg);
    }
    
    sendDatabaseError(res, '연장', '사용자 OpenAPI 인증키');
  }
};