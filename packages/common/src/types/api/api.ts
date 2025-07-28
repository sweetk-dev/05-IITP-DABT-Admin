// API URL 상수 정의
export const API_URLS = {
  // 인증 관련
  AUTH: {
    BASE: '/api/auth',
    USER: {
      LOGIN: '/user/login',
      LOGOUT: '/user/logout',
      REFRESH: '/user/refresh',
    },
    ADMIN: {
      LOGIN: '/admin/login',
      LOGOUT: '/admin/logout',
      REFRESH: '/admin/refresh',
    }
  },
  
  // 사용자 관련
  USER: {
    BASE: '/api/user',
    PROFILE: '/profile',
    PASSWORD: '/password',
    REGISTER: '/register',
    CHECK_EMAIL: '/email/check',
    FAQ: {
      LIST: '/faq',
      DETAIL: '/faq/:faqId',
    },
    QNA: {
      LIST: '/qna',
      DETAIL: '/qna/:qnaId',
      CREATE: '/qna',
    }
  },
  
  // 관리자 관련
  ADMIN: {
    BASE: '/api/admin',
    PROFILE: '/profile',
    PASSWORD: '/password',
    // FAQ 관리
    FAQ: {
      LIST: '/faq',
      DETAIL: '/faq/:faqId',
      CREATE: '/faq',
      UPDATE: '/faq/:faqId',
      DELETE: '/faq/:faqId',
      STATS: '/faq/stats',
    },
    // QnA 관리
    QNA: {
      LIST: '/qna',
      DETAIL: '/qna/:qnaId',
      ANSWER: '/qna/:qnaId/answer',
      UPDATE: '/qna/:qnaId',
      DELETE: '/qna/:qnaId',
    },
    // Admin 계정 관리
    ACCOUNT: {
      LIST: '/accounts',
      DETAIL: '/accounts/:adminId',
      CREATE: '/accounts',
      CHECK_EMAIL: '/accounts/email/check',
      UPDATE: '/accounts/:adminId',
      DELETE: '/accounts/:adminId',
      PASSWORD_CHANGE: '/accounts/:adminId/password',
      STATUS_CHANGE: '/accounts/:adminId/status',
      STATS: '/accounts/stats',
    }
  },
  
  // 공통
  COMMON: {
    BASE: '/api/common',
    HEALTH_CHECK: '/health',
    VERSION: '/version',
    JWT_CONFIG: '/jwt-config',
  },
  
  // 공통 코드
  COMMON_CODE: {
    BASE: '/api/common-code',
    BY_GROUP: '/:grpId',
    BY_ID: '/:grpId/:codeId',
    BY_TYPE: '/type/:codeType',
    BY_PARENT: '/:grpId/parent',
    STATS: '/stats/overview',
    // 관리자용 상세 조회
    ADMIN_BY_GROUP: '/admin/:grpId',
    ADMIN_BY_ID: '/admin/:grpId/:codeId',
    ADMIN_BY_TYPE: '/admin/type/:codeType',
    ADMIN_BY_PARENT: '/admin/:grpId/parent',
  }
} as const;

// URL 조합 유틸리티 함수
export const buildUrl = (base: string, path: string): string => {
  return `${base}${path}`;
};

// API URL 조합 함수들
export const getAuthUrl = (path: string): string => buildUrl(API_URLS.AUTH.BASE, path);
export const getUserUrl = (path: string): string => buildUrl(API_URLS.USER.BASE, path);
export const getAdminUrl = (path: string): string => buildUrl(API_URLS.ADMIN.BASE, path);
export const getCommonUrl = (path: string): string => buildUrl(API_URLS.COMMON.BASE, path);
export const getCommonCodeUrl = (path: string): string => buildUrl(API_URLS.COMMON_CODE.BASE, path);

// 완전한 URL 상수들 (함수 조합으로 생성)
export const FULL_API_URLS = {
  AUTH: {
    USER_LOGIN: getAuthUrl(API_URLS.AUTH.USER.LOGIN),
    USER_LOGOUT: getAuthUrl(API_URLS.AUTH.USER.LOGOUT),
    USER_REFRESH: getAuthUrl(API_URLS.AUTH.USER.REFRESH),
    ADMIN_LOGIN: getAuthUrl(API_URLS.AUTH.ADMIN.LOGIN),
    ADMIN_LOGOUT: getAuthUrl(API_URLS.AUTH.ADMIN.LOGOUT),
    ADMIN_REFRESH: getAuthUrl(API_URLS.AUTH.ADMIN.REFRESH),
  },
  USER: {
    PROFILE: {
      GET: getUserUrl(API_URLS.USER.PROFILE),
      POST: getUserUrl(API_URLS.USER.PROFILE),
      PUT: getUserUrl(API_URLS.USER.PROFILE)
    },
    PASSWORD: {
      POST: getUserUrl(API_URLS.USER.PASSWORD),
      PUT: getUserUrl(API_URLS.USER.PASSWORD)
    },
    REGISTER: getUserUrl(API_URLS.USER.REGISTER),
    CHECK_EMAIL: getUserUrl(API_URLS.USER.CHECK_EMAIL),
    FAQ: {
      LIST: getUserUrl(API_URLS.USER.FAQ.LIST),
      DETAIL: getUserUrl(API_URLS.USER.FAQ.DETAIL),
    },
    QNA: {
      LIST: getUserUrl(API_URLS.USER.QNA.LIST),
      DETAIL: getUserUrl(API_URLS.USER.QNA.DETAIL),
      CREATE: getUserUrl(API_URLS.USER.QNA.CREATE),
    }
  },
  ADMIN: {
    PROFILE: {
      GET: getAdminUrl(API_URLS.ADMIN.PROFILE),
      POST: getAdminUrl(API_URLS.ADMIN.PROFILE),
      PUT: getAdminUrl(API_URLS.ADMIN.PROFILE)
    },
    PASSWORD: {
      POST: getAdminUrl(API_URLS.ADMIN.PASSWORD),
      PUT: getAdminUrl(API_URLS.ADMIN.PASSWORD)
    },
    FAQ: {
      LIST: getAdminUrl(API_URLS.ADMIN.FAQ.LIST),
      DETAIL: getAdminUrl(API_URLS.ADMIN.FAQ.DETAIL),
      CREATE: getAdminUrl(API_URLS.ADMIN.FAQ.CREATE),
      UPDATE: getAdminUrl(API_URLS.ADMIN.FAQ.UPDATE),
      DELETE: getAdminUrl(API_URLS.ADMIN.FAQ.DELETE),
      STATS: getAdminUrl(API_URLS.ADMIN.FAQ.STATS),
    },
    QNA: {
      LIST: getAdminUrl(API_URLS.ADMIN.QNA.LIST),
      DETAIL: getAdminUrl(API_URLS.ADMIN.QNA.DETAIL),
      ANSWER: getAdminUrl(API_URLS.ADMIN.QNA.ANSWER),
      UPDATE: getAdminUrl(API_URLS.ADMIN.QNA.UPDATE),
      DELETE: getAdminUrl(API_URLS.ADMIN.QNA.DELETE),
    },
    ACCOUNT: {
      LIST: getAdminUrl(API_URLS.ADMIN.ACCOUNT.LIST),
      DETAIL: getAdminUrl(API_URLS.ADMIN.ACCOUNT.DETAIL),
      CREATE: getAdminUrl(API_URLS.ADMIN.ACCOUNT.CREATE),
      CHECK_EMAIL: getAdminUrl(API_URLS.ADMIN.ACCOUNT.CHECK_EMAIL),
      UPDATE: getAdminUrl(API_URLS.ADMIN.ACCOUNT.UPDATE),
      DELETE: getAdminUrl(API_URLS.ADMIN.ACCOUNT.DELETE),
      PASSWORD_CHANGE: getAdminUrl(API_URLS.ADMIN.ACCOUNT.PASSWORD_CHANGE),
      STATUS_CHANGE: getAdminUrl(API_URLS.ADMIN.ACCOUNT.STATUS_CHANGE),
      STATS: getAdminUrl(API_URLS.ADMIN.ACCOUNT.STATS),
    }
  },
  COMMON: {
    HEALTH_CHECK: getCommonUrl(API_URLS.COMMON.HEALTH_CHECK),
    VERSION: getCommonUrl(API_URLS.COMMON.VERSION),
    JWT_CONFIG: getCommonUrl(API_URLS.COMMON.JWT_CONFIG),
  },
  COMMON_CODE: {
    BY_GROUP: getCommonCodeUrl(API_URLS.COMMON_CODE.BY_GROUP),
    BY_ID: getCommonCodeUrl(API_URLS.COMMON_CODE.BY_ID),
    BY_TYPE: getCommonCodeUrl(API_URLS.COMMON_CODE.BY_TYPE),
    BY_PARENT: getCommonCodeUrl(API_URLS.COMMON_CODE.BY_PARENT),
    STATS: getCommonCodeUrl(API_URLS.COMMON_CODE.STATS),
    // 관리자용 상세 조회
    ADMIN_BY_GROUP: getCommonCodeUrl(API_URLS.COMMON_CODE.ADMIN_BY_GROUP),
    ADMIN_BY_ID: getCommonCodeUrl(API_URLS.COMMON_CODE.ADMIN_BY_ID),
    ADMIN_BY_TYPE: getCommonCodeUrl(API_URLS.COMMON_CODE.ADMIN_BY_TYPE),
    ADMIN_BY_PARENT: getCommonCodeUrl(API_URLS.COMMON_CODE.ADMIN_BY_PARENT),
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