import { jwtDecode } from 'jwt-decode';

// JWT 토큰 정보 인터페이스 (BE와 동일)
export interface TokenInfo {
  exp: number;        // 만료 시간 (timestamp)
  iat: number;        // 발급 시간 (timestamp)
  expiresIn: string;  // 만료 시간 (문자열, 예: "15m", "7d")
}

// JWT 설정 정보 (기본값, BE에서 동적으로 업데이트)
export let JWT_CONFIG = {
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
  issuer: 'iitp-dabt-api',
};

/**
 * BE에서 JWT 설정을 가져와서 업데이트
 */
export async function updateJwtConfig(): Promise<void> {
  try {
    const { getJwtConfig } = await import('../api/common');
    const config = await getJwtConfig();
    JWT_CONFIG = {
      accessTokenExpiresIn: config.accessTokenExpiresIn,
      refreshTokenExpiresIn: config.refreshTokenExpiresIn,
      issuer: config.issuer,
    };
  } catch (error) {
    console.warn('Failed to fetch JWT config from server, using defaults:', error);
  }
}

/**
 * 토큰에서 만료 시간만 추출 (BE와 동일한 로직)
 * @param token JWT 토큰
 * @returns 토큰 정보 또는 null
 */
export function extractTokenInfo(token: string): TokenInfo | null {
  try {
    const decoded = jwtDecode(token) as any;
    if (!decoded || !decoded.exp || !decoded.iat) {
      return null;
    }
    
    return {
      exp: decoded.exp,
      iat: decoded.iat,
      expiresIn: JWT_CONFIG.accessTokenExpiresIn, // 기본값으로 access token 만료 시간 반환
    };
  } catch {
    return null;
  }
}

/**
 * 토큰 만료 여부 확인 (BE와 동일한 로직)
 * @param token JWT 토큰
 * @returns 만료 여부
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode(token) as any;
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
}

/**
 * 토큰 만료까지 남은 시간 계산 (초 단위)
 * @param token JWT 토큰
 * @returns 남은 시간 (초), 만료된 경우 음수
 */
export function getTokenTimeRemaining(token: string): number {
  try {
    const decoded = jwtDecode(token) as any;
    if (!decoded || !decoded.exp) {
      return -1;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp - currentTime;
  } catch {
    return -1;
  }
}

/**
 * 토큰 발급 시간으로부터 경과 시간 계산 (초 단위)
 * @param token JWT 토큰
 * @returns 경과 시간 (초)
 */
export function getTokenAge(token: string): number {
  try {
    const decoded = jwtDecode(token) as any;
    if (!decoded || !decoded.iat) {
      return -1;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime - decoded.iat;
  } catch {
    return -1;
  }
}

/**
 * 토큰 만료 시간을 Date 객체로 반환
 * @param token JWT 토큰
 * @returns 만료 시간 Date 객체 또는 null
 */
export function getTokenExpirationDate(token: string): Date | null {
  try {
    const decoded = jwtDecode(token) as any;
    if (!decoded || !decoded.exp) {
      return null;
    }
    
    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
}

/**
 * 토큰 발급 시간을 Date 객체로 반환
 * @param token JWT 토큰
 * @returns 발급 시간 Date 객체 또는 null
 */
export function getTokenIssuedDate(token: string): Date | null {
  try {
    const decoded = jwtDecode(token) as any;
    if (!decoded || !decoded.iat) {
      return null;
    }
    
    return new Date(decoded.iat * 1000);
  } catch {
    return null;
  }
}

/**
 * 토큰 갱신이 필요한지 확인 (기본값: 만료 5분 전)
 * @param token JWT 토큰
 * @param bufferSeconds 갱신 버퍼 시간 (초, 기본값: 300초 = 5분)
 * @returns 갱신 필요 여부
 */
export function shouldRefreshToken(token: string, bufferSeconds: number = 300): boolean {
  const timeRemaining = getTokenTimeRemaining(token);
  return timeRemaining > 0 && timeRemaining <= bufferSeconds;
}

/**
 * 토큰 유효성 검사 (기본적인 형식 검사)
 * @param token JWT 토큰
 * @returns 유효성 여부
 */
export function isValidTokenFormat(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // JWT 토큰은 3개의 파트로 구성 (header.payload.signature)
  const parts = token.split('.');
  return parts.length === 3;
}

/**
 * 토큰 정보를 사람이 읽기 쉬운 형태로 반환
 * @param token JWT 토큰
 * @returns 토큰 정보 문자열
 */
export function getTokenInfoString(token: string): string {
  const info = extractTokenInfo(token);
  if (!info) {
    return '유효하지 않은 토큰';
  }
  
  const expDate = new Date(info.exp * 1000);
  const iatDate = new Date(info.iat * 1000);
  const timeRemaining = getTokenTimeRemaining(token);
  
  return `발급: ${iatDate.toLocaleString()}, 만료: ${expDate.toLocaleString()}, 남은시간: ${Math.max(0, timeRemaining)}초`;
} 