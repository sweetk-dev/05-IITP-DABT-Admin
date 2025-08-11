import { Op } from 'sequelize';
import { 
  findAuthKeysByUserId, 
  findAuthKeyById, 
  createAuthKey as createOpenApiAuthKeyRepo, 
  updateAuthKey as updateOpenApiAuthKeyRepo, 
  deleteAuthKey as deleteOpenApiAuthKeyRepo 
} from '../../repositories/openApiAuthKeyRepository';
import { appLogger } from '../../utils/logger';

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
  extensionDays: number;
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
      openApis: result.rows,
      total: result.count,
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
    const newApi = await createOpenApiAuthKeyRepo({
      ...apiData,
      createdBy: adminId,
      updatedBy: adminId,
      status: 'ACTIVE'
    });

    appLogger.info('OpenAPI 생성 성공', { apiId: newApi.apiId, adminId });
    return newApi;
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
      updatedBy: adminId
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