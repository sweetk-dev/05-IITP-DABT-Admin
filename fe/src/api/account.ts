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
  AdminStatsRes,
  ApiResponse
} from '@iitp-dabt/common';

// ===== Admin Account API =====

/**
 * 관리자 계정 목록 조회
 */
export async function getAdminAccountList(_params: AdminListReq): Promise<ApiResponse<AdminListRes>> {
  return apiFetch<AdminListRes>(FULL_API_URLS.ADMIN.ACCOUNT_LIST, {
    method: 'GET',
    // TODO: 쿼리 파라미터 처리
  });
}

/**
 * 관리자 계정 상세 조회
 */
export async function getAdminAccountDetail(adminId: number): Promise<ApiResponse<AdminDetailRes>> {
  const url = FULL_API_URLS.ADMIN.ACCOUNT_DETAIL.replace(':adminId', adminId.toString());
  return apiFetch<AdminDetailRes>(url, {
    method: 'GET',
  });
}

/**
 * 관리자 계정 생성
 */
export async function createAdminAccount(params: AdminCreateReq): Promise<ApiResponse<AdminCreateRes>> {
  return apiFetch<AdminCreateRes>(FULL_API_URLS.ADMIN.ACCOUNT_CREATE, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * 관리자 계정 이메일 중복 확인
 */
export async function checkAdminAccountEmail(loginId: string): Promise<ApiResponse<AdminCheckEmailRes>> {
  const requestData: AdminCheckEmailReq = { loginId };
  return apiFetch<AdminCheckEmailRes>(FULL_API_URLS.ADMIN.ACCOUNT_CHECK_EMAIL, {
    method: 'POST',
    body: JSON.stringify(requestData),
  });
}

/**
 * 관리자 계정 수정
 */
export async function updateAdminAccount(adminId: number, params: AdminUpdateReq): Promise<ApiResponse<AdminUpdateRes>> {
  const url = FULL_API_URLS.ADMIN.ACCOUNT_UPDATE.replace(':adminId', adminId.toString());
  return apiFetch<AdminUpdateRes>(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

/**
 * 관리자 계정 삭제
 */
export async function deleteAdminAccount(adminId: number): Promise<ApiResponse<AdminDeleteRes>> {
  const url = FULL_API_URLS.ADMIN.ACCOUNT_DELETE.replace(':adminId', adminId.toString());
  return apiFetch<AdminDeleteRes>(url, {
    method: 'DELETE',
  });
}

/**
 * 관리자 계정 비밀번호 변경
 */
export async function changeAdminAccountPassword(adminId: number, params: AdminPasswordChangeReq): Promise<ApiResponse<AdminPasswordChangeRes>> {
  const url = FULL_API_URLS.ADMIN.ACCOUNT_PASSWORD_CHANGE.replace(':adminId', adminId.toString());
  return apiFetch<AdminPasswordChangeRes>(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

/**
 * 관리자 계정 상태 변경
 */
export async function changeAdminAccountStatus(adminId: number, params: AdminStatusChangeReq): Promise<ApiResponse<AdminStatusChangeRes>> {
  const url = FULL_API_URLS.ADMIN.ACCOUNT_STATUS_CHANGE.replace(':adminId', adminId.toString());
  return apiFetch<AdminStatusChangeRes>(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

/**
 * 관리자 계정 통계 조회
 */
export async function getAdminAccountStats(): Promise<ApiResponse<AdminStatsRes>> {
  return apiFetch<AdminStatsRes>(FULL_API_URLS.ADMIN.ACCOUNT_STATS, {
    method: 'GET',
  });
} 