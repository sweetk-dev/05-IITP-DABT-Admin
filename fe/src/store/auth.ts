import { jwtDecode } from 'jwt-decode';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function removeTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getTokenExpireTime(token: string): number | null {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const exp = getTokenExpireTime(token);
  return exp !== null ? Date.now() > exp : true;
} 