// User API Request/Response 타입 정의
import { PaginationReq, PaginationRes, API_URLS } from './api.js';

/**
 * USER API 매핑 테이블
 * API URL과 Request/Response 타입을 명시적으로 연결
 */
/**
 * USER API 매핑 테이블 (params/query/body/res)
 * - params: URL 경로 변수 타입. 없으면 생략
 * - query: 쿼리스트링 타입. 없으면 생략
 * - body: 요청 본문 타입. 없으면 생략 또는 'void' 사용 가능(본문 없음 의미)
 * - res: 응답 데이터 타입. 'void'는 ApiResponse<void> 의미
 */
export const USER_API_MAPPING = {
  // 프로필 관리
  [`GET ${API_URLS.USER.PROFILE}`]: {
    req: 'UserProfileReq',
    res: 'UserProfileRes',
    description: '사용자 프로필 조회'
  },
  [`PUT ${API_URLS.USER.PROFILE}`]: {
    body: 'UserProfileUpdateReq',
    res: 'void',
    description: '사용자 프로필 업데이트'
  },
  
  // 비밀번호 관리
  [`PUT ${API_URLS.USER.PASSWORD}`]: {
    body: 'UserPasswordChangeReq',
    res: 'void',
    description: '사용자 비밀번호 변경'
  },
  
  // 회원가입
  [`POST ${API_URLS.USER.REGISTER}`]: {
    req: 'UserRegisterReq',
    res: 'UserRegisterRes',
    description: '사용자 회원가입'
  },
  
  // 이메일 중복 체크
  [`POST ${API_URLS.USER.CHECK_EMAIL}`]: {
    req: 'UserCheckEmailReq',
    res: 'UserCheckEmailRes',
    description: '사용자 이메일 중복 체크'
  },
  
  // FAQ 관리
  [`GET ${API_URLS.USER.FAQ.LIST}`]: {
    query: 'UserFaqListQuery',
    res: 'UserFaqListRes',
    description: '사용자 FAQ 목록 조회'
  },
  [`GET ${API_URLS.USER.FAQ.DETAIL}`]: {
    params: 'UserFaqDetailParams',
    res: 'UserFaqDetailRes',
    description: '사용자 FAQ 상세 조회'
  },
  [`GET ${API_URLS.USER.FAQ.HOME}`]: {
    res: 'UserFaqHomeRes',
    description: '사용자 FAQ 홈 조회'
  },
  
  // QnA 관리
  [`GET ${API_URLS.USER.QNA.LIST}`]: {
    query: 'UserQnaListQuery',
    res: 'UserQnaListRes',
    description: '사용자 QnA 목록 조회'
  },
  [`GET ${API_URLS.USER.QNA.DETAIL}`]: {
    params: 'UserQnaDetailParams',
    res: 'UserQnaDetailRes',
    description: '사용자 QnA 상세 조회'
  },
  [`POST ${API_URLS.USER.QNA.CREATE}`]: {
    req: 'UserQnaCreateReq',
    res: 'UserQnaCreateRes',
    description: '사용자 QnA 작성'
  },
  [`DELETE ${API_URLS.USER.QNA.DELETE}`]: {
    params: 'UserQnaDeleteParams',
    res: 'void',
    description: '사용자 QnA 삭제'
  },
  [`GET ${API_URLS.USER.QNA.HOME}`]: {
    res: 'UserQnaHomeRes',
    description: '사용자 QnA 홈 조회'
  },
  
  // 공지사항 관리
  [`GET ${API_URLS.USER.NOTICE.LIST}`]: {
    query: 'UserNoticeListQuery',
    res: 'UserNoticeListRes',
    description: '사용자 공지사항 목록 조회'
  },
  [`GET ${API_URLS.USER.NOTICE.DETAIL}`]: {
    params: 'UserNoticeDetailParams',
    res: 'UserNoticeDetailRes',
    description: '사용자 공지사항 상세 조회'
  },
  [`GET ${API_URLS.USER.NOTICE.HOME}`]: {
    res: 'UserNoticeHomeRes',
    description: '사용자 공지사항 홈 조회'
  },
  
  // OpenAPI 관리
  [`GET ${API_URLS.USER.OPEN_API.LIST}`]: {
    // no params/query/body
    res: 'UserOpenApiListRes',
    description: '사용자 OpenAPI 키 목록 조회'
  },
  [`GET ${API_URLS.USER.OPEN_API.DETAIL}`]: {
    params: 'UserOpenApiDetailParams',
    res: 'UserOpenApiDetailRes',
    description: '사용자 OpenAPI 키 상세 조회'
  },
  [`POST ${API_URLS.USER.OPEN_API.CREATE}`]: {
    body: 'UserOpenApiCreateReq',
    res: 'UserOpenApiCreateRes',
    description: '사용자 OpenAPI 키 생성'
  },
  [`DELETE ${API_URLS.USER.OPEN_API.DELETE}`]: {
    params: 'UserOpenApiDeleteParams',
    res: 'void',
    description: '사용자 OpenAPI 키 삭제'
  },
  [`POST ${API_URLS.USER.OPEN_API.EXTEND}`]: {
    params: 'UserOpenApiExtendParams',
    body: 'UserOpenApiExtendReq',
    res: 'UserOpenApiExtendRes',
    description: '사용자 OpenAPI 키 연장'
  }
} as const;

// 사용자 이메일 중복 체크
export interface UserCheckEmailReq {
  email: string;
}

export interface UserCheckEmailRes {
  isAvailable: boolean;
}

// 사용자 회원가입
export interface UserRegisterReq {
  email: string;
  password: string;
  name: string;
  affiliation?: string;
}

export interface UserRegisterRes {
  userId: number;
  email: string;
  name: string;
  affiliation?: string;
}

// 사용자 프로필 조회 (필요한 정보만)
export interface UserProfileRes {
  userId: number;
  email: string;
  name: string;
  affiliation?: string;
  createdAt: string;
}

// 사용자 프로필 변경
export interface UserProfileUpdateReq {
  name: string;
  affiliation?: string;
}

// 사용자 프로필 업데이트 응답은 ApiResponse<void> 사용

// 사용자 비밀번호 변경
export interface UserPasswordChangeReq {
  currentPassword: string;
  newPassword: string;
}

// 사용자 비밀번호 변경 응답은 ApiResponse<void> 사용