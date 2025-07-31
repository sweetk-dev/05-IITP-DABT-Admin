import { apiFetch, enhanceApiResponse } from './api';
import { FULL_API_URLS } from '@iitp-dabt/common';
import type {
  UserFaqListReq,
  UserFaqListRes,
  UserFaqDetailRes,
  UserFaqHomeRes,
  AdminFaqListReq,
  AdminFaqListRes,
  AdminFaqDetailRes,
  AdminFaqCreateReq,
  AdminFaqCreateRes,
  AdminFaqUpdateReq,
  AdminFaqUpdateRes,
  AdminFaqDeleteRes,
  AdminFaqStatsRes
} from '@iitp-dabt/common';
import type { ApiResponse } from '../types/api';

/**
 * FAQ 목록 조회 (사용자용)
 */
export async function getUserFaqList(params: UserFaqListReq): Promise<ApiResponse<UserFaqListRes>> {
  const response = await apiFetch<UserFaqListRes>(FULL_API_URLS.USER.FAQ.LIST, {
    method: 'POST',
    body: JSON.stringify(params)
  });
  return enhanceApiResponse(response);
}

/**
 * FAQ 상세 조회 (사용자용)
 */
export async function getUserFaqDetail(faqId: number): Promise<ApiResponse<UserFaqDetailRes>> {
  const url = FULL_API_URLS.USER.FAQ.DETAIL.replace(':faqId', faqId.toString());
  const response = await apiFetch<UserFaqDetailRes>(url);
  return enhanceApiResponse(response);
}

/**
 * 홈 화면용 FAQ 조회 (조회수 높은 5개)
 */
export async function getHomeFaqList(): Promise<ApiResponse<UserFaqHomeRes>> {
  const response = await apiFetch<UserFaqHomeRes>(FULL_API_URLS.USER.FAQ.HOME);
  return enhanceApiResponse(response);
}

/**
 * FAQ 타입별 목록 조회 (사용자용)
 */
export async function getUserFaqListByType(faqType: string, params: Omit<UserFaqListReq, 'faqType'>): Promise<ApiResponse<UserFaqListRes>> {
  const response = await apiFetch<UserFaqListRes>(FULL_API_URLS.USER.FAQ.LIST, {
    method: 'POST',
    body: JSON.stringify({
      ...params,
      faqType: faqType === 'ALL' ? undefined : faqType
    })
  });
  return enhanceApiResponse(response);
}

// ===== 관리자용 API 함수들 =====

/**
 * FAQ 목록 조회 (관리자용)
 */
export async function getAdminFaqList(params: AdminFaqListReq): Promise<ApiResponse<AdminFaqListRes>> {
  return apiFetch<AdminFaqListRes>(FULL_API_URLS.ADMIN.FAQ.LIST, {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * FAQ 상세 조회 (관리자용)
 */
export async function getAdminFaqDetail(faqId: number): Promise<ApiResponse<AdminFaqDetailRes>> {
  const url = FULL_API_URLS.ADMIN.FAQ.DETAIL.replace(':faqId', faqId.toString());
  return apiFetch<AdminFaqDetailRes>(url);
}

/**
 * FAQ 생성 (관리자용)
 */
export async function createAdminFaq(data: AdminFaqCreateReq): Promise<ApiResponse<AdminFaqCreateRes>> {
  return apiFetch<AdminFaqCreateRes>(FULL_API_URLS.ADMIN.FAQ.CREATE, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * FAQ 수정 (관리자용)
 */
export async function updateAdminFaq(faqId: number, data: AdminFaqUpdateReq): Promise<ApiResponse<AdminFaqUpdateRes>> {
  const url = FULL_API_URLS.ADMIN.FAQ.UPDATE.replace(':faqId', faqId.toString());
  return apiFetch<AdminFaqUpdateRes>(url, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

/**
 * FAQ 삭제 (관리자용)
 */
export async function deleteAdminFaq(faqId: number): Promise<ApiResponse<AdminFaqDeleteRes>> {
  const url = FULL_API_URLS.ADMIN.FAQ.DELETE.replace(':faqId', faqId.toString());
  return apiFetch<AdminFaqDeleteRes>(url, {
    method: 'DELETE'
  });
}

/**
 * FAQ 통계 조회 (관리자용)
 */
export async function getAdminFaqStats(): Promise<ApiResponse<AdminFaqStatsRes>> {
  return apiFetch<AdminFaqStatsRes>(FULL_API_URLS.ADMIN.FAQ.STATS);
} 