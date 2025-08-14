/**
 * FE 전체 라우트 정보 중앙 관리
 * 모든 화면 이동은 이 파일의 ROUTES 상수를 사용
 */

export const ROUTES = {
  // 공개 페이지 (로그인 불필요)
  PUBLIC: {
    HOME: '/',
    THEME_PREVIEW: '/theme-preview',
    LOGIN: '/login',
    REGISTER: '/register',
    NOTICE: '/notice',
    NOTICE_DETAIL: '/notice/:noticeId',
    FAQ: '/faq',
    QNA: '/qna',
    QNA_DETAIL: '/qna/:qnaId',
  },

  // 사용자 페이지 (로그인 필요)
  USER: {
    DASHBOARD: '/dashbd',
    PROFILE: '/profile',
    FAQ_LIST: '/user/faq',
    FAQ_DETAIL: '/user/faq/:id',
    QNA_LIST: '/user/qna',
    QNA_DETAIL: '/user/qna/:id',
    QNA_CREATE: '/user/qna/create',
    QNA_HISTORY: '/user/qna/history',
    OPEN_API_MANAGEMENT: '/user/openapi',
  },

  // 관리자 페이지 (관리자 로그인 필요)
  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashbd',
    PROFILE: '/admin/profile',
    
    // FAQ 관리
    FAQ: {
      LIST: '/admin/faqs',
      CREATE: '/admin/faqs/create',
      EDIT: '/admin/faqs/:id/edit',
      DETAIL: '/admin/faqs/:id',
    },
    
    // Q&A 관리
    QNA: {
      LIST: '/admin/qnas',
      DETAIL: '/admin/qnas/:id',
      REPLY: '/admin/qnas/:id/reply',
    },
    
    // 사용자 관리
    USERS: {
      LIST: '/admin/users',
      DETAIL: '/admin/users/:id',
      CREATE: '/admin/users/create',
      EDIT: '/admin/users/:id/edit',
    },

    // OpenAPI 관리
    OPENAPI: {
      CLIENTS: '/admin/openapi/clients',
      CLIENT_DETAIL: '/admin/openapi/clients/:id',
      REQUESTS: '/admin/openapi/requests',
      REQUEST_DETAIL: '/admin/openapi/requests/:id',
    },

    // 공지사항 관리
    NOTICES: {
      LIST: '/admin/notices',
      CREATE: '/admin/notices/create',
      DETAIL: '/admin/notices/:id',
      EDIT: '/admin/notices/:id/edit',
    },
    
    // 시스템 관리
    SETTINGS: '/admin/settings',
    LOGS: '/admin/logs',
    STATS: '/admin/stats',
  },

  // 공통 페이지
  COMMON: {
    NOT_FOUND: '/404',
    ERROR: '/error',
  },
} as const;

/**
 * 라우트 타입 정의
 */
export type RouteKey = keyof typeof ROUTES;
export type PublicRoute = typeof ROUTES.PUBLIC[keyof typeof ROUTES.PUBLIC];
export type UserRoute = typeof ROUTES.USER[keyof typeof ROUTES.USER];
export type AdminRoute = typeof ROUTES.ADMIN[keyof typeof ROUTES.ADMIN];

/**
 * 라우트 유틸리티 함수들
 */
export const RouteUtils = {
  /**
   * 동적 라우트 생성 (예: /faq/:id → /faq/123)
   */
  createDynamicRoute: (route: string, params: Record<string, string | number>): string => {
    let result = route;
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(`:${key}`, String(value));
    });
    return result;
  },

  /**
   * FAQ 상세 페이지 라우트 생성
   */
  createFaqDetailRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.USER.FAQ_DETAIL, { id });
  },

  /**
   * Q&A 상세 페이지 라우트 생성
   */
  createQnaDetailRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.USER.QNA_DETAIL, { id });
  },

  /**
   * 관리자 FAQ 편집 라우트 생성
   */
  createAdminFaqEditRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.ADMIN.FAQ.EDIT, { id });
  },

  /**
   * 관리자 Q&A 상세 라우트 생성
   */
  createAdminQnaDetailRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.ADMIN.QNA.DETAIL, { id });
  },

  /**
   * 사용자 상세 라우트 생성
   */
  createUserDetailRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.ADMIN.USERS.DETAIL, { id });
  },

  /**
   * 관리자 공지사항 편집 라우트 생성
   */
  createAdminNoticeEditRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.ADMIN.NOTICES.EDIT, { id });
  },

  /**
   * 관리자 OpenAPI 클라이언트 상세 라우트 생성
   */
  createAdminOpenApiClientDetailRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.ADMIN.OPENAPI.CLIENT_DETAIL, { id });
  },
};

/**
 * 라우트 메타데이터 (네비게이션, 권한 등에 사용)
 */
export const ROUTE_META = {
  [ROUTES.PUBLIC.HOME]: {
    title: '홈',
    requiresAuth: false,
    requiresAdmin: false,
    showInNav: true,
  },
  [ROUTES.PUBLIC.LOGIN]: {
    title: '로그인',
    requiresAuth: false,
    requiresAdmin: false,
    showInNav: false,
  },
  [ROUTES.PUBLIC.REGISTER]: {
    title: '회원가입',
    requiresAuth: false,
    requiresAdmin: false,
    showInNav: false,
  },
  [ROUTES.PUBLIC.FAQ]: {
    title: 'FAQ',
    requiresAuth: false,
    requiresAdmin: false,
    showInNav: true,
  },
  [ROUTES.PUBLIC.NOTICE]: {
    title: '공지사항',
    requiresAuth: false,
    requiresAdmin: false,
    showInNav: true,
  },
  [ROUTES.PUBLIC.NOTICE_DETAIL]: {
    title: '공지사항 상세',
    requiresAuth: false,
    requiresAdmin: false,
    showInNav: false,
  },
  [ROUTES.PUBLIC.QNA]: {
    title: 'Q&A',
    requiresAuth: false,
    requiresAdmin: false,
    showInNav: true,
  },
  [ROUTES.PUBLIC.QNA_DETAIL]: {
    title: 'Q&A 상세',
    requiresAuth: false,
    requiresAdmin: false,
    showInNav: false,
  },
  [ROUTES.USER.DASHBOARD]: {
    title: '대시보드',
    requiresAuth: true,
    requiresAdmin: false,
    showInNav: true,
  },
  [ROUTES.USER.PROFILE]: {
    title: '프로필',
    requiresAuth: true,
    requiresAdmin: false,
    showInNav: true,
  },
  [ROUTES.ADMIN.LOGIN]: {
    title: '관리자 로그인',
    requiresAuth: false,
    requiresAdmin: false,
    showInNav: false,
  },
  [ROUTES.ADMIN.DASHBOARD]: {
    title: '관리자 대시보드',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: true,
  },
  [ROUTES.ADMIN.FAQ.LIST]: {
    title: 'FAQ 관리',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: true,
  },
  [ROUTES.ADMIN.QNA.LIST]: {
    title: 'Q&A 관리',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: true,
  },
  [ROUTES.ADMIN.USERS.LIST]: {
    title: '사용자 관리',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: true,
  },
  [ROUTES.ADMIN.OPENAPI.CLIENTS]: {
    title: 'OpenAPI 클라이언트 관리',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: true,
  },
  [ROUTES.ADMIN.NOTICES.LIST]: {
    title: '공지사항 관리',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: true,
  },
  [ROUTES.ADMIN.SETTINGS]: {
    title: '시스템 설정',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: true,
  },
} as const;

/**
 * 라우트 그룹별 분류 (메뉴 구조 파악용)
 */
export const ROUTE_GROUPS = {
  PUBLIC: {
    name: '공개 페이지',
    routes: [
      { path: ROUTES.PUBLIC.HOME, title: '홈' },
      { path: ROUTES.PUBLIC.NOTICE, title: '공지사항' },
      { path: ROUTES.PUBLIC.FAQ, title: 'FAQ' },
      { path: ROUTES.PUBLIC.QNA, title: 'Q&A' },
    ],
  },
  USER: {
    name: '사용자 페이지',
    routes: [
      { path: ROUTES.USER.DASHBOARD, title: '대시보드' },
      { path: ROUTES.USER.PROFILE, title: '프로필' },
      { path: ROUTES.USER.FAQ_LIST, title: 'FAQ 목록' },
      { path: ROUTES.USER.QNA_LIST, title: 'Q&A 목록' },
    ],
  },
  ADMIN: {
    name: '관리자 페이지',
    routes: [
      { path: ROUTES.ADMIN.DASHBOARD, title: '관리자 대시보드' },
      { path: ROUTES.ADMIN.FAQ.LIST, title: 'FAQ 관리' },
      { path: ROUTES.ADMIN.QNA.LIST, title: 'Q&A 관리' },
      { path: ROUTES.ADMIN.USERS.LIST, title: '사용자 관리' },
      { path: ROUTES.ADMIN.OPENAPI.CLIENTS, title: 'OpenAPI 클라이언트 관리' },
      { path: ROUTES.ADMIN.NOTICES.LIST, title: '공지사항 관리' },
      { path: ROUTES.ADMIN.SETTINGS, title: '시스템 설정' },
    ],
  },
} as const; 