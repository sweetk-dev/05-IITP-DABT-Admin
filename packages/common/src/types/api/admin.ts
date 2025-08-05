// Admin 계정 관리 관련 DTO 정의
import { PaginationReq, PaginationRes, API_URLS } from './api.js';

/**
 * ADMIN API 매핑 테이블
 * API URL과 Request/Response 타입을 명시적으로 연결
 */
export const ADMIN_API_MAPPING = {
  // 프로필 관리
  [`GET ${API_URLS.ADMIN.PROFILE}`]: {
    req: 'AdminProfileReq',
    res: 'AdminProfileRes',
    description: '관리자 프로필 조회'
  },
  [`PUT ${API_URLS.ADMIN.PROFILE}`]: {
    req: 'AdminProfileUpdateReq',
    res: 'AdminProfileUpdateRes',
    description: '관리자 프로필 업데이트'
  },
  
  // 비밀번호 관리
  [`PUT ${API_URLS.ADMIN.PASSWORD}`]: {
    req: 'AdminPasswordChangeReq',
    res: 'AdminPasswordChangeRes',
    description: '관리자 비밀번호 변경'
  },
  
  // FAQ 관리
  [`GET ${API_URLS.ADMIN.FAQ.LIST}`]: {
    req: 'AdminFaqListReq',
    res: 'AdminFaqListRes',
    description: '관리자 FAQ 목록 조회'
  },
  [`GET ${API_URLS.ADMIN.FAQ.DETAIL}`]: {
    req: 'AdminFaqDetailReq',
    res: 'AdminFaqDetailRes',
    description: '관리자 FAQ 상세 조회'
  },
  [`POST ${API_URLS.ADMIN.FAQ.CREATE}`]: {
    req: 'AdminFaqCreateReq',
    res: 'AdminFaqCreateRes',
    description: '관리자 FAQ 생성'
  },
  [`PUT ${API_URLS.ADMIN.FAQ.UPDATE}`]: {
    req: 'AdminFaqUpdateReq',
    res: 'AdminFaqUpdateRes',
    description: '관리자 FAQ 업데이트'
  },
  [`DELETE ${API_URLS.ADMIN.FAQ.DELETE}`]: {
    req: 'AdminFaqDeleteReq',
    res: 'AdminFaqDeleteRes',
    description: '관리자 FAQ 삭제'
  },
  
  // QnA 관리
  [`GET ${API_URLS.ADMIN.QNA.LIST}`]: {
    req: 'AdminQnaListReq',
    res: 'AdminQnaListRes',
    description: '관리자 QnA 목록 조회'
  },
  [`GET ${API_URLS.ADMIN.QNA.DETAIL}`]: {
    req: 'AdminQnaDetailReq',
    res: 'AdminQnaDetailRes',
    description: '관리자 QnA 상세 조회'
  },
  [`POST ${API_URLS.ADMIN.QNA.ANSWER}`]: {
    req: 'AdminQnaAnswerReq',
    res: 'AdminQnaAnswerRes',
    description: '관리자 QnA 답변'
  },
  [`PUT ${API_URLS.ADMIN.QNA.UPDATE}`]: {
    req: 'AdminQnaUpdateReq',
    res: 'AdminQnaUpdateRes',
    description: '관리자 QnA 업데이트'
  },
  [`DELETE ${API_URLS.ADMIN.QNA.DELETE}`]: {
    req: 'AdminQnaDeleteReq',
    res: 'AdminQnaDeleteRes',
    description: '관리자 QnA 삭제'
  },
  
  // 공지사항 관리
  [`GET ${API_URLS.ADMIN.NOTICE.LIST}`]: {
    req: 'AdminNoticeListReq',
    res: 'AdminNoticeListRes',
    description: '관리자 공지사항 목록 조회'
  },
  [`GET ${API_URLS.ADMIN.NOTICE.DETAIL}`]: {
    req: 'AdminNoticeDetailReq',
    res: 'AdminNoticeDetailRes',
    description: '관리자 공지사항 상세 조회'
  },
  [`POST ${API_URLS.ADMIN.NOTICE.CREATE}`]: {
    req: 'AdminNoticeCreateReq',
    res: 'AdminNoticeCreateRes',
    description: '관리자 공지사항 생성'
  },
  [`PUT ${API_URLS.ADMIN.NOTICE.UPDATE}`]: {
    req: 'AdminNoticeUpdateReq',
    res: 'AdminNoticeUpdateRes',
    description: '관리자 공지사항 업데이트'
  },
  [`DELETE ${API_URLS.ADMIN.NOTICE.DELETE}`]: {
    req: 'AdminNoticeDeleteReq',
    res: 'AdminNoticeDeleteRes',
    description: '관리자 공지사항 삭제'
  },
  
  // Admin 계정 관리
  [`GET ${API_URLS.ADMIN.ACCOUNT.LIST}`]: {
    req: 'AdminListReq',
    res: 'AdminListRes',
    description: '관리자 계정 목록 조회'
  },
  [`GET ${API_URLS.ADMIN.ACCOUNT.DETAIL}`]: {
    req: 'AdminDetailReq',
    res: 'AdminDetailRes',
    description: '관리자 계정 상세 조회'
  },
  [`POST ${API_URLS.ADMIN.ACCOUNT.CREATE}`]: {
    req: 'AdminCreateReq',
    res: 'AdminCreateRes',
    description: '관리자 계정 생성'
  },
  [`POST ${API_URLS.ADMIN.ACCOUNT.CHECK_EMAIL}`]: {
    req: 'AdminCheckEmailReq',
    res: 'AdminCheckEmailRes',
    description: '관리자 계정 이메일 중복 체크'
  },
  [`PUT ${API_URLS.ADMIN.ACCOUNT.UPDATE}`]: {
    req: 'AdminUpdateReq',
    res: 'AdminUpdateRes',
    description: '관리자 계정 업데이트'
  },
  [`DELETE ${API_URLS.ADMIN.ACCOUNT.DELETE}`]: {
    req: 'AdminDeleteReq',
    res: 'AdminDeleteRes',
    description: '관리자 계정 삭제'
  },
  [`PUT ${API_URLS.ADMIN.ACCOUNT.PASSWORD_CHANGE}`]: {
    req: 'AdminPasswordChangeReq',
    res: 'AdminPasswordChangeRes',
    description: '관리자 계정 비밀번호 변경'
  },
  
  // OpenAPI 관리
  [`GET ${API_URLS.ADMIN.OPEN_API.LIST}`]: {
    req: 'AdminOpenApiListReq',
    res: 'AdminOpenApiListRes',
    description: '관리자 OpenAPI 키 목록 조회'
  },
  [`GET ${API_URLS.ADMIN.OPEN_API.DETAIL}`]: {
    req: 'AdminOpenApiDetailReq',
    res: 'AdminOpenApiDetailRes',
    description: '관리자 OpenAPI 키 상세 조회'
  },
  [`POST ${API_URLS.ADMIN.OPEN_API.CREATE}`]: {
    req: 'AdminOpenApiCreateReq',
    res: 'AdminOpenApiCreateRes',
    description: '관리자 OpenAPI 키 생성'
  },
  [`PUT ${API_URLS.ADMIN.OPEN_API.UPDATE}`]: {
    req: 'AdminOpenApiUpdateReq',
    res: 'AdminOpenApiUpdateRes',
    description: '관리자 OpenAPI 키 업데이트'
  },
  [`DELETE ${API_URLS.ADMIN.OPEN_API.DELETE}`]: {
    req: 'AdminOpenApiDeleteReq',
    res: 'AdminOpenApiDeleteRes',
    description: '관리자 OpenAPI 키 삭제'
  },
  [`POST ${API_URLS.ADMIN.OPEN_API.EXTEND}`]: {
    req: 'AdminOpenApiExtendReq',
    res: 'AdminOpenApiExtendRes',
    description: '관리자 OpenAPI 키 연장'
  }
} as const;

// Admin 계정 엔티티
export interface Admin {
  adminId: number;
  loginId: string;
  name: string;
  roles: string;
  affiliation?: string;
  description?: string;
  note?: string;
  status: string;
  delYn: string;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

// Admin Profile 조회 (필요한 정보만)
export interface AdminProfileRes {
  adminId: number;
  loginId: string;
  name: string;
  role: string;
  affiliation?: string;
  createdAt: string;
}

// Admin 프로필 변경
export interface AdminProfileUpdateReq {
  name: string;
  affiliation?: string;
}

export interface AdminProfileUpdateRes {
  success: boolean;
  message: string;
}

// Admin 비밀번호 변경
export interface AdminPasswordChangeReq {
  currentPassword: string;
  newPassword: string;
}

export interface AdminPasswordChangeRes {
  success: boolean;
  message: string;
}

// Admin 계정 목록 조회
export interface AdminListReq extends PaginationReq {
  search?: string;
  status?: string;
  roles?: string;
}

export interface AdminListRes extends PaginationRes<Admin> {
  admins: Admin[];
}

// Admin 계정 상세 조회
export interface AdminDetailReq {
  adminId: string;
}

export interface AdminDetailRes {
  admin: Admin;
}

// Admin 계정 생성
export interface AdminCreateReq {
  loginId: string;
  password: string;
  name: string;
  roles: string;
  affiliation?: string;
  description?: string;
  note?: string;
  status?: string;
}

export interface AdminCreateRes {
  adminId: number;
  message: string;
}

// Admin 계정 이메일 중복 체크
export interface AdminCheckEmailReq {
  loginId: string;
}

export interface AdminCheckEmailRes {
  available: boolean;
  message: string;
}

// Admin 계정 수정
export interface AdminUpdateReq {
  name?: string;
  roles?: string;
  affiliation?: string;
  description?: string;
  note?: string;
  status?: string;
  updatedBy?: string;
}

export interface AdminUpdateRes {
  success: boolean;
  message: string;
}

// Admin 계정 삭제
export interface AdminDeleteReq {
  adminId: string;
}

export interface AdminDeleteRes {
  success: boolean;
  message: string;
}

// Admin 계정 상태 변경
export interface AdminStatusChangeReq {
  status: string;
  reason?: string;
}

export interface AdminStatusChangeRes {
  success: boolean;
  message: string;
}

// Admin 계정 통계
export interface AdminStatsRes {
  totalAdmins: number;
  activeAdmins: number;
  inactiveAdmins: number;
  lockedAdmins: number;
  roleStats: Array<{
    role: string;
    count: number;
  }>;
} 