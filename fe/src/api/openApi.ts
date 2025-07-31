import { apiFetch, publicApiFetch } from './api';
import { FULL_API_URLS } from '@iitp-dabt/common';
import type { 
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
  AdminOpenApiListReq,
  AdminOpenApiListRes,
  AdminOpenApiDetailReq,
  AdminOpenApiDetailRes,
  AdminOpenApiCreateReq,
  AdminOpenApiCreateRes,
  AdminOpenApiUpdateReq,
  AdminOpenApiUpdateRes,
  AdminOpenApiDeleteReq,
  AdminOpenApiDeleteRes,
  AdminOpenApiExtendReq,
  AdminOpenApiExtendRes,
  AdminOpenApiStatsReq,
  AdminOpenApiStatsRes,
  ApiResponse
} from '@iitp-dabt/common';

// ===== User OpenAPI API =====

/**
 * 사용자 OpenAPI 인증키 목록 조회
 */
export async function getUserOpenApiList(_params: UserOpenApiListReq): Promise<ApiResponse<UserOpenApiListRes>> {
  return apiFetch<UserOpenApiListRes>(FULL_API_URLS.USER.OPEN_API.LIST, {
    method: 'GET',
  });
}

/**
 * 사용자 OpenAPI 인증키 상세 조회
 */
export async function getUserOpenApiDetail(keyId: number): Promise<ApiResponse<UserOpenApiDetailRes>> {
  const url = FULL_API_URLS.USER.OPEN_API.DETAIL.replace(':keyId', keyId.toString());
  return apiFetch<UserOpenApiDetailRes>(url, {
    method: 'GET',
  });
}

/**
 * 사용자 OpenAPI 인증키 생성
 */
export async function createUserOpenApi(params: UserOpenApiCreateReq): Promise<ApiResponse<UserOpenApiCreateRes>> {
  return apiFetch<UserOpenApiCreateRes>(FULL_API_URLS.USER.OPEN_API.CREATE, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * 사용자 OpenAPI 인증키 삭제
 */
export async function deleteUserOpenApi(keyId: number): Promise<ApiResponse<UserOpenApiDeleteRes>> {
  const url = FULL_API_URLS.USER.OPEN_API.DELETE.replace(':keyId', keyId.toString());
  return apiFetch<UserOpenApiDeleteRes>(url, {
    method: 'DELETE',
  });
}

/**
 * 사용자 OpenAPI 인증키 기간 연장
 */
export async function extendUserOpenApi(params: UserOpenApiExtendReq): Promise<ApiResponse<UserOpenApiExtendRes>> {
  const url = FULL_API_URLS.USER.OPEN_API.EXTEND.replace(':keyId', params.keyId.toString());
  return apiFetch<UserOpenApiExtendRes>(url, {
    method: 'PUT',
    body: JSON.stringify({ extensionDays: params.extensionDays }),
  });
}

// ===== Admin OpenAPI API =====

/**
 * 관리자 OpenAPI 인증키 목록 조회
 */
export async function getAdminOpenApiList(params: AdminOpenApiListReq): Promise<ApiResponse<AdminOpenApiListRes>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.userId) searchParams.append('userId', params.userId.toString());
  if (params.activeYn) searchParams.append('activeYn', params.activeYn);
  if (params.searchKeyword) searchParams.append('searchKeyword', params.searchKeyword);

  const url = `${FULL_API_URLS.ADMIN.OPEN_API.LIST}?${searchParams.toString()}`;
  return apiFetch<AdminOpenApiListRes>(url, {
    method: 'GET',
  });
}

/**
 * 관리자 OpenAPI 인증키 상세 조회
 */
export async function getAdminOpenApiDetail(keyId: number): Promise<ApiResponse<AdminOpenApiDetailRes>> {
  const url = FULL_API_URLS.ADMIN.OPEN_API.DETAIL.replace(':keyId', keyId.toString());
  return apiFetch<AdminOpenApiDetailRes>(url, {
    method: 'GET',
  });
}

/**
 * 관리자 OpenAPI 인증키 생성
 */
export async function createAdminOpenApi(params: AdminOpenApiCreateReq): Promise<ApiResponse<AdminOpenApiCreateRes>> {
  return apiFetch<AdminOpenApiCreateRes>(FULL_API_URLS.ADMIN.OPEN_API.CREATE, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * 관리자 OpenAPI 인증키 수정
 */
export async function updateAdminOpenApi(params: AdminOpenApiUpdateReq): Promise<ApiResponse<AdminOpenApiUpdateRes>> {
  const url = FULL_API_URLS.ADMIN.OPEN_API.UPDATE.replace(':keyId', params.keyId.toString());
  return apiFetch<AdminOpenApiUpdateRes>(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

/**
 * 관리자 OpenAPI 인증키 삭제
 */
export async function deleteAdminOpenApi(params: AdminOpenApiDeleteReq): Promise<ApiResponse<AdminOpenApiDeleteRes>> {
  const url = FULL_API_URLS.ADMIN.OPEN_API.DELETE.replace(':keyId', params.keyId.toString());
  return apiFetch<AdminOpenApiDeleteRes>(url, {
    method: 'DELETE',
    body: JSON.stringify({ deletedBy: params.deletedBy }),
  });
}

/**
 * 관리자 OpenAPI 인증키 기간 연장
 */
export async function extendAdminOpenApi(params: AdminOpenApiExtendReq): Promise<ApiResponse<AdminOpenApiExtendRes>> {
  const url = FULL_API_URLS.ADMIN.OPEN_API.EXTEND.replace(':keyId', params.keyId.toString());
  return apiFetch<AdminOpenApiExtendRes>(url, {
    method: 'PUT',
    body: JSON.stringify({ 
      extensionDays: params.extensionDays,
      updatedBy: params.updatedBy 
    }),
  });
}

/**
 * 관리자 OpenAPI 인증키 통계 조회
 */
export async function getAdminOpenApiStats(params: AdminOpenApiStatsReq): Promise<ApiResponse<AdminOpenApiStatsRes>> {
  const searchParams = new URLSearchParams();
  if (params.userId) searchParams.append('userId', params.userId.toString());

  const url = `${FULL_API_URLS.ADMIN.OPEN_API.STATS}?${searchParams.toString()}`;
  return apiFetch<AdminOpenApiStatsRes>(url, {
    method: 'GET',
  });
} 