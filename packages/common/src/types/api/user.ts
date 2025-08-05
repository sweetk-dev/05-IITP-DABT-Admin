// User API Request/Response 타입 정의
import { PaginationReq, PaginationRes, API_URLS } from './api.js';

/**
 * USER API 매핑 테이블
 * API URL과 Request/Response 타입을 명시적으로 연결
 */
export const USER_API_MAPPING = {
  // 프로필 관리
  [`GET ${API_URLS.USER.PROFILE}`]: {
    req: 'UserProfileReq',
    res: 'UserProfileRes',
    description: '사용자 프로필 조회'
  },
  [`PUT ${API_URLS.USER.PROFILE}`]: {
    req: 'UserProfileUpdateReq',
    res: 'UserProfileUpdateRes',
    description: '사용자 프로필 업데이트'
  },
  
  // 비밀번호 관리
  [`PUT ${API_URLS.USER.PASSWORD}`]: {
    req: 'UserPasswordChangeReq',
    res: 'UserPasswordChangeRes',
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
    req: 'UserFaqListReq',
    res: 'UserFaqListRes',
    description: '사용자 FAQ 목록 조회'
  },
  [`GET ${API_URLS.USER.FAQ.DETAIL}`]: {
    req: 'UserFaqDetailReq',
    res: 'UserFaqDetailRes',
    description: '사용자 FAQ 상세 조회'
  },
  [`GET ${API_URLS.USER.FAQ.HOME}`]: {
    req: 'UserFaqHomeReq',
    res: 'UserFaqHomeRes',
    description: '사용자 FAQ 홈 조회'
  },
  
  // QnA 관리
  [`GET ${API_URLS.USER.QNA.LIST}`]: {
    req: 'UserQnaListReq',
    res: 'UserQnaListRes',
    description: '사용자 QnA 목록 조회'
  },
  [`GET ${API_URLS.USER.QNA.DETAIL}`]: {
    req: 'UserQnaDetailReq',
    res: 'UserQnaDetailRes',
    description: '사용자 QnA 상세 조회'
  },
  [`POST ${API_URLS.USER.QNA.CREATE}`]: {
    req: 'UserQnaCreateReq',
    res: 'UserQnaCreateRes',
    description: '사용자 QnA 작성'
  },
  [`GET ${API_URLS.USER.QNA.HOME}`]: {
    req: 'UserQnaHomeReq',
    res: 'UserQnaHomeRes',
    description: '사용자 QnA 홈 조회'
  },
  
  // 공지사항 관리
  [`GET ${API_URLS.USER.NOTICE.LIST}`]: {
    req: 'UserNoticeListReq',
    res: 'UserNoticeListRes',
    description: '사용자 공지사항 목록 조회'
  },
  [`GET ${API_URLS.USER.NOTICE.DETAIL}`]: {
    req: 'UserNoticeDetailReq',
    res: 'UserNoticeDetailRes',
    description: '사용자 공지사항 상세 조회'
  },
  [`GET ${API_URLS.USER.NOTICE.HOME}`]: {
    req: 'UserNoticeHomeReq',
    res: 'UserNoticeHomeRes',
    description: '사용자 공지사항 홈 조회'
  },
  
  // OpenAPI 관리
  [`GET ${API_URLS.USER.OPEN_API.LIST}`]: {
    req: 'UserOpenApiListReq',
    res: 'UserOpenApiListRes',
    description: '사용자 OpenAPI 키 목록 조회'
  },
  [`GET ${API_URLS.USER.OPEN_API.DETAIL}`]: {
    req: 'UserOpenApiDetailReq',
    res: 'UserOpenApiDetailRes',
    description: '사용자 OpenAPI 키 상세 조회'
  },
  [`POST ${API_URLS.USER.OPEN_API.CREATE}`]: {
    req: 'UserOpenApiCreateReq',
    res: 'UserOpenApiCreateRes',
    description: '사용자 OpenAPI 키 생성'
  },
  [`DELETE ${API_URLS.USER.OPEN_API.DELETE}`]: {
    req: 'UserOpenApiDeleteReq',
    res: 'UserOpenApiDeleteRes',
    description: '사용자 OpenAPI 키 삭제'
  },
  [`POST ${API_URLS.USER.OPEN_API.EXTEND}`]: {
    req: 'UserOpenApiExtendReq',
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

export interface UserProfileUpdateRes {
  success: boolean;
  message: string;
}

// 사용자 비밀번호 변경
export interface UserPasswordChangeReq {
  currentPassword: string;
  newPassword: string;
}

export interface UserPasswordChangeRes {
  success: boolean;
  message: string;
} 