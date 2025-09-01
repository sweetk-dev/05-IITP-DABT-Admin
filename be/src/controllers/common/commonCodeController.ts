import e, { Request, Response } from 'express';
import { ErrorCode, COMMON_CODE_API_MAPPING, API_URLS } from '@iitp-dabt/common';
import { getActorTag } from '../../utils/auth';
import { checkSuperRole } from '../../utils/commonUtils'
import { sendError, sendSuccess, sendValidationError, sendDatabaseError, sendAdminRoleError } from '../../utils/errorHandler';
import { commonCodeService } from '../../services/common/commonCodeService';
import { toUserCommonCode, toAdminCommonCodeDetail } from '../../mappers/commonCodeMapper';
import { appLogger } from '../../utils/logger';
import { logApiCall } from '../../utils/apiLogger';
import { 
  extractUserIdFromRequest,
  validateAndParseNumber,
  normalizeErrorMessage
} from '../../utils/commonUtils';
import { BusinessError, ResourceError } from '../../utils/customErrors';
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
  CommonCodeUpdateReq,
  CommonCodeListDeleteReq,
  CommonCodeGroupsRes,
  CommonCodeGroupCreateReq,
  CommonCodeGroupUpdateReq,
  CommonCodeGroupListDeleteReq,
  ApiResponse
} from '@iitp-dabt/common';
import { log } from 'console';




//*****************************************
// 사용자용 Common Code APIs
//*****************************************

/**
 * 그룹 ID로 공통 코드 목록 조회 (사용자용)
 * 
 * API: GET /api/common-code/:grpId
 * 매핑: COMMON_CODE_API_MAPPING[`GET ${API_URLS.COMMON_CODE.BASIC.BY_GROUP}`]
 */
export const getCodes = async (req: Request<CommonCodeByGroupReq>, res: Response) => {
  try {
    // API 매핑 정보 로깅
    logApiCall('GET', API_URLS.COMMON_CODE.BASIC.BY_GROUP, COMMON_CODE_API_MAPPING as any, '그룹별 조회 (사용자용)');

    const { grpId } = req.params;
    if (!grpId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const codes = await commonCodeService.getCodesByGroupId(grpId);
    
    // 사용자용 응답 - 관리 정보 제외
    const userCodes = codes.map(toUserCommonCode);
    
    const result: CommonCodeByGroupRes = { codes: userCodes };
    sendSuccess(res, result, undefined, 'COMMON_CODES_RETRIEVED', { grpId, count: userCodes.length }, true); // isListResponse: true
  } catch (error) {
    appLogger.error('Error in getCodes:', error);
    
    // ✅ customErrors 처리
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.DATABASE_ERROR) {
        return sendDatabaseError(res, '조회', '그굽별 코드 목록');
      }
      return sendError(res, error.errorCode, error.message);
    }
    
    if (error instanceof ResourceError) {
      return sendError(res, error.errorCode, error.message);
    }
    
    // 기타 예상치 못한 에러
    sendError(res, ErrorCode.SYS_INTERNAL_SERVER_ERROR);
  }
};



/**
 * 특정 공통 코드 조회 (사용자용)
 */
export const getCode = async (req: Request<CommonCodeByIdReq>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.COMMON_CODE.BASIC.BY_ID, COMMON_CODE_API_MAPPING as any, '특정 공통 코드 조회 (사용자용)');
    const { grpId, codeId } = req.params;
    
    if (!grpId || !codeId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const code = await commonCodeService.getCodeById(grpId, codeId);
    
    if (!code) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    // 사용자용 응답 - 관리 정보 제외
    const userCode = toUserCommonCode(code);

    const result: CommonCodeByIdRes = { code: userCode };
    sendSuccess(res, result, undefined, 'COMMON_CODE_RETRIEVED', { grpId, codeId });
  } catch (error) {
    appLogger.error('Error in getCode:', error);
    if (error instanceof Error) {
      if (error instanceof ResourceError) {
        return sendError(res, error.errorCode, error.message);
      } 
      if (error instanceof BusinessError) {
        if (error.errorCode === ErrorCode.DATABASE_ERROR) {
          return sendDatabaseError(res, '조회', '공통 코드');
        }
        return sendError(res, error.errorCode, error.message);
      } 
    }
    sendError(res, ErrorCode.SYS_INTERNAL_SERVER_ERROR);
  }
};



/**
 * 코드 타입별 공통 코드 목록 조회 (사용자용)
 */
export const getCodesByType = async (req: Request<CommonCodeByTypeReq>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.COMMON_CODE.BASIC.BY_TYPE, COMMON_CODE_API_MAPPING as any, '타입별 조회 (사용자용)');
    const { codeType } = req.params;
    
    if (!codeType || !['B', 'A', 'S'].includes(codeType)) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const codes = await commonCodeService.getCodesByType(codeType as 'B' | 'A' | 'S');
    
    // 사용자용 응답 - 관리 정보 제외
    const userCodes = codes.map(toUserCommonCode);
    
    const result: CommonCodeByTypeRes = { codes: userCodes };
    sendSuccess(res, result, undefined, 'COMMON_CODES_BY_TYPE_RETRIEVED', { codeType, count: userCodes.length });
  } catch (error) {
    appLogger.error('Error in getCodesByType:', error);
    if (error instanceof Error) {
      if (error instanceof ResourceError) {
        return sendError(res, error.errorCode, error.message);
      }
      if (error instanceof BusinessError) {
        if (error.errorCode === ErrorCode.DATABASE_ERROR) {
          return sendDatabaseError(res, '조회', '공통 코드 타입별 목록');
        }
         return sendError(res, error.errorCode, error.message);
      }
    }
    sendError(res, ErrorCode.SYS_INTERNAL_SERVER_ERROR);
  }
};




/**
 * 계층형 공통 코드 조회 (사용자용)
 */
export const getCodesByParent = async (req: Request<CommonCodeByParentReq>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.COMMON_CODE.BASIC.BY_PARENT, COMMON_CODE_API_MAPPING as any, '계층형 조회 (사용자용)');
    const { grpId } = req.params;
    const { parentCodeId } = req.query;
    
    if (!grpId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const codes = await commonCodeService.getCodesByParent(grpId, parentCodeId as string);
    
    // 사용자용 응답 - 관리 정보 제외
    const userCodes = codes.map(toUserCommonCode);
    
    const result: CommonCodeByParentRes = { codes: userCodes };
    sendSuccess(res, result, undefined, 'COMMON_CODES_BY_PARENT_RETRIEVED', { grpId, parentCodeId, count: userCodes.length });
  } catch (error) {
    appLogger.error('Error in getCodesByParent:', error);
    if (error instanceof Error) {
      if (error instanceof ResourceError) {
        return sendError(res, error.errorCode, error.message);
      }
      if (error instanceof BusinessError) {
        if (error.errorCode === ErrorCode.DATABASE_ERROR) {
          return sendDatabaseError(res, '조회', '계층형 공통 코드 조회');
        }
         return sendError(res, error.errorCode, error.message);
      }
    }
    sendError(res, ErrorCode.SYS_INTERNAL_SERVER_ERROR);
  }
};






//*****************************************
// 관리자용 Common Code Group APIs
//*****************************************
/**
 * 공통 코드 그룹 목록 조회 (관리자용)
 */
export const getCodeGroupsForAdmin = async (req: Request<CommonCodeByGroupReq>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.COMMON_CODE.GROUP.LIST, COMMON_CODE_API_MAPPING as any, '코드 그룹 목록 조회 (관리자용)');

    const groups = await commonCodeService.getCodeGroups( );
    

    const result: CommonCodeGroupsRes = { groups: groups };
    sendSuccess(res, result, undefined, 'COMMON_CODE_GROUPS_RETRIEVED', { count: groups.length }, true); // isListResponse: true
  } catch (error) {
    appLogger.error('Error in getCodeGroupsForAdmin:', error);
    if (error instanceof ResourceError) {
      return sendError(res, error.errorCode, error.message);
    }
    
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.DATABASE_ERROR) {
        return sendDatabaseError(res, '조회', '공통 코드 그룹 목록');
      }
      return sendError(res, error.errorCode, error.message);
    }
    sendError(res, ErrorCode.SYS_INTERNAL_SERVER_ERROR);
  }
};



/**
 *  공통 코드 그룹(+코드) 생성 조회 (관리자용)
 */
export const createCodeGroupByAdmin = async(req: Request<{}, {}, CommonCodeGroupCreateReq>, res: Response ) => {
  try {
    logApiCall( 'POST', API_URLS.COMMON_CODE.GROUP.CREATE, COMMON_CODE_API_MAPPING as any, '그룹 + 코드 생성 (관리자용)');

    const superRole = checkSuperRole(req as any);
    if( !superRole || !superRole.adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!superRole.isSuper) {
      return sendAdminRoleError(res);
    }

    const groupData = req.body;

    if (!groupData.grpId || !groupData.grpNm || !groupData.codeType || groupData.codes.length === 0 ) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    // 코드 타입 유효성 검사
    if (!['B', 'A', 'S'].includes(groupData.codeType)) {
      return sendValidationError(res, 'codeType', '코드 타입은 B, A, S 중 하나여야 합니다.');
    }

    // 코드 데이터 유효성 검사
    for (const code of groupData.codes) {
      if (!code.codeId || !code.codeNm) {
        return sendValidationError(res, 'codes', '각 코드는 codeId와 codeNm이 필요합니다.');
      }
    }

    await commonCodeService.createCodeGroup(groupData, getActorTag(req));
    
    sendSuccess(res, undefined, undefined, 'COMMON_CODE_GROUP_CREATED', { 
      grpId: groupData.grpId, 
      grpNm: groupData.grpNm,
      codeCount: groupData.codes.length 
    });

  } catch (error) {
    appLogger.error('Error in createCodeGroupByAdmin:', error);
    if (error instanceof ResourceError) {
      return sendError(res, error.errorCode, error.message);
    }
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.DATABASE_ERROR) {
        return sendDatabaseError(res, '생성', '그룹 + 코드 생성');
      }
      return sendError(res, error.errorCode, error.message);
    } 
    sendError(res, ErrorCode.SYS_INTERNAL_SERVER_ERROR);
  }

};


/**
 * 공통 코드 그룹 수정 (관리자용)
 */
export const updateCodeGroupByAdmin = async(req: Request<{grpId: string}, {}, CommonCodeGroupUpdateReq>, res: Response ) => {
  try {
    logApiCall( 'PUT', API_URLS.COMMON_CODE.GROUP.UPDATE, COMMON_CODE_API_MAPPING as any, '그룹 수정 (관리자용)');

    const superRole = checkSuperRole(req as any);
    if( !superRole || !superRole.adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!superRole.isSuper) {
      return sendAdminRoleError(res);
    }

    const { grpId } = req.params;
    const updateData = req.body;

    if (!grpId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER, '그룹 ID가 필요합니다.');
    }

    if (!updateData.grpNm) {
      return sendValidationError(res, 'grpNm', '그룹명은 필수입니다.');
    }

    await commonCodeService.updateCodeGroup(grpId, updateData, getActorTag(req));
    
    sendSuccess(res, undefined, undefined, 'COMMON_CODE_GROUP_UPDATED', { grpId });

  } catch (error) {
    appLogger.error('Error in updateCodeGroupByAdmin:', error);
    if (error instanceof ResourceError) {
      return sendError(res, error.errorCode, error.message);
    }
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.DATABASE_ERROR) {
        return sendDatabaseError(res, '수정', '그룹 수정');
      }
      return sendError(res, error.errorCode, error.message);
    } 
    sendError(res, ErrorCode.SYS_INTERNAL_SERVER_ERROR);
  }
};

/**
 * 공통 코드 그룹 삭제 (관리자용)
 */
export const deleteCodeGroupsByAdmin = async(req: Request<{}, {}, CommonCodeGroupListDeleteReq>, res: Response ) => {
  try {
    logApiCall( 'DELETE', API_URLS.COMMON_CODE.GROUP.LIST_DELETE, COMMON_CODE_API_MAPPING as any, '그룹 삭제 (관리자용)');

    const superRole = checkSuperRole(req as any);
    if( !superRole || !superRole.adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!superRole.isSuper) {
      return sendAdminRoleError(res);
    }

    const { grpIds } = req.body;

    if (!grpIds || grpIds.length === 0) {
      return sendValidationError(res, 'grpIds', '삭제할 그룹 ID 목록을 제공해야 합니다.');
    }

    await commonCodeService.deleteCodeGroups(grpIds, getActorTag(req));
    
    sendSuccess(res, undefined, undefined, 'COMMON_CODE_GROUPS_DELETED', { count: grpIds.length });

  } catch (error) {
    appLogger.error('Error in deleteCodeGroupsByAdmin:', error);
    if (error instanceof ResourceError) {
      return sendError(res, error.errorCode, error.message);
    }
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.DATABASE_ERROR) {
        return sendDatabaseError(res, '삭제', '그룹 삭제');
      }
      return sendError(res, error.errorCode, error.message);
    } 
    sendError(res, ErrorCode.SYS_INTERNAL_SERVER_ERROR);
  }
};





//*****************************************
// 관리자용 Common Code APIs
//*****************************************
/**
 * 그룹별 공통 코드 목록 조회 (관리자용)
 */
export const getCodesByGroupForAdmin = async (req: Request<CommonCodeByGroupReq>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.COMMON_CODE.ADMIN.BY_GROUP, COMMON_CODE_API_MAPPING as any, '그룹별 조회 (관리자용)');
    const { grpId } = req.params;
    
    if (!grpId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const codes = await commonCodeService.getCodesByGroupId(grpId);   
    // 관리자용 응답 - Date를 string으로 변환
    const detailCodes = codes.map(toAdminCommonCodeDetail);
    
    const result: CommonCodeByGroupDetailRes = { codes: detailCodes };
    sendSuccess(res, result, undefined, 'COMMON_CODES_BY_GROUP_DETAIL_RETRIEVED', { grpId, count: detailCodes.length }, true); // isListResponse: true
  } catch (error) {
    appLogger.error('Error in getCodesByGroupForAdmin:', error);
    if (error instanceof ResourceError) {
      return sendError(res, error.errorCode, error.message);
    }
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.DATABASE_ERROR) {
        return sendDatabaseError(res, '조회', '그굽별 코드 목록');
      }
      return sendError(res, error.errorCode, error.message);
    } 
    sendError(res, ErrorCode.SYS_INTERNAL_SERVER_ERROR);
  }
}



/**
 * 특정 공통 코드 조회 (관리자용)
 */
export const getCodeForAdmin = async (req: Request<CommonCodeByIdReq>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.COMMON_CODE.ADMIN.BY_ID, COMMON_CODE_API_MAPPING as any, '특정 코드 조회 (관리자용)');
    const { grpId, codeId } = req.params;
    
    if (!grpId || !codeId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const code = await commonCodeService.getCodeById(grpId, codeId);
    if (!code) { 
      return sendError(res, ErrorCode.SYS_CODE_NOT_FOUND, '해당 공통 코드를 찾을 수 없습니다.');
    }

    // 관리자용 응답 - Date를 string으로 변환
    const detailCode = toAdminCommonCodeDetail(code);

    const result: CommonCodeByIdDetailRes = { code: detailCode };
    sendSuccess(res, result, undefined, 'COMMON_CODE_DETAIL_RETRIEVED', { grpId, codeId });
  } catch (error) {
    appLogger.error('Error in getCodeForAdmin:', error);
    if (error instanceof ResourceError) {
      return sendError(res, error.errorCode, error.message);
    }
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.DATABASE_ERROR) {
        return sendDatabaseError(res, '조회', '그굽별 코드 목록');
      }
      return sendError(res, error.errorCode, error.message);
    } 
    sendError(res, ErrorCode.SYS_INTERNAL_SERVER_ERROR);
  }
};




/**
 * 공통 코드 생성
 */
export const createCodeByAdmin = async (req: Request<{}, {}, CommonCodeCreateReq>, res: Response) => {
  try {
    logApiCall('POST', API_URLS.COMMON_CODE.CODE.CREATE, COMMON_CODE_API_MAPPING as any, '코드 생성 (관리자용)');

    const superRole = checkSuperRole(req as any);
    if( !superRole || !superRole.adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!superRole.isSuper) {
      return sendAdminRoleError(res);
    }

    const codeData = req.body;
    
    if (!codeData.grpId || !codeData.codeId || !codeData.codeNm || !codeData.codeType) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    await commonCodeService.createCommonCode(codeData, getActorTag(req));
    
    sendSuccess(res, undefined, undefined, 'COMMON_CODE_CREATED', { grpId: codeData.grpId, codeId: codeData.codeId });
  } catch (error) {
    appLogger.error('Error in createCodeByAdmin:', error);
    if (error instanceof ResourceError) {
      return sendError(res, error.errorCode, error.message);
    }
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.DATABASE_ERROR) {
        return sendDatabaseError(res, '생성', '코드 생성');
      }
      return sendError(res, error.errorCode, error.message);
    } 
    sendError(res, ErrorCode.SYS_INTERNAL_SERVER_ERROR);
  }
};


/**
 * 공통 코드 수정
 */
export const updateCodeByAdmin = async (req: Request<{ grpId: string; codeId: string }, {}, CommonCodeUpdateReq>, res: Response) => {
  try {
    const { grpId, codeId } = req.params;
    const updateData = req.body;
    
    if (!grpId || !codeId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    // S-ADMIN 권한 체크
    const superRole = checkSuperRole(req as any);
    if( !superRole || !superRole.adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!superRole.isSuper) {
      return sendAdminRoleError(res);
    }

    const actorTag = getActorTag(req);
    const affectedCount = await commonCodeService.updateCommonCodeById(grpId, codeId, updateData, actorTag);
    
    if (affectedCount === 0) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    sendSuccess(res, undefined, undefined, 'COMMON_CODE_UPDATED', { grpId, codeId });
  } catch (error) {
    appLogger.error('Error in updateCodeByAdmin:', error);
    if (error instanceof ResourceError) {
      return sendError(res, error.errorCode, error.message);
    }
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.DATABASE_ERROR) {
        return sendDatabaseError(res, '조회', '그굽별 코드 목록');
      }
      return sendError(res, error.errorCode, error.message);
    } 
    sendError(res, ErrorCode.SYS_INTERNAL_SERVER_ERROR);
  }
};



/**
 * 공통 코드 삭제
 */
export const deleteCodeByAdmin = async (req: Request<{ grpId: string; codeId: string }>, res: Response) => {
  try {
    logApiCall('DELETE', API_URLS.COMMON_CODE.CODE.DELETE, COMMON_CODE_API_MAPPING as any, '코드 삭제 (관리자용)');

    const { grpId, codeId } = req.params;
    
    if (!grpId || !codeId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    // S-ADMIN 권한 체크
    const superRole = checkSuperRole(req as any);
    if( !superRole || !superRole.adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!superRole.isSuper) {
      return sendAdminRoleError(res);
    }

    const actorTag = getActorTag(req);

    const affectedCount = await commonCodeService.deleteCommonCodeById(grpId, codeId, actorTag);
    
    if (affectedCount === 0) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    sendSuccess(res, undefined, undefined, 'COMMON_CODE_DELETED', { grpId, codeId });
  } catch (error) {
    appLogger.error('Error in deleteCodeByAdmin:', error);
    if (error instanceof ResourceError) {
      return sendError(res, error.errorCode, error.message);
    }
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.DATABASE_ERROR) {
        return sendDatabaseError(res, '조회', '그굽별 코드 목록');
      }
      return sendError(res, error.errorCode, error.message);
    } 
    sendError(res, ErrorCode.SYS_INTERNAL_SERVER_ERROR);
  }
};


/**
 * 공통 코드 목록 삭제
 */
export const deleteCodesInGroupByAdmin = async (req: Request<{grpId:string}, {}, CommonCodeListDeleteReq>, res: Response) => {
  try {
    logApiCall('POST', API_URLS.COMMON_CODE.CODE.LIST_DELETE, COMMON_CODE_API_MAPPING as any, '코드 목록 삭제 (관리자용)');

    const { grpId } = req.params;
    const { codeIds } = req.body;
    
    if (!grpId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER, '그룹 ID가 필요합니다.');
    }
    
    if (!codeIds || codeIds.length === 0) { 
      return sendValidationError(res, 'codeIds', '삭제할 공통 코드 목록을 제공해야 합니다.');
    }

    const adminId = extractUserIdFromRequest(req);
    if (!adminId) { 
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }
    const actorTag = getActorTag(req);

    await commonCodeService.deleteCommonCodeByGroup( grpId, codeIds, actorTag);
    sendSuccess(res, undefined, undefined, 'COMMON_CODE_LIST_DELETED', { grpId: grpId, count: codeIds.length });
  } catch (error) {
    appLogger.error('Error in deleteCodeList:', error);
    if (error instanceof ResourceError) {
      return sendError(res, error.errorCode, error.message);
    }
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.DATABASE_ERROR) {
        return sendDatabaseError(res, '조회', '그굽별 코드 목록');
      }
      return sendError(res, error.errorCode, error.message);
    } 
    sendError(res, ErrorCode.SYS_INTERNAL_SERVER_ERROR);
  }
};



///======  TODO :: 아래 함수 모두 재 검토 필요  ======///



/**
 * 코드 타입별 공통 코드 목록 조회 (관리자용)
 */
export const getCodesByTypeForAdmin = async (req: Request<CommonCodeByTypeReq>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.COMMON_CODE.ADMIN.BY_PARENT, COMMON_CODE_API_MAPPING as any, '계층형 조회 (관리자용)');
    const { codeType } = req.params;
    
    if (!codeType || !['B', 'A', 'S'].includes(codeType)) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const codes = await commonCodeService.getCodesByType(codeType as 'B' | 'A' | 'S');
    
    // 관리자용 응답 - Date를 string으로 변환
    const detailCodes = codes.map(toAdminCommonCodeDetail);
    
    const result: CommonCodeByTypeDetailRes = { codes: detailCodes };
    sendSuccess(res, result, undefined, 'COMMON_CODES_BY_TYPE_DETAIL_RETRIEVED', { codeType, count: detailCodes.length });
  } catch (error) {
    appLogger.error('Error in getCodesByTypeForAdmin:', error);
    if (error instanceof ResourceError) {
      return sendError(res, error.errorCode, error.message);
    }
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.DATABASE_ERROR) {
        return sendDatabaseError(res, '조회', '그굽별 코드 목록');
      }
      return sendError(res, error.errorCode, error.message);
    } 
    sendError(res, ErrorCode.SYS_INTERNAL_SERVER_ERROR);
  }
};



/**
 * 계층형 공통 코드 조회 (관리자용)
 */
export const getCodesByParentForAdmin = async (req: Request<CommonCodeByParentReq>, res: Response) => {
  try {
    logApiCall('PUT', API_URLS.COMMON_CODE.CODE.UPDATE, COMMON_CODE_API_MAPPING as any, '코드 수정 (관리자용)');
    const { grpId } = req.params;
    const { parentCodeId } = req.query;
    
    if (!grpId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const codes = await commonCodeService.getCodesByParent(grpId, parentCodeId as string);
    
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
    appLogger.error('Error in getCodesByParentForAdmin:', error);
    if (error instanceof ResourceError) {
      return sendError(res, error.errorCode, error.message);
    }
    if (error instanceof BusinessError) {
      if (error.errorCode === ErrorCode.DATABASE_ERROR) {
        return sendDatabaseError(res, '조회', '그굽별 코드 목록');
      }
      return sendError(res, error.errorCode, error.message);
    } 
    sendError(res, ErrorCode.SYS_INTERNAL_SERVER_ERROR);
  }
};




