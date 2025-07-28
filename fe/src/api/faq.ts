import { apiFetch, publicApiFetch } from './api';
import { FULL_API_URLS } from '@iitp-dabt/common';
import type { 
  UserFaqListReq,
  UserFaqListRes,
  UserFaqDetailRes,
  AdminFaqListReq,
  AdminFaqListRes,
  AdminFaqDetailRes,
  AdminFaqCreateReq,
  AdminFaqCreateRes,
  AdminFaqUpdateReq,
  AdminFaqUpdateRes,
  AdminFaqDeleteRes,
  AdminFaqStatsRes,
  ApiResponse
} from '@iitp-dabt/common';

// ===== User FAQ API =====

/**
 * 사용자 FAQ 목록 조회
 */
export async function getUserFaqList(_params: UserFaqListReq): Promise<ApiResponse<UserFaqListRes>> {
  return publicApiFetch<UserFaqListRes>(FULL_API_URLS.USER.FAQ.LIST, {
    method: 'GET',
    // TODO: 쿼리 파라미터 처리
  });
}

/**
 * 사용자 FAQ 상세 조회
 */
export async function getUserFaqDetail(faqId: number): Promise<ApiResponse<UserFaqDetailRes>> {
  const url = FULL_API_URLS.USER.FAQ.DETAIL.replace(':faqId', faqId.toString());
  return publicApiFetch<UserFaqDetailRes>(url, {
    method: 'GET',
  });
}

// ===== Admin FAQ API =====

/**
 * 관리자 FAQ 목록 조회
 */
export async function getAdminFaqList(_params: AdminFaqListReq): Promise<ApiResponse<AdminFaqListRes>> {
  return apiFetch<AdminFaqListRes>(FULL_API_URLS.ADMIN.FAQ.LIST, {
    method: 'GET',
    // TODO: 쿼리 파라미터 처리
  });
}

/**
 * 관리자 FAQ 상세 조회
 */
export async function getAdminFaqDetail(faqId: number): Promise<ApiResponse<AdminFaqDetailRes>> {
  const url = FULL_API_URLS.ADMIN.FAQ.DETAIL.replace(':faqId', faqId.toString());
  return apiFetch<AdminFaqDetailRes>(url, {
    method: 'GET',
  });
}

/**
 * 관리자 FAQ 생성
 */
export async function createAdminFaq(params: AdminFaqCreateReq): Promise<ApiResponse<AdminFaqCreateRes>> {
  return apiFetch<AdminFaqCreateRes>(FULL_API_URLS.ADMIN.FAQ.CREATE, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * 관리자 FAQ 수정
 */
export async function updateAdminFaq(faqId: number, params: AdminFaqUpdateReq): Promise<ApiResponse<AdminFaqUpdateRes>> {
  const url = FULL_API_URLS.ADMIN.FAQ.UPDATE.replace(':faqId', faqId.toString());
  return apiFetch<AdminFaqUpdateRes>(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

/**
 * 관리자 FAQ 삭제
 */
export async function deleteAdminFaq(faqId: number): Promise<ApiResponse<AdminFaqDeleteRes>> {
  const url = FULL_API_URLS.ADMIN.FAQ.DELETE.replace(':faqId', faqId.toString());
  return apiFetch<AdminFaqDeleteRes>(url, {
    method: 'DELETE',
  });
}

/**
 * 관리자 FAQ 통계 조회
 */
export async function getAdminFaqStats(): Promise<ApiResponse<AdminFaqStatsRes>> {
  return apiFetch<AdminFaqStatsRes>(FULL_API_URLS.ADMIN.FAQ.STATS, {
    method: 'GET',
  });
} 