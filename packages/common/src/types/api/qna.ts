// QnA 관련 DTO 정의
import { PaginationReq, PaginationRes } from './api';

// QnA 엔티티
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
  answeredBy?: number;
}

// QnA 상세 (답변 포함)
export interface QnaDetail extends Qna {
  answerContent?: string;
}

// QnA 목록 조회 (사용자용)
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
  qna: QnaDetail;
}

// QnA 생성 (사용자용)
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

// QnA 목록 조회 (관리자용)
export interface AdminQnaListReq extends PaginationReq {
  search?: string;
}

export interface AdminQnaListRes extends PaginationRes<Qna> {
  qnas: Qna[];
}

export interface AdminQnaDetailReq {
  qnaId: string;
}

export interface AdminQnaDetailRes {
  qna: QnaDetail;
}

// QnA 답변 (관리자용)
export interface AdminQnaAnswerReq {
  answer: string;
  answeredBy?: string;
}

export interface AdminQnaAnswerRes {
  success: boolean;
  message: string;
}

// QnA 수정 (관리자용)
export interface AdminQnaUpdateReq {
  title?: string;
  content?: string;
  updatedBy?: string;
}

export interface AdminQnaUpdateRes {
  success: boolean;
  message: string;
}

// QnA 삭제 (관리자용)
export interface AdminQnaDeleteRes {
  success: boolean;
  message: string;
} 