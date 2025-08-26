import { apiFetch, buildUrl } from './api';
import { FULL_API_URLS } from '@iitp-dabt/common';
import type { 
  AdminAccountListQuery,
  AdminAccountListRes,
  AdminAccountDetailRes,
  AdminAccountCreateReq,
  AdminAccountCreateRes,
  AdminAccountCheckEmailReq,
  AdminAccountCheckEmailRes,
  AdminAccountUpdateReq,
  AdminAccountPasswordChangeReq
} from '@iitp-dabt/common';
import type { ApiResponse } from '../types/api';

// ===== Admin Account API =====

/**
 * 관리자 계정 목록 조회
 */
export async function getAdminAccountList(params: AdminAccountListQuery): Promise<ApiResponse<AdminAccountListRes>> {
  const url = buildUrl(FULL_API_URLS.ADMIN.ADMIN_ACCOUNT.LIST, params as any);
  return apiFetch<AdminAccountListRes>(url, { method: 'GET' });
}

/**
 * 관리자 계정 상세 조회
 */
export async function getAdminAccountDetail(adminId: number): Promise<ApiResponse<AdminAccountDetailRes>> {
  const url = FULL_API_URLS.ADMIN.ADMIN_ACCOUNT.DETAIL.replace(':adminId', adminId.toString());
  return apiFetch<AdminAccountDetailRes>(url, { method: 'GET' });
}

/**
 * 관리자 계정 생성
 */
export async function createAdminAccount(params: AdminAccountCreateReq): Promise<ApiResponse<AdminAccountCreateRes>> {
  return apiFetch<AdminAccountCreateRes>(FULL_API_URLS.ADMIN.ADMIN_ACCOUNT.CREATE, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * 관리자 계정 이메일 중복 체크
 */
export async function checkAdminEmail(params: AdminAccountCheckEmailReq): Promise<ApiResponse<AdminAccountCheckEmailRes>> {
  return apiFetch<AdminAccountCheckEmailRes>(FULL_API_URLS.ADMIN.ADMIN_ACCOUNT.CHECK_EMAIL, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * 관리자 계정 수정
 */
export async function updateAdminAccount(adminId: number, params: AdminAccountUpdateReq): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.ADMIN.ADMIN_ACCOUNT.UPDATE.replace(':adminId', adminId.toString());
  return apiFetch<void>(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

/**
 * 관리자 계정 삭제
 */
export async function deleteAdminAccount(adminId: number): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.ADMIN.ADMIN_ACCOUNT.DELETE.replace(':adminId', adminId.toString());
  return apiFetch<void>(url, { method: 'DELETE' });
}

/**
 * 관리자 계정 비밀번호 변경
 */
export async function changeAdminAccountPassword(adminId: number, params: AdminAccountPasswordChangeReq): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.ADMIN.ADMIN_ACCOUNT.PASSWORD_CHANGE.replace(':adminId', adminId.toString());
  return apiFetch<void>(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}
