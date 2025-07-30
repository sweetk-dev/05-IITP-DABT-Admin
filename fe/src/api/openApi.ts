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
  ApiResponse
} from '@iitp-dabt/common';

// ===== User OpenAPI API =====

/**
 * 사용자 OpenAPI 인증키 목록 조회
 */
export async function getUserOpenApiList(params: UserOpenApiListReq): Promise<ApiResponse<UserOpenApiListRes>> {
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