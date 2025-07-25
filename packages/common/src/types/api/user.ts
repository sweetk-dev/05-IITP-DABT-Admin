// User API Request/Response 타입 정의
import { PaginationReq, PaginationRes } from './api';

// 사용자 이메일 중복 체크
export interface UserCheckEmailReq {
  email: string;
}

export interface UserCheckEmailRes {
  isAvailable: boolean;
}

// 사용자 회원가입
export interface UserRegisterReq {
  email: string;
  password: string;
  name: string;
  affiliation?: string;
}

export interface UserRegisterRes {
  userId: number;
  email: string;
  name: string;
  affiliation?: string;
}

// 사용자 프로필 조회
export interface UserProfileRes {
  userId: number;
  email: string;
  name: string;
  affiliation?: string;
  createdAt: string;
} 