import jwt, { JwtPayload } from 'jsonwebtoken';
import { getDecryptedEnv } from './decrypt';

// 환경 변수에서 JWT 설정 로드 (암호화된 환경변수 지원)
const JWT_SECRET = getDecryptedEnv('JWT_SECRET') || process.env.JWT_SECRET || '';
const ACCESS_TOKEN_EXPIRES_IN = getDecryptedEnv('ACCESS_TOKEN_EXPIRES_IN') || process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = getDecryptedEnv('REFRESH_TOKEN_EXPIRES_IN') || process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
const ISSUER = getDecryptedEnv('JWT_ISSUER') || process.env.JWT_ISSUER || 'iitp-dabt-api';
const ALGORITHM: jwt.Algorithm = 'HS256';

// JWT 토큰 페이로드 인터페이스
export interface TokenPayload {
  userId: number;     // 사용자 ID
  userType: 'U' | 'A'; // 사용자 타입 (User/Admin)
  email?: string;     // 이메일 (User용)
  loginId?: string;   // 로그인 ID (Admin용)
  role?: string;      // 역할 코드 (Admin용)
  exp?: number;       // 만료 시간 (FE에서 접근 가능)
  iat?: number;       // 발급 시간 (FE에서 접근 가능)
}

// JWT 토큰 정보 인터페이스 (FE에서 접근 가능한 정보만)
export interface TokenInfo {
  exp: number;        // 만료 시간 (timestamp)
  iat: number;        // 발급 시간 (timestamp)
  expiresIn: string;  // 만료 시간 (문자열, 예: "15m", "7d")
}

// JWT 설정 정보 (FE에서 접근 가능)
export const JWT_CONFIG = {
  accessTokenExpiresIn: ACCESS_TOKEN_EXPIRES_IN,
  refreshTokenExpiresIn: REFRESH_TOKEN_EXPIRES_IN,
  issuer: ISSUER,
} as const;

/**
 * Access Token 생성
 * @param payload 토큰 페이로드
 * @returns JWT 토큰 문자열
 */
export function generateAccessToken(payload: Omit<TokenPayload, 'exp' | 'iat'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN as any,
    issuer: ISSUER,
    algorithm: ALGORITHM,
  });
}

/**
 * Refresh Token 생성
 * @param payload 토큰 페이로드
 * @returns JWT 토큰 문자열
 */
export function generateRefreshToken(payload: Omit<TokenPayload, 'exp' | 'iat'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN as any,
    issuer: ISSUER,
    algorithm: ALGORITHM,
  });
}

/**
 * 토큰 검증 및 페이로드 반환
 * @param token JWT 토큰
 * @returns 검증된 페이로드 또는 null
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: [ALGORITHM],
      issuer: ISSUER,
      clockTolerance: 5, // seconds
    }) as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * 토큰 디코딩 (검증 없이)
 * @param token JWT 토큰
 * @returns 디코딩된 페이로드 또는 null
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * 토큰에서 만료 시간만 추출 (FE에서 사용)
 * @param token JWT 토큰
 * @returns 토큰 정보 또는 null
 */
export function extractTokenInfo(token: string): TokenInfo | null {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    if (!decoded || !decoded.exp || !decoded.iat) {
      return null;
    }
    
    return {
      exp: decoded.exp,
      iat: decoded.iat,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN, // 기본값으로 access token 만료 시간 반환
    };
  } catch {
    return null;
  }
}

/**
 * 토큰 만료 여부 확인 (FE에서 사용)
 * @param token JWT 토큰
 * @returns 만료 여부
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
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
    const decoded = jwt.decode(token) as JwtPayload;
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
    const decoded = jwt.decode(token) as JwtPayload;
    if (!decoded || !decoded.iat) {
      return -1;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime - decoded.iat;
  } catch {
    return -1;
  }
} 