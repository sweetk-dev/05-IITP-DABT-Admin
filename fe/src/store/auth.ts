import { 
  isTokenExpired, 
  getTokenTimeRemaining, 
  shouldRefreshToken,
  isValidTokenFormat,
  getTokenInfoString 
} from '../utils/jwt';
import { clearLoginInfo, getUserType } from './user';

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
 * 일반 사용자 인증 상태 확인
 */
export function isUserAuthenticated(): boolean {
  const authenticated = isAuthenticated();
  const userType = getUserType();
  const result = authenticated && userType === 'U';
  
  return result;
}

/**
 * 관리자 인증 상태 확인
 */
export function isAdminAuthenticated(): boolean {
  const authenticated = isAuthenticated();
  const userType = getUserType();
  const result = authenticated && userType === 'A';
  return result;
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
  
  // 토큰이 없으면 null 반환
  if (!accessToken) {
    return null;
  }
  
  // Access Token이 유효하면 반환
  if (!isTokenExpired(accessToken)) {
    return accessToken;
  }
  
  // Access Token이 만료되었지만 Refresh Token이 유효하면 갱신 시도
  const refreshToken = getRefreshToken();
  if (refreshToken && !isTokenExpired(refreshToken)) {
    try {
      // TODO: 토큰 갱신 API 호출 구현
      // const response = await refreshTokenAPI(refreshToken);
      // if (response.success) {
      //   saveTokens(response.data.accessToken, response.data.refreshToken);
      //   return response.data.accessToken;
      // }
      console.warn('Token refresh not implemented yet');
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
  }
  
  // 갱신 실패 시 null 반환
  return null;
} 