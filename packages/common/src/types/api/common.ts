// Common API Request/Response 타입 정의
import { API_URLS } from './api.js';

/**
 * COMMON API 매핑 테이블
 * API URL과 Request/Response 타입을 명시적으로 연결
 */
export const COMMON_API_MAPPING = {
  [`GET ${API_URLS.COMMON.HEALTH_CHECK}`]: {
    req: 'CommonHealthReq',
    res: 'CommonHealthRes',
    description: '헬스 체크'
  },
  [`GET ${API_URLS.COMMON.VERSION}`]: {
    req: 'CommonVersionReq',
    res: 'CommonVersionRes',
    description: '버전 정보 조회'
  },
  [`GET ${API_URLS.COMMON.JWT_CONFIG}`]: {
    req: 'CommonJwtConfigReq',
    res: 'CommonJwtConfigRes',
    description: 'JWT 설정 정보 조회'
  }
} as const;

// 버전 정보 조회
export interface CommonVersionReq {
  // 현재는 파라미터 없음
}

export interface CommonVersionRes {
  version: string;
  buildDate: string;
  environment: string;
}

// VersionRes 타입 (FE 호환성)
export type VersionRes = CommonVersionRes;

// JWT 설정 정보 조회
export interface CommonJwtConfigReq {
  // 현재는 파라미터 없음
}

export interface CommonJwtConfigRes {
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
  issuer: string;
}

// JwtConfigRes 타입 (FE 호환성)
export type JwtConfigRes = CommonJwtConfigRes;

// 헬스 체크
export interface CommonHealthReq {
  // 현재는 파라미터 없음
}

export interface CommonHealthRes {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
} 