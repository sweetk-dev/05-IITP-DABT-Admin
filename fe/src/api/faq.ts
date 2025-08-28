import { apiFetch, publicApiFetch, enhanceApiResponse, buildUrl } from './api';
import { FULL_API_URLS } from '@iitp-dabt/common';
import type {
  UserFaqListQuery as UserFaqListReq,
  UserFaqListRes,
  UserFaqDetailRes,
  UserFaqHomeRes,
  AdminFaqListQuery as AdminFaqListReq,
  AdminFaqListRes,
  AdminFaqDetailRes,
  AdminFaqCreateReq,
  AdminFaqCreateRes,
  AdminFaqUpdateReq,
  // Update/Delete 는 void
} from '@iitp-dabt/common';
import type { ApiResponse } from '../types/api';

/**
 * FAQ 목록 조회 (사용자용)
 */
export async function getUserFaqList(params: UserFaqListReq): Promise<ApiResponse<UserFaqListRes>> {
  const url = buildUrl(FULL_API_URLS.USER.FAQ.LIST, params as any);
  return apiFetch<UserFaqListRes>(url, { method: 'GET' });
}

/**
 * FAQ 상세 조회 (사용자용)
 */
export async function getUserFaqDetail(faqId: number, options?: { skipHit?: boolean }): Promise<ApiResponse<UserFaqDetailRes>> {
  const base = FULL_API_URLS.USER.FAQ.DETAIL.replace(':faqId', faqId.toString());
  const url = options?.skipHit ? `${base}?skipHit=true` : base;
  return apiFetch<UserFaqDetailRes>(url, { method: 'GET' });
}

/**
 * 홈 화면용 FAQ 조회 (조회수 높은 5개)
 */
export async function getHomeFaqList(): Promise<ApiResponse<UserFaqHomeRes>> {
  return publicApiFetch<UserFaqHomeRes>(FULL_API_URLS.USER.FAQ.HOME, { method: 'GET' });
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
  const url = buildUrl(FULL_API_URLS.ADMIN.FAQ.LIST, params as any);
  return apiFetch<AdminFaqListRes>(url, { method: 'GET' });
}

/**
 * FAQ 상세 조회 (관리자용)
 */
export async function getAdminFaqDetail(faqId: number): Promise<ApiResponse<AdminFaqDetailRes>> {
  const url = FULL_API_URLS.ADMIN.FAQ.DETAIL.replace(':faqId', faqId.toString());
  return apiFetch<AdminFaqDetailRes>(url, { method: 'GET' });
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
export async function updateAdminFaq(faqId: number, data: AdminFaqUpdateReq): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.ADMIN.FAQ.UPDATE.replace(':faqId', faqId.toString());
  return apiFetch<void>(url, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

/**
 * FAQ 삭제 (관리자용)
 */
export async function deleteAdminFaq(faqId: number): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.ADMIN.FAQ.DELETE.replace(':faqId', faqId.toString());
  return apiFetch<void>(url, {
    method: 'DELETE'
  });
}

/**
 * FAQ 일괄 삭제 (관리자용)
 */
export async function deleteAdminFaqList(faqIds: (number | string)[]): Promise<ApiResponse<void>> {
  return apiFetch<void>(FULL_API_URLS.ADMIN.FAQ.LIST_DELETE, {
    method: 'DELETE',
    body: JSON.stringify({ faqIds }),
  });
}

