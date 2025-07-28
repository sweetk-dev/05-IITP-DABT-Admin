import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError, sendSuccess } from '../../utils/errorHandler';
import { 
  getCommonCodesByGroupId,
  getCommonCodeById,
  getCommonCodesByType as getCommonCodesByTypeService,
  getCommonCodesByParent as getCommonCodesByParentService,
  createCommonCode as createCommonCodeService,
  updateCommonCodeById,
  deleteCommonCodeById,
  getCommonCodeStatistics
} from '../../services/common/commonCodeService';
import { appLogger } from '../../utils/logger';
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
  CommonCodeStatsRes,
  CommonCodeCreateReq,
  CommonCodeCreateRes,
  CommonCodeUpdateReq,
  CommonCodeUpdateRes,
  CommonCodeDeleteRes,
  ApiResponse
} from '@iitp-dabt/common';

/**
 * 그룹 ID로 공통 코드 목록 조회 (사용자용)
 */
export const getCommonCodes = async (req: Request<CommonCodeByGroupReq>, res: Response) => {
  try {
    const { grpId } = req.params;
    
    if (!grpId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const codes = await getCommonCodesByGroupId(grpId);
    
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
    
    const response: CommonCodeByGroupRes = { codes: userCodes };
    sendSuccess(res, response, undefined, 'COMMON_CODES_RETRIEVED', { grpId, count: userCodes.length });
  } catch (error) {
    appLogger.error('Error in getCommonCodes:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * 그룹 ID로 공통 코드 목록 조회 (관리자용)
 */
export const getCommonCodesDetail = async (req: Request<CommonCodeByGroupReq>, res: Response) => {
  try {
    const { grpId } = req.params;
    
    if (!grpId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const codes = await getCommonCodesByGroupId(grpId);
    
    // 관리자용 응답 - Date를 string으로 변환
    const detailCodes = codes.map(code => ({
      ...code,
      createdAt: code.createdAt?.toISOString(),
      updatedAt: code.updatedAt?.toISOString(),
      deletedAt: code.deletedAt?.toISOString()
    }));
    
    const response: CommonCodeByGroupDetailRes = { codes: detailCodes };
    sendSuccess(res, response, undefined, 'COMMON_CODES_DETAIL_RETRIEVED', { grpId, count: detailCodes.length });
  } catch (error) {
    appLogger.error('Error in getCommonCodesDetail:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * 특정 공통 코드 조회 (사용자용)
 */
export const getCommonCode = async (req: Request<CommonCodeByIdReq>, res: Response) => {
  try {
    const { grpId, codeId } = req.params;
    
    if (!grpId || !codeId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const code = await getCommonCodeById(grpId, codeId);
    
    if (!code) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    // 사용자용 응답 - 관리 정보 제외
    const userCode = {
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
    };

    const response: CommonCodeByIdRes = { code: userCode };
    sendSuccess(res, response, undefined, 'COMMON_CODE_RETRIEVED', { grpId, codeId });
  } catch (error) {
    appLogger.error('Error in getCommonCode:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * 특정 공통 코드 조회 (관리자용)
 */
export const getCommonCodeDetail = async (req: Request<CommonCodeByIdReq>, res: Response) => {
  try {
    const { grpId, codeId } = req.params;
    
    if (!grpId || !codeId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const code = await getCommonCodeById(grpId, codeId);
    
    if (!code) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    // 관리자용 응답 - Date를 string으로 변환
    const detailCode = {
      ...code,
      createdAt: code.createdAt?.toISOString(),
      updatedAt: code.updatedAt?.toISOString(),
      deletedAt: code.deletedAt?.toISOString()
    };

    const response: CommonCodeByIdDetailRes = { code: detailCode };
    sendSuccess(res, response, undefined, 'COMMON_CODE_DETAIL_RETRIEVED', { grpId, codeId });
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
    const { codeType } = req.params;
    
    if (!codeType || !['B', 'A', 'S'].includes(codeType)) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const codes = await getCommonCodesByTypeService(codeType as 'B' | 'A' | 'S');
    
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
    
    const response: CommonCodeByTypeRes = { codes: userCodes };
    sendSuccess(res, response, undefined, 'COMMON_CODES_BY_TYPE_RETRIEVED', { codeType, count: userCodes.length });
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
    const { codeType } = req.params;
    
    if (!codeType || !['B', 'A', 'S'].includes(codeType)) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const codes = await getCommonCodesByTypeService(codeType as 'B' | 'A' | 'S');
    
    // 관리자용 응답 - Date를 string으로 변환
    const detailCodes = codes.map(code => ({
      ...code,
      createdAt: code.createdAt?.toISOString(),
      updatedAt: code.updatedAt?.toISOString(),
      deletedAt: code.deletedAt?.toISOString()
    }));
    
    const response: CommonCodeByTypeDetailRes = { codes: detailCodes };
    sendSuccess(res, response, undefined, 'COMMON_CODES_BY_TYPE_DETAIL_RETRIEVED', { codeType, count: detailCodes.length });
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
    
    const response: CommonCodeByParentRes = { codes: userCodes };
    sendSuccess(res, response, undefined, 'COMMON_CODES_BY_PARENT_RETRIEVED', { 
      grpId, 
      parentCodeId: parentCodeId || 'root', 
      count: userCodes.length 
    });
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
    
    const response: CommonCodeByParentDetailRes = { codes: detailCodes };
    sendSuccess(res, response, undefined, 'COMMON_CODES_BY_PARENT_DETAIL_RETRIEVED', { 
      grpId, 
      parentCodeId: parentCodeId || 'root', 
      count: detailCodes.length 
    });
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
    const codeData = req.body;
    
    if (!codeData.grpId || !codeData.codeId || !codeData.codeNm || !codeData.codeType) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const newCode = await createCommonCodeService(codeData, req.user?.userId?.toString());
    
    // 관리자용 응답 - Date를 string으로 변환
    const detailCode = {
      ...newCode,
      createdAt: newCode.createdAt?.toISOString(),
      updatedAt: newCode.updatedAt?.toISOString(),
      deletedAt: newCode.deletedAt?.toISOString()
    };
    
    const response: CommonCodeCreateRes = { code: detailCode };
    sendSuccess(res, response, undefined, 'COMMON_CODE_CREATED', { 
      grpId: codeData.grpId, 
      codeId: codeData.codeId 
    });
  } catch (error) {
    appLogger.error('Error in createCommonCode:', error);
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

    const affectedCount = await updateCommonCodeById(grpId, codeId, updateData, req.user?.userId?.toString());
    
    if (affectedCount === 0) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const response: CommonCodeUpdateRes = { affectedCount };
    sendSuccess(res, response, undefined, 'COMMON_CODE_UPDATED', { grpId, codeId });
  } catch (error) {
    appLogger.error('Error in updateCommonCode:', error);
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

    const affectedCount = await deleteCommonCodeById(grpId, codeId, req.user?.userId?.toString());
    
    if (affectedCount === 0) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const response: CommonCodeDeleteRes = { affectedCount };
    sendSuccess(res, response, undefined, 'COMMON_CODE_DELETED', { grpId, codeId });
  } catch (error) {
    appLogger.error('Error in deleteCommonCode:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * 공통 코드 통계 조회
 */
export const getCommonCodeStats = async (req: Request, res: Response) => {
  try {
    const stats = await getCommonCodeStatistics();
    
    const response: CommonCodeStatsRes = { stats };
    sendSuccess(res, response, undefined, 'COMMON_CODE_STATS_RETRIEVED', { count: stats.length });
  } catch (error) {
    appLogger.error('Error in getCommonCodeStats:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
}; 