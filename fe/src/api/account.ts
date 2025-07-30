import { apiFetch } from './api';
import { FULL_API_URLS } from '@iitp-dabt/common';
import type { 
  AdminListReq,
  AdminListRes,
  AdminDetailRes,
  AdminCreateReq,
  AdminCreateRes,
  AdminCheckEmailReq,
  AdminCheckEmailRes,
  AdminUpdateReq,
  AdminUpdateRes,
  AdminDeleteRes,
  AdminPasswordChangeReq,
  AdminPasswordChangeRes,
  AdminStatusChangeReq,
  AdminStatusChangeRes,
  AdminStatsRes
} from '@iitp-dabt/common';
import type { ApiResponse } from '../types/api';
import { enhanceApiResponse } from '../utils/apiResponseHandler';

// ===== Admin Account API =====

/**
 * 관리자 계정 목록 조회
 */
export async function getAdminAccountList(_params: AdminListReq): Promise<ApiResponse<AdminListRes>> {
  const response = await apiFetch<AdminListRes>(FULL_API_URLS.ADMIN.ACCOUNT.LIST, {
    method: 'GET',
    // TODO: 쿼리 파라미터 처리
  });
  return enhanceApiResponse(response);
}

/**
 * 관리자 계정 상세 조회
 */
export async function getAdminAccountDetail(adminId: number): Promise<ApiResponse<AdminDetailRes>> {
  const url = FULL_API_URLS.ADMIN.ACCOUNT.DETAIL.replace(':adminId', adminId.toString());
  const response = await apiFetch<AdminDetailRes>(url, {
    method: 'GET',
  });
  return enhanceApiResponse(response);
}

/**
 * 관리자 계정 생성
 */
export async function createAdminAccount(params: AdminCreateReq): Promise<ApiResponse<AdminCreateRes>> {
  const response = await apiFetch<AdminCreateRes>(FULL_API_URLS.ADMIN.ACCOUNT.CREATE, {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return enhanceApiResponse(response);
}

/**
 * 관리자 계정 이메일 중복 체크
 */
export async function checkAdminEmail(params: AdminCheckEmailReq): Promise<ApiResponse<AdminCheckEmailRes>> {
  const response = await apiFetch<AdminCheckEmailRes>(FULL_API_URLS.ADMIN.ACCOUNT.CHECK_EMAIL, {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return enhanceApiResponse(response);
}

/**
 * 관리자 계정 수정
 */
export async function updateAdminAccount(adminId: number, params: AdminUpdateReq): Promise<ApiResponse<AdminUpdateRes>> {
  const url = FULL_API_URLS.ADMIN.ACCOUNT.UPDATE.replace(':adminId', adminId.toString());
  const response = await apiFetch<AdminUpdateRes>(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
  return enhanceApiResponse(response);
}

/**
 * 관리자 계정 삭제
 */
export async function deleteAdminAccount(adminId: number): Promise<ApiResponse<AdminDeleteRes>> {
  const url = FULL_API_URLS.ADMIN.ACCOUNT.DELETE.replace(':adminId', adminId.toString());
  const response = await apiFetch<AdminDeleteRes>(url, {
    method: 'DELETE',
  });
  return enhanceApiResponse(response);
}

/**
 * 관리자 계정 비밀번호 변경
 */
export async function changeAdminAccountPassword(adminId: number, params: AdminPasswordChangeReq): Promise<ApiResponse<AdminPasswordChangeRes>> {
  const url = FULL_API_URLS.ADMIN.ACCOUNT.PASSWORD_CHANGE.replace(':adminId', adminId.toString());
  const response = await apiFetch<AdminPasswordChangeRes>(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
  return enhanceApiResponse(response);
}

/**
 * 관리자 계정 상태 변경
 */
export async function changeAdminAccountStatus(adminId: number, params: AdminStatusChangeReq): Promise<ApiResponse<AdminStatusChangeRes>> {
  const url = FULL_API_URLS.ADMIN.ACCOUNT.STATUS_CHANGE.replace(':adminId', adminId.toString());
  const response = await apiFetch<AdminStatusChangeRes>(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
  return enhanceApiResponse(response);
}

/**
 * 관리자 계정 통계 조회
 */
export async function getAdminAccountStats(): Promise<ApiResponse<AdminStatsRes>> {
  const response = await apiFetch<AdminStatsRes>(FULL_API_URLS.ADMIN.ACCOUNT.STATS, {
    method: 'GET',
  });
  return enhanceApiResponse(response);
} 