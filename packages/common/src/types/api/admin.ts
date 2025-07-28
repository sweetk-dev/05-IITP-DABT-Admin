// Admin 계정 관리 관련 DTO 정의
import { PaginationReq, PaginationRes } from './api';

// Admin 계정 엔티티
export interface Admin {
  adminId: number;
  loginId: string;
  name: string;
  roles: string;
  affiliation?: string;
  description?: string;
  note?: string;
  status: string;
  delYn: string;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

// Admin Profile 조회
export interface AdminProfileRes {
  adminId: number;
  loginId: string;
  name: string;
  role: string;
  affiliation?: string;
  description?: string;
  status: string;
  createdAt: string;
  lastLoginAt?: string;
}

// Admin 계정 목록 조회
export interface AdminListReq extends PaginationReq {
  search?: string;
  status?: string;
  roles?: string;
}

export interface AdminListRes extends PaginationRes<Admin> {
  admins: Admin[];
}

// Admin 계정 상세 조회
export interface AdminDetailReq {
  adminId: string;
}

export interface AdminDetailRes {
  admin: Admin;
}

// Admin 계정 생성
export interface AdminCreateReq {
  loginId: string;
  password: string;
  name: string;
  roles: string;
  affiliation?: string;
  description?: string;
  note?: string;
  status?: string;
}

export interface AdminCreateRes {
  adminId: number;
  message: string;
}

// Admin 계정 이메일 중복 체크
export interface AdminCheckEmailReq {
  loginId: string;
}

export interface AdminCheckEmailRes {
  available: boolean;
  message: string;
}

// Admin 계정 수정
export interface AdminUpdateReq {
  name?: string;
  roles?: string;
  affiliation?: string;
  description?: string;
  note?: string;
  status?: string;
  updatedBy?: string;
}

export interface AdminUpdateRes {
  success: boolean;
  message: string;
}

// Admin 비밀번호 변경
export interface AdminPasswordChangeReq {
  currentPassword: string;
  newPassword: string;
}

export interface AdminPasswordChangeRes {
  success: boolean;
  message: string;
}

// Admin 계정 삭제
export interface AdminDeleteReq {
  adminId: string;
}

export interface AdminDeleteRes {
  success: boolean;
  message: string;
}

// Admin 계정 상태 변경
export interface AdminStatusChangeReq {
  status: string;
  reason?: string;
}

export interface AdminStatusChangeRes {
  success: boolean;
  message: string;
}

// Admin 계정 통계
export interface AdminStatsRes {
  totalAdmins: number;
  activeAdmins: number;
  inactiveAdmins: number;
  lockedAdmins: number;
  roleStats: Array<{
    role: string;
    count: number;
  }>;
} 