import { Request, Response } from 'express';
import { ErrorCode, COMMON_CODE_API_MAPPING, API_URLS } from '@iitp-dabt/common';
import { sendError, sendSuccess, sendValidationError, sendDatabaseError } from '../../utils/errorHandler';
import { 
  getCommonCodesByGroupId,
  getCommonCodeById,
  getCommonCodesByType as getCommonCodesByTypeService,
  getCommonCodesByParent as getCommonCodesByParentService,
  createCommonCode as createCommonCodeService,
  updateCommonCodeById,
  deleteCommonCodeById,
} from '../../services/common/commonCodeService';
import { toUserCommonCode, toAdminCommonCodeDetail } from '../../mappers/commonCodeMapper';
import { appLogger } from '../../utils/logger';
import { logApiCall } from '../../utils/apiLogger';
import { 
  extractUserIdFromRequest,
  validateAndParseNumber,
  normalizeErrorMessage
} from '../../utils/commonUtils';
import type {
  CommonCodeByGroupReq,
  CommonCodeByGroupRes,
  CommonCodeByGroupDetailRes,
  CommonCodeByIdReq,
  CommonCodeByIdRes,
  CommonCodeByIdDetailRes,
  CommonCodeByTypeReq,
  CommonCodeByTypeRes,
  CommonCodeByTypeDetailRes,
  CommonCodeByParentReq,
  CommonCodeByParentRes,
  CommonCodeByParentDetailRes,
  CommonCodeCreateReq,
  CommonCodeCreateRes,
  CommonCodeUpdateReq,
  CommonCodeUpdateRes,
  CommonCodeDeleteRes,
  ApiResponse
} from '@iitp-dabt/common';

/**
 * 그룹 ID로 공통 코드 목록 조회 (사용자용)
 * 
 * API: GET /api/common-code/:grpId
 * 매핑: COMMON_CODE_API_MAPPING[`GET ${API_URLS.COMMON_CODE.BASIC.BY_GROUP}`]
 */
export const getCommonCodes = async (req: Request<CommonCodeByGroupReq>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.COMMON_CODE.BASIC.BY_ID, COMMON_CODE_API_MAPPING as any, '코드 상세 조회 (사용자용)');
    // API 매핑 정보 로깅
    logApiCall('GET', API_URLS.COMMON_CODE.BASIC.BY_GROUP, COMMON_CODE_API_MAPPING as any, '그룹별 조회 (사용자용)');

    const { grpId } = req.params;
    
    if (!grpId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const codes = await getCommonCodesByGroupId(grpId);
    
    // 사용자용 응답 - 관리 정보 제외
    const userCodes = codes.map(toUserCommonCode);
    
    const result: CommonCodeByGroupRes = { codes: userCodes };
    sendSuccess(res, result, undefined, 'COMMON_CODES_RETRIEVED', { grpId, count: userCodes.length }, true); // isListResponse: true
  } catch (error) {
    appLogger.error('Error in getCommonCodes:', error);
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '조회', '공통 코드 목록');
      }
    }
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * 그룹 ID로 공통 코드 목록 조회 (관리자용)
 * 
 * API: GET /api/common-code/admin/:grpId
 * 매핑: COMMON_CODE_API_MAPPING[`GET ${API_URLS.COMMON_CODE.ADMIN.BY_GROUP}`]
 */
export const getCommonCodesDetail = async (req: Request<CommonCodeByGroupReq>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.COMMON_CODE.ADMIN.BY_ID, COMMON_CODE_API_MAPPING as any, '코드 상세 조회 (관리자용)');
    // API 매핑 정보 로깅
    logApiCall('GET', API_URLS.COMMON_CODE.ADMIN.BY_GROUP, COMMON_CODE_API_MAPPING as any, '그룹별 조회 (관리자용)');

    const { grpId } = req.params;
    
    if (!grpId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const codes = await getCommonCodesByGroupId(grpId);
    
    // 관리자용 응답 - Date를 string으로 변환
    const detailCodes = codes.map(toAdminCommonCodeDetail);
    
    const result: CommonCodeByGroupDetailRes = { codes: detailCodes };
    sendSuccess(res, result, undefined, 'COMMON_CODES_DETAIL_RETRIEVED', { grpId, count: detailCodes.length }, true); // isListResponse: true
  } catch (error) {
    appLogger.error('Error in getCommonCodesDetail:', error);
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '조회', '공통 코드 상세 목록');
      }
    }
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * 특정 공통 코드 조회 (사용자용)
 */
export const getCommonCode = async (req: Request<CommonCodeByIdReq>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.COMMON_CODE.BASIC.BY_TYPE, COMMON_CODE_API_MAPPING as any, '타입별 조회 (사용자용)');
    const { grpId, codeId } = req.params;
    
    if (!grpId || !codeId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const code = await getCommonCodeById(grpId, codeId);
    
    if (!code) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    // 사용자용 응답 - 관리 정보 제외
    const userCode = toUserCommonCode(code);

    const result: CommonCodeByIdRes = { code: userCode };
    sendSuccess(res, result, undefined, 'COMMON_CODE_RETRIEVED', { grpId, codeId });
  } catch (error) {
    appLogger.error('Error in getCommonCode:', error);
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '조회', '공통 코드');
      }
    }
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * 특정 공통 코드 조회 (관리자용)
 */
export const getCommonCodeDetail = async (req: Request<CommonCodeByIdReq>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.COMMON_CODE.ADMIN.BY_TYPE, COMMON_CODE_API_MAPPING as any, '타입별 조회 (관리자용)');
    const { grpId, codeId } = req.params;
    
    if (!grpId || !codeId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const code = await getCommonCodeById(grpId, codeId);
    
    if (!code) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    // 관리자용 응답 - Date를 string으로 변환
    const detailCode = toAdminCommonCodeDetail(code);

    const result: CommonCodeByIdDetailRes = { code: detailCode };
    sendSuccess(res, result, undefined, 'COMMON_CODE_DETAIL_RETRIEVED', { grpId, codeId });
  } catch (error) {
    appLogger.error('Error in getCommonCodeDetail:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * 코드 타입별 공통 코드 목록 조회 (사용자용)
 */
export const getCommonCodesByType = async (req: Request<CommonCodeByTypeReq>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.COMMON_CODE.BASIC.BY_PARENT, COMMON_CODE_API_MAPPING as any, '계층형 조회 (사용자용)');
    const { codeType } = req.params;
    
    if (!codeType || !['B', 'A', 'S'].includes(codeType)) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const codes = await getCommonCodesByTypeService(codeType as 'B' | 'A' | 'S');
    
    // 사용자용 응답 - 관리 정보 제외
    const userCodes = codes.map(toUserCommonCode);
    
    const result: CommonCodeByTypeRes = { codes: userCodes };
    sendSuccess(res, result, undefined, 'COMMON_CODES_BY_TYPE_RETRIEVED', { codeType, count: userCodes.length });
  } catch (error) {
    appLogger.error('Error in getCommonCodesByType:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * 코드 타입별 공통 코드 목록 조회 (관리자용)
 */
export const getCommonCodesByTypeDetail = async (req: Request<CommonCodeByTypeReq>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.COMMON_CODE.ADMIN.BY_PARENT, COMMON_CODE_API_MAPPING as any, '계층형 조회 (관리자용)');
    const { codeType } = req.params;
    
    if (!codeType || !['B', 'A', 'S'].includes(codeType)) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const codes = await getCommonCodesByTypeService(codeType as 'B' | 'A' | 'S');
    
    // 관리자용 응답 - Date를 string으로 변환
    const detailCodes = codes.map(toAdminCommonCodeDetail);
    
    const result: CommonCodeByTypeDetailRes = { codes: detailCodes };
    sendSuccess(res, result, undefined, 'COMMON_CODES_BY_TYPE_DETAIL_RETRIEVED', { codeType, count: detailCodes.length });
  } catch (error) {
    appLogger.error('Error in getCommonCodesByTypeDetail:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * 계층형 공통 코드 조회 (사용자용)
 */
export const getCommonCodesByParent = async (req: Request<CommonCodeByParentReq>, res: Response) => {
  try {
    logApiCall('POST', API_URLS.COMMON_CODE.CODE.CREATE, COMMON_CODE_API_MAPPING as any, '코드 생성 (관리자용)');
    const { grpId } = req.params;
    const { parentCodeId } = req.query;
    
    if (!grpId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const codes = await getCommonCodesByParentService(grpId, parentCodeId as string);
    
    // 사용자용 응답 - 관리 정보 제외
    const userCodes = codes.map(code => ({
      grpId: code.grpId,
      grpNm: code.grpNm,
      codeId: code.codeId,
      codeNm: code.codeNm,
      parentGrpId: code.parentGrpId,
      parentCodeId: code.parentCodeId,
      codeType: code.codeType,
      codeLvl: code.codeLvl,
      sortOrder: code.sortOrder,
      codeDes: code.codeDes
    }));
    
    const result: CommonCodeByParentRes = { codes: userCodes };
    sendSuccess(res, result, undefined, 'COMMON_CODES_BY_PARENT_RETRIEVED', { grpId, parentCodeId, count: userCodes.length });
  } catch (error) {
    appLogger.error('Error in getCommonCodesByParent:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * 계층형 공통 코드 조회 (관리자용)
 */
export const getCommonCodesByParentDetail = async (req: Request<CommonCodeByParentReq>, res: Response) => {
  try {
    logApiCall('PUT', API_URLS.COMMON_CODE.CODE.UPDATE, COMMON_CODE_API_MAPPING as any, '코드 수정 (관리자용)');
    const { grpId } = req.params;
    const { parentCodeId } = req.query;
    
    if (!grpId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const codes = await getCommonCodesByParentService(grpId, parentCodeId as string);
    
    // 관리자용 응답 - Date를 string으로 변환
    const detailCodes = codes.map(code => ({
      ...code,
      createdAt: code.createdAt?.toISOString(),
      updatedAt: code.updatedAt?.toISOString(),
      deletedAt: code.deletedAt?.toISOString()
    }));
    
    const result: CommonCodeByParentDetailRes = { codes: detailCodes };
    sendSuccess(res, result, undefined, 'COMMON_CODES_BY_PARENT_DETAIL_RETRIEVED', { grpId, parentCodeId, count: detailCodes.length });
  } catch (error) {
    appLogger.error('Error in getCommonCodesByParentDetail:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * 공통 코드 생성
 */
export const createCommonCode = async (req: Request<{}, {}, CommonCodeCreateReq>, res: Response) => {
  try {
    logApiCall('DELETE', API_URLS.COMMON_CODE.CODE.DELETE, COMMON_CODE_API_MAPPING as any, '코드 삭제 (관리자용)');
    const codeData = req.body;
    
    if (!codeData.grpId || !codeData.codeId || !codeData.codeNm || !codeData.codeType) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const newCode = await createCommonCodeService(codeData, extractUserIdFromRequest(req)?.toString());
    
    // 관리자용 응답 - Date를 string으로 변환
    const detailCode = {
      ...newCode,
      createdAt: newCode.createdAt?.toISOString(),
      updatedAt: newCode.updatedAt?.toISOString(),
      deletedAt: newCode.deletedAt?.toISOString()
    };
    
    const result: CommonCodeCreateRes = { 
      code: {
        grpId: newCode.grpId,
        grpNm: newCode.grpNm,
        codeId: newCode.codeId,
        codeNm: newCode.codeNm,
        parentGrpId: newCode.parentGrpId,
        parentCodeId: newCode.parentCodeId,
        codeType: newCode.codeType as any,
        codeLvl: newCode.codeLvl,
        sortOrder: newCode.sortOrder,
        useYn: (newCode as any).useYn,
        delYn: (newCode as any).delYn,
        codeDes: newCode.codeDes,
        memo: (newCode as any).memo,
        createdAt: newCode.createdAt?.toISOString(),
        updatedAt: newCode.updatedAt?.toISOString(),
        deletedAt: (newCode as any).deletedAt?.toISOString(),
        createdBy: (newCode as any).createdBy,
        updatedBy: (newCode as any).updatedBy,
        deletedBy: (newCode as any).deletedBy
      }
    };
    sendSuccess(res, result, undefined, 'COMMON_CODE_CREATED', { grpId: newCode.grpId, codeId: newCode.codeId });
  } catch (error) {
    appLogger.error('Error in createCommonCode:', error);
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      appLogger.error('Error details:', errorMsg);
    }
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * 공통 코드 수정
 */
export const updateCommonCode = async (req: Request<{ grpId: string; codeId: string }, {}, CommonCodeUpdateReq>, res: Response) => {
  try {
    const { grpId, codeId } = req.params;
    const updateData = req.body;
    
    if (!grpId || !codeId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const affectedCount = await updateCommonCodeById(grpId, codeId, updateData, extractUserIdFromRequest(req)?.toString());
    
    if (affectedCount === 0) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const result: CommonCodeUpdateRes = { affectedCount };
    sendSuccess(res, result, undefined, 'COMMON_CODE_UPDATED', { grpId, codeId });
  } catch (error) {
    appLogger.error('Error in updateCommonCode:', error);
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      appLogger.error('Error details:', errorMsg);
    }
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * 공통 코드 삭제
 */
export const deleteCommonCode = async (req: Request<{ grpId: string; codeId: string }>, res: Response) => {
  try {
    const { grpId, codeId } = req.params;
    
    if (!grpId || !codeId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const affectedCount = await deleteCommonCodeById(grpId, codeId, extractUserIdFromRequest(req)?.toString());
    
    if (affectedCount === 0) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const result: CommonCodeDeleteRes = { affectedCount };
    sendSuccess(res, result,undefined, 'COMMON_CODE_DELETED', { grpId, codeId });
  } catch (error) {
    appLogger.error('Error in deleteCommonCode:', error);
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      appLogger.error('Error details:', errorMsg);
    }
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};
