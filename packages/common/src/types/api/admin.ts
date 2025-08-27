// Admin 계정 관리 관련 DTO 정의
import { PaginationReq, PaginationRes, API_URLS } from './api.js';

/**
 * ADMIN API 매핑 테이블
 * API URL과 Request/Response 타입을 명시적으로 연결
 */
/**
 * ADMIN API 매핑 테이블 (params/query/body/res)
 * - params: URL 경로 변수 타입. 없으면 생략
 * - query: 쿼리스트링 타입. 없으면 생략
 * - body: 요청 본문 타입. 없으면 생략 또는 'void' 사용 가능(본문 없음 의미)
 * - res: 응답 데이터 타입. 'void'는 ApiResponse<void> 의미
 */
export const ADMIN_API_MAPPING = {
  // 프로필 관리
  [`GET ${API_URLS.ADMIN.PROFILE}`]: {
    req: 'AdminProfileReq',
    res: 'AdminProfileRes',
    description: '관리자 프로필 조회'
  },
  [`PUT ${API_URLS.ADMIN.PROFILE}`]: {
    body: 'AdminProfileUpdateReq',
    res: 'void',
    description: '관리자 프로필 업데이트'
  },
  
  // 비밀번호 관리
  [`PUT ${API_URLS.ADMIN.PASSWORD}`]: {
    body: 'AdminPasswordChangeReq',
    res: 'void',
    description: '관리자 비밀번호 변경'
  },
  
  // FAQ 관리
  [`GET ${API_URLS.ADMIN.FAQ.LIST}`]: {
    query: 'AdminFaqListQuery',
    res: 'AdminFaqListRes',
    description: '관리자 FAQ 목록 조회'
  },
  [`GET ${API_URLS.ADMIN.FAQ.DETAIL}`]: {
    params: 'AdminFaqDetailParams',
    res: 'AdminFaqDetailRes',
    description: '관리자 FAQ 상세 조회'
  },
  [`POST ${API_URLS.ADMIN.FAQ.CREATE}`]: {
    body: 'AdminFaqCreateReq',
    res: 'AdminFaqCreateRes',
    description: '관리자 FAQ 생성'
  },
  [`PUT ${API_URLS.ADMIN.FAQ.UPDATE}`]: {
    body: 'AdminFaqUpdateReq',
    res: 'void',
    description: '관리자 FAQ 업데이트'
  },
  [`DELETE ${API_URLS.ADMIN.FAQ.DELETE}`]: {
    params: 'AdminFaqDetailParams',
    res: 'void',
    description: '관리자 FAQ 삭제'
  },
  
  // QnA 관리
  [`GET ${API_URLS.ADMIN.QNA.LIST}`]: {
    query: 'AdminQnaListQuery',
    res: 'AdminQnaListRes',
    description: '관리자 QnA 목록 조회'
  },
  [`GET ${API_URLS.ADMIN.QNA.DETAIL}`]: {
    params: 'AdminQnaDetailParams',
    res: 'AdminQnaDetailRes',
    description: '관리자 QnA 상세 조회'
  },
  [`POST ${API_URLS.ADMIN.QNA.ANSWER}`]: {
    params: 'AdminQnaDetailParams',
    body: 'AdminQnaAnswerReq',
    res: 'void',
    description: '관리자 QnA 답변'
  },
  [`PUT ${API_URLS.ADMIN.QNA.UPDATE}`]: {
    params: 'AdminQnaDetailParams',
    body: 'AdminQnaUpdateReq',
    res: 'void',
    description: '관리자 QnA 업데이트'
  },
  [`DELETE ${API_URLS.ADMIN.QNA.DELETE}`]: {
    params: 'AdminQnaDetailParams',
    res: 'void',
    description: '관리자 QnA 삭제'
  },
   [`GET ${API_URLS.ADMIN.QNA.STATUS}`]: {
    // no params/query/body
    res: 'AdminQnaStatusRes',
    description: '관리자 QnA 상태(통계) 조회'
  },
  
  // 공지사항 관리
  [`GET ${API_URLS.ADMIN.NOTICE.LIST}`]: {
    query: 'AdminNoticeListQuery',
    res: 'AdminNoticeListRes',
    description: '관리자 공지사항 목록 조회'
  },
  [`GET ${API_URLS.ADMIN.NOTICE.DETAIL}`]: {
    params: 'AdminNoticeDetailParams',
    res: 'AdminNoticeDetailRes',
    description: '관리자 공지사항 상세 조회'
  },
  [`POST ${API_URLS.ADMIN.NOTICE.CREATE}`]: {
    body: 'AdminNoticeCreateReq',
    res: 'AdminNoticeCreateRes',
    description: '관리자 공지사항 생성'
  },
  [`PUT ${API_URLS.ADMIN.NOTICE.UPDATE}`]: {
    params: 'AdminNoticeDetailParams',
    body: 'AdminNoticeUpdateReq',
    res: 'void',
    description: '관리자 공지사항 업데이트'
  },
  [`DELETE ${API_URLS.ADMIN.NOTICE.DELETE}`]: {
    params: 'AdminNoticeDetailParams',
    res: 'void',
    description: '관리자 공지사항 삭제'
  },
  
  // OpenAPI 관리
  [`GET ${API_URLS.ADMIN.OPEN_API.LIST}`]: {
    query: 'AdminOpenApiListQuery',
    res: 'AdminOpenApiListRes',
    description: '관리자 OpenAPI 키 목록 조회'
  },
  [`GET ${API_URLS.ADMIN.OPEN_API.DETAIL}`]: {
    params: 'AdminOpenApiDetailParams',
    res: 'AdminOpenApiDetailRes',
    description: '관리자 OpenAPI 키 상세 조회'
  },
  [`POST ${API_URLS.ADMIN.OPEN_API.CREATE}`]: {
    body: 'AdminOpenApiCreateReq',
    res: 'AdminOpenApiCreateRes',
    description: '관리자 OpenAPI 키 생성'
  },
  [`PUT ${API_URLS.ADMIN.OPEN_API.UPDATE}`]: {
    params: 'AdminOpenApiUpdateParams',
    body: 'AdminOpenApiUpdateReq',
    res: 'void',
    description: '관리자 OpenAPI 키 업데이트'
  },
  [`DELETE ${API_URLS.ADMIN.OPEN_API.DELETE}`]: {
    params: 'AdminOpenApiDeleteParams',
    res: 'void',
    description: '관리자 OpenAPI 키 삭제'
  },
  [`POST ${API_URLS.ADMIN.OPEN_API.EXTEND}`]: {
    params: 'AdminOpenApiExtendParams',
    body: 'AdminOpenApiExtendReq',
    res: 'AdminOpenApiExtendRes',
    description: '관리자 OpenAPI 키 연장'
  },
  [`GET ${API_URLS.ADMIN.OPEN_API.STATUS}`]: {
    // no params/query/body
    res: 'AdminOpenApiStatsRes',
    description: '관리자 OpenAPI 상태(통계) 조회'
  },
  
  // 운영자 계정 관리 (S-Admin 전용)
  [`GET ${API_URLS.ADMIN.ADMIN_ACCOUNT.LIST}`]: {
    query: 'AdminAccountListQuery',
    res: 'AdminAccountListRes',
    description: '운영자 계정 목록 조회'
  },
  [`GET ${API_URLS.ADMIN.ADMIN_ACCOUNT.DETAIL}`]: {
    params: 'AdminAccountDetailParams',
    res: 'AdminAccountDetailRes',
    description: '운영자 계정 상세 조회'
  },
  [`POST ${API_URLS.ADMIN.ADMIN_ACCOUNT.CREATE}`]: {
    body: 'AdminAccountCreateReq',
    res: 'AdminAccountCreateRes',
    description: '운영자 계정 생성'
  },
  [`PUT ${API_URLS.ADMIN.ADMIN_ACCOUNT.UPDATE}`]: {
    params: 'AdminAccountUpdateParams',
    body: 'AdminAccountUpdateReq',
    res: 'void',
    description: '운영자 계정 업데이트'
  },
  [`DELETE ${API_URLS.ADMIN.ADMIN_ACCOUNT.DELETE}`]: {
    params: 'AdminAccountDeleteParams',
    res: 'void',
    description: '운영자 계정 삭제'
  },
  [`PUT ${API_URLS.ADMIN.ADMIN_ACCOUNT.PASSWORD_CHANGE}`]: {
    params: 'AdminAccountPasswordChangeParams',
    body: 'AdminAccountPasswordChangeReq',
    res: 'void',
    description: '운영자 계정 비밀번호 변경'
  },
  [`PUT ${API_URLS.ADMIN.ADMIN_ACCOUNT.ROLE_UPDATE}`]: {
    params: 'AdminAccountRoleUpdateParams',
    body: 'AdminAccountRoleUpdateReq',
    res: 'void',
    description: '운영자 계정 역할 업데이트'
  },
  [`POST ${API_URLS.ADMIN.ADMIN_ACCOUNT.CHECK_EMAIL}`]: {
    body: 'AdminAccountCheckEmailReq',
    res: 'AdminAccountCheckEmailRes',
    description: '운영자 계정 이메일 중복 체크'
  },
  
  // 사용자 계정 관리 (일반 Admin도 접근 가능)
  [`GET ${API_URLS.ADMIN.USER_ACCOUNT.LIST}`]: {
    query: 'UserAccountListQuery',
    res: 'UserAccountListRes',
    description: '사용자 계정 목록 조회'
  },
  [`GET ${API_URLS.ADMIN.USER_ACCOUNT.DETAIL}`]: {
    params: 'UserAccountDetailParams',
    res: 'UserAccountDetailRes',
    description: '사용자 계정 상세 조회'
  },
  [`POST ${API_URLS.ADMIN.USER_ACCOUNT.CREATE}`]: {
    body: 'UserAccountCreateReq',
    res: 'UserAccountCreateRes',
    description: '사용자 계정 생성'
  },
  [`PUT ${API_URLS.ADMIN.USER_ACCOUNT.UPDATE}`]: {
    params: 'UserAccountUpdateParams',
    body: 'UserAccountUpdateReq',
    res: 'void',
    description: '사용자 계정 업데이트'
  },
  [`DELETE ${API_URLS.ADMIN.USER_ACCOUNT.DELETE}`]: {
    params: 'UserAccountDeleteParams',
    res: 'void',
    description: '사용자 계정 삭제'
  },
  [`PUT ${API_URLS.ADMIN.USER_ACCOUNT.PASSWORD_CHANGE}`]: {
    params: 'UserAccountPasswordChangeParams',
    body: 'UserAccountPasswordChangeReq',
    res: 'void',
    description: '사용자 계정 비밀번호 변경'
  },
  [`PUT ${API_URLS.ADMIN.USER_ACCOUNT.STATUS_UPDATE}`]: {
    params: 'UserAccountStatusUpdateParams',
    body: 'UserAccountStatusUpdateReq',
    res: 'void',
    description: '사용자 계정 상태 업데이트'
  },
  [`POST ${API_URLS.ADMIN.USER_ACCOUNT.CHECK_EMAIL}`]: {
    body: 'UserAccountCheckEmailReq',
    res: 'UserAccountCheckEmailRes',
    description: '사용자 계정 이메일 중복 체크'
  }
} as const;

// Admin Profile 조회 (필요한 정보만)
export interface AdminProfileRes {
  adminId: number;
  loginId: string;
  name: string;
  role: string;
  roleName?: String;
  affiliation?: string;
  createdAt: string;
}

// Admin 프로필 변경
export interface AdminProfileUpdateReq {
  name: string;
  affiliation?: string;
}

// 프로필 업데이트 응답은 ApiResponse<void> 사용

// Admin 비밀번호 변경
export interface AdminPasswordChangeReq {
  currentPassword: string;
  newPassword: string;
}

// 비밀번호 변경 응답은 ApiResponse<void> 사용




