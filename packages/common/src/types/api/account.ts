// Admin 계정 관리 관련 DTO 정의
import { PaginationReq, PaginationRes } from './api.js';

// 운영자 계정 관련 타입 정의
export interface OperatorAccount {
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
  lastLoginAt?: string;
  createdBy: string;
  updatedBy?: string;
}

// 운영자 계정 목록 조회
export interface OperatorAccountListQuery extends PaginationReq {
  search?: string;
  status?: string;
  role?: string;
  affiliation?: string;
}

export interface OperatorAccountListRes extends PaginationRes<OperatorAccount> {
  operators: OperatorAccount[];
}

// 운영자 계정 상세 조회
export interface OperatorAccountDetailParams {
  adminId: string;
}

export interface OperatorAccountDetailRes {
  operator: OperatorAccount;
}

// 운영자 계정 생성
export interface OperatorAccountCreateReq {
  loginId: string;
  password: string;
  name: string;
  role: string;
  affiliation?: string;
  description?: string;
  note?: string;
  status?: string;
}

export interface OperatorAccountCreateRes {
  adminId: number;
}

// 운영자 계정 수정
export interface OperatorAccountUpdateParams {
  adminId: string;
}

export interface OperatorAccountUpdateReq {
  name?: string;
  role?: string;
  affiliation?: string;
  description?: string;
  note?: string;
  status?: string;
}

// 운영자 계정 삭제
export interface OperatorAccountDeleteParams {
  adminId: string;
}

// 운영자 계정 비밀번호 변경
export interface OperatorAccountPasswordChangeParams {
  adminId: string;
}

export interface OperatorAccountPasswordChangeReq {
  newPassword: string;
}

// 운영자 계정 역할 업데이트
export interface OperatorAccountRoleUpdateParams {
  adminId: string;
}

export interface OperatorAccountRoleUpdateReq {
  role: string;
  reason?: string;
}

// 운영자 계정 이메일 중복 체크
export interface OperatorAccountCheckEmailReq {
  loginId: string;
}

export interface OperatorAccountCheckEmailRes {
  available: boolean;
}

// 사용자 계정 관련 타입 정의
export interface UserAccount {
  userId: number;
  loginId: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  delYn: string;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
  openApiKeyCount: number;
  createdBy: string;
  updatedBy?: string;
}

// 사용자 계정 목록 조회
export interface UserAccountListQuery extends PaginationReq {
  search?: string;
  status?: string;
  email?: string;
  phone?: string;
}

export interface UserAccountListRes extends PaginationRes<UserAccount> {
  users: UserAccount[];
}

// 사용자 계정 상세 조회
export interface UserAccountDetailParams {
  userId: string;
}

export interface UserAccountDetailRes {
  user: UserAccount;
}

// 사용자 계정 생성
export interface UserAccountCreateReq {
  loginId: string;
  password: string;
  name: string;
  email: string;
  phone?: string;
  status?: string;
}

export interface UserAccountCreateRes {
  userId: number;
}

// 사용자 계정 수정
export interface UserAccountUpdateParams {
  userId: string;
}

export interface UserAccountUpdateReq {
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
}

// 사용자 계정 삭제
export interface UserAccountDeleteParams {
  userId: string;
}

// 사용자 계정 비밀번호 변경
export interface UserAccountPasswordChangeParams {
  userId: string;
}

export interface UserAccountPasswordChangeReq {
  newPassword: string;
}

// 사용자 계정 상태 업데이트
export interface UserAccountStatusUpdateParams {
  userId: string;
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

// 하위 호환성을 위한 별칭 (기존 코드와의 호환성 유지)
export type AdminOperatorAccount = OperatorAccount;
export type AdminUserAccount = UserAccount;
export type AdminOperatorAccountListQuery = OperatorAccountListQuery;
export type AdminOperatorAccountListRes = OperatorAccountListRes;
export type AdminOperatorAccountDetailParams = OperatorAccountDetailParams;
export type AdminOperatorAccountDetailRes = OperatorAccountDetailRes;
export type AdminOperatorAccountCreateReq = OperatorAccountCreateReq;
export type AdminOperatorAccountCreateRes = OperatorAccountCreateRes;
export type AdminOperatorAccountUpdateParams = OperatorAccountUpdateParams;
export type AdminOperatorAccountUpdateReq = OperatorAccountUpdateReq;
export type AdminOperatorAccountDeleteParams = OperatorAccountDeleteParams;
export type AdminOperatorAccountPasswordChangeParams = OperatorAccountPasswordChangeParams;
export type AdminOperatorAccountPasswordChangeReq = OperatorAccountPasswordChangeReq;
export type AdminOperatorAccountRoleUpdateParams = OperatorAccountRoleUpdateParams;
export type AdminOperatorAccountRoleUpdateReq = OperatorAccountRoleUpdateReq;
export type AdminOperatorAccountCheckEmailReq = OperatorAccountCheckEmailReq;
export type AdminOperatorAccountCheckEmailRes = OperatorAccountCheckEmailRes;
export type AdminUserAccountListQuery = UserAccountListQuery;
export type AdminUserAccountListRes = UserAccountListRes;
export type AdminUserAccountDetailParams = UserAccountDetailParams;
export type AdminUserAccountDetailRes = UserAccountDetailRes;
export type AdminUserAccountCreateReq = UserAccountCreateReq;
export type AdminUserAccountCreateRes = UserAccountCreateRes;
export type AdminUserAccountUpdateParams = UserAccountUpdateParams;
export type AdminUserAccountUpdateReq = UserAccountUpdateReq;
export type AdminUserAccountDeleteParams = UserAccountDeleteParams;
export type AdminUserAccountPasswordChangeParams = UserAccountPasswordChangeParams;
export type AdminUserAccountPasswordChangeReq = UserAccountPasswordChangeReq;
export type AdminUserAccountStatusUpdateParams = UserAccountStatusUpdateParams;
export type AdminUserAccountStatusUpdateReq = UserAccountStatusUpdateReq;
export type AdminUserAccountCheckEmailReq = UserAccountCheckEmailReq;
export type AdminUserAccountCheckEmailRes = UserAccountCheckEmailRes;
