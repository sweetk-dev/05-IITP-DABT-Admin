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



// 사용자 OpenAPI 인증키 목록 조회
export const getUserOpenApiList = async (req: Request<{}, {}, UserOpenApiListReq>, res: Response) => {
  try {
    const userId = extractUserIdFromRequest(req);
    
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    // 기본 파라미터 검증 (현재는 특별한 파라미터가 없지만 향후 확장성을 위해)
    const params = req.body;

    const response = await UserOpenApiService.getUserOpenApiList(userId, params);

    sendSuccess(res, response, undefined, 'USER_OPENAPI_LIST_VIEW', {
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

// 사용자 OpenAPI 인증키 상세 조회
export const getUserOpenApiDetail = async (req: Request<{ keyId: string }>, res: Response) => {
  try {
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

    sendSuccess(res, response, undefined, 'USER_OPENAPI_DETAIL_VIEW', {
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

// 사용자 OpenAPI 인증키 생성
export const createUserOpenApi = async (req: Request<{}, {}, UserOpenApiCreateReq>, res: Response) => {
  try {
    const userId = extractUserIdFromRequest(req);
    
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    // 기본 파라미터 검증
    const { keyName, keyDesc, startDt, endDt } = req.body;

    if (!keyName) {
      return sendValidationError(res, 'keyName', 'API 이름이 필요합니다.');
    }

    if (!keyDesc) {
      return sendValidationError(res, 'keyDesc', 'API 사용 목적이 필요합니다.');
    }

    // API 키 이름 형식 검증
    if (!isValidApiKeyName(keyName)) {
      return sendValidationError(res, 'keyName', '유효한 API 이름을 입력해주세요. (1-120자, 한글/영문/숫자/공백/특수문자)');
    }

    // API 키 설명 형식 검증
    if (!isValidApiKeyDesc(keyDesc)) {
      return sendValidationError(res, 'keyDesc', '유효한 API 사용 목적을 입력해주세요. (1-600자, 한글/영문/숫자/공백/특수문자)');
    }

    // 날짜 형식 검증 (선택적)
    if (startDt && !isValidDate(startDt)) {
      return sendValidationError(res, 'startDt', '유효하지 않은 시작일 형식입니다. (YYYY-MM-DD)');
    }

    if (endDt && !isValidDate(endDt)) {
      return sendValidationError(res, 'endDt', '유효하지 않은 종료일 형식입니다. (YYYY-MM-DD)');
    }

    // 시작일이 종료일보다 늦은 경우
    if (startDt && endDt && new Date(startDt) > new Date(endDt)) {
      return sendValidationError(res, 'date', '시작일은 종료일보다 이전이어야 합니다.');
    }

    const response = await UserOpenApiService.createUserOpenApi(userId, { keyName, keyDesc, startDt, endDt });

    sendSuccess(res, response, response.message, 'USER_OPENAPI_CREATE', {
      userId: userId,
      keyId: response.keyId,
      keyName: keyName
    });
  } catch (error) {
    appLogger.error('사용자 OpenAPI 인증키 생성 중 오류 발생', { error, userId: extractUserIdFromRequest(req) });
    
    if (error instanceof Error) {
      return sendValidationError(res, 'general', normalizeErrorMessage(error));
    }
    
    sendDatabaseError(res, '생성', '사용자 OpenAPI 인증키');
  }
};

// 사용자 OpenAPI 인증키 삭제
export const deleteUserOpenApi = async (req: Request<{ keyId: string }>, res: Response) => {
  try {
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

    sendSuccess(res, response, response.message, 'USER_OPENAPI_DELETE', {
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

// 사용자 OpenAPI 인증키 기간 연장
export const extendUserOpenApi = async (req: Request<{ keyId: string }, {}, UserOpenApiExtendReq>, res: Response) => {
  try {
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

    const { extensionDays } = req.body;

    if (!extensionDays) {
      return sendValidationError(res, 'extensionDays', '연장 기간이 필요합니다.');
    }

    // 연장 기간 유효성 검증
    if (typeof extensionDays !== 'number' || (extensionDays !== 90 && extensionDays !== 365)) {
      return sendValidationError(res, 'extensionDays', '연장 기간은 90일 또는 365일이어야 합니다.');
    }

    const response = await UserOpenApiService.extendUserOpenApi(userId, { keyId, extensionDays });

    sendSuccess(res, response, response.message, 'USER_OPENAPI_EXTEND', {
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