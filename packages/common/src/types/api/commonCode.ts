// Common Code API Request/Response 타입 정의

import { API_URLS } from './api.js';

// API URL과 타입 매핑 테이블
export const COMMON_CODE_API_MAPPING = {
  // 기본 조회 API (GET)
  [`GET ${API_URLS.COMMON_CODE.BASIC.BY_GROUP}`]: {
    req: 'CommonCodeByGroupReq',
    res: 'CommonCodeByGroupRes',
    description: '그룹별 조회 (사용자용)'
  },
  [`GET ${API_URLS.COMMON_CODE.BASIC.BY_ID}`]: {
    req: 'CommonCodeByIdReq',
    res: 'CommonCodeByIdRes',
    description: '코드 상세 조회 (사용자용)'
  },
  [`GET ${API_URLS.COMMON_CODE.BASIC.BY_TYPE}`]: {
    req: 'CommonCodeByTypeReq',
    res: 'CommonCodeByTypeRes',
    description: '타입별 조회 (사용자용)'
  },
  [`GET ${API_URLS.COMMON_CODE.BASIC.BY_PARENT}`]: {
    req: 'CommonCodeByParentReq',
    res: 'CommonCodeByParentRes',
    description: '계층형 조회 (사용자용)'
  },
  
  // 관리자용 상세 조회 API (GET)
  [`GET ${API_URLS.COMMON_CODE.ADMIN.BY_GROUP}`]: {
    req: 'CommonCodeByGroupReq',
    res: 'CommonCodeByGroupDetailRes',
    description: '그룹별 조회 (관리자용)'
  },
  [`GET ${API_URLS.COMMON_CODE.ADMIN.BY_ID}`]: {
    req: 'CommonCodeByIdReq',
    res: 'CommonCodeByIdDetailRes',
    description: '코드 상세 조회 (관리자용)'
  },
  [`GET ${API_URLS.COMMON_CODE.ADMIN.BY_TYPE}`]: {
    req: 'CommonCodeByTypeReq',
    res: 'CommonCodeByTypeDetailRes',
    description: '타입별 조회 (관리자용)'
  },
  [`GET ${API_URLS.COMMON_CODE.ADMIN.BY_PARENT}`]: {
    req: 'CommonCodeByParentReq',
    res: 'CommonCodeByParentDetailRes',
    description: '계층형 조회 (관리자용)'
  },
  
  // 계층 구조 조회 API (GET)
  [`GET ${API_URLS.COMMON_CODE.HIERARCHY.USER}`]: {
    req: 'CommonCodeHierarchyReq',
    res: 'CommonCodeHierarchyRes',
    description: '계층 구조 조회 (사용자용)'
  },
  [`GET ${API_URLS.COMMON_CODE.HIERARCHY.ADMIN}`]: {
    req: 'CommonCodeHierarchyReq',
    res: 'CommonCodeHierarchyDetailRes',
    description: '계층 구조 조회 (관리자용)'
  },
  [`GET ${API_URLS.COMMON_CODE.HIERARCHY.CHILDREN.USER}`]: {
    req: 'CommonCodeChildrenReq',
    res: 'CommonCodeChildrenRes',
    description: '그룹 간 계층 구조 조회 (사용자용)'
  },
  [`GET ${API_URLS.COMMON_CODE.HIERARCHY.CHILDREN.ADMIN}`]: {
    req: 'CommonCodeChildrenReq',
    res: 'CommonCodeChildrenDetailRes',
    description: '그룹 간 계층 구조 조회 (관리자용)'
  },
  
  // 고급 조회 API (GET)
  [`GET ${API_URLS.COMMON_CODE.ADVANCED.TREE}`]: {
    req: 'CommonCodeTreeReq',
    res: 'CommonCodeTreeRes',
    description: '트리 구조 조회 (관리자용)'
  },
  [`GET ${API_URLS.COMMON_CODE.ADVANCED.PARENT}`]: {
    req: 'CommonCodeParentReq',
    res: 'CommonCodeParentDetailRes',
    description: '부모 코드 조회 (관리자용)'
  },
  [`GET ${API_URLS.COMMON_CODE.ADVANCED.DESCENDANTS}`]: {
    req: 'CommonCodeDescendantsReq',
    res: 'CommonCodeDescendantsDetailRes',
    description: '하위 코드 조회 (관리자용)'
  },
  
  // 유틸리티 API (GET)
  [`GET ${API_URLS.COMMON_CODE.UTILITY.LEVEL}`]: {
    req: 'CommonCodeLevelReq',
    res: 'CommonCodeLevelDetailRes',
    description: '레벨별 조회 (관리자용)'
  },
  
  // 관리자용 그룹 관리 API
  [`GET ${API_URLS.COMMON_CODE.GROUP.LIST}`]: {
    req: 'void',
    res: 'CommonCodeGroupsRes',
    description: '그룹 리스트 조회 (관리자용)'
  },
  [`POST ${API_URLS.COMMON_CODE.GROUP.CREATE}`]: {
    req: 'CommonCodeGroupCreateReq',
    res: 'void',
    description: '그룹 생성 (관리자용)'
  },
  [`PUT ${API_URLS.COMMON_CODE.GROUP.UPDATE}`]: {
    req: 'CommonCodeGroupUpdateReq',
    res: 'void',
    description: '그룹 수정 (관리자용)'
  },
  [`DELETE ${API_URLS.COMMON_CODE.GROUP.DELETE}`]: {
    req: 'void',
    res: 'void',
    description: '그룹 삭제 (관리자용)'
  },
  
  // 관리자용 코드 관리 API
  [`POST ${API_URLS.COMMON_CODE.CODE.CREATE}`]: {
    req: 'CommonCodeCodeCreateReq',
    res: 'void',
    description: '코드 생성 (관리자용)'
  },
  [`PUT ${API_URLS.COMMON_CODE.CODE.UPDATE}`]: {
    req: 'CommonCodeCodeUpdateReq',
    res: 'void',
    description: '코드 수정 (관리자용)'
  },
  [`DELETE ${API_URLS.COMMON_CODE.CODE.DELETE}`]: {
    req: 'void',
    res: 'void',
    description: '코드 삭제 (관리자용)'
  },
} as const;

// 공통으로 사용하는 Common Code Group ID 상수들
export const COMMON_CODE_GROUPS = {
  // 시스템 관리
  SYS_ADMIN_ROLES: 'sys_admin_roles',      // 관리자 역할 코드
  SYS_DATA_STATUS: 'sys_data_status',      // 데이터 상태 코드
  SYS_WORK_TYPES: 'sys_work_type',        // 작업 유형 코드
  
  // FAQ 관련
  FAQ_TYPE: 'faq_type',                    // FAQ 유형
  FAQ_STATUS: 'faq_status',                // FAQ 상태 (공개/비공개)
  
  // QNA 관련
  QNA_TYPE: 'qna_type',                    // QNA 유형
  QNA_STATUS: 'qna_status',                // QNA 상태 (답변대기/답변완료/비공개)
  
  // 공지사항 관련
  NOTICE_TYPE: 'notice_type',              // 공지사항 유형
} as const;


// Admin Rolde Code ID 상수들
export const CODE_SYS_ADMIN_ROLES = {
  SUPER_ADMIN: 'S-ADMIN',  // 최고 관리자
  ADMIN: 'ADMIN',          // 관리자
  EDITOR: 'EDITOR',        // 에디터 
  VIEWER: 'VIEWER'         // 뷰어
} as const;



export const CODE_SYS_WORK_TYPES = {
  BATCH: 'SYS-BACH',            // 배치 작업
  MANUAL: 'SYS-MANUAL',        // 수동 작업
  USER: 'BY-USER'      // 사용자 작업
} as const;


// Common Code Group ID 타입
export type CommonCodeGroupId = typeof COMMON_CODE_GROUPS[keyof typeof COMMON_CODE_GROUPS];







// 공통 코드 기본 정보 (사용자용 - 단순 조회)
export interface CommonCode {
  grpId: string;
  grpNm: string;
  codeId: string;
  codeNm: string;
  parentGrpId?: string;
  parentCodeId?: string;
  codeType: 'B' | 'A' | 'S';
  codeLvl?: number;
  sortOrder?: number;
  codeDes?: string;
}

// 공통 코드 상세 정보 (관리자용 - 관리 기능 포함)
export interface CommonCodeDetail {
  grpId: string;
  grpNm: string;
  codeId: string;
  codeNm: string;
  parentGrpId?: string;
  parentCodeId?: string;
  codeType: 'B' | 'A' | 'S';
  codeLvl?: number;
  sortOrder?: number;
  useYn?: 'Y' | 'N';
  delYn?: 'Y' | 'N';
  codeDes?: string;
  memo?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

// 공통 코드 생성 요청
export interface CommonCodeCreateReq {
  grpId: string;
  grpNm: string;
  codeId: string;
  codeNm: string;
  parentGrpId?: string;
  parentCodeId?: string;
  codeType: 'B' | 'A' | 'S';
  codeLvl?: number;
  sortOrder?: number;
  useYn?: 'Y' | 'N';
  codeDes?: string;
  memo?: string;
}

// 공통 코드 수정 요청
export interface CommonCodeUpdateReq {
  grpNm?: string;
  codeNm?: string;
  parentGrpId?: string;
  parentCodeId?: string;
  codeType?: 'B' | 'A' | 'S';
  codeLvl?: number;
  sortOrder?: number;
  useYn?: 'Y' | 'N';
  codeDes?: string;
  memo?: string;
}

/**
 * 그룹별 조회 요청
 * 
 * 사용 API:
 * - GET /api/common-code/:grpId (사용자용)
 * - GET /api/common-code/admin/:grpId (관리자용)
 * 
 * @param grpId - 조회할 그룹 ID
 */
export interface CommonCodeByGroupReq {
  grpId: string;
}

/**
 * 그룹별 조회 응답 (사용자용)
 * 
 * 사용 API: GET /api/common-code/:grpId
 * 
 * @param codes - 그룹에 속한 코드 리스트
 */
export interface CommonCodeByGroupRes {
  codes: CommonCode[];
}

/**
 * 그룹별 조회 응답 (관리자용)
 * 
 * 사용 API: GET /api/common-code/admin/:grpId
 * 
 * @param codes - 그룹에 속한 코드 리스트 (상세 정보 포함)
 */
export interface CommonCodeByGroupDetailRes {
  codes: CommonCodeDetail[];
}

// 공통 코드 상세 조회 요청
export interface CommonCodeByIdReq {
  grpId: string;
  codeId: string;
}

// 공통 코드 상세 조회 응답 (사용자용)
export interface CommonCodeByIdRes {
  code: CommonCode;
}

// 공통 코드 상세 조회 응답 (관리자용)
export interface CommonCodeByIdDetailRes {
  code: CommonCodeDetail;
}

// 공통 코드 타입별 조회 요청
export interface CommonCodeByTypeReq {
  codeType: 'B' | 'A' | 'S';
}

// 공통 코드 타입별 조회 응답 (사용자용)
export interface CommonCodeByTypeRes {
  codes: CommonCode[];
}

// 공통 코드 타입별 조회 응답 (관리자용)
export interface CommonCodeByTypeDetailRes {
  codes: CommonCodeDetail[];
}

// 계층형 공통 코드 조회 요청
export interface CommonCodeByParentReq {
  grpId: string;
  parentCodeId?: string;
}

// 계층형 공통 코드 조회 응답 (사용자용)
export interface CommonCodeByParentRes {
  codes: CommonCode[];
}

// 계층형 공통 코드 조회 응답 (관리자용)
export interface CommonCodeByParentDetailRes {
  codes: CommonCodeDetail[];
}


// === 관리자용 그룹 관리 API 타입들 ===

// 그룹 정보 (코드 리스트 제외)
export interface CommonCodeGroup {
  grpId: string;
  grpNm: string;
  codeCount: number;
  createdAt?: string;
  updatedAt?: string;
}

// 그룹 리스트 조회 응답
export interface CommonCodeGroupsRes {
  groups: CommonCodeGroup[];
}


// 그룹 목록 일괄 삭제 요청 (관리자용)
export interface CommonCodeGroupListDeleteReq {
  grpIds: string[]; 
}
// CommonCodeGroupListDeleteRes는 ApiResponse<void> 사용


// 그룹 생성 요청 (코드 리스트 포함)
export interface CommonCodeGroupCreateReq {
  grpId: string;
  grpNm: string;
  codeType: 'B' | 'A' | 'S';
  codeDes?: string;
  codes: Array<{
    codeId: string;
    codeNm: string;
    parentCodeId?: string;
    codeLvl?: number;
    sortOrder?: number;
    codeDes?: string;
  }>;
}

// 그룹 생성 응답은 ApiResponse<void> 사용

// 그룹 수정 요청 (그룹명, 설명만 수정 가능)
export interface CommonCodeGroupUpdateReq {
  grpNm: string;
  codeDes?: string;
}

// 그룹 수정 응답은 ApiResponse<void> 사용

// 그룹 삭제 응답은 ApiResponse<void> 사용

// === 관리자용 코드 관리 API 타입들 ===


// 코드 목록 일괄 삭제 요청 (관리자용)
export interface CommonCodeListDeleteParams {
  grpId: string;  
}
export interface CommonCodeListDeleteReq {
  codeIds: string [];
}
// CommonCodeListDeleteRes는 ApiResponse<void> 사용

// 코드 생성 요청
export interface CommonCodeCodeCreateReq {
  codeId: string;
  codeNm: string;
  parentCodeId?: string;
  codeLvl?: number;
  sortOrder?: number;
  codeDes?: string;
}

// 코드 생성 응답은 ApiResponse<void> 사용

// 코드 수정 요청 (codeId는 수정 불가)
export interface CommonCodeCodeUpdateReq {
  codeNm: string;
  codeDes?: string;
  sortOrder?: number;
}

// 코드 수정 응답
export interface CommonCodeCodeUpdateRes {
  affectedCount: number;
}

// 코드 삭제 응답은 ApiResponse<void> 사용

// === 계층 구조 조회 API 타입들 ===

// 계층 구조 조회 요청
export interface CommonCodeHierarchyReq {
  grpId: string;
  parentCodeId?: string;
}

// 계층 구조 조회 응답 (사용자용)
export interface CommonCodeHierarchyRes {
  codes: CommonCode[];
}

// 계층 구조 조회 응답 (관리자용)
export interface CommonCodeHierarchyDetailRes {
  codes: CommonCodeDetail[];
}

// 그룹 간 계층 구조 조회 요청
export interface CommonCodeChildrenReq {
  grpId: string;
}

// 그룹 간 계층 구조 조회 응답 (사용자용)
export interface CommonCodeChildrenRes {
  codes: CommonCode[];
}

// 그룹 간 계층 구조 조회 응답 (관리자용)
export interface CommonCodeChildrenDetailRes {
  codes: CommonCodeDetail[];
}

// === 고급 조회 API 타입들 ===

// 트리 구조 조회 요청
export interface CommonCodeTreeReq {
  grpId: string;
}

// 트리 구조 노드 (재귀적 구조)
export interface CommonCodeTreeNode {
  grpId: string;
  grpNm: string;
  codeId: string;
  codeNm: string;
  parentGrpId?: string;
  parentCodeId?: string;
  codeType: 'B' | 'A' | 'S';
  codeLvl?: number;
  sortOrder?: number;
  codeDes?: string;
  children: CommonCodeTreeNode[];
}

// 트리 구조 조회 응답 (관리자용)
export interface CommonCodeTreeRes {
  tree: CommonCodeTreeNode[];
}

// 부모 코드 조회 요청
export interface CommonCodeParentReq {
  grpId: string;
  codeId: string;
}

// 부모 코드 조회 응답 (사용자용)
export interface CommonCodeParentRes {
  code: CommonCode | null;
}

// 부모 코드 조회 응답 (관리자용)
export interface CommonCodeParentDetailRes {
  code: CommonCodeDetail | null;
}

// 하위 코드 조회 요청
export interface CommonCodeDescendantsReq {
  grpId: string;
  codeId: string;
}

// 하위 코드 조회 응답 (사용자용)
export interface CommonCodeDescendantsRes {
  codes: CommonCode[];
}

// 하위 코드 조회 응답 (관리자용)
export interface CommonCodeDescendantsDetailRes {
  codes: CommonCodeDetail[];
}

// === 유틸리티 API 타입들 ===

// 레벨별 조회 요청
export interface CommonCodeLevelReq {
  grpId: string;
  level: number;
}

// 레벨별 조회 응답 (사용자용)
export interface CommonCodeLevelRes {
  codes: CommonCode[];
}

// 레벨별 조회 응답 (관리자용)
export interface CommonCodeLevelDetailRes {
  codes: CommonCodeDetail[];
} 