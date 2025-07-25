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
}

// 사용자 프로필 조회
export interface UserProfileRes {
  userId: number;
  email: string;
  name: string;
  createdAt: string;
}

// FAQ 관련
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

// QnA 관련
export interface UserQnaListReq extends PaginationReq {
  qnaType?: string;
  search?: string;
}

export interface UserQnaListRes extends PaginationRes<Qna> {
  qnas: Qna[];
}

export interface UserQnaDetailReq {
  qnaId: string;
}

export interface UserQnaDetailRes {
  qna: Qna;
}

export interface UserQnaCreateReq {
  qnaType: string;
  title: string;
  content: string;
  secretYn?: string;
  writerName?: string;
}

export interface UserQnaCreateRes {
  qnaId: number;
  message: string;
}

// 공통 타입들
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

export interface Qna {
  qnaId: number;
  userId: number;
  qnaType: string;
  title: string;
  content: string;
  secretYn: string;
  status: string;
  writerName: string;
  createdAt: string;
  answeredAt?: string;
  answeredBy?: string;
  answerContent?: string;
} 