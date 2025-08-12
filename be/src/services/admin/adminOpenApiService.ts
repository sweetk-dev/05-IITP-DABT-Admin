import { Op } from 'sequelize';
import { 
  findAuthKeysByUserId, 
  findAuthKeyById, 
  createAuthKey as createOpenApiAuthKeyRepo, 
  updateAuthKey as updateOpenApiAuthKeyRepo, 
  deleteAuthKey as deleteOpenApiAuthKeyRepo 
} from '../../repositories/openApiAuthKeyRepository';
import { appLogger } from '../../utils/logger';
import { generateAuthKey } from '../../utils/authKeyGenerator';

export interface OpenApiListParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
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
  extensionDays?: number;
  status?: string;
}

/**
 * OpenAPI 목록 조회 (관리자용)
 */
export const getOpenApiList = async (params: OpenApiListParams) => {
  try {
    const { page, limit, search, status } = params;
    const offset = (page - 1) * limit;

    // 검색 조건 구성
    const whereConditions: any = {};
    
    if (search) {
      whereConditions[Op.or] = [
        { keyName: { [Op.like]: `%${search}%` } },
        { keyDesc: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (status) {
      whereConditions.status = status;
    }

    const result = await findAuthKeysByUserId(0, {
      page,
      limit,
      includeInactive: true
    });

    return {
      openApis: result.authKeys,
      total: result.total,
      page,
      limit
    };
  } catch (error) {
    appLogger.error('OpenAPI 목록 조회 중 오류 발생', { error, params });
    throw error;
  }
};

/**
 * OpenAPI 상세 조회 (관리자용)
 */
export const getOpenApiDetail = async (apiId: number) => {
  try {
    const api = await findAuthKeyById(apiId);
    if (!api) {
      throw new Error('OPEN_API_NOT_FOUND');
    }
    return api;
  } catch (error) {
    appLogger.error('OpenAPI 상세 조회 중 오류 발생', { error, apiId });
    throw error;
  }
};

/**
 * OpenAPI 생성 (관리자용)
 */
export const createOpenApi = async (apiData: OpenApiCreateData, adminId: number) => {
  try {
    const authKey = generateAuthKey();
    const newKey = await createOpenApiAuthKeyRepo({
      userId: apiData.userId,
      authKey,
      keyName: apiData.keyName,
      keyDesc: apiData.keyDesc || '',
      startDt: apiData.startDt ? new Date(apiData.startDt) : undefined,
      endDt: apiData.endDt ? new Date(apiData.endDt) : undefined,
      createdBy: adminId.toString()
    });

    appLogger.info('OpenAPI 생성 성공', { keyId: newKey.keyId, adminId });
    return { keyId: newKey.keyId, authKey };
  } catch (error) {
    appLogger.error('OpenAPI 생성 중 오류 발생', { error, apiData, adminId });
    throw error;
  }
};

/**
 * OpenAPI 수정 (관리자용)
 */
export const updateOpenApi = async (apiId: number, updateData: OpenApiUpdateData, adminId: number) => {
  try {
    const updatedApi = await updateOpenApiAuthKeyRepo(apiId, {
      ...updateData,
      updatedBy: adminId.toString()
    });

    if (!updatedApi) {
      throw new Error('OPEN_API_NOT_FOUND');
    }

    appLogger.info('OpenAPI 수정 성공', { apiId, adminId });
    return updatedApi;
  } catch (error) {
    appLogger.error('OpenAPI 수정 중 오류 발생', { error, apiId, updateData, adminId });
    throw error;
  }
};

/**
 * OpenAPI 삭제 (관리자용)
 */
export const deleteOpenApi = async (apiId: number, adminId: number) => {
  try {
    const deletedApi = await deleteOpenApiAuthKeyRepo(apiId, adminId);

    if (!deletedApi) {
      throw new Error('OPEN_API_NOT_FOUND');
    }

    appLogger.info('OpenAPI 삭제 성공', { apiId, adminId });
    return deletedApi;
  } catch (error) {
    appLogger.error('OpenAPI 삭제 중 오류 발생', { error, apiId, adminId });
    throw error;
  }
};

/**
 * OpenAPI 키 기간 연장 (관리자용)
 */
export const extendOpenApiKey = async (keyId: number, extensionDays: number, adminId: number) => {
  try {
    // 기존 키 조회
    const existingKey = await findAuthKeyById(keyId);
    if (!existingKey) {
      throw new Error('OPEN_API_NOT_FOUND');
    }

    // 만료일 계산 (기존 만료일 + 연장 일수)
    const currentEndDate = existingKey.endDt ? new Date(existingKey.endDt) : new Date();
    const newEndDate = new Date(currentEndDate);
    newEndDate.setDate(newEndDate.getDate() + extensionDays);

    // 키 업데이트
    const updatedKey = await updateOpenApiAuthKeyRepo(keyId, {
      endDt: newEndDate,
      updatedBy: adminId
    });

    if (!updatedKey) {
      throw new Error('OPEN_API_UPDATE_FAILED');
    }

    appLogger.info('OpenAPI 키 기간 연장 성공', { keyId, extensionDays, adminId, newEndDate });
    return updatedKey;
  } catch (error) {
    appLogger.error('OpenAPI 키 기간 연장 중 오류 발생', { error, keyId, extensionDays, adminId });
    throw error;
  }
};

/**
 * OpenAPI 상태 통계 조회 (관리자용)
 */
export const getOpenApiStats = async () => {
  try {
    // 전체 키 수 조회
    const totalKeys = await findAuthKeysByUserId(0, {
      page: 1,
      limit: 1000, // 충분히 큰 수로 설정
      includeInactive: true
    });

    const allKeys = totalKeys.rows;
    
    // 상태별 통계 계산
    const activeKeys = allKeys.filter(key => key.status === 'ACTIVE').length;
    const expiredKeys = allKeys.filter(key => {
      if (!key.endDt) return false;
      return new Date(key.endDt) < new Date();
    }).length;
    const suspendedKeys = allKeys.filter(key => key.status === 'SUSPENDED').length;
    
    // 사용량 통계 (hitCnt 기준)
    const totalUsage = allKeys.reduce((sum, key) => sum + (key.hitCnt || 0), 0);
    const averageUsage = allKeys.length > 0 ? Math.round(totalUsage / allKeys.length) : 0;

    return {
      totalKeys: allKeys.length,
      activeKeys,
      expiredKeys,
      suspendedKeys,
      totalUsage,
      averageUsage
    };
  } catch (error) {
    appLogger.error('OpenAPI 상태 통계 조회 중 오류 발생', { error });
    throw error;
  }
};