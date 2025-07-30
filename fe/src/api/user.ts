import { apiFetch, publicApiFetch } from './api';
import { saveLoginInfo } from '../store/user';
import { FULL_API_URLS } from '@iitp-dabt/common';
import type {
  UserLoginReq,
  UserLoginRes,
  UserLogoutReq,
  UserLogoutRes,
  UserRefreshTokenReq,
  UserRefreshTokenRes,
  UserProfileRes,
  UserProfileUpdateReq,
  UserProfileUpdateRes,
  UserPasswordChangeReq,
  UserPasswordChangeRes,
  UserRegisterReq,
  UserRegisterRes,
  UserCheckEmailReq,
  UserCheckEmailRes
} from '@iitp-dabt/common';
import type { ApiResponse } from '../types/api';
import { enhanceApiResponse } from '../utils/apiResponseHandler';

/**
 * 사용자 로그인
 */
export async function loginUser(params: UserLoginReq): Promise<ApiResponse<UserLoginRes>> {
  const response = await publicApiFetch<UserLoginRes>(FULL_API_URLS.AUTH.USER_LOGIN, {
    method: 'POST',
    body: JSON.stringify(params),
  });

  // 로그인 성공 시 토큰과 사용자 정보 저장
  if (response.success && response.data?.token && response.data?.refreshToken) {
    const userInfo = {
      userId: response.data.user.userId,
      email: params.email, // 로그인 요청에서 email 사용
      name: response.data.user.name || params.email.split('@')[0], // 이름이 없으면 이메일에서 추출
      userType: 'U' as const,
    };
    saveLoginInfo(userInfo, response.data.token, response.data.refreshToken);
  }
  return enhanceApiResponse(response);
}

/**
 * 이메일 중복 확인
 */
export async function checkEmail(email: string): Promise<ApiResponse<UserCheckEmailRes>> {
  const requestData: UserCheckEmailReq = { email };
  const response = await publicApiFetch<UserCheckEmailRes>(FULL_API_URLS.USER.CHECK_EMAIL, {
    method: 'POST',
    body: JSON.stringify(requestData),
  });
  return enhanceApiResponse(response);
}

/**
 * 사용자 회원가입
 */
export async function registerUser(params: UserRegisterReq): Promise<ApiResponse<UserRegisterRes>> {
  const response = await publicApiFetch<UserRegisterRes>(FULL_API_URLS.USER.REGISTER, {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return enhanceApiResponse(response);
}

/**
 * 사용자 토큰 갱신
 */
export async function refreshUserToken(params: UserRefreshTokenReq): Promise<ApiResponse<UserRefreshTokenRes>> {
  const response = await apiFetch<UserRefreshTokenRes>(FULL_API_URLS.AUTH.USER_REFRESH, {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return enhanceApiResponse(response);
}

/**
 * 사용자 프로필 조회
 */
export async function getUserProfile(): Promise<ApiResponse<UserProfileRes>> {
  const response = await apiFetch<UserProfileRes>(FULL_API_URLS.USER.PROFILE.GET);
  return enhanceApiResponse(response);
}

/**
 * 사용자 프로필 업데이트
 */
export async function updateUserProfile(params: UserProfileUpdateReq): Promise<ApiResponse<UserProfileUpdateRes>> {
  const response = await apiFetch<UserProfileUpdateRes>(FULL_API_URLS.USER.PROFILE.POST, {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return enhanceApiResponse(response);
}

/**
 * 사용자 비밀번호 변경
 */
export async function changeUserPassword(params: UserPasswordChangeReq): Promise<ApiResponse<UserPasswordChangeRes>> {
  const response = await apiFetch<UserPasswordChangeRes>(FULL_API_URLS.USER.PASSWORD.POST, {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return enhanceApiResponse(response);
}

/**
 * 사용자 로그아웃
 */
export async function logoutUser(params: UserLogoutReq): Promise<ApiResponse<UserLogoutRes>> {
  const response = await apiFetch<UserLogoutRes>(FULL_API_URLS.AUTH.USER_LOGOUT, {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return enhanceApiResponse(response);
} 