// QnA 관련 DTO 정의
import { PaginationReq, PaginationRes } from './api';

// 사용자용 Q&A 아이템 (제한된 정보만)
export interface UserQnaItem {
  qnaId: number;
  qnaType: string;
  title: string;
  content: string;
  secretYn: string;
  writerName: string;
  answeredYn: string;
  createdAt: string;
  answeredAt?: string;
}

// 관리자용 Q&A 아이템 (전체 정보)
export interface AdminQnaItem {
  qnaId: number;
  userId: number;
  qnaType: string;
  title: string;
  content: string;
  secretYn: string;
  writerName: string;
  answeredYn: string;
  createdAt: string;
  answeredAt?: string;
  answeredBy?: number;
  updatedAt?: string;
  deletedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

// Q&A 상세 (답변 포함) - 사용자용
export interface UserQnaDetailItem extends UserQnaItem {
  answerContent?: string;
}

// Q&A 상세 (답변 포함) - 관리자용
export interface AdminQnaDetailItem extends AdminQnaItem {
  answerContent?: string;
}

// Q&A 목록 조회 (사용자용)
export interface UserQnaListQuery extends PaginationReq {
  qnaType?: string;
  search?: string;
}

export type UserQnaListRes = PaginationRes<UserQnaItem>;

export interface UserQnaDetailParams {
  qnaId: string;
}

export interface UserQnaDetailRes {
  qna: UserQnaDetailItem;
}

// Q&A 생성 (사용자용)
export interface UserQnaCreateReq {
  qnaType: string;
  title: string;
  content: string;
  secretYn?: string;
  writerName?: string;
}

export interface UserQnaCreateRes {
  qnaId: number;
}

// 홈 화면용 Q&A 조회 (사용자용)
export interface UserQnaHomeRes {
  qnas: UserQnaItem[];
}

// Q&A 목록 조회 (관리자용)
export interface AdminQnaListQuery extends PaginationReq {
  search?: string;
}

export type AdminQnaListRes = PaginationRes<AdminQnaItem>;

export interface AdminQnaDetailParams {
  qnaId: string;
}

export interface AdminQnaDetailRes {
  qna: AdminQnaDetailItem;
}

// Q&A 답변 (관리자용)
export interface AdminQnaAnswerReq {
  answer: string;
  answeredBy?: string;
}

export interface AdminQnaAnswerParams {
  qnaId: string;
}

// 답변 응답은 ApiResponse<void> 사용

// Q&A 수정 (관리자용)
export interface AdminQnaUpdateReq {
  title?: string;
  content?: string;
  updatedBy?: string;
}

// 업데이트 응답은 ApiResponse<void> 사용

// Q&A 삭제 (관리자용)
// 삭제 응답은 ApiResponse<void> 사용