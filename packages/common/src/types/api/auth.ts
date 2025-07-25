// Auth API Request/Response 타입 정의

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
    loginId: string;
    name: string;
    email: string;
    role: string;
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
    email: string;
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