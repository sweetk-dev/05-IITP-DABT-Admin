// API URL 상수 정의
export const API_URLS = {
  // 인증 관련
  AUTH: {
    USER_LOGIN: '/api/auth/user/login',
    USER_LOGOUT: '/api/auth/user/logout',
    ADMIN_LOGIN: '/api/auth/admin/login',
    ADMIN_LOGOUT: '/api/auth/admin/logout',
  },
  
  // 사용자 관련
  USER: {
    PROFILE: '/api/user/profile',
    REGISTER: '/api/user/register',
    CHECK_EMAIL: '/api/user/check-email',
    FAQ_LIST: '/api/user/faq',
    FAQ_DETAIL: '/api/user/faq/:faqId',
    QNA_LIST: '/api/user/qna',
    QNA_DETAIL: '/api/user/qna/:qnaId',
    QNA_CREATE: '/api/user/qna',
  },
  
  // 관리자 관련
  ADMIN: {
    // FAQ 관리
    FAQ_LIST: '/api/admin/faq',
    FAQ_DETAIL: '/api/admin/faq/:faqId',
    FAQ_CREATE: '/api/admin/faq',
    FAQ_UPDATE: '/api/admin/faq/:faqId',
    FAQ_DELETE: '/api/admin/faq/:faqId',
    FAQ_STATS: '/api/admin/faq/stats',
    
    // QnA 관리
    QNA_LIST: '/api/admin/qna',
    QNA_DETAIL: '/api/admin/qna/:qnaId',
    QNA_ANSWER: '/api/admin/qna/:qnaId/answer',
    QNA_UPDATE: '/api/admin/qna/:qnaId',
    QNA_DELETE: '/api/admin/qna/:qnaId',
    
    // Admin 계정 관리
    ACCOUNT_LIST: '/api/admin/accounts',
    ACCOUNT_DETAIL: '/api/admin/accounts/:adminId',
    ACCOUNT_CREATE: '/api/admin/accounts',
    ACCOUNT_CHECK_EMAIL: '/api/admin/accounts/email/check',
    ACCOUNT_UPDATE: '/api/admin/accounts/:adminId',
    ACCOUNT_DELETE: '/api/admin/accounts/:adminId',
    ACCOUNT_PASSWORD_CHANGE: '/api/admin/accounts/:adminId/password',
    ACCOUNT_STATUS_CHANGE: '/api/admin/accounts/:adminId/status',
    ACCOUNT_STATS: '/api/admin/accounts/stats',
  },
  
  // 공통
  COMMON: {
    HEALTH_CHECK: '/api/common/health',
  }
} as const;

// API 응답 기본 구조
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  errorCode?: number;
  errorMessage?: string;
  showPopup?: boolean;
  redirectTo?: string;
  autoLogout?: boolean;
  details?: any;
}

// 페이징 관련 타입
export interface PaginationReq {
  page?: number;
  limit?: number;
}

export interface PaginationRes<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 검색 관련 타입
export interface SearchReq extends PaginationReq {
  search?: string;
}

// 정렬 관련 타입
export interface SortReq {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} 