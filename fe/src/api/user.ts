import { apiFetch, publicApiFetch } from './api';
import { saveTokens, removeTokens } from '../store/auth';

export interface LoginResponse {
  result: 'ok' | 'fail';
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: number;
    userId: string;
    name: string;
    role: string;
    affiliation?: string;
    status: string;
  };
  message?: string;
}

export interface LoginApiResponse {
  result: 'ok' | 'fail';
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: number;
    userId: string;
    name: string;
    role: string;
    affiliation?: string;
    status: string;
  };
  message?: string;
}

export interface RegisterResponse {
  result: 'ok' | 'fail';
  userId?: number;
  message?: string;
}

export interface CheckEmailResponse {
  result: 'ok' | 'fail';
  exists?: boolean;
  message?: string;
}

/**
 * 사용자 로그인
 */
export async function loginUser(params: { email: string; password: string }): Promise<LoginApiResponse> {
  const response = await publicApiFetch<LoginApiResponse>('/user/login', {
    method: 'POST',
    body: JSON.stringify(params),
  });

  // 로그인 성공 시 토큰 저장
  if (response.result === 'ok' && response.data?.accessToken && response.data?.refreshToken) {
    saveTokens(response.data.accessToken, response.data.refreshToken);
  }

  return response.data || response;
}

/**
 * 이메일 중복 확인
 */
export async function checkEmail(email: string): Promise<CheckEmailResponse> {
  return publicApiFetch<CheckEmailResponse>('/user/email/check', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * 사용자 회원가입
 */
export async function registerUser(params: { 
  email: string; 
  password: string; 
  name: string; 
  affiliation?: string 
}): Promise<RegisterResponse> {
  return publicApiFetch<RegisterResponse>('/user/register', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * 토큰 갱신
 */
export async function refreshToken(refreshToken: string): Promise<LoginResponse> {
  const response = await publicApiFetch<LoginResponse>('/user/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  // 갱신 성공 시 토큰 저장
  if (response.result === 'ok' && response.accessToken) {
    saveTokens(response.accessToken, refreshToken);
  }

  return response;
}

/**
 * 사용자 프로필 조회
 */
export async function getUserProfile() {
  return apiFetch('/user/profile');
}

/**
 * 사용자 로그아웃
 */
export async function logoutUser() {
  // 서버에 로그아웃 요청 (선택사항)
  try {
    await apiFetch('/user/logout', { method: 'POST' });
  } catch (error) {
    console.warn('Logout request failed:', error);
  }
  
  // 클라이언트에서 토큰 제거
  removeTokens();
} 