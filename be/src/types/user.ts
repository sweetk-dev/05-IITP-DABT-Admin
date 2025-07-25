// User API 요청/응답 타입 정의 (BE 표준)
// Java DTO 개념으로 중앙 집중식 관리

// ===== 인증 관련 =====

// UserLogin
export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  token: string;
  userId: number;
  userType: 'U';
  email: string;
  name: string;
}

// UserLogout
export interface UserLogoutRequest {
  userId: number;
  userType: 'U';
}

export interface UserLogoutResponse {
  success: boolean;
  message: string;
}

// ===== 회원 관리 =====

// UserRegister
export interface UserRegisterRequest {
  email: string;
  password: string;
  name: string;
  affiliation?: string;
}

export interface UserRegisterResponse {
  userId: number;
  email: string;
  name: string;
}

// UserCheckEmail
export interface UserCheckEmailRequest {
  email: string;
}

export interface UserCheckEmailResponse {
  isAvailable: boolean;
}

// UserProfile
export interface UserProfileResponse {
  userId: number;
  email: string;
  name: string;
  createdAt: string;
}

// ===== FAQ 관련 =====

// UserFaqList
export interface UserFaqListQuery {
  page?: number;
  limit?: number;
  faqType?: string;
  search?: string;
}

export interface UserFaqListResponse {
  faqs: Array<{
    faqId: number;
    faqType: string;
    question: string;
    answer: string;
    hitCnt: number;
    createdAt: string;
  }>;
  total: number;
  page: number;
  limit: number;
}

// UserFaqDetail
export interface UserFaqDetailParams {
  faqId: string;
}

export interface UserFaqDetailResponse {
  faq: {
    faqId: number;
    faqType: string;
    question: string;
    answer: string;
    hitCnt: number;
    createdAt: string;
    updatedAt: string;
  };
}

// ===== QnA 관련 =====

// UserQnaList
export interface UserQnaListQuery {
  page?: number;
  limit?: number;
  qnaType?: string;
}

export interface UserQnaListResponse {
  qnas: Array<{
    qnaId: number;
    qnaType: string;
    title: string;
    content: string;
    secretYn: string;
    status: string;
    createdAt: string;
    answeredAt?: string;
  }>;
  total: number;
  page: number;
  limit: number;
}

// UserQnaDetail
export interface UserQnaDetailParams {
  qnaId: string;
}

export interface UserQnaDetailResponse {
  qna: {
    qnaId: number;
    qnaType: string;
    title: string;
    content: string;
    secretYn: string;
    status: string;
    createdAt: string;
    answerContent?: string;
    answeredAt?: string;
    answeredBy?: number;
  };
}

// UserQnaCreate
export interface UserQnaCreateRequest {
  qnaType: string;
  title: string;
  content: string;
  secretYn?: string;
}

export interface UserQnaCreateResponse {
  qnaId: number;
  message: string;
} 