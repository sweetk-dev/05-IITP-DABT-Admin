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
  hitCnt?: number;
  // 클라이언트 UX를 위한 소유 여부 표시 (민감정보(userId) 노출 없이)
  isMine?: boolean;
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
  hitCnt?: number;
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
  sort?: string; // 'createdAt-desc' | 'hit-desc'
  // 로그인 사용자의 비공개 포함 '내 문의'만 보고 싶을 때 true
  mineOnly?: boolean;
}

export type UserQnaListRes = PaginationRes<UserQnaItem>;

export interface UserQnaDetailParams {
  qnaId: string;
}


export interface UserQnaDetailRes {
  qna: UserQnaDetailItem;
}

// 삭제도 동일한 경로 파라미터 사용
export interface UserQnaDeleteParams {
  qnaId: string;
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
  status?: string;
  sort?: string; // 'createdAt-desc' | 'hit-desc'
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
  answerContent?: string;
  updatedBy?: string;
}

// 업데이트 응답은 ApiResponse<void> 사용

// Q&A 삭제 (관리자용)
// 삭제 응답은 ApiResponse<void> 사용