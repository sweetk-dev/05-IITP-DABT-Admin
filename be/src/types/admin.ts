// Admin API 요청/응답 타입 정의 (BE 표준)
// Java DTO 개념으로 중앙 집중식 관리

// ===== 인증 관련 =====

// AdminLogin
export interface AdminLoginRequest {
  loginId: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  userId: number;
  userType: 'A';
  loginId: string;
  name: string;
}

// AdminLogout
export interface AdminLogoutRequest {
  userId: number;
  userType: 'A';
}

export interface AdminLogoutResponse {
  success: boolean;
  message: string;
}

// ===== FAQ 관리 =====

// AdminFaqList
export interface AdminFaqListQuery {
  page?: number;
  limit?: number;
  faqType?: string;
  search?: string;
}

export interface AdminFaqListResponse {
  faqs: Array<{
    faqId: number;
    faqType: string;
    question: string;
    answer: string;
    hitCnt: number;
    sortOrder: number;
    useYn: string;
    createdAt: string;
    updatedAt: string;
  }>;
  total: number;
  page: number;
  limit: number;
}

// AdminFaqDetail
export interface AdminFaqDetailParams {
  faqId: string;
}

export interface AdminFaqDetailResponse {
  faq: {
    faqId: number;
    faqType: string;
    question: string;
    answer: string;
    hitCnt: number;
    sortOrder: number;
    useYn: string;
    createdAt: string;
    updatedAt: string;
  };
}

// AdminFaqCreate
export interface AdminFaqCreateRequest {
  faqType: string;
  question: string;
  answer: string;
  sortOrder?: number;
  useYn?: string;
}

export interface AdminFaqCreateResponse {
  faqId: number;
  message: string;
}

// AdminFaqUpdate
export interface AdminFaqUpdateRequest {
  faqType?: string;
  question?: string;
  answer?: string;
  sortOrder?: number;
  useYn?: string;
}

export interface AdminFaqUpdateResponse {
  success: boolean;
  message: string;
}

// AdminFaqDelete
export interface AdminFaqDeleteResponse {
  success: boolean;
  message: string;
}

// AdminFaqStats
export interface AdminFaqStatsResponse {
  totalFaqs: number;
  activeFaqs: number;
  totalHits: number;
  topFaqs: Array<{
    faqId: number;
    question: string;
    hitCnt: number;
  }>;
}

// ===== QnA 관리 =====

// AdminQnaList
export interface AdminQnaListQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AdminQnaListResponse {
  qnas: Array<{
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
  }>;
  total: number;
  page: number;
  limit: number;
}

// AdminQnaDetail
export interface AdminQnaDetailParams {
  qnaId: string;
}

export interface AdminQnaDetailResponse {
  qna: {
    qnaId: number;
    userId: number;
    qnaType: string;
    title: string;
    content: string;
    secretYn: string;
    status: string;
    writerName: string;
    createdAt: string;
    answerContent?: string;
    answeredAt?: string;
    answeredBy?: number;
  };
}

// AdminQnaAnswer
export interface AdminQnaAnswerRequest {
  answer: string;
  answeredBy?: number;
}

export interface AdminQnaAnswerResponse {
  success: boolean;
  message: string;
}

// AdminQnaUpdate
export interface AdminQnaUpdateRequest {
  title?: string;
  content?: string;
  updatedBy?: number;
}

export interface AdminQnaUpdateResponse {
  success: boolean;
  message: string;
}

// AdminQnaDelete
export interface AdminQnaDeleteResponse {
  success: boolean;
  message: string;
} 