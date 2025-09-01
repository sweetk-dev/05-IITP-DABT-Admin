/**
 * FE 전체 라우트 정보 중앙 관리
 * 모든 화면 이동은 이 파일의 ROUTES 상수를 사용
 */

export const ROUTES = {
  // 공개 페이지 (로그인 불필요)
  PUBLIC: {
    HOME: '/',
    THEME_PREVIEW: '/theme-preview',
    NOTICE: '/notice',
    NOTICE_DETAIL: '/notice/:noticeId',
    FAQ: '/faq',
    QNA: '/qna',
    QNA_DETAIL: '/qna/:qnaId',
    // 공개 정적 페이지
    ABOUT: '/about',
    TERMS: '/terms',
    PRIVACY: '/privacy',
    LOGIN: '/login',
    REGISTER: '/register',
  },

  // 사용자 페이지 (로그인 필요)
  USER: {
    DASHBOARD: '/dashbd',
    PROFILE: '/profile',
    LOGIN: '/login',
    REGISTER: '/register',
    FAQ_LIST: '/user/faq',
    FAQ_DETAIL: '/user/faq/:id',
    QNA_LIST: '/user/qna',
    QNA_DETAIL: '/user/qna/:id',
    QNA_CREATE: '/user/qna/create',
    QNA_HISTORY: '/user/qna/history',
    OPEN_API_MANAGEMENT: '/user/openapi',
    NOTICE_LIST: '/user/notice',
    NOTICE_DETAIL: '/user/notice/:id',
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
      CREATE: '/admin/qnas/create',
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
      CLIENT_EDIT: '/admin/openapi/clients/:id/edit',
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

    // 운영자 관리 (S-Admin 전용)
    OPERATORS: {
      LIST: '/admin/operators',
      CREATE: '/admin/operators/create',
      DETAIL: '/admin/operators/:id',
      EDIT: '/admin/operators/:id/edit',
    },

    // 관리자 계정 관리
    ACCOUNT: {
      LIST: '/admin/account',
      DETAIL: '/admin/account/:adminId',
      CREATE: '/admin/account/create',
      UPDATE: '/admin/account/:adminId/edit',
      DELETE: '/admin/account/:adminId/delete',
      CHECK_EMAIL: '/admin/account/check-email',
      PASSWORD_CHANGE: '/admin/account/:adminId/password',
    },

    // 코드 관리 (S-Admin 전용)
    CODE: {
      LIST: '/admin/code',
      GROUP_DETAIL: '/admin/code/group/:groupId',
      CREATE: '/admin/code/create',
      DETAIL: '/admin/code/:id',
      EDIT: '/admin/code/:id/edit',
    },
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
   * 관리자 FAQ 생성 라우트 생성
   */
  createAdminFaqCreateRoute: (): string => {
    return ROUTES.ADMIN.FAQ.CREATE;
  },

  /**
   * 관리자 FAQ 상세 라우트 생성
   */
  createAdminFaqDetailRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.ADMIN.FAQ.DETAIL, { id });
  },

  /**
   * 관리자 Q&A 상세 라우트 생성
   */
  createAdminQnaDetailRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.ADMIN.QNA.DETAIL, { id });
  },

  /**
   * 관리자 Q&A 생성 라우트 생성
   */
  createAdminQnaCreateRoute: (): string => {
    return ROUTES.ADMIN.QNA.CREATE;
  },

  /**
   * 관리자 Q&A 답변 라우트 생성
   */
  createAdminQnaReplyRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.ADMIN.QNA.REPLY, { id });
  },

  /**
   * 사용자 상세 라우트 생성
   */
  createUserDetailRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.ADMIN.USERS.DETAIL, { id });
  },

  /**
   * 관리자 사용자 생성 라우트 생성
   */
  createAdminUserCreateRoute: (): string => {
    return ROUTES.ADMIN.USERS.CREATE;
  },

  /**
   * 관리자 사용자 편집 라우트 생성
   */
  createAdminUserEditRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.ADMIN.USERS.EDIT, { id });
  },

  /**
   * 관리자 공지사항 편집 라우트 생성
   */
  createAdminNoticeEditRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.ADMIN.NOTICES.EDIT, { id });
  },

  /**
   * 관리자 공지사항 생성 라우트 생성
   */
  createAdminNoticeCreateRoute: (): string => {
    return ROUTES.ADMIN.NOTICES.CREATE;
  },

  /**
   * 관리자 공지사항 상세 라우트 생성
   */
  createAdminNoticeDetailRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.ADMIN.NOTICES.DETAIL, { id });
  },

  /**
   * 관리자 OpenAPI 클라이언트 상세 라우트 생성
   */
  createAdminOpenApiClientDetailRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.ADMIN.OPENAPI.CLIENT_DETAIL, { id });
  },

  /**
   * 관리자 OpenAPI 클라이언트 편집 라우트 생성
   */
  createAdminOpenApiClientEditRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.ADMIN.OPENAPI.CLIENT_EDIT, { id });
  },

  /**
   * 관리자 OpenAPI 요청 상세 라우트 생성
   */
  createAdminOpenApiRequestDetailRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.ADMIN.OPENAPI.REQUEST_DETAIL, { id });
  },

  /**
   * 관리자 운영자 편집 라우트 생성
   */
  createAdminOperatorEditRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.ADMIN.OPERATORS.EDIT, { id });
  },

  /**
   * 관리자 운영자 생성 라우트 생성
   */
  createAdminOperatorCreateRoute: (): string => {
    return ROUTES.ADMIN.OPERATORS.CREATE;
  },

  /**
   * 관리자 운영자 상세 라우트 생성
   */
  createAdminOperatorDetailRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.ADMIN.OPERATORS.DETAIL, { id });
  },

  /**
   * 관리자 코드 생성 라우트 생성
   */
  createAdminCodeCreateRoute: (): string => {
    return ROUTES.ADMIN.CODE.CREATE;
  },

  /**
   * 관리자 코드 상세 라우트 생성
   */
  createAdminCodeDetailRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.ADMIN.CODE.DETAIL, { id });
  },

  /**
   * 관리자 코드 편집 라우트 생성
   */
  createAdminCodeEditRoute: (id: string | number): string => {
    return RouteUtils.createDynamicRoute(ROUTES.ADMIN.CODE.EDIT, { id });
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
  [ROUTES.USER.LOGIN]: {
    title: '사용자 로그인',
    requiresAuth: false,
    requiresAdmin: false,
    showInNav: false,
  },
  [ROUTES.USER.REGISTER]: {
    title: '사용자 등록',
    requiresAuth: false,
    requiresAdmin: false,
    showInNav: false,
  },
  [ROUTES.PUBLIC.ABOUT]: {
    title: 'OpenAPI센터 소개',
    requiresAuth: false,
    requiresAdmin: false,
    showInNav: false,
  },
  [ROUTES.PUBLIC.TERMS]: {
    title: '이용약관',
    requiresAuth: false,
    requiresAdmin: false,
    showInNav: false,
  },
  [ROUTES.PUBLIC.PRIVACY]: {
    title: '개인정보처리방침',
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
  [ROUTES.ADMIN.PROFILE]: {
    title: '관리자 프로필',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: false,
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
    title: 'OpenAPI 인증 키 관리',
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
  [ROUTES.ADMIN.OPERATORS.LIST]: {
    title: '운영자 관리',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: true,
  },
  [ROUTES.ADMIN.CODE.LIST]: {
    title: '코드 관리',
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
  // FAQ 관련
  [ROUTES.ADMIN.FAQ.CREATE]: {
    title: 'FAQ 생성',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: false,
  },
  [ROUTES.ADMIN.FAQ.EDIT]: {
    title: 'FAQ 편집',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: false,
  },
  [ROUTES.ADMIN.FAQ.DETAIL]: {
    title: 'FAQ 상세',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: false,
  },
  // Q&A 관련
  [ROUTES.ADMIN.QNA.DETAIL]: {
    title: 'Q&A 상세',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: false,
  },
  [ROUTES.ADMIN.QNA.REPLY]: {
    title: 'Q&A 답변',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: false,
  },
  // 사용자 관련
  [ROUTES.ADMIN.USERS.CREATE]: {
    title: '사용자 생성',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: false,
  },
  [ROUTES.ADMIN.USERS.EDIT]: {
    title: '사용자 편집',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: false,
  },
  [ROUTES.ADMIN.USERS.DETAIL]: {
    title: '사용자 상세',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: false,
  },
  // OpenAPI 관련
  [ROUTES.ADMIN.OPENAPI.CLIENT_DETAIL]: {
    title: 'OpenAPI 클라이언트 상세',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: false,
  },
  [ROUTES.ADMIN.OPENAPI.REQUESTS]: {
    title: 'OpenAPI 요청 관리',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: true,
  },
  [ROUTES.ADMIN.OPENAPI.REQUEST_DETAIL]: {
    title: 'OpenAPI 요청 상세',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: false,
  },
  // 공지사항 관련
  [ROUTES.ADMIN.NOTICES.CREATE]: {
    title: '공지사항 생성',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: false,
  },
  [ROUTES.ADMIN.NOTICES.EDIT]: {
    title: '공지사항 편집',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: false,
  },
  [ROUTES.ADMIN.NOTICES.DETAIL]: {
    title: '공지사항 상세',
    requiresAuth: true,
    requiresAdmin: true,
    showInNav: false,
  },
           // 운영자 관련
    [ROUTES.ADMIN.OPERATORS.CREATE]: {
      title: '운영자 생성',
      requiresAuth: true,
      requiresAdmin: true,
      showInNav: false,
    },
    [ROUTES.ADMIN.OPERATORS.DETAIL]: {
      title: '운영자 상세',
      requiresAuth: true,
      requiresAdmin: true,
      showInNav: false,
    },
    [ROUTES.ADMIN.OPERATORS.EDIT]: {
      title: '운영자 편집',
      requiresAuth: true,
      requiresAdmin: true,
      showInNav: false,
    },

   // 코드 관련
   [ROUTES.ADMIN.CODE.CREATE]: {
     title: '코드 생성',
     requiresAuth: true,
     requiresAdmin: true,
     showInNav: false,
   },
   [ROUTES.ADMIN.CODE.DETAIL]: {
     title: '코드 상세',
     requiresAuth: true,
     requiresAdmin: true,
     showInNav: false,
   },
   [ROUTES.ADMIN.CODE.EDIT]: {
     title: '코드 편집',
     requiresAuth: true,
     requiresAdmin: true,
     showInNav: false,
   },
  // 사용자 페이지 관련
  [ROUTES.USER.FAQ_DETAIL]: {
    title: 'FAQ 상세',
    requiresAuth: true,
    requiresAdmin: false,
    showInNav: false,
  },
  [ROUTES.USER.QNA_DETAIL]: {
    title: 'Q&A 상세',
    requiresAuth: true,
    requiresAdmin: false,
    showInNav: false,
  },
  [ROUTES.USER.QNA_CREATE]: {
    title: 'Q&A 작성',
    requiresAuth: true,
    requiresAdmin: false,
    showInNav: false,
  },
  [ROUTES.USER.QNA_HISTORY]: {
    title: 'Q&A 이력',
    requiresAuth: true,
    requiresAdmin: false,
    showInNav: true,
  },
  [ROUTES.USER.OPEN_API_MANAGEMENT]: {
    title: 'OpenAPI 관리',
    requiresAuth: true,
    requiresAdmin: false,
    showInNav: true,
  },
  [ROUTES.USER.NOTICE_LIST]: {
    title: '공지사항 목록',
    requiresAuth: true,
    requiresAdmin: false,
    showInNav: true,
  },
  [ROUTES.USER.NOTICE_DETAIL]: {
    title: '공지사항 상세',
    requiresAuth: true,
    requiresAdmin: false,
    showInNav: false,
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
      { path: ROUTES.USER.FAQ_DETAIL, title: 'FAQ 상세' },
      { path: ROUTES.USER.QNA_LIST, title: 'Q&A 목록' },
      { path: ROUTES.USER.QNA_DETAIL, title: 'Q&A 상세' },
      { path: ROUTES.USER.QNA_CREATE, title: 'Q&A 작성' },
      { path: ROUTES.USER.QNA_HISTORY, title: 'Q&A 이력' },
      { path: ROUTES.USER.OPEN_API_MANAGEMENT, title: 'OpenAPI 관리' },
      { path: ROUTES.USER.NOTICE_LIST, title: '공지사항 목록' },
      { path: ROUTES.USER.NOTICE_DETAIL, title: '공지사항 상세' },
    ],
  },
  ADMIN: {
    name: '관리자 페이지',
    routes: [
      { path: ROUTES.ADMIN.DASHBOARD, title: '관리자 대시보드' },
      { path: ROUTES.ADMIN.PROFILE, title: '관리자 프로필' },
      { path: ROUTES.ADMIN.FAQ.LIST, title: 'FAQ 관리' },
      { path: ROUTES.ADMIN.FAQ.CREATE, title: 'FAQ 생성' },
      { path: ROUTES.ADMIN.FAQ.EDIT, title: 'FAQ 편집' },
      { path: ROUTES.ADMIN.FAQ.DETAIL, title: 'FAQ 상세' },
      { path: ROUTES.ADMIN.QNA.LIST, title: 'Q&A 관리' },
      { path: ROUTES.ADMIN.QNA.DETAIL, title: 'Q&A 상세' },
      { path: ROUTES.ADMIN.QNA.REPLY, title: 'Q&A 답변' },
      { path: ROUTES.ADMIN.USERS.LIST, title: '사용자 관리' },
      { path: ROUTES.ADMIN.USERS.CREATE, title: '사용자 생성' },
      { path: ROUTES.ADMIN.USERS.EDIT, title: '사용자 편집' },
      { path: ROUTES.ADMIN.USERS.DETAIL, title: '사용자 상세' },
      { path: ROUTES.ADMIN.OPENAPI.CLIENTS, title: 'OpenAPI 인증 키 관리' },
      { path: ROUTES.ADMIN.OPENAPI.CLIENT_DETAIL, title: 'OpenAPI 클라이언트 상세' },
      { path: ROUTES.ADMIN.OPENAPI.REQUESTS, title: 'OpenAPI 요청 관리' },
      { path: ROUTES.ADMIN.OPENAPI.REQUEST_DETAIL, title: 'OpenAPI 요청 상세' },
      { path: ROUTES.ADMIN.NOTICES.LIST, title: '공지사항 관리' },
             { path: ROUTES.ADMIN.NOTICES.CREATE, title: '공지사항 생성' },
       { path: ROUTES.ADMIN.NOTICES.EDIT, title: '공지사항 편집' },
       { path: ROUTES.ADMIN.NOTICES.DETAIL, title: '공지사항 상세' },
       { path: ROUTES.ADMIN.OPERATORS.LIST, title: '운영자 관리' },
       { path: ROUTES.ADMIN.OPERATORS.CREATE, title: '운영자 생성' },
       { path: ROUTES.ADMIN.OPERATORS.DETAIL, title: '운영자 상세' },
       { path: ROUTES.ADMIN.OPERATORS.EDIT, title: '운영자 편집' },
       { path: ROUTES.ADMIN.CODE.LIST, title: '코드 관리' },
       { path: ROUTES.ADMIN.CODE.CREATE, title: '코드 생성' },
       { path: ROUTES.ADMIN.CODE.DETAIL, title: '코드 상세' },
       { path: ROUTES.ADMIN.CODE.EDIT, title: '코드 편집' },
      { path: ROUTES.ADMIN.SETTINGS, title: '시스템 설정' },
    ],
  },
  ADMIN_AUTH: {
    name: '관리자 인증',
    routes: [
      { path: ROUTES.ADMIN.LOGIN, title: '관리자 로그인' },
    ],
  },
  USER_AUTH: {
    name: '사용자 인증',
    routes: [
      { path: ROUTES.USER.LOGIN, title: '사용자 로그인' },
      { path: ROUTES.USER.REGISTER, title: '사용자 등록' },
    ],
  },
  ADMIN_CONTENT: {
    name: '콘텐츠 관리',
    routes: [
      { path: ROUTES.ADMIN.FAQ.LIST, title: 'FAQ 관리' },
      { path: ROUTES.ADMIN.FAQ.CREATE, title: 'FAQ 생성' },
      { path: ROUTES.ADMIN.FAQ.EDIT, title: 'FAQ 편집' },
      { path: ROUTES.ADMIN.FAQ.DETAIL, title: 'FAQ 상세' },
      { path: ROUTES.ADMIN.QNA.LIST, title: 'Q&A 관리' },
      { path: ROUTES.ADMIN.QNA.DETAIL, title: 'Q&A 상세' },
      { path: ROUTES.ADMIN.QNA.REPLY, title: 'Q&A 답변' },
      { path: ROUTES.ADMIN.NOTICES.LIST, title: '공지사항 관리' },
      { path: ROUTES.ADMIN.NOTICES.CREATE, title: '공지사항 생성' },
      { path: ROUTES.ADMIN.NOTICES.EDIT, title: '공지사항 편집' },
      { path: ROUTES.ADMIN.NOTICES.DETAIL, title: '공지사항 상세' },
    ],
  },
  ADMIN_ACCOUNT: {
    name: '계정 관리',
    routes: [
      { path: ROUTES.ADMIN.USERS.LIST, title: '사용자 관리' },
      { path: ROUTES.ADMIN.USERS.CREATE, title: '사용자 생성' },
      { path: ROUTES.ADMIN.USERS.EDIT, title: '사용자 편집' },
      { path: ROUTES.ADMIN.USERS.DETAIL, title: '사용자 상세' },
      { path: ROUTES.ADMIN.OPERATORS.LIST, title: '운영자 관리' },
      { path: ROUTES.ADMIN.OPERATORS.CREATE, title: '운영자 생성' },
      { path: ROUTES.ADMIN.OPERATORS.DETAIL, title: '운영자 상세' },
      { path: ROUTES.ADMIN.OPERATORS.EDIT, title: '운영자 편집' },
    ],
  },
  ADMIN_SYSTEM: {
    name: '시스템 관리',
    routes: [
      { path: ROUTES.ADMIN.OPENAPI.CLIENTS, title: 'OpenAPI 인증 키 관리' },
      { path: ROUTES.ADMIN.OPENAPI.CLIENT_DETAIL, title: 'OpenAPI 클라이언트 상세' },
      { path: ROUTES.ADMIN.OPENAPI.REQUESTS, title: 'OpenAPI 요청 관리' },
             { path: ROUTES.ADMIN.OPENAPI.REQUEST_DETAIL, title: 'OpenAPI 요청 상세' },
       { path: ROUTES.ADMIN.CODE.LIST, title: '코드 관리' },
       { path: ROUTES.ADMIN.CODE.CREATE, title: '코드 생성' },
       { path: ROUTES.ADMIN.CODE.DETAIL, title: '코드 상세' },
       { path: ROUTES.ADMIN.CODE.EDIT, title: '코드 편집' },
       { path: ROUTES.ADMIN.SETTINGS, title: '시스템 설정' },
    ],
  },
  USER_CONTENT: {
    name: '콘텐츠 조회',
    routes: [
      { path: ROUTES.USER.FAQ_LIST, title: 'FAQ 목록' },
      { path: ROUTES.USER.FAQ_DETAIL, title: 'FAQ 상세' },
      { path: ROUTES.USER.QNA_LIST, title: 'Q&A 목록' },
      { path: ROUTES.USER.QNA_DETAIL, title: 'Q&A 상세' },
      { path: ROUTES.USER.QNA_CREATE, title: 'Q&A 작성' },
      { path: ROUTES.USER.QNA_HISTORY, title: 'Q&A 이력' },
      { path: ROUTES.USER.NOTICE_LIST, title: '공지사항 목록' },
      { path: ROUTES.USER.NOTICE_DETAIL, title: '공지사항 상세' },
    ],
  },
  USER_SERVICES: {
    name: '서비스 이용',
    routes: [
      { path: ROUTES.USER.OPEN_API_MANAGEMENT, title: 'OpenAPI 관리' },
    ],
  },
} as const;

/**
 * 라우트 가드 컴포넌트들
 * 인증, 권한, 접근 제어를 담당
 */
export { 
  PublicRoute, 
  LoginRoute, 
  AdminLoginRoute, 
  RegisterRoute 
} from './guards/PublicRoute';

export { 
  PrivateRoute, 
  AdminProtectedRoute 
} from '../components/ProtectedRoute'; 