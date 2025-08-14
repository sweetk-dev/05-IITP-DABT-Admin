import { apiFetch, buildUrl } from './api';
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
  AdminPasswordChangeReq
} from '@iitp-dabt/common';
import type { ApiResponse } from '../types/api';

// ===== Admin Account API =====

/**
 * 관리자 계정 목록 조회
 */
export async function getAdminAccountList(params: AdminListReq): Promise<ApiResponse<AdminListRes>> {
  const url = buildUrl(FULL_API_URLS.ADMIN.ACCOUNT.LIST, params as any);
  return apiFetch<AdminListRes>(url, { method: 'GET' });
}

/**
 * 관리자 계정 상세 조회
 */
export async function getAdminAccountDetail(adminId: number): Promise<ApiResponse<AdminDetailRes>> {
  const url = FULL_API_URLS.ADMIN.ACCOUNT.DETAIL.replace(':adminId', adminId.toString());
  return apiFetch<AdminDetailRes>(url, { method: 'GET' });
}

/**
 * 관리자 계정 생성
 */
export async function createAdminAccount(params: AdminCreateReq): Promise<ApiResponse<AdminCreateRes>> {
  return apiFetch<AdminCreateRes>(FULL_API_URLS.ADMIN.ACCOUNT.CREATE, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * 관리자 계정 이메일 중복 체크
 */
export async function checkAdminEmail(params: AdminCheckEmailReq): Promise<ApiResponse<AdminCheckEmailRes>> {
  return apiFetch<AdminCheckEmailRes>(FULL_API_URLS.ADMIN.ACCOUNT.CHECK_EMAIL, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * 관리자 계정 수정
 */
export async function updateAdminAccount(adminId: number, params: AdminUpdateReq): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.ADMIN.ACCOUNT.UPDATE.replace(':adminId', adminId.toString());
  return apiFetch<void>(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

/**
 * 관리자 계정 삭제
 */
export async function deleteAdminAccount(adminId: number): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.ADMIN.ACCOUNT.DELETE.replace(':adminId', adminId.toString());
  return apiFetch<void>(url, { method: 'DELETE' });
}

/**
 * 관리자 계정 비밀번호 변경
 */
export async function changeAdminAccountPassword(adminId: number, params: AdminPasswordChangeReq): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.ADMIN.ACCOUNT.PASSWORD_CHANGE.replace(':adminId', adminId.toString());
  return apiFetch<void>(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}
