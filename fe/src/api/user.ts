import { apiFetch, publicApiFetch } from './api';
import { saveTokens, removeTokens } from '../store/auth';
import { FULL_API_URLS } from '@iitp-dabt/common';
import type {
  UserLoginReq,
  UserLoginRes,
  UserRegisterReq,
  UserRegisterRes,
  UserCheckEmailReq,
  UserCheckEmailRes,
  UserRefreshTokenReq,
  UserRefreshTokenRes,
  UserProfileRes,
  ApiResponse
} from '@iitp-dabt/common';

/**
 * 사용자 로그인
 */
export async function loginUser(params: UserLoginReq): Promise<ApiResponse<UserLoginRes>> {
  const response = await publicApiFetch<UserLoginRes>(FULL_API_URLS.AUTH.USER_LOGIN, {
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
 * 이메일 중복 확인
 */
export async function checkEmail(email: string): Promise<ApiResponse<UserCheckEmailRes>> {
  const requestData: UserCheckEmailReq = { email };
  return publicApiFetch<UserCheckEmailRes>(FULL_API_URLS.USER.CHECK_EMAIL, {
    method: 'POST',
    body: JSON.stringify(requestData),
  });
}

/**
 * 사용자 회원가입
 */
export async function registerUser(params: UserRegisterReq): Promise<ApiResponse<UserRegisterRes>> {
  return publicApiFetch<UserRegisterRes>(FULL_API_URLS.USER.REGISTER, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * 토큰 갱신
 */
export async function refreshToken(refreshToken: string): Promise<ApiResponse<UserRefreshTokenRes>> {
  const requestData: UserRefreshTokenReq = { refreshToken };
  const response = await publicApiFetch<UserRefreshTokenRes>(FULL_API_URLS.AUTH.USER_REFRESH, {
    method: 'POST',
    body: JSON.stringify(requestData),
  });

  // 갱신 성공 시 토큰 저장
  if (response.success && response.data?.token) {
    saveTokens(response.data.token, refreshToken);
  }

  return response;
}

/**
 * 사용자 프로필 조회
 */
export async function getUserProfile(): Promise<ApiResponse<UserProfileRes>> {
  return apiFetch<UserProfileRes>(FULL_API_URLS.USER.PROFILE);
}

/**
 * 사용자 로그아웃
 */
export async function logoutUser() {
  // 서버에 로그아웃 요청
  try {
    await apiFetch(FULL_API_URLS.AUTH.USER_LOGOUT, { method: 'POST' });
  } catch (error) {
    console.warn('Logout request failed:', error);
  }
  
  // 클라이언트에서 토큰 제거
  removeTokens();
} 