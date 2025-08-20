import { apiFetch, buildUrl } from './api';
import { FULL_API_URLS } from '@iitp-dabt/common';
import type { 
  UserOpenApiListReq,
  UserOpenApiListRes,
  UserOpenApiDetailRes,
  UserOpenApiCreateReq,
  UserOpenApiCreateRes,
  UserOpenApiExtendParams,
  UserOpenApiExtendReq,
  UserOpenApiExtendRes,
  AdminOpenApiListQuery,
  AdminOpenApiListRes,
  AdminOpenApiDetailRes,
  AdminOpenApiCreateReq,
  AdminOpenApiCreateRes,
  AdminOpenApiUpdateReq,
  // UPDATE/DELETE 는 void
  // delete는 params만 사용, res는 void
  AdminOpenApiExtendReq,
  AdminOpenApiExtendRes,
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
export async function deleteUserOpenApi(keyId: number): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.USER.OPEN_API.DELETE.replace(':keyId', keyId.toString());
  return apiFetch<void>(url, {
    method: 'DELETE',
  });
}

/**
 * 사용자 OpenAPI 인증키 기간 연장
 */
export async function extendUserOpenApi(params: UserOpenApiExtendParams, body: UserOpenApiExtendReq): Promise<ApiResponse<UserOpenApiExtendRes>> {
  const url = FULL_API_URLS.USER.OPEN_API.EXTEND.replace(':keyId', params.keyId.toString());
  return apiFetch<UserOpenApiExtendRes>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// ===== Admin OpenAPI API =====

/**
 * 관리자 OpenAPI 인증키 목록 조회
 */
export async function getAdminOpenApiList(params: AdminOpenApiListQuery): Promise<ApiResponse<AdminOpenApiListRes>> {
  const url = buildUrl(FULL_API_URLS.ADMIN.OPEN_API.LIST, {
    page: params.page,
    limit: params.limit,
    userId: params.userId,
    activeYn: params.activeYn,
    searchKeyword: params.searchKeyword
  });
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
export async function updateAdminOpenApi(keyId: number, body: AdminOpenApiUpdateReq): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.ADMIN.OPEN_API.UPDATE.replace(':keyId', keyId.toString());
  return apiFetch<void>(url, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * 관리자 OpenAPI 인증키 삭제
 */
export async function deleteAdminOpenApi(keyId: number): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.ADMIN.OPEN_API.DELETE.replace(':keyId', keyId.toString());
  return apiFetch<void>(url, {
    method: 'DELETE'
  });
}

/**
 * 관리자 OpenAPI 인증키 기간 연장
 */
export async function extendAdminOpenApi(keyId: number, body: AdminOpenApiExtendReq): Promise<ApiResponse<AdminOpenApiExtendRes>> {
  const url = FULL_API_URLS.ADMIN.OPEN_API.EXTEND.replace(':keyId', keyId.toString());
  return apiFetch<AdminOpenApiExtendRes>(url, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

/**
 * 관리자 OpenAPI 인증키 통계 조회
 */
export async function getAdminOpenApiStats(userId?: number): Promise<ApiResponse<AdminOpenApiStatsRes>> {
  const searchParams = new URLSearchParams();
  if (userId) searchParams.append('userId', userId.toString());
  const url = `${FULL_API_URLS.ADMIN.OPEN_API.STATUS}?${searchParams.toString()}`;
  return apiFetch<AdminOpenApiStatsRes>(url, {
    method: 'GET',
  });
} 