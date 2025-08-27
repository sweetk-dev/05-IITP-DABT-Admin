import { apiFetch, publicApiFetch } from './api';
import { saveLoginInfo } from '../store/user';
import { FULL_API_URLS } from '@iitp-dabt/common';
import type {
  AdminLoginReq,
  AdminLoginRes,
  AdminLogoutReq,
  AdminLogoutRes,
  AdminRefreshTokenReq,
  AdminRefreshTokenRes,
  AdminProfileRes,
  AdminProfileUpdateReq,
  // 프로필 업데이트는 void
  AdminPasswordChangeReq,
  // 비밀번호 변경은 void
} from '@iitp-dabt/common';
import type { ApiResponse } from '../types/api';
import { enhanceApiResponse } from '../utils/apiResponseHandler';

/**
 * 관리자 로그인
 */
export async function loginAdmin(params: AdminLoginReq): Promise<ApiResponse<AdminLoginRes>> {
  const response = await publicApiFetch<AdminLoginRes>(FULL_API_URLS.AUTH.ADMIN.LOGIN, {
    method: 'POST',
    body: JSON.stringify(params),
  });

  // 로그인 성공 시 토큰과 사용자 정보 저장
  if (response.success && response.data?.token && response.data?.refreshToken) {
    const userInfo = {
      userId: response.data.admin.adminId,
      email: '', // email 정보는 더 이상 제공되지 않음
      name: response.data.admin.name,
      userType: 'A' as const,
      role: response.data.admin.role,
      roleName: response.data.admin.roleName
    };
    saveLoginInfo(userInfo, response.data.token, response.data.refreshToken);
  }
  return enhanceApiResponse(response);
}

/**
 * 관리자 로그아웃
 */
export async function logoutAdmin(params: AdminLogoutReq): Promise<ApiResponse<AdminLogoutRes>> {
  const response = await apiFetch<AdminLogoutRes>(FULL_API_URLS.AUTH.ADMIN.LOGOUT, {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return enhanceApiResponse(response);
}

/**
 * 관리자 토큰 갱신
 */
export async function refreshAdminToken(params: AdminRefreshTokenReq): Promise<ApiResponse<AdminRefreshTokenRes>> {
  const response = await apiFetch<AdminRefreshTokenRes>(FULL_API_URLS.AUTH.ADMIN.REFRESH, {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return enhanceApiResponse(response);
}

/**
 * 관리자 프로필 조회
 */
export async function getAdminProfile(): Promise<ApiResponse<AdminProfileRes>> {
  return apiFetch<AdminProfileRes>(FULL_API_URLS.ADMIN.PROFILE.DETAIL, { method: 'GET' });
}

/**
 * 관리자 프로필 업데이트
 */
export async function updateAdminProfile(params: AdminProfileUpdateReq): Promise<ApiResponse<void>> {
  return apiFetch<void>(FULL_API_URLS.ADMIN.PROFILE.UPDATE, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

/**
 * 관리자 비밀번호 변경
 */
export async function changeAdminPassword(params: AdminPasswordChangeReq): Promise<ApiResponse<void>> {
  return apiFetch<void>(FULL_API_URLS.ADMIN.PASSWORD.UPDATE, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}
