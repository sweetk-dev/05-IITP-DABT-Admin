import { 
  isTokenExpired, 
  getTokenTimeRemaining, 
  shouldRefreshToken,
  isValidTokenFormat,
  getTokenInfoString 
} from '../utils/jwt';
import { clearLoginInfo, getUserType } from './user';
import { API_BASE_URL } from '../config';
import { FULL_API_URLS } from '@iitp-dabt/common';

// User/Admin 독립적 저장을 위한 prefix 상수
const USER_PREFIX = 'user_';
const ADMIN_PREFIX = 'admin_';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_INFO_KEY = 'userInfo';

/**
 * 현재 활성 사용자 타입에 맞는 prefix 자동 반환
 * user.ts의 getUserType()과 연동하여 자동 판단
 */
function getCurrentPrefix(): string {
  const userType = getUserType();
  
  // Admin이 활성화되어 있으면 Admin prefix
  if (userType === 'A') {
    return ADMIN_PREFIX;
  }
  
  // User가 활성화되어 있거나 둘 다 없으면 User prefix (기본값)
  return USER_PREFIX;
}

/**
 * 토큰 저장 (현재 사용자 타입에 맞는 prefix 사용)
 */
export function saveTokens(accessToken: string, refreshToken: string) {
  if (!isValidTokenFormat(accessToken) || !isValidTokenFormat(refreshToken)) {
    console.warn('Invalid token format detected');
    return;
  }
  
  const prefix = getCurrentPrefix();
  localStorage.setItem(prefix + ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(prefix + REFRESH_TOKEN_KEY, refreshToken);
}

/**
 * Access Token 가져오기 (현재 사용자 타입에 맞는 prefix 사용)
 */
export function getAccessToken(): string | null {
  const prefix = getCurrentPrefix();
  const token = localStorage.getItem(prefix + ACCESS_TOKEN_KEY);
  if (!token || !isValidTokenFormat(token)) {
    return null;
  }
  return token;
}

/**
 * Refresh Token 가져오기 (현재 사용자 타입에 맞는 prefix 사용)
 */
export function getRefreshToken(): string | null {
  const prefix = getCurrentPrefix();
  const token = localStorage.getItem(prefix + REFRESH_TOKEN_KEY);
  if (!token || !isValidTokenFormat(token)) {
    return null;
  }
  return token;
}

/**
 * 특정 타입의 토큰만 제거 (prefix 기반)
 */
export function removeTokens() {
  const prefix = getCurrentPrefix();
  localStorage.removeItem(prefix + ACCESS_TOKEN_KEY);
  localStorage.removeItem(prefix + REFRESH_TOKEN_KEY);
}

/**
 * 모든 사용자 타입의 토큰 제거 (완전 초기화)
 */
export function removeAllTokens() {
  // User 토큰 제거
  localStorage.removeItem(USER_PREFIX + ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_PREFIX + REFRESH_TOKEN_KEY);
  
  // Admin 토큰 제거
  localStorage.removeItem(ADMIN_PREFIX + ACCESS_TOKEN_KEY);
  localStorage.removeItem(ADMIN_PREFIX + REFRESH_TOKEN_KEY);
}

/**
 * 특정 사용자 타입의 토큰만 제거
 */
export function removeTokensByType(userType: 'U' | 'A') {
  const prefix = userType === 'A' ? ADMIN_PREFIX : USER_PREFIX;
  localStorage.removeItem(prefix + ACCESS_TOKEN_KEY);
  localStorage.removeItem(prefix + REFRESH_TOKEN_KEY);
}

/**
 * Access Token이 만료되었는지 확인
 */
export function isAccessTokenExpired(): boolean {
  const token = getAccessToken();
  return !token || isTokenExpired(token);
}

/**
 * Refresh Token이 만료되었는지 확인
 */
export function isRefreshTokenExpired(): boolean {
  const token = getRefreshToken();
  return !token || isTokenExpired(token);
}

/**
 * Access Token 갱신이 필요한지 확인 (만료 5분 전)
 */
export function shouldRefreshAccessToken(): boolean {
  const token = getAccessToken();
  return token ? shouldRefreshToken(token) : true;
}

/**
 * 토큰 만료까지 남은 시간 (초)
 */
export function getAccessTokenTimeRemaining(): number {
  const token = getAccessToken();
  return token ? getTokenTimeRemaining(token) : -1;
}

/**
 * 토큰 정보 문자열 (디버깅용)
 */
export function getAccessTokenInfo(): string {
  const token = getAccessToken();
  return token ? getTokenInfoString(token) : '토큰이 없습니다';
}

/**
 * 사용자 인증 상태 확인 (기본)
 */
export function isAuthenticated(): boolean {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  
  const result = (!!accessToken && !isTokenExpired(accessToken)) || 
                 (!!refreshToken && !isTokenExpired(refreshToken));
  
  return result;
}

/**
 * 일반 사용자 인증 상태 확인 (토큰 기반)
 */
export function isUserAuthenticated(): boolean {
  // User 토큰 직접 확인
  const userAccessToken = localStorage.getItem(USER_PREFIX + ACCESS_TOKEN_KEY);
  const userRefreshToken = localStorage.getItem(USER_PREFIX + REFRESH_TOKEN_KEY);
  
  // User 토큰이 있고 유효한지 확인
  const hasValidUserToken = (userAccessToken && !isTokenExpired(userAccessToken)) || 
                           (userRefreshToken && !isTokenExpired(userRefreshToken));
  
  // User 정보도 있는지 확인
  const userInfo = localStorage.getItem(USER_PREFIX + USER_INFO_KEY);
  const hasUserInfo = !!userInfo;
  
  return !!(hasValidUserToken && hasUserInfo);
}

/**
 * 관리자 인증 상태 확인 (토큰 기반)
 */
export function isAdminAuthenticated(): boolean {
  // Admin 토큰 직접 확인
  const adminAccessToken = localStorage.getItem(ADMIN_PREFIX + ACCESS_TOKEN_KEY);
  const adminRefreshToken = localStorage.getItem(ADMIN_PREFIX + REFRESH_TOKEN_KEY);
  
  // Admin 토큰이 있고 유효한지 확인
  const hasValidAdminToken = (adminAccessToken && !isTokenExpired(adminAccessToken)) || 
                            (adminRefreshToken && !isTokenExpired(adminRefreshToken));
  
  // Admin 정보도 있는지 확인
  const adminInfo = localStorage.getItem(ADMIN_PREFIX + USER_INFO_KEY);
  const hasAdminInfo = !!adminInfo;
  
  return !!(hasValidAdminToken && hasAdminInfo);
}

/**
 * 토큰 유효성 검사 및 정리
 */
export function validateAndCleanTokens(): void {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  
  // 토큰이 없으면 사용자 정보도 제거
  if (!accessToken && !refreshToken) {
    clearLoginInfo();
    return;
  }
  
  // 두 토큰 모두 만료되었으면 제거
  if (accessToken && isTokenExpired(accessToken) && 
      refreshToken && isTokenExpired(refreshToken)) {
    clearLoginInfo(); // 사용자 정보도 함께 제거
    return;
  }
  
  // 유효하지 않은 형식의 토큰 제거
  if (accessToken && !isValidTokenFormat(accessToken)) {
    console.warn('Invalid access token format, removing');
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    clearLoginInfo(); // 사용자 정보도 함께 제거
    return;
  }
  
  if (refreshToken && !isValidTokenFormat(refreshToken)) {
    console.warn('Invalid refresh token format, removing');
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    clearLoginInfo(); // 사용자 정보도 함께 제거
    return;
  }
}

/**
 * 토큰 상태 확인 및 갱신 (API 요청 전 호출)
 */
export async function ensureValidToken(): Promise<string | null> {
  // 토큰 유효성 검사 및 정리
  validateAndCleanTokens();
  
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  
  // 토큰이 없으면 null 반환
  if (!accessToken) {
    // Access 없음 → Refresh로 갱신 시도
    if (refreshToken && !isTokenExpired(refreshToken)) {
      const refreshed = await tryRefreshToken(refreshToken);
      return refreshed;
    }
    return null;
  }
  
  // Access Token이 유효하고 갱신 필요 없으면 그대로 사용
  if (!isTokenExpired(accessToken) && !shouldRefreshToken(accessToken)) {
    return accessToken;
  }

  // Access 만료 또는 만료 임박 → Refresh로 갱신 시도
  if (refreshToken && !isTokenExpired(refreshToken)) {
    const refreshed = await tryRefreshToken(refreshToken);
    return refreshed;
  }

  // 갱신 실패 시 null 반환
  return null;
} 

/**
 * Refresh Token으로 Access/Refresh 재발급 시도 (api.ts 의존 없이 순수 fetch 사용)
 */
async function tryRefreshToken(refreshToken: string): Promise<string | null> {
  try {
    const userType = getUserType();
    const url = userType === 'A' ? FULL_API_URLS.AUTH.ADMIN.REFRESH : FULL_API_URLS.AUTH.USER.REFRESH;
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    if (!res.ok) {
      throw new Error(`Refresh failed: ${res.status}`);
    }
    const data = await res.json();
    const newAccess = data?.data?.token || data?.token;
    const newRefresh = data?.data?.refreshToken || data?.refreshToken;
    if (newAccess && newRefresh && isValidTokenFormat(newAccess) && isValidTokenFormat(newRefresh)) {
      saveTokens(newAccess, newRefresh);
      return newAccess;
    }
    throw new Error('Invalid refresh response');
  } catch (error) {
    console.error('Token refresh failed:', error);
    removeTokens();
    clearLoginInfo();
    return null;
  }
}