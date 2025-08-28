// FAQ 관련 DTO 정의
import { PaginationReq, PaginationRes } from './api';

// 사용자용 FAQ 아이템 (제한된 정보만)
export interface UserFaqItem {
  faqId: number;
  faqType: string;
  question: string;
  answer: string;
  hitCnt: number;
  sortOrder: number;
}

// 관리자용 FAQ 아이템 (전체 정보)
export interface AdminFaqItem {
  faqId: number;
  faqType: string;
  question: string;
  answer: string;
  hitCnt: number;
  sortOrder: number;
  useYn: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}


export interface AdminFaqListItem {
  faqId: number;
  faqType: string;
  question: string;
  hitCnt: number;
  sortOrder: number;
  useYn: string;
  createdAt: string;
}


// FAQ 목록 조회 (사용자용)
export interface UserFaqListQuery extends PaginationReq {
  faqType?: string;
  search?: string;
}

export type UserFaqListRes = PaginationRes<UserFaqItem>;

export interface UserFaqDetailParams {
  faqId: string;
}

export interface UserFaqDetailRes {
  faq: UserFaqItem;
}

// 홈 화면용 FAQ 조회 (사용자용)
export interface UserFaqHomeRes {
  faqs: UserFaqItem[];
}

// FAQ 목록 조회 (관리자용)
export interface AdminFaqListQuery extends PaginationReq {
  faqType?: string;
  search?: string;
  useYn?: string;
}

export type AdminFaqListRes = PaginationRes<AdminFaqListItem>;


// FAQ 목록 일괄 삭제 (관리자용)
export interface AdminFaqListDeleteReq {
  faqIds: number[]; 
}
// AdminFaqListDeleteRes는 ApiResponse<void> 사용

export interface AdminFaqDetailParams {
  faqId: string;
}

export interface AdminFaqDetailRes {
  faq: AdminFaqItem;
}

// FAQ 생성 (관리자용)
export interface AdminFaqCreateReq {
  faqType: string;
  question: string;
  answer: string;
  sortOrder?: number;
  useYn?: string;
}

export interface AdminFaqCreateRes {
  faqId: number;
}

// FAQ 수정 (관리자용)
export interface AdminFaqUpdateReq {
  faqType?: string;
  question?: string;
  answer?: string;
  sortOrder?: number;
  useYn?: string;
}

// 업데이트 응답은 ApiResponse<void> 사용

// FAQ 삭제 (관리자용)
// 삭제 응답은 ApiResponse<void> 사용

