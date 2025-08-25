// Admin 계정 관리 관련 DTO 정의
import { PaginationReq, PaginationRes } from './api.js';
import { ParsedQs } from 'qs';

// 운영자 계정 관련 타입 정의
export interface AdminAccount {
  adminId: number;
  loginId: string;
  name: string;
  role: string;
  roleName: string;
  affiliation?: string;
  description?: string;
  note?: string;
  status: string;
  delYn: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  lastLoginAt?: string;
  createdBy: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface AdminAccountListItem {
  adminId: number;
  loginId: string;
  name: string;
  role: string;
  roleName: string;
  status: string;
  delYn: string;
  createdAt: string;
  lastLoginAt?: string;
}


// 운영자 계정 목록 조회
export interface AdminAccountListQuery extends PaginationReq {
  search?: string;
  status?: string;
  role?: string;
  affiliation?: string;
  [key: string]: string | number | ParsedQs | (string | ParsedQs)[] | undefined;
}

export interface AdminAccountListRes extends PaginationRes<AdminAccountListItem> {
  // PaginationRes의 items를 AdminAccountListItem 오버라이드
  items: AdminAccountListItem[];
}

// 운영자 계정 상세 조회
export interface AdminAccountDetailParams {
  adminId: string;
  [key: string]: string;
}

export interface AdminAccountDetailRes {
  admin: AdminAccount;
}

// 운영자 계정 생성
export interface AdminAccountCreateReq {
  loginId: string;
  password: string;
  name: string;
  role: string;
  affiliation?: string;
  description?: string;
  note?: string;
  status?: string;
}

export interface AdminAccountCreateRes {
  adminId: number;
}

// 운영자 계정 수정
export interface AdminAccountUpdateParams {
  adminId: string;
  [key: string]: string;
}

export interface AdminAccountUpdateReq {
  name?: string;
  role?: string;
  affiliation?: string;
  description?: string;
  note?: string;
  status?: string;
}

// 운영자 계정 삭제
export interface AdminAccountDeleteParams {
  adminId: string;
  [key: string]: string;
}

// 운영자 계정 비밀번호 변경
export interface AdminAccountPasswordChangeParams {
  adminId: string;
  [key: string]: string;
}

export interface AdminAccountPasswordChangeReq {
  newPassword: string;
}

// 운영자 계정 역할 업데이트
export interface AdminAccountRoleUpdateParams {
  adminId: string;
  [key: string]: string;
}

export interface AdminAccountRoleUpdateReq {
  role: string;
  reason?: string;
}

// 운영자 계정 이메일 중복 체크
export interface AdminAccountCheckEmailReq {
  loginId: string;
}

export interface AdminAccountCheckEmailRes {
  available: boolean;
}

// 사용자 계정 관련 타입 정의
export interface UserAccount {
  userId: number;
  loginId: string;
  name: string;
  status: string;
  affiliation?: string;
  note?: string;
  latestKeyCreatedAt?: string;
  latestLoginAt?: string;
  keyCount: number;
  delYn: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  createdBy: string;
  updatedBy?: string;
  deletedBy?: string;
}


export interface UserAccountListItem {
  userId: number;
  loginId: string;
  name: string;
  status: string;
  latestKeyCreatedAt?: string;
  latestLoginAt?: string;
  keyCount: number;
  delYn: string;
  createdAt: string;
}



// 사용자 계정 목록 조회
export interface UserAccountListQuery extends PaginationReq {
  search?: string;
  status?: string;
  email?: string;
  [key: string]: string | number | ParsedQs | (string | ParsedQs)[] | undefined;
}

export interface UserAccountListRes extends PaginationRes<UserAccountListItem> {
  // PaginationRes의 items를 users로 오버라이드
  items: UserAccountListItem[];
}

// 사용자 계정 상세 조회
export interface UserAccountDetailParams {
  userId: string;
  [key: string]: string;
}

export interface UserAccountDetailRes {
  user: UserAccount;
}

// 사용자 계정 생성
export interface UserAccountCreateReq {
  loginId: string;
  password: string;
  name: string;
  affiliation?: string;
  note?: string;
  status?: string;
}

export interface UserAccountCreateRes {
  userId: number;
}

// 사용자 계정 수정
export interface UserAccountUpdateParams {
  userId: string;
  [key: string]: string;
}

export interface UserAccountUpdateReq {
  name?: string;
  status?: string;
  affiliation?: string;
  note?: string;
}

// 사용자 계정 삭제
export interface UserAccountDeleteParams {
  userId: string;
  [key: string]: string;
}

// 사용자 계정 비밀번호 변경
export interface UserAccountPasswordChangeParams {
  userId: string;
  [key: string]: string;
}

export interface UserAccountPasswordChangeReq {
  newPassword: string;
}

// 사용자 계정 상태 업데이트
export interface UserAccountStatusUpdateParams {
  userId: string;
  [key: string]: string;
}

export interface UserAccountStatusUpdateReq {
  status: string;
  reason?: string;
}

// 사용자 계정 이메일 중복 체크
export interface UserAccountCheckEmailReq {
  email: string;
}

export interface UserAccountCheckEmailRes {
  available: boolean;
}
