// FAQ 관련 DTO 정의
import { PaginationReq, PaginationRes } from './api';

// FAQ 엔티티
export interface Faq {
  faqId: number;
  faqType: string;
  question: string;
  answer: string;
  hitCnt: number;
  sortOrder: number;
  useYn: string;
  createdAt: string;
  updatedAt?: string;
}

// FAQ 목록 조회 (사용자용)
export interface UserFaqListReq extends PaginationReq {
  faqType?: string;
  search?: string;
}

export interface UserFaqListRes extends PaginationRes<Faq> {
  faqs: Faq[];
}

export interface UserFaqDetailReq {
  faqId: string;
}

export interface UserFaqDetailRes {
  faq: Faq;
}

// FAQ 목록 조회 (관리자용)
export interface AdminFaqListReq extends PaginationReq {
  faqType?: string;
  search?: string;
  useYn?: string;
}

export interface AdminFaqListRes extends PaginationRes<Faq> {
  faqs: Faq[];
}

export interface AdminFaqDetailReq {
  faqId: string;
}

export interface AdminFaqDetailRes {
  faq: Faq;
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
  message: string;
}

// FAQ 수정 (관리자용)
export interface AdminFaqUpdateReq {
  faqType?: string;
  question?: string;
  answer?: string;
  sortOrder?: number;
  useYn?: string;
}

export interface AdminFaqUpdateRes {
  success: boolean;
  message: string;
}

// FAQ 삭제 (관리자용)
export interface AdminFaqDeleteRes {
  success: boolean;
  message: string;
}

// FAQ 통계 (관리자용)
export interface AdminFaqStatsRes {
  totalFaqs: number;
  activeFaqs: number;
  totalHits: number;
  topFaqs: Array<{
    faqId: number;
    question: string;
    hitCnt: number;
  }>;
} 