import { apiFetch, publicApiFetch } from './api';
import { saveTokens, removeTokens } from '../store/auth';
import { FULL_API_URLS } from '@iitp-dabt/common';
import type { 
  AdminLoginReq, 
  AdminLoginRes,
  AdminLogoutReq, 
  AdminLogoutRes,
  AdminRefreshTokenReq,
  AdminRefreshTokenRes,
  ApiResponse
} from '@iitp-dabt/common';

/**
 * 관리자 로그인
 */
export async function loginAdmin(params: AdminLoginReq): Promise<ApiResponse<AdminLoginRes>> {
  const response = await publicApiFetch<AdminLoginRes>(FULL_API_URLS.AUTH.ADMIN_LOGIN, {
    method: 'POST',
    body: JSON.stringify(params),
  });

  // 로그인 성공 시 토큰 저장
  if (response.success && response.data?.token && response.data?.refreshToken) {
    saveTokens(response.data.token, response.data.refreshToken);
  }

  return response;
}

/**
 * 관리자 토큰 갱신
 */
export async function refreshAdminToken(refreshToken: string): Promise<ApiResponse<AdminRefreshTokenRes>> {
  const response = await publicApiFetch<AdminRefreshTokenRes>(FULL_API_URLS.AUTH.ADMIN_REFRESH, {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  // 갱신 성공 시 토큰 저장
  if (response.success && response.data?.token) {
    saveTokens(response.data.token, refreshToken);
  }

  return response;
}

/**
 * 관리자 로그아웃
 */
export async function logoutAdmin() {
  // 서버에 로그아웃 요청
  try {
    await apiFetch<AdminLogoutRes>(FULL_API_URLS.AUTH.ADMIN_LOGOUT, { method: 'POST' });
  } catch (error) {
    console.warn('Admin logout request failed:', error);
  }
  
  // 클라이언트에서 토큰 제거
  removeTokens();
}

// TODO: Admin FAQ, QnA, Account 관리 API 함수들 추가 예정
// export async function getAdminFaqList(params: AdminFaqListReq): Promise<ApiResponse<AdminFaqListRes>> { ... }
// export async function createAdminFaq(params: AdminFaqCreateReq): Promise<ApiResponse<AdminFaqCreateRes>> { ... }
// export async function getAdminQnaList(params: AdminQnaListReq): Promise<ApiResponse<AdminQnaListRes>> { ... }
// export async function getAdminAccountList(params: AdminAccountListReq): Promise<ApiResponse<AdminAccountListRes>> { ... } 