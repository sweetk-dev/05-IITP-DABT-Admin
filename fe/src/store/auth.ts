import { 
  isTokenExpired, 
  getTokenTimeRemaining, 
  shouldRefreshToken,
  isValidTokenFormat,
  getTokenInfoString 
} from '../utils/jwt';
import { clearLoginInfo } from './user';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * 토큰 저장
 */
export function saveTokens(accessToken: string, refreshToken: string) {
  if (!isValidTokenFormat(accessToken) || !isValidTokenFormat(refreshToken)) {
    console.warn('Invalid token format detected');
    return;
  }
  
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

/**
 * Access Token 가져오기
 */
export function getAccessToken(): string | null {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token || !isValidTokenFormat(token)) {
    return null;
  }
  return token;
}

/**
 * Refresh Token 가져오기
 */
export function getRefreshToken(): string | null {
  const token = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!token || !isValidTokenFormat(token)) {
    return null;
  }
  return token;
}

/**
 * 토큰 제거
 */
export function removeTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
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
 * 사용자 인증 상태 확인
 */
export function isAuthenticated(): boolean {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  
  // 두 토큰 모두 있어야 하고, access token이 만료되지 않았거나 refresh token이 유효해야 함
  return !!(accessToken && refreshToken && (!isTokenExpired(accessToken) || !isTokenExpired(refreshToken)));
}

/**
 * 토큰 유효성 검사 및 정리
 */
export function validateAndCleanTokens(): void {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  
  // 두 토큰 모두 만료되었으면 제거
  if (accessToken && isTokenExpired(accessToken) && 
      refreshToken && isTokenExpired(refreshToken)) {
    console.log('Both tokens expired, removing from storage');
    clearLoginInfo(); // 사용자 정보도 함께 제거
  }
  
  // 유효하지 않은 형식의 토큰 제거
  if (accessToken && !isValidTokenFormat(accessToken)) {
    console.warn('Invalid access token format, removing');
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    clearLoginInfo(); // 사용자 정보도 함께 제거
  }
  
  if (refreshToken && !isValidTokenFormat(refreshToken)) {
    console.warn('Invalid refresh token format, removing');
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    clearLoginInfo(); // 사용자 정보도 함께 제거
  }
} 