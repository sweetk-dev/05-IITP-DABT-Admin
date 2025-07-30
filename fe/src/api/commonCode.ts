import { apiFetch, publicApiFetch } from './api';
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
  CommonCodeStatsRes,
  CommonCodeCreateReq,
  CommonCodeCreateRes,
  CommonCodeUpdateReq,
  CommonCodeUpdateRes,
  CommonCodeDeleteRes
} from '@iitp-dabt/common';
import type { ApiResponse } from '../types/api';
import { enhanceApiResponse } from '../utils/apiResponseHandler';

/**
 * 그룹 ID로 공통 코드 목록 조회 (사용자용)
 */
export async function getCommonCodesByGroupId(grpId: string): Promise<ApiResponse<CommonCodeByGroupRes>> {
  const url = FULL_API_URLS.COMMON_CODE.BY_GROUP.replace(':grpId', grpId);
  const response = await publicApiFetch<CommonCodeByGroupRes>(url, {
    method: 'GET',
  });
  return enhanceApiResponse(response);
}

/**
 * 그룹 ID로 공통 코드 목록 조회 (관리자용)
 */
export async function getCommonCodesByGroupIdDetail(grpId: string): Promise<ApiResponse<CommonCodeByGroupDetailRes>> {
  const url = FULL_API_URLS.COMMON_CODE.ADMIN_BY_GROUP.replace(':grpId', grpId);
  const response = await apiFetch<CommonCodeByGroupDetailRes>(url, {
    method: 'GET',
  });
  return enhanceApiResponse(response);
}

/**
 * 그룹 ID와 코드 ID로 특정 공통 코드 조회 (사용자용)
 */
export async function getCommonCodeById(grpId: string, codeId: string): Promise<ApiResponse<CommonCodeByIdRes>> {
  const url = FULL_API_URLS.COMMON_CODE.BY_ID
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
  const url = FULL_API_URLS.COMMON_CODE.ADMIN_BY_ID
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
  const url = FULL_API_URLS.COMMON_CODE.BY_TYPE.replace(':codeType', codeType);
  const response = await publicApiFetch<CommonCodeByTypeRes>(url, {
    method: 'GET',
  });
  return enhanceApiResponse(response);
}

/**
 * 코드 타입별로 공통 코드 목록 조회 (관리자용)
 */
export async function getCommonCodesByTypeDetail(codeType: 'B' | 'A' | 'S'): Promise<ApiResponse<CommonCodeByTypeDetailRes>> {
  const url = FULL_API_URLS.COMMON_CODE.ADMIN_BY_TYPE.replace(':codeType', codeType);
  const response = await apiFetch<CommonCodeByTypeDetailRes>(url, {
    method: 'GET',
  });
  return enhanceApiResponse(response);
}

/**
 * 계층형 구조의 공통 코드 조회 (사용자용)
 */
export async function getCommonCodesByParent(grpId: string, parentCodeId?: string): Promise<ApiResponse<CommonCodeByParentRes>> {
  const url = FULL_API_URLS.COMMON_CODE.BY_PARENT.replace(':grpId', grpId);
  const params = parentCodeId ? `?parentCodeId=${parentCodeId}` : '';
  const response = await publicApiFetch<CommonCodeByParentRes>(url + params, {
    method: 'GET',
  });
  return enhanceApiResponse(response);
}

/**
 * 계층형 구조의 공통 코드 조회 (관리자용)
 */
export async function getCommonCodesByParentDetail(grpId: string, parentCodeId?: string): Promise<ApiResponse<CommonCodeByParentDetailRes>> {
  const url = FULL_API_URLS.COMMON_CODE.ADMIN_BY_PARENT.replace(':grpId', grpId);
  const params = parentCodeId ? `?parentCodeId=${parentCodeId}` : '';
  const response = await apiFetch<CommonCodeByParentDetailRes>(url + params, {
    method: 'GET',
  });
  return enhanceApiResponse(response);
}

/**
 * 공통 코드 통계 조회
 */
export async function getCommonCodeStats(): Promise<ApiResponse<CommonCodeStatsRes>> {
  const response = await apiFetch<CommonCodeStatsRes>(FULL_API_URLS.COMMON_CODE.STATS, {
    method: 'GET',
  });
  return enhanceApiResponse(response);
}

/**
 * 공통 코드 생성 (관리자 전용)
 */
export async function createCommonCode(codeData: CommonCodeCreateReq): Promise<ApiResponse<CommonCodeCreateRes>> {
  const response = await apiFetch<CommonCodeCreateRes>(FULL_API_URLS.COMMON_CODE.BY_GROUP.replace(':grpId', codeData.grpId), {
    method: 'POST',
    body: JSON.stringify(codeData),
  });
  return enhanceApiResponse(response);
}

/**
 * 공통 코드 수정 (관리자 전용)
 */
export async function updateCommonCode(grpId: string, codeId: string, updateData: CommonCodeUpdateReq): Promise<ApiResponse<CommonCodeUpdateRes>> {
  const url = FULL_API_URLS.COMMON_CODE.BY_ID
    .replace(':grpId', grpId)
    .replace(':codeId', codeId);
  const response = await apiFetch<CommonCodeUpdateRes>(url, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
  return enhanceApiResponse(response);
}

/**
 * 공통 코드 삭제 (관리자 전용)
 */
export async function deleteCommonCode(grpId: string, codeId: string): Promise<ApiResponse<CommonCodeDeleteRes>> {
  const url = FULL_API_URLS.COMMON_CODE.BY_ID
    .replace(':grpId', grpId)
    .replace(':codeId', codeId);
  const response = await apiFetch<CommonCodeDeleteRes>(url, {
    method: 'DELETE',
  });
  return enhanceApiResponse(response);
} 