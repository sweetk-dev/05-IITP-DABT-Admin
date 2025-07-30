// OpenAPI 인증키 관련 DTO 정의

// OpenAPI 인증키 엔티티
export interface OpenApiAuthKey {
  keyId: number;
  userId: number;
  authKey: string;
  activeYn: string;
  startDt: string;
  endDt: string;
  delYn: string;
  activeAt?: string;
  latestAccAt?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  createdBy: string;
  updatedBy?: string;
  deletedBy?: string;
}

// 사용자 OpenAPI 인증키 목록 조회
export interface UserOpenApiListReq {
  // 현재는 특별한 파라미터 없음
}

export interface UserOpenApiListRes {
  authKeys: OpenApiAuthKey[];
}

// 사용자 OpenAPI 인증키 상세 조회
export interface UserOpenApiDetailReq {
  keyId: string;
}

export interface UserOpenApiDetailRes {
  authKey: OpenApiAuthKey;
}

// 사용자 OpenAPI 인증키 생성
export interface UserOpenApiCreateReq {
  apiName: string; // API 이름 (필수, 40자 이내)
  startDt?: string; // 시작일 (옵션)
  endDt?: string; // 종료일 (옵션)
  description: string; // API 사용 목적 (필수, 200자 이내)
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