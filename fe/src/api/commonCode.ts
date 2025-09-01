import { apiFetch, publicApiFetch, buildUrl } from './api';
import { FULL_API_URLS } from '@iitp-dabt/common';
import type { 
  CommonCodeByGroupRes,
  CommonCodeByGroupDetailRes,
  CommonCodeByIdRes,
  CommonCodeByIdDetailRes,
  CommonCodeByTypeRes,
  CommonCodeByTypeDetailRes,
  CommonCodeByParentRes,
  CommonCodeByParentDetailRes,
  CommonCodeCreateReq,
  CommonCodeUpdateReq,
  CommonCodeCodeUpdateRes
} from '@iitp-dabt/common';
import type { ApiResponse } from '../types/api';
import { enhanceApiResponse } from '../utils/apiResponseHandler';

/**
 * 그룹 ID로 공통 코드 목록 조회 (사용자용)
 */
export async function getCommonCodesByGroupId(grpId: string): Promise<ApiResponse<CommonCodeByGroupRes>> {
  const url = FULL_API_URLS.COMMON_CODE.BASIC.BY_GROUP.replace(':grpId', grpId);
  const response = await publicApiFetch<CommonCodeByGroupRes>(url, {
    method: 'GET',
  });
  return enhanceApiResponse(response);
}

/**
 * 공통 코드 그룹 목록 조회 (관리자용)
 */
export async function getCommonCodeGroups(filters?: { search?: string; useYn?: string; sort?: string }): Promise<ApiResponse<any>> {
  // ✅ 쿼리 파라미터 구성
  const queryParams = new URLSearchParams();
  if (filters?.search) queryParams.append('search', filters.search);
  if (filters?.useYn) queryParams.append('useYn', filters.useYn);
  if (filters?.sort) queryParams.append('sort', filters.sort);
  
  const url = queryParams.toString() ? `${FULL_API_URLS.COMMON_CODE.GROUP.LIST}?${queryParams.toString()}` : FULL_API_URLS.COMMON_CODE.GROUP.LIST;
  
  const response = await apiFetch<any>(url, {
    method: 'GET',
  });
  return enhanceApiResponse(response);
}

/**
 * 그룹 ID로 공통 코드 목록 조회 (관리자용)
 */
export async function getCommonCodesByGroupIdDetail(grpId: string): Promise<ApiResponse<CommonCodeByGroupDetailRes>> {
  const url = FULL_API_URLS.COMMON_CODE.ADMIN.BY_GROUP.replace(':grpId', grpId);
  const response = await apiFetch<CommonCodeByGroupDetailRes>(url, {
    method: 'GET',
  });
  return enhanceApiResponse(response);
}

/**
 * 그룹 ID와 코드 ID로 특정 공통 코드 조회 (사용자용)
 */
export async function getCommonCodeById(grpId: string, codeId: string): Promise<ApiResponse<CommonCodeByIdRes>> {
  const url = FULL_API_URLS.COMMON_CODE.BASIC.BY_ID
    .replace(':grpId', grpId)
    .replace(':codeId', codeId);
  const response = await publicApiFetch<CommonCodeByIdRes>(url, {
    method: 'GET',
  });
  return enhanceApiResponse(response);
}

/**
 * 그룹 ID와 코드 ID로 특정 공통 코드 조회 (관리자용)
 */
export async function getCommonCodeByIdDetail(grpId: string, codeId: string): Promise<ApiResponse<CommonCodeByIdDetailRes>> {
  const url = FULL_API_URLS.COMMON_CODE.ADMIN.BY_ID
    .replace(':grpId', grpId)
    .replace(':codeId', codeId);
  const response = await apiFetch<CommonCodeByIdDetailRes>(url, {
    method: 'GET',
  });
  return enhanceApiResponse(response);
}

/**
 * 코드 타입별로 공통 코드 목록 조회 (사용자용)
 */
export async function getCommonCodesByType(codeType: 'B' | 'A' | 'S'): Promise<ApiResponse<CommonCodeByTypeRes>> {
  const url = FULL_API_URLS.COMMON_CODE.BASIC.BY_TYPE.replace(':codeType', codeType);
  const response = await publicApiFetch<CommonCodeByTypeRes>(url, {
    method: 'GET',
  });
  return enhanceApiResponse(response);
}

/**
 * 코드 타입별로 공통 코드 목록 조회 (관리자용)
 */
export async function getCommonCodesByTypeDetail(codeType: 'B' | 'A' | 'S'): Promise<ApiResponse<CommonCodeByTypeDetailRes>> {
  const url = FULL_API_URLS.COMMON_CODE.ADMIN.BY_TYPE.replace(':codeType', codeType);
  const response = await apiFetch<CommonCodeByTypeDetailRes>(url, {
    method: 'GET',
  });
  return enhanceApiResponse(response);
}

/**
 * 계층형 구조의 공통 코드 조회 (사용자용)
 */
export async function getCommonCodesByParent(grpId: string, parentCodeId?: string): Promise<ApiResponse<CommonCodeByParentRes>> {
  const base = FULL_API_URLS.COMMON_CODE.BASIC.BY_PARENT.replace(':grpId', grpId);
  const url = buildUrl(base, { parentCodeId });
  return publicApiFetch<CommonCodeByParentRes>(url, { method: 'GET' });
}

/**
 * 계층형 구조의 공통 코드 조회 (관리자용)
 */
export async function getCommonCodesByParentDetail(grpId: string, parentCodeId?: string): Promise<ApiResponse<CommonCodeByParentDetailRes>> {
  const base = FULL_API_URLS.COMMON_CODE.ADMIN.BY_PARENT.replace(':grpId', grpId);
  const url = buildUrl(base, { parentCodeId });
  return apiFetch<CommonCodeByParentDetailRes>(url, { method: 'GET' });
}

/**
 * 공통 코드 통계 조회
 */
/**
 * 공통 코드 생성 (관리자 전용)
 */
export async function createCommonCode(codeData: CommonCodeCreateReq): Promise<ApiResponse<void>> {
  return apiFetch<void>(FULL_API_URLS.COMMON_CODE.CODE.CREATE.replace(':grpId', codeData.grpId), {
    method: 'POST',
    body: JSON.stringify(codeData),
  });
}

/**
 * 공통 코드 수정 (관리자 전용)
 */
export async function updateCommonCode(grpId: string, codeId: string, updateData: CommonCodeUpdateReq): Promise<ApiResponse<CommonCodeCodeUpdateRes>> {
  const url = FULL_API_URLS.COMMON_CODE.CODE.UPDATE
    .replace(':grpId', grpId)
    .replace(':codeId', codeId);
  return apiFetch<CommonCodeCodeUpdateRes>(url, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
}

/**
 * 공통 코드 삭제 (관리자 전용)
 */
export async function deleteCommonCode(grpId: string, codeId: string): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.COMMON_CODE.CODE.DELETE
    .replace(':grpId', grpId)
    .replace(':codeId', codeId);
  return apiFetch<void>(url, { method: 'DELETE' });
}

/**
 * 공통 코드 일괄 삭제 (관리자용)
 */
export async function deleteCommonCodeList(ids: (number | string)[]): Promise<ApiResponse<void>> {
  const response = await apiFetch<void>(FULL_API_URLS.COMMON_CODE.CODE.LIST_DELETE, {
    method: 'DELETE',
    body: JSON.stringify({ codeIds: ids }),
  });
  return enhanceApiResponse(response);
}

/**
 * 공통 코드 그룹 일괄 삭제 (관리자용)
 */
export async function deleteCommonCodeGroupList(ids: (number | string)[]): Promise<ApiResponse<void>> {
  const response = await apiFetch<void>(FULL_API_URLS.COMMON_CODE.GROUP.LIST_DELETE, {
    method: 'DELETE',
    body: JSON.stringify({ groupIds: ids }),
  });
  return enhanceApiResponse(response);
} 