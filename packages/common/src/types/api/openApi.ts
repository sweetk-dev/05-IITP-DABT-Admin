// OpenAPI 인증키 관련 DTO 정의

// OpenAPI 인증키 엔티티 (전체 정보 - Admin용)
export interface OpenApiAuthKey {
  keyId: number;
  userId: number;
  authKey: string;
  activeYn: string;
  startDt?: string;
  endDt?: string;
  delYn: string;
  keyName: string;
  keyDesc: string;
  activeAt?: string;
  latestAccAt?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  createdBy: string;
  updatedBy?: string;
  deletedBy?: string;
}

// OpenAPI 인증키 엔티티 (제한된 정보 - User용)
export interface UserOpenApiAuthKey {
  keyId: number;
  authKey: string;
  activeYn: string;
  startDt?: string;
  endDt?: string;
  keyName: string;
  keyDesc: string;
  activeAt?: string;
  latestAccAt?: string;
  createdAt: string;
  updatedAt?: string;
}

// 사용자 OpenAPI 인증키 목록 조회
export interface UserOpenApiListReq {
  // 현재는 특별한 파라미터 없음
}

export interface UserOpenApiListRes {
  authKeys: UserOpenApiAuthKey[];
}

// 사용자 OpenAPI 인증키 상세 조회
export interface UserOpenApiDetailReq {
  keyId: string;
}

export interface UserOpenApiDetailRes {
  authKey: UserOpenApiAuthKey;
}

// 사용자 OpenAPI 인증키 생성
export interface UserOpenApiCreateReq {
  keyName: string; // API 이름 (필수, 120자 이내)
  keyDesc: string; // API 사용 목적 (필수, 600자 이내)
  startDt?: string; // 시작일 (옵션)
  endDt?: string; // 종료일 (옵션)
}

export interface UserOpenApiCreateRes {
  keyId: number;
  authKey: string;
  message: string;
}

// 사용자 OpenAPI 인증키 삭제
export interface UserOpenApiDeleteReq {
  keyId: number;
}

export interface UserOpenApiDeleteRes {
  message: string;
}

// 사용자 OpenAPI 인증키 기간 연장
export interface UserOpenApiExtendReq {
  keyId: number;
  extensionDays: number; // 90일 또는 365일
}

export interface UserOpenApiExtendRes {
  message: string;
  newEndDt: string;
}

// ===== Admin용 OpenAPI 인증키 관련 DTO =====

// Admin OpenAPI 인증키 목록 조회
export interface AdminOpenApiListReq {
  page?: number;
  limit?: number;
  userId?: number;
  activeYn?: string;
  searchKeyword?: string;
}

export interface AdminOpenApiListRes {
  authKeys: OpenApiAuthKey[];
  total: number;
  page: number;
  limit: number;
}

// Admin OpenAPI 인증키 상세 조회
export interface AdminOpenApiDetailReq {
  keyId: string;
}

export interface AdminOpenApiDetailRes {
  authKey: OpenApiAuthKey;
}

// Admin OpenAPI 인증키 생성
export interface AdminOpenApiCreateReq {
  userId: number;
  keyName: string;
  keyDesc: string;
  startDt?: string;
  endDt?: string;
  createdBy: string;
}

export interface AdminOpenApiCreateRes {
  keyId: number;
  authKey: string;
  message: string;
}

// Admin OpenAPI 인증키 수정
export interface AdminOpenApiUpdateReq {
  keyId: number;
  keyName?: string;
  keyDesc?: string;
  startDt?: string;
  endDt?: string;
  activeYn?: string;
  updatedBy: string;
}

export interface AdminOpenApiUpdateRes {
  message: string;
}

// Admin OpenAPI 인증키 삭제
export interface AdminOpenApiDeleteReq {
  keyId: number;
  deletedBy: string;
}

export interface AdminOpenApiDeleteRes {
  message: string;
}

// Admin OpenAPI 인증키 기간 연장
export interface AdminOpenApiExtendReq {
  keyId: number;
  extensionDays: number;
  updatedBy: string;
}

export interface AdminOpenApiExtendRes {
  message: string;
  newEndDt: string;
}

// Admin OpenAPI 인증키 통계
export interface AdminOpenApiStatsReq {
  userId?: number;
}

export interface AdminOpenApiStatsRes {
  total: number;
  active: number;
  expired: number;
  inactive: number;
} 