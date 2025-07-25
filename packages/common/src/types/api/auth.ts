// 인증 관련 DTO 정의

// 사용자 로그인
export interface UserLoginReq {
  email: string;
  password: string;
}

export interface UserLoginRes {
  token: string;
  userId: number;
  userType: 'U';
  email: string;
  name: string;
}

export interface UserLogoutReq {
  userId: number;
  userType: 'U';
}

export interface UserLogoutRes {
  success: boolean;
  message: string;
}

// 관리자 로그인
export interface AdminLoginReq {
  loginId: string;
  password: string;
}

export interface AdminLoginRes {
  token: string;
  userId: number;
  userType: 'A';
  loginId: string;
  name: string;
}

export interface AdminLogoutReq {
  userId: number;
  userType: 'A';
}

export interface AdminLogoutRes {
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