import { Op } from 'sequelize';
import { 
  findAuthKeysByUserId, 
  findAuthKeyById, 
  createAuthKey as createOpenApiAuthKeyRepo, 
  updateAuthKey as updateOpenApiAuthKeyRepo, 
  deleteAuthKey as deleteOpenApiAuthKeyRepo,
  deleteApiAKeyList as deleteOpenApiListRepo,
  getAuthKeyStats
} from '../../repositories/openApiAuthKeyRepository';
import { appLogger } from '../../utils/logger';
import { generateAuthKey } from '../../utils/authKeyGenerator';
import { ErrorCode, AdminOpenApiKeyListItem } from '@iitp-dabt/common';
import { ResourceError, BusinessError } from '../../utils/customErrors';

export interface OpenApiListParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  pendingOnly?: boolean;
}

export interface OpenApiCreateData {
  userId: number;
  keyName: string;
  keyDesc?: string;
  startDt?: string;
  endDt?: string;
}

export interface OpenApiUpdateData {
  keyName?: string;
  keyDesc?: string;
  /**
   * [추가 2026-10] 활성 여부 'Y' | 'N'.
   * 프론트(관리자 OpenApiEdit 수정 화면, OpenApiRequestDetail 승인·거절 화면)가 실제로 보내는 필드이며
   * 공통 DTO(AdminOpenApiUpdateReq.activeYn)와 같다.
   */
  activeYn?: string;
  /**
   * @deprecated 과거 호환용('ACTIVE' 이면 활성, 그 외 비활성). 현재 프론트는 보내지 않는다.
   * activeYn 이 함께 오면 activeYn 이 우선한다.
   */
  status?: string;
  rejectReason?: string;
}

/**
 * OpenAPI 목록 조회 (관리자용)
 */
export const getOpenApiList = async (params: OpenApiListParams) => {
  try {
    const { page, limit, search, status, pendingOnly = false } = params;
    const offset = (page - 1) * limit;

    // Repository에서 모든 조건을 직접 처리하도록 개선
    const result = await findAuthKeysByUserId(0, {
      page,
      limit,
      includeInactive: true, // 관리자는 기본적으로 모든 상태의 키를 볼 수 있도록 true로 설정
      pendingOnly,
      activeYn: status, // status 파라미터를 activeYn으로 전달
      searchKeyword: search // search 파라미터를 searchKeyword로 전달
    });

    return {
      openApis: result.authKeys,
      total: result.total,
      page,
      limit
    };
  } catch (error) {
    appLogger.error('OpenAPI 목록 조회 중 오류 발생', { error, params });
    throw new BusinessError(
      ErrorCode.DATABASE_ERROR,
      'OpenAPI 목록 조회 중 오류가 발생했습니다.',
      { params, originalError: error }
    );
  }
};

/**
 * OpenAPI 상세 조회 (관리자용)
 */
export const getOpenApiDetail = async (apiId: number) => {
  try {
    const api = await findAuthKeyById(apiId);
    if (!api) {
      throw new ResourceError(
        ErrorCode.OPEN_API_NOT_FOUND,
        'OpenAPI를 찾을 수 없습니다.',
        'openApi',
        apiId
      );
    }
    return api;
  } catch (error) {
    if (error instanceof ResourceError) {
      throw error;
    }
    appLogger.error('OpenAPI 상세 조회 중 오류 발생', { error, apiId });
    throw new BusinessError(
      ErrorCode.DATABASE_ERROR,
      'OpenAPI 상세 조회 중 오류가 발생했습니다.',
      { apiId, originalError: error }
    );
  }
};

/**
 * OpenAPI 생성 (관리자용)
 */
export const createOpenApi = async (apiData: OpenApiCreateData, actorTag: string) => {
  try {
    const authKey = generateAuthKey();
    const newKey = await createOpenApiAuthKeyRepo({
      userId: apiData.userId,
      authKey,
      keyName: apiData.keyName,
      keyDesc: apiData.keyDesc || '',
      startDt: apiData.startDt ? new Date(apiData.startDt) : undefined,
      endDt: apiData.endDt ? new Date(apiData.endDt) : undefined,
      createdBy: actorTag
    });

    appLogger.info('OpenAPI 생성 성공', { keyId: newKey.keyId, actorTag });
    return { keyId: newKey.keyId, authKey };
  } catch (error) {
    appLogger.error('OpenAPI 생성 중 오류 발생', { error, apiData, actorTag });
    throw new BusinessError(
      ErrorCode.OPEN_API_CREATE_FAILED,
      'OpenAPI 생성 중 오류가 발생했습니다.',
      { apiData, actorTag, originalError: error }
    );
  }
};

/**
 * OpenAPI 수정 (관리자용)
 */
export const updateOpenApi = async (apiId: number, updateData: OpenApiUpdateData, actorTag: string) => {
  try {
    const existingApi = await findAuthKeyById(apiId);
    if (!existingApi) {
      throw new ResourceError(
        ErrorCode.OPEN_API_NOT_FOUND,
        '수정할 OpenAPI를 찾을 수 없습니다.',
        'openApi',
        apiId
      );
    }

    const updateFields: any = {
      updatedBy: actorTag
    };

    if (updateData.keyName !== undefined) {
      updateFields.keyName = updateData.keyName;
    }

    if (updateData.keyDesc !== undefined) {
      updateFields.keyDesc = updateData.keyDesc;
    }

    // [수정 2026-10] 활성 여부(승인/거절/활성/비활성) 반영
    //  - 문제: 기존 코드는 updateData.status === 'ACTIVE' 만 보았는데, 프론트는 activeYn('Y'|'N') 을 보낸다.
    //    그래서 관리자 화면의 승인·거절·활성·비활성 변경이 모두 무시되고 이름/설명만(그마저도 리포지토리에서 누락) 반영됐다.
    //  - 조치: activeYn 을 우선 사용하고, activeYn 이 없을 때만 과거 status 값을 호환 처리한다.
    //  - 현재 값과 같으면 activeYn 을 넘기지 않는다. 리포지토리(updateAuthKey)는 activeYn='Y' 를 받으면
    //    active_at 을 현재시각으로 다시 쓰고 반려 사유를 지우므로, 이미 활성인 키의 이름만 고쳐 저장해도
    //    '활성화 일시'가 바뀌는 부작용을 막기 위함이다.
    //  - 결과 동작(리포지토리 updateAuthKey 와 합쳐서):
    //      승인   (N→Y)       : active_yn='Y', active_at=현재시각, key_reject_reason=NULL
    //      거절   (N 유지+사유): key_reject_reason=사유 (active_yn='N' 유지)
    //      비활성 (Y→N)       : active_yn='N' (active_at 유지 → 통계상 '비활성'으로 집계)
    //      재활성 (N→Y)       : 승인과 동일
    const requestedActiveYn: string | undefined =
      updateData.activeYn !== undefined
        ? updateData.activeYn
        : updateData.status !== undefined
          ? (updateData.status === 'ACTIVE' ? 'Y' : 'N')
          : undefined;

    if (requestedActiveYn !== undefined && requestedActiveYn !== existingApi.activeYn) {
      updateFields.activeYn = requestedActiveYn;
    }

    // rejectReason이 있으면 keyRejectReason으로 매핑
    if ((updateData as any).rejectReason !== undefined) {
      updateFields.keyRejectReason = (updateData as any).rejectReason;
    }

    // 참고: updateOpenApiAuthKeyRepo 는 리포지토리의 updateAuthKey 이다(파일 상단 import 별칭).
    //  [수정 2026-10] updateAuthKey 가 keyName/keyDesc 도 반영하도록 리포지토리를 보강했다.
    const updatedApi = await updateOpenApiAuthKeyRepo(apiId, updateFields);

    if (!updatedApi) {
      throw new ResourceError(
        ErrorCode.OPEN_API_NOT_FOUND,
        '수정할 OpenAPI를 찾을 수 없습니다.',
        'openApi',
        apiId
      );
    }

    appLogger.info('OpenAPI 수정 성공', { apiId, actorTag });
    return updatedApi;
  } catch (error) {
    if (error instanceof ResourceError) {
      throw error;
    }
    appLogger.error('OpenAPI 수정 중 오류 발생', { error, apiId, updateData, actorTag });
    throw new BusinessError(
      ErrorCode.OPEN_API_UPDATE_FAILED,
      'OpenAPI 수정 중 오류가 발생했습니다.',
      { apiId, updateData, actorTag, originalError: error }
    );
  }
};

/**
 * OpenAPI 삭제 (관리자용)
 */
export const deleteOpenApi = async (apiId: number, actorTag: string) => {
  try {
    const deletedApi = await deleteOpenApiAuthKeyRepo(apiId, actorTag);

    if (!deletedApi) {
      throw new ResourceError(
        ErrorCode.OPEN_API_NOT_FOUND,
        '삭제할 OpenAPI를 찾을 수 없습니다.',
        'openApi',
        apiId
      );
    }

    appLogger.info('OpenAPI 삭제 성공', { apiId, actorTag });
    return deletedApi;
  } catch (error) {
    if (error instanceof ResourceError) {
      throw error;
    }
    appLogger.error('OpenAPI 삭제 중 오류 발생', { error, apiId, actorTag });
    throw new BusinessError(
      ErrorCode.OPEN_API_DELETE_FAILED,
      'OpenAPI 삭제 중 오류가 발생했습니다.',
      { apiId, actorTag, originalError: error }
    );
  }
};


/**
 * OpenAPI 목록 삭제 (관리자용)
 */
export const deleteOpenApiList = async (apiIds: number[], actorTag: string) => {
  try {   
    const deletedCount = await deleteOpenApiListRepo(apiIds, actorTag);
    if (deletedCount == 0) {
      throw new ResourceError( ErrorCode.OPEN_API_NOT_FOUND, '삭제할 OpenAPI를 찾을 수 없습니다.', 'openApi', apiIds.toString() );
    }

    appLogger.info('OpenAPI 목록 삭제 성공', { apiIds, actorTag });
    return deletedCount;
  } catch (error) {
    if (error instanceof ResourceError) { 
      throw error;
    }
    appLogger.error('OpenAPI 목록 삭제 중 오류 발생', { error, apiIds, actorTag });
    throw new BusinessError(
      ErrorCode.OPEN_API_DELETE_FAILED,
      'OpenAPI 목록 삭제 중 오류가 발생했습니다.',
      { apiIds, actorTag, originalError: error }
    );
  }
};



/**
 * OpenAPI 키 기간 연장 (관리자용)
 */
export const extendOpenApiKey = async (keyId: number, range: { startDt: string; endDt: string }, actorTag: string) => {
  try {
    // 기존 키 조회
    const existingKey = await findAuthKeyById(keyId);
    if (!existingKey) {
      throw new ResourceError(
        ErrorCode.OPEN_API_NOT_FOUND,
        '연장할 OpenAPI 키를 찾을 수 없습니다.',
        'openApi',
        keyId
      );
    }

    // 기간 업데이트 (시작/종료를 직접 세팅)
    const newStartDate = range.startDt ? new Date(range.startDt) : (existingKey.startDt ? new Date(existingKey.startDt) : undefined);
    const newEndDate = new Date(range.endDt);

    // 키 업데이트
    const updatedOk = await updateOpenApiAuthKeyRepo(keyId, {
      startDt: newStartDate,
      endDt: newEndDate,
      updatedBy: actorTag
    });

    if (!updatedOk) {
      throw new BusinessError(
        ErrorCode.OPEN_API_UPDATE_FAILED,
        'OpenAPI 키 기간 연장 중 오류가 발생했습니다.',
        { keyId, actorTag, range }
      );
    }

    appLogger.info('OpenAPI 키 기간 연장 성공', { keyId, actorTag, newStartDate, newEndDate });
    return { startDt: newStartDate, endDt: newEndDate };
  } catch (error) {
    if (error instanceof ResourceError || error instanceof BusinessError) {
      throw error;
    }
    appLogger.error('OpenAPI 키 기간 연장 중 오류 발생', { error, keyId, actorTag, range });
    throw new BusinessError(
      ErrorCode.OPEN_API_UPDATE_FAILED,
      'OpenAPI 키 기간 연장 중 오류가 발생했습니다.',
      { keyId, actorTag, range, originalError: error }
    );
  }
};

/**
 * OpenAPI 상태 통계 조회 (관리자용)
 */
export const getOpenApiStats = async () => {
  try {
    // getAuthKeyStats 함수를 사용하여 전체 통계 조회 (성능 최적화)
    // userId = 0으로 설정하여 모든 사용자의 키를 대상으로 함
    const stats = await getAuthKeyStats(0, true); // includeUnlimited = true로 설정하여 모든 키 포함
    
    return {
      totalKeys: stats.total,
      activeKeys: stats.active,
      expiredKeys: stats.expired,
      inactive: stats.inactive,
      pending:stats.pending 
    };
  } catch (error) {
    appLogger.error('OpenAPI 상태 통계 조회 중 오류 발생', { error });
    throw new BusinessError(
      ErrorCode.DATABASE_ERROR,
      'OpenAPI 상태 통계 조회 중 오류가 발생했습니다.',
      { originalError: error }
    );
  }
};