// API URL 상수 정의
import { ParsedQs } from 'qs';

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
      LIST: '/faq/list',
      DETAIL: '/faq/:faqId',
      HOME: '/faq/home',
    },
    QNA: {
      LIST: '/qna/list',
      DETAIL: '/qna/:qnaId',
      CREATE: '/qna',
      DELETE: '/qna/:qnaId',
      HOME: '/qna/home',
    },
    NOTICE: {
      LIST: '/notice',
      DETAIL: '/notice/:noticeId',
      HOME: '/notice/home',
    },
    OPEN_API: {
      LIST: '/openapi/keys',
      DETAIL: '/openapi/keys/:keyId',
      CREATE: '/openapi/keys',
      DELETE: '/openapi/keys/:keyId',
      EXTEND: '/openapi/keys/:keyId/extend',
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
      LIST_DELETE: '/faq/delete',
      DETAIL: '/faq/:faqId',
      CREATE: '/faq',
      UPDATE: '/faq/:faqId',
      DELETE: '/faq/:faqId',
    },
    // QnA 관리
    QNA: {
      LIST: '/qna',
      LIST_DELETE: '/qna/delete',
      DETAIL: '/qna/:qnaId',
      ANSWER: '/qna/:qnaId/answer',
      UPDATE: '/qna/:qnaId',
      DELETE: '/qna/:qnaId',
      STATUS: '/qna/status',
    },
    // 공지사항 관리
    NOTICE: {
      LIST: '/notice',
      LIST_DELETE: '/notice/delete',
      DETAIL: '/notice/:noticeId',
      CREATE: '/notice',
      UPDATE: '/notice/:noticeId',
      DELETE: '/notice/:noticeId',
    },
    // OpenAPI 인증키 관리
    OPEN_API: {
      LIST: '/openapi/keys',
      LIST_DELETE: '/openapi/keys/delete',
      DETAIL: '/openapi/keys/:keyId',
      CREATE: '/openapi/keys',
      UPDATE: '/openapi/keys/:keyId',
      DELETE: '/openapi/keys/:keyId',
      EXTEND: '/openapi/keys/:keyId/extend',
      STATUS: '/openapi/status', 
    },
    // 운영자 계정 관리 (S-Admin 전용)
    ADMIN_ACCOUNT: {
      LIST: '/accounts/admin',
      LIST_DELETE: '/accounts/admin/delete',
      DETAIL: '/accounts/admin/:adminId',
      CREATE: '/accounts/admin',
      UPDATE: '/accounts/admin/:adminId',
      DELETE: '/accounts/admin/:adminId',
      PASSWORD_CHANGE: '/accounts/admin/:adminId/password',
      ROLE_UPDATE: '/accounts/admin/:adminId/role',
      CHECK_EMAIL: '/accounts/admin/email/check',
    },
    // 사용자 계정 관리 (일반 Admin도 접근 가능)
    USER_ACCOUNT: {
      LIST: '/accounts/user',
      LIST_DELETE: '/accounts/user/delete',
      DETAIL: '/accounts/user/:userId',
      CREATE: '/accounts/user',
      UPDATE: '/accounts/user/:userId',
      DELETE: '/accounts/user/:userId',
      PASSWORD_CHANGE: '/accounts/user/:userId/password',
      STATUS_UPDATE: '/accounts/user/:userId/status',
      CHECK_EMAIL: '/accounts/user/email/check',
    },
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
    BASE: '/api/code',
    
    // 기본 조회 API
    BASIC: {
      BY_GROUP: '/:grpId',
      BY_ID: '/:grpId/:codeId',
      BY_TYPE: '/type/:codeType',
      BY_PARENT: '/:grpId/parent'
    },
    
    // 관리자용 상세 조회 API
    ADMIN: {
      BY_GROUP: '/admin/:grpId',
      BY_ID: '/admin/:grpId/:codeId',
      BY_TYPE: '/admin/type/:codeType',
      BY_PARENT: '/admin/:grpId/parent',
    },
    
    // 계층 구조 조회 API
    HIERARCHY: {
      USER: '/:grpId/hierarchy',
      ADMIN: '/admin/:grpId/hierarchy',
      CHILDREN: {
        USER: '/:grpId/children',
        ADMIN: '/admin/:grpId/children',
      },
    },
    
    // 고급 조회 API
    ADVANCED: {
      TREE: '/admin/:grpId/tree',
      PARENT: '/admin/:grpId/:codeId/parent',
      DESCENDANTS: '/admin/:grpId/:codeId/descendants',
    },
    
    // 유틸리티 API
    UTILITY: {
      LEVEL: '/admin/:grpId/level/:level',
    },
    
    // 관리자용 그룹 관리 API
    GROUP: {
      LIST: '/admin/groups',           // GET
      LIST_DELETE: '/admin/groups/delete', // POST
      CREATE: '/admin/group',          // POST
      UPDATE: '/admin/group/:grpId',  // PUT
      DELETE: '/admin/group/:grpId',  // DELETE
    },
    
    // 관리자용 코드 관리 API
    CODE: {
      LIST_DELETE: '/admin/:grpId/codes/delete', // POST
      CREATE: '/admin/:grpId/code',        // POST
      UPDATE: '/admin/:grpId/:codeId',    // PUT
      DELETE: '/admin/:grpId/:codeId',    // DELETE
    },
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
    USER: {
      LOGIN: getAuthUrl(API_URLS.AUTH.USER.LOGIN),
      LOGOUT: getAuthUrl(API_URLS.AUTH.USER.LOGOUT),
      REFRESH: getAuthUrl(API_URLS.AUTH.USER.REFRESH)
    },
    ADMIN: {
      LOGIN: getAuthUrl(API_URLS.AUTH.ADMIN.LOGIN),
      LOGOUT: getAuthUrl(API_URLS.AUTH.ADMIN.LOGOUT),
      REFRESH: getAuthUrl(API_URLS.AUTH.ADMIN.REFRESH)
    }
  },
  USER: {
    PROFILE: {
      DETAIL: getUserUrl(API_URLS.USER.PROFILE),
      UPDATE: getUserUrl(API_URLS.USER.PROFILE)
    },
    PASSWORD: {
      UPDATE: getUserUrl(API_URLS.USER.PASSWORD)
    },
    REGISTER: getUserUrl(API_URLS.USER.REGISTER),
    CHECK_EMAIL: getUserUrl(API_URLS.USER.CHECK_EMAIL),
    FAQ: {
      LIST: getUserUrl(API_URLS.USER.FAQ.LIST),
      DETAIL: getUserUrl(API_URLS.USER.FAQ.DETAIL),
      HOME: getUserUrl(API_URLS.USER.FAQ.HOME),
    },
    QNA: {
      LIST: getUserUrl(API_URLS.USER.QNA.LIST),
      DETAIL: getUserUrl(API_URLS.USER.QNA.DETAIL),
      CREATE: getUserUrl(API_URLS.USER.QNA.CREATE),
      DELETE: getUserUrl(API_URLS.USER.QNA.DELETE),
      HOME: getUserUrl(API_URLS.USER.QNA.HOME),
    },
    NOTICE: {
      LIST: getUserUrl(API_URLS.USER.NOTICE.LIST),
      DETAIL: getUserUrl(API_URLS.USER.NOTICE.DETAIL),
      HOME: getUserUrl(API_URLS.USER.NOTICE.HOME),
    },
    OPEN_API: {
      LIST: getUserUrl(API_URLS.USER.OPEN_API.LIST),
      DETAIL: getUserUrl(API_URLS.USER.OPEN_API.DETAIL),
      CREATE: getUserUrl(API_URLS.USER.OPEN_API.CREATE),
      DELETE: getUserUrl(API_URLS.USER.OPEN_API.DELETE),
      EXTEND: getUserUrl(API_URLS.USER.OPEN_API.EXTEND),
    }
  },
  ADMIN: {
    PROFILE: {
      DETAIL: getAdminUrl(API_URLS.ADMIN.PROFILE),
      UPDATE: getAdminUrl(API_URLS.ADMIN.PROFILE)
    },
    PASSWORD: {
      UPDATE: getAdminUrl(API_URLS.ADMIN.PASSWORD)
    },
    FAQ: {
      LIST: getAdminUrl(API_URLS.ADMIN.FAQ.LIST),
      LIST_DELETE: getAdminUrl(API_URLS.ADMIN.FAQ.LIST_DELETE),
      DETAIL: getAdminUrl(API_URLS.ADMIN.FAQ.DETAIL),
      CREATE: getAdminUrl(API_URLS.ADMIN.FAQ.CREATE),
      UPDATE: getAdminUrl(API_URLS.ADMIN.FAQ.UPDATE),
      DELETE: getAdminUrl(API_URLS.ADMIN.FAQ.DELETE),
    },
    QNA: {
      LIST: getAdminUrl(API_URLS.ADMIN.QNA.LIST),
      LIST_DELETE: getAdminUrl(API_URLS.ADMIN.QNA.LIST_DELETE),
      DETAIL: getAdminUrl(API_URLS.ADMIN.QNA.DETAIL),
      ANSWER: getAdminUrl(API_URLS.ADMIN.QNA.ANSWER),
      UPDATE: getAdminUrl(API_URLS.ADMIN.QNA.UPDATE),
      DELETE: getAdminUrl(API_URLS.ADMIN.QNA.DELETE),
      STATUS: getAdminUrl(API_URLS.ADMIN.QNA.STATUS),
    },
    NOTICE: {
      LIST: getAdminUrl(API_URLS.ADMIN.NOTICE.LIST),
      LIST_DELETE: getAdminUrl(API_URLS.ADMIN.NOTICE.LIST_DELETE),
      DETAIL: getAdminUrl(API_URLS.ADMIN.NOTICE.DETAIL),
      CREATE: getAdminUrl(API_URLS.ADMIN.NOTICE.CREATE),
      UPDATE: getAdminUrl(API_URLS.ADMIN.NOTICE.UPDATE),
      DELETE: getAdminUrl(API_URLS.ADMIN.NOTICE.DELETE),
    },
    OPEN_API: {
      LIST: getAdminUrl(API_URLS.ADMIN.OPEN_API.LIST),
      LIST_DELETE: getAdminUrl(API_URLS.ADMIN.OPEN_API.LIST_DELETE),
      DETAIL: getAdminUrl(API_URLS.ADMIN.OPEN_API.DETAIL),
      CREATE: getAdminUrl(API_URLS.ADMIN.OPEN_API.CREATE),
      UPDATE: getAdminUrl(API_URLS.ADMIN.OPEN_API.UPDATE),
      DELETE: getAdminUrl(API_URLS.ADMIN.OPEN_API.DELETE),
      EXTEND: getAdminUrl(API_URLS.ADMIN.OPEN_API.EXTEND),
      STATUS: getAdminUrl(API_URLS.ADMIN.OPEN_API.STATUS),
    },
    // 운영자 계정 관리 (S-Admin 전용)
    ADMIN_ACCOUNT: {
      LIST: getAdminUrl(API_URLS.ADMIN.ADMIN_ACCOUNT.LIST),
      LIST_DELETE: getAdminUrl(API_URLS.ADMIN.ADMIN_ACCOUNT.LIST_DELETE),
      DETAIL: getAdminUrl(API_URLS.ADMIN.ADMIN_ACCOUNT.DETAIL),
      CREATE: getAdminUrl(API_URLS.ADMIN.ADMIN_ACCOUNT.CREATE),
      UPDATE: getAdminUrl(API_URLS.ADMIN.ADMIN_ACCOUNT.UPDATE),
      DELETE: getAdminUrl(API_URLS.ADMIN.ADMIN_ACCOUNT.DELETE),
      PASSWORD_CHANGE: getAdminUrl(API_URLS.ADMIN.ADMIN_ACCOUNT.PASSWORD_CHANGE),
      ROLE_UPDATE: getAdminUrl(API_URLS.ADMIN.ADMIN_ACCOUNT.ROLE_UPDATE),
      CHECK_EMAIL: getAdminUrl(API_URLS.ADMIN.ADMIN_ACCOUNT.CHECK_EMAIL),
    },
    // 사용자 계정 관리 (일반 Admin도 접근 가능)
    USER_ACCOUNT: {
      LIST: getAdminUrl(API_URLS.ADMIN.USER_ACCOUNT.LIST),
      LIST_DELETE: getAdminUrl(API_URLS.ADMIN.USER_ACCOUNT.LIST_DELETE),
      DETAIL: getAdminUrl(API_URLS.ADMIN.USER_ACCOUNT.DETAIL),
      CREATE: getAdminUrl(API_URLS.ADMIN.USER_ACCOUNT.CREATE),
      UPDATE: getAdminUrl(API_URLS.ADMIN.USER_ACCOUNT.UPDATE),
      DELETE: getAdminUrl(API_URLS.ADMIN.USER_ACCOUNT.DELETE),
      PASSWORD_CHANGE: getAdminUrl(API_URLS.ADMIN.USER_ACCOUNT.PASSWORD_CHANGE),
      STATUS_UPDATE: getAdminUrl(API_URLS.ADMIN.USER_ACCOUNT.STATUS_UPDATE),
      CHECK_EMAIL: getAdminUrl(API_URLS.ADMIN.USER_ACCOUNT.CHECK_EMAIL),
    },
  },
  COMMON: {
    HEALTH_CHECK: getCommonUrl(API_URLS.COMMON.HEALTH_CHECK),
    VERSION: getCommonUrl(API_URLS.COMMON.VERSION),
    JWT_CONFIG: getCommonUrl(API_URLS.COMMON.JWT_CONFIG),
  },
  COMMON_CODE: {
    // 기본 조회 API
    BASIC: {
      BY_GROUP: getCommonCodeUrl(API_URLS.COMMON_CODE.BASIC.BY_GROUP),
      BY_ID: getCommonCodeUrl(API_URLS.COMMON_CODE.BASIC.BY_ID),
      BY_TYPE: getCommonCodeUrl(API_URLS.COMMON_CODE.BASIC.BY_TYPE),
      BY_PARENT: getCommonCodeUrl(API_URLS.COMMON_CODE.BASIC.BY_PARENT),
    },
    
    // 관리자용 상세 조회 API
    ADMIN: {
      BY_GROUP: getCommonCodeUrl(API_URLS.COMMON_CODE.ADMIN.BY_GROUP),
      BY_ID: getCommonCodeUrl(API_URLS.COMMON_CODE.ADMIN.BY_ID),
      BY_TYPE: getCommonCodeUrl(API_URLS.COMMON_CODE.ADMIN.BY_TYPE),
      BY_PARENT: getCommonCodeUrl(API_URLS.COMMON_CODE.ADMIN.BY_PARENT),
    },
    
    // 계층 구조 조회 API
    HIERARCHY: {
      USER: getCommonCodeUrl(API_URLS.COMMON_CODE.HIERARCHY.USER),
      ADMIN: getCommonCodeUrl(API_URLS.COMMON_CODE.HIERARCHY.ADMIN),
      CHILDREN: {
        USER: getCommonCodeUrl(API_URLS.COMMON_CODE.HIERARCHY.CHILDREN.USER),
        ADMIN: getCommonCodeUrl(API_URLS.COMMON_CODE.HIERARCHY.CHILDREN.ADMIN),
      },
    },
    
    // 고급 조회 API
    ADVANCED: {
      TREE: getCommonCodeUrl(API_URLS.COMMON_CODE.ADVANCED.TREE),
      PARENT: getCommonCodeUrl(API_URLS.COMMON_CODE.ADVANCED.PARENT),
      DESCENDANTS: getCommonCodeUrl(API_URLS.COMMON_CODE.ADVANCED.DESCENDANTS),
    },
    
    // 유틸리티 API
    UTILITY: {
      LEVEL: getCommonCodeUrl(API_URLS.COMMON_CODE.UTILITY.LEVEL),
    },
    
    // 관리자용 그룹 관리 API
    GROUP: {
      LIST: getCommonCodeUrl(API_URLS.COMMON_CODE.GROUP.LIST),           // GET
      LIST_DELETE: getCommonCodeUrl(API_URLS.COMMON_CODE.GROUP.LIST_DELETE), // DELETE
      CREATE: getCommonCodeUrl(API_URLS.COMMON_CODE.GROUP.CREATE),       // POST
      UPDATE: getCommonCodeUrl(API_URLS.COMMON_CODE.GROUP.UPDATE),       // PUT
      DELETE: getCommonCodeUrl(API_URLS.COMMON_CODE.GROUP.DELETE),       // DELETE
    },
    
    // 관리자용 코드 관리 API
    CODE: {
      LIST_DELETE: getCommonCodeUrl(API_URLS.COMMON_CODE.CODE.LIST_DELETE), // DELETE
      CREATE: getCommonCodeUrl(API_URLS.COMMON_CODE.CODE.CREATE),        // POST
      UPDATE: getCommonCodeUrl(API_URLS.COMMON_CODE.CODE.UPDATE),        // PUT
      DELETE: getCommonCodeUrl(API_URLS.COMMON_CODE.CODE.DELETE),        // DELETE
    },
  }
} as const;

// API 응답 기본 구조 (BE/FE 공통)
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  errorCode?: number;
  errorMessage?: string;
}

// 페이징 관련 타입
export interface PaginationReq {
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | ParsedQs | (string | ParsedQs)[] | undefined;
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