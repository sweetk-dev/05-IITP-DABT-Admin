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
  AdminAccountPasswordChangeReq,
  AdminAccountRoleUpdateReq,
  UserAccountListQuery,
  UserAccountListRes,
  UserAccountDetailRes,
  UserAccountCreateReq,
  UserAccountCreateRes,
  UserAccountUpdateReq,
  UserAccountPasswordChangeReq,
  UserAccountStatusUpdateReq,
  UserAccountCheckEmailReq,
  UserAccountCheckEmailRes
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
 * 운영자 계정 일괄 삭제 (S-Admin 전용)
 */
export async function deleteAdminAccountList(adminIds: (number | string)[]): Promise<ApiResponse<void>> {
  return apiFetch<void>(FULL_API_URLS.ADMIN.ADMIN_ACCOUNT.LIST_DELETE, {
    method: 'DELETE',
    body: JSON.stringify({ adminIds }),
  });
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

/**
 * 관리자 계정 역할 업데이트
 */
export async function updateAdminAccountRole(adminId: number, params: AdminAccountRoleUpdateReq): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.ADMIN.ADMIN_ACCOUNT.ROLE_UPDATE.replace(':adminId', adminId.toString());
  return apiFetch<void>(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

// ===== User Account API =====

/**
 * 사용자 계정 목록 조회
 */
export async function getUserAccountList(params: UserAccountListQuery): Promise<ApiResponse<UserAccountListRes>> {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append('search', params.search);
  if (params.status) queryParams.append('status', params.status);
  if (params.email) queryParams.append('email', params.email);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  
  const url = `${FULL_API_URLS.ADMIN.USER_ACCOUNT.LIST}?${queryParams.toString()}`;
  return apiFetch<UserAccountListRes>(url, { method: 'GET' });
}

/**
 * 사용자 계정 상세 조회
 */
export async function getUserAccountDetail(userId: number): Promise<ApiResponse<UserAccountDetailRes>> {
  const url = FULL_API_URLS.ADMIN.USER_ACCOUNT.DETAIL.replace(':userId', userId.toString());
  return apiFetch<UserAccountDetailRes>(url, { method: 'GET' });
}

/**
 * 사용자 계정 생성
 */
export async function createUserAccount(params: UserAccountCreateReq): Promise<ApiResponse<UserAccountCreateRes>> {
  return apiFetch<UserAccountCreateRes>(FULL_API_URLS.ADMIN.USER_ACCOUNT.CREATE, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * 사용자 계정 수정
 */
export async function updateUserAccount(userId: number, params: UserAccountUpdateReq): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.ADMIN.USER_ACCOUNT.UPDATE.replace(':userId', userId.toString());
  return apiFetch<void>(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

/**
 * 사용자 계정 삭제
 */
export async function deleteUserAccount(userId: number): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.ADMIN.USER_ACCOUNT.DELETE.replace(':userId', userId.toString());
  return apiFetch<void>(url, { method: 'DELETE' });
}

/**
 * 사용자 계정 비밀번호 변경
 */
export async function changeUserAccountPassword(userId: number, params: UserAccountPasswordChangeReq): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.ADMIN.USER_ACCOUNT.PASSWORD_CHANGE.replace(':userId', userId.toString());
  return apiFetch<void>(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

/**
 * 사용자 계정 상태 업데이트
 */
export async function updateUserAccountStatus(userId: number, params: UserAccountStatusUpdateReq): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.ADMIN.USER_ACCOUNT.STATUS_UPDATE.replace(':userId', userId.toString());
  return apiFetch<void>(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

/**
 * 사용자 계정 이메일 중복 체크
 */
export async function checkUserEmail(params: UserAccountCheckEmailReq): Promise<ApiResponse<UserAccountCheckEmailRes>> {
  return apiFetch<UserAccountCheckEmailRes>(FULL_API_URLS.ADMIN.USER_ACCOUNT.CHECK_EMAIL, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * 사용자 계정 일괄 삭제
 */
export async function deleteUserAccountList(userIds: (number | string)[]): Promise<ApiResponse<void>> {
  return apiFetch<void>(FULL_API_URLS.ADMIN.USER_ACCOUNT.LIST_DELETE, {
    method: 'DELETE',
    body: JSON.stringify({ userIds }),
  });
}
