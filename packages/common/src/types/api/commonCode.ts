// Common Code API Request/Response 타입 정의

// 공통으로 사용하는 Common Code Group ID 상수들
export const COMMON_CODE_GROUPS = {
  // 시스템 관리
  SYS_ADMIN_ROLES: 'sys_admin_roles',      // 관리자 역할 코드
  SYS_DATA_STATUS: 'sys_data_status',      // 데이터 상태 코드
  
  // FAQ 관련
  FAQ_TYPE: 'faq_type',                    // FAQ 유형
  FAQ_STATUS: 'faq_status',                // FAQ 상태 (공개/비공개)
  
  // QNA 관련
  QNA_TYPE: 'qna_type',                    // QNA 유형
  QNA_STATUS: 'qna_status',                // QNA 상태 (답변대기/답변완료/비공개)
  
  // 공지사항 관련
  NOTICE_TYPE: 'notice_type',              // 공지사항 유형
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

// 공통 코드 그룹별 조회 요청
export interface CommonCodeByGroupReq {
  grpId: string;
}

// 공통 코드 그룹별 조회 응답 (사용자용)
export interface CommonCodeByGroupRes {
  codes: CommonCode[];
}

// 공통 코드 그룹별 조회 응답 (관리자용)
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

// 공통 코드 통계 정보
export interface CommonCodeStats {
  grpId: string;
  grpNm: string;
  count: number;
}

// 공통 코드 통계 조회 응답
export interface CommonCodeStatsRes {
  stats: CommonCodeStats[];
}

// 공통 코드 생성 응답
export interface CommonCodeCreateRes {
  code: CommonCodeDetail;
}

// 공통 코드 수정 응답
export interface CommonCodeUpdateRes {
  affectedCount: number;
}

// 공통 코드 삭제 응답
export interface CommonCodeDeleteRes {
  affectedCount: number;
} 