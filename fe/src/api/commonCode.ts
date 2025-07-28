import { apiFetch, publicApiFetch } from './api';
import { FULL_API_URLS } from '@iitp-dabt/common';
import type { 
  ApiResponse,
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

/**
 * 그룹 ID로 공통 코드 목록 조회 (사용자용)
 */
export async function getCommonCodesByGroupId(grpId: string): Promise<ApiResponse<CommonCodeByGroupRes>> {
  const url = FULL_API_URLS.COMMON_CODE.BY_GROUP.replace(':grpId', grpId);
  return publicApiFetch<CommonCodeByGroupRes>(url, {
    method: 'GET',
  });
}

/**
 * 그룹 ID로 공통 코드 목록 조회 (관리자용)
 */
export async function getCommonCodesByGroupIdDetail(grpId: string): Promise<ApiResponse<CommonCodeByGroupDetailRes>> {
  const url = FULL_API_URLS.COMMON_CODE.ADMIN_BY_GROUP.replace(':grpId', grpId);
  return apiFetch<CommonCodeByGroupDetailRes>(url, {
    method: 'GET',
  });
}

/**
 * 그룹 ID와 코드 ID로 특정 공통 코드 조회 (사용자용)
 */
export async function getCommonCodeById(grpId: string, codeId: string): Promise<ApiResponse<CommonCodeByIdRes>> {
  const url = FULL_API_URLS.COMMON_CODE.BY_ID
    .replace(':grpId', grpId)
    .replace(':codeId', codeId);
  return publicApiFetch<CommonCodeByIdRes>(url, {
    method: 'GET',
  });
}

/**
 * 그룹 ID와 코드 ID로 특정 공통 코드 조회 (관리자용)
 */
export async function getCommonCodeByIdDetail(grpId: string, codeId: string): Promise<ApiResponse<CommonCodeByIdDetailRes>> {
  const url = FULL_API_URLS.COMMON_CODE.ADMIN_BY_ID
    .replace(':grpId', grpId)
    .replace(':codeId', codeId);
  return apiFetch<CommonCodeByIdDetailRes>(url, {
    method: 'GET',
  });
}

/**
 * 코드 타입별로 공통 코드 목록 조회 (사용자용)
 */
export async function getCommonCodesByType(codeType: 'B' | 'A' | 'S'): Promise<ApiResponse<CommonCodeByTypeRes>> {
  const url = FULL_API_URLS.COMMON_CODE.BY_TYPE.replace(':codeType', codeType);
  return publicApiFetch<CommonCodeByTypeRes>(url, {
    method: 'GET',
  });
}

/**
 * 코드 타입별로 공통 코드 목록 조회 (관리자용)
 */
export async function getCommonCodesByTypeDetail(codeType: 'B' | 'A' | 'S'): Promise<ApiResponse<CommonCodeByTypeDetailRes>> {
  const url = FULL_API_URLS.COMMON_CODE.ADMIN_BY_TYPE.replace(':codeType', codeType);
  return apiFetch<CommonCodeByTypeDetailRes>(url, {
    method: 'GET',
  });
}

/**
 * 계층형 구조의 공통 코드 조회 (사용자용)
 */
export async function getCommonCodesByParent(grpId: string, parentCodeId?: string): Promise<ApiResponse<CommonCodeByParentRes>> {
  const url = FULL_API_URLS.COMMON_CODE.BY_PARENT.replace(':grpId', grpId);
  const params = parentCodeId ? `?parentCodeId=${parentCodeId}` : '';
  return publicApiFetch<CommonCodeByParentRes>(url + params, {
    method: 'GET',
  });
}

/**
 * 계층형 구조의 공통 코드 조회 (관리자용)
 */
export async function getCommonCodesByParentDetail(grpId: string, parentCodeId?: string): Promise<ApiResponse<CommonCodeByParentDetailRes>> {
  const url = FULL_API_URLS.COMMON_CODE.ADMIN_BY_PARENT.replace(':grpId', grpId);
  const params = parentCodeId ? `?parentCodeId=${parentCodeId}` : '';
  return apiFetch<CommonCodeByParentDetailRes>(url + params, {
    method: 'GET',
  });
}

/**
 * 공통 코드 통계 조회
 */
export async function getCommonCodeStats(): Promise<ApiResponse<CommonCodeStatsRes>> {
  return apiFetch<CommonCodeStatsRes>(FULL_API_URLS.COMMON_CODE.STATS, {
    method: 'GET',
  });
}

/**
 * 공통 코드 생성 (관리자 전용)
 */
export async function createCommonCode(codeData: CommonCodeCreateReq): Promise<ApiResponse<CommonCodeCreateRes>> {
  return apiFetch<CommonCodeCreateRes>(FULL_API_URLS.COMMON_CODE.BY_GROUP.replace(':grpId', codeData.grpId), {
    method: 'POST',
    body: JSON.stringify(codeData),
  });
}

/**
 * 공통 코드 수정 (관리자 전용)
 */
export async function updateCommonCode(grpId: string, codeId: string, updateData: CommonCodeUpdateReq): Promise<ApiResponse<CommonCodeUpdateRes>> {
  const url = FULL_API_URLS.COMMON_CODE.BY_ID
    .replace(':grpId', grpId)
    .replace(':codeId', codeId);
  return apiFetch<CommonCodeUpdateRes>(url, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
}

/**
 * 공통 코드 삭제 (관리자 전용)
 */
export async function deleteCommonCode(grpId: string, codeId: string): Promise<ApiResponse<CommonCodeDeleteRes>> {
  const url = FULL_API_URLS.COMMON_CODE.BY_ID
    .replace(':grpId', grpId)
    .replace(':codeId', codeId);
  return apiFetch<CommonCodeDeleteRes>(url, {
    method: 'DELETE',
  });
} 