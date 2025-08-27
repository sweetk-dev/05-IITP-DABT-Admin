// OpenAPI 인증키 관련 DTO 정의
import { PaginationReq, PaginationRes } from './api';

// OpenAPI 인증키 엔티티 (전체 정보 - Admin용)
export interface AdminOpenApiKeyItem {
  keyId: number;
  userId: number;
  authKey: string;
  activeYn: string;
  startDt?: string;
  endDt?: string;
  delYn: string;
  keyName: string;
  keyDesc: string;
  keyRejectReason?: string; // 반려 사유
  activeAt?: string;
  latestAccAt?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  createdBy: string;
  updatedBy?: string;
  deletedBy?: string;
}


export interface AdminOpenApiKeyListItem {
  keyId: number;
  userId: number;
  authKey: string;
  activeYn: string;
  startDt?: string;
  endDt?: string;
  delYn: string;
  keyName: string;
  activeAt?: string;
  latestAccAt?: string;
  createdAt: string;
}






// OpenAPI 인증키 엔티티 (제한된 정보 - User용)
export interface UserOpenApiKeyItem {
  keyId: number;
  authKey: string;
  activeYn: string;
  startDt?: string;
  endDt?: string;
  keyName: string;
  keyDesc: string;
  keyRejectReason?: string; // 반려 사유
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
  authKeys: UserOpenApiKeyItem[];
}

// 사용자 OpenAPI 인증키 상세 조회
export interface UserOpenApiDetailParams {
  keyId: string;
}

export interface UserOpenApiDetailRes {
  authKey: UserOpenApiKeyItem;
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
}

// 사용자 OpenAPI 인증키 삭제
export interface UserOpenApiDeleteParams {
  keyId: string;
}

// 삭제 응답은 ApiResponse<void> 사용

// 사용자 OpenAPI 인증키 기간 연장
export interface UserOpenApiExtendParams {
  keyId: string;
}

export interface UserOpenApiExtendReq {
    startDt?: string;
    endDt?: string;
}

export interface UserOpenApiExtendRes {
  startDt?: string;
  endDt?: string;
}

// ===== Admin용 OpenAPI 인증키 관련 DTO =====

// Admin OpenAPI 인증키 목록 조회
export interface AdminOpenApiListQuery {
  page?: number;
  limit?: number;
  userId?: number;
  activeYn?: string;
  searchKeyword?: string;
  pendingOnly?: boolean; //허가 대기 중인 인증키만 조회
}

export type AdminOpenApiListRes = PaginationRes<AdminOpenApiKeyListItem>;

// Admin OpenAPI 인증키 상세 조회
export interface AdminOpenApiDetailParams {
  keyId: string;
}

export interface AdminOpenApiDetailRes {
  authKey: AdminOpenApiKeyItem;
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
}

// Admin OpenAPI 인증키 수정
export interface AdminOpenApiUpdateReq {
  keyName?: string;
  keyDesc?: string;
  startDt?: string;
  endDt?: string;
  activeYn?: string;
  rejectReason?: string; // 반려 사유 (activeYn이 'N'으로 변경될 때 필수)
  updatedBy: string;
}

export interface AdminOpenApiUpdateParams {
  keyId: string;
}

// 업데이트 응답은 ApiResponse<void> 사용

// Admin OpenAPI 인증키 삭제
export interface AdminOpenApiDeleteParams {
  keyId: string;
}

// 삭제 응답은 ApiResponse<void> 사용

// Admin OpenAPI 인증키 기간 연장
export interface AdminOpenApiExtendParams {
  keyId: string;
}

export interface AdminOpenApiExtendReq {
  startDt?: string;
  endDt?: string;
  updatedBy: string;
}

export interface AdminOpenApiExtendRes {
  startDt?: string;
  endDt?: string;
}

// Admin OpenAPI 인증키 통계
// 상태 조회는 별도 요청 DTO 없음 (params/query/body 모두 없음)

export interface AdminOpenApiStatsRes {
  total: number;
  active: number;
  expired: number;
  inactive: number;
  pending: number;    //허가 대기 중 count 
 } 