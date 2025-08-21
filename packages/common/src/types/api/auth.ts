// Auth API Request/Response 타입 정의
import { API_URLS } from './api.js';

/**
 * AUTH API 매핑 테이블
 * API URL과 Request/Response 타입을 명시적으로 연결
 */
export const AUTH_API_MAPPING = {
  [`POST ${API_URLS.AUTH.USER.LOGIN}`]: {
    req: 'UserLoginReq',
    res: 'UserLoginRes',
    description: '사용자 로그인'
  },
  [`POST ${API_URLS.AUTH.USER.LOGOUT}`]: {
    req: 'UserLogoutReq',
    res: 'UserLogoutRes',
    description: '사용자 로그아웃'
  },
  [`POST ${API_URLS.AUTH.USER.REFRESH}`]: {
    req: 'UserRefreshTokenReq',
    res: 'UserRefreshTokenRes',
    description: '사용자 토큰 갱신'
  },
  [`POST ${API_URLS.AUTH.ADMIN.LOGIN}`]: {
    req: 'AdminLoginReq',
    res: 'AdminLoginRes',
    description: '관리자 로그인'
  },
  [`POST ${API_URLS.AUTH.ADMIN.LOGOUT}`]: {
    req: 'AdminLogoutReq',
    res: 'AdminLogoutRes',
    description: '관리자 로그아웃'
  },
  [`POST ${API_URLS.AUTH.ADMIN.REFRESH}`]: {
    req: 'AdminRefreshTokenReq',
    res: 'AdminRefreshTokenRes',
    description: '관리자 토큰 갱신'
  }
} as const;

// Admin 로그인
export interface AdminLoginReq {
  loginId: string;
  password: string;
}

export interface AdminLoginRes {
  token: string;
  refreshToken: string;
  admin: {
    adminId: number;
    name: string;
    role: string;
    roleName: string; // 역할 이름 (코드 대신)
  };
}

// Admin 토큰 갱신
export interface AdminRefreshTokenReq {
  refreshToken: string;
}

export interface AdminRefreshTokenRes {
  token: string;
  refreshToken: string;
}

// Admin 로그아웃
export interface AdminLogoutReq {
  // 현재는 파라미터 없음 (토큰으로 인증)
}

export interface AdminLogoutRes {
  success: boolean;
  message: string;
}

// User 로그인
export interface UserLoginReq {
  email: string;
  password: string;
}

export interface UserLoginRes {
  token: string;
  refreshToken: string;
  user: {
    userId: number;
    name: string;
    phone?: string;
  };
}

// User 토큰 갱신
export interface UserRefreshTokenReq {
  refreshToken: string;
}

export interface UserRefreshTokenRes {
  token: string;
  refreshToken: string;
}

// User 로그아웃
export interface UserLogoutReq {
  // 현재는 파라미터 없음 (토큰으로 인증)
}

export interface UserLogoutRes {
  success: boolean;
  message: string;
}

// 공통 인증 타입
export type UserType = 'U' | 'A';

export interface AuthUser {
  userId: number;
  userType: UserType;
  email?: string;
  loginId?: string;
  name: string;
} 