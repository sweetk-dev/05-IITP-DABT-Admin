// FE 전용 API 관련 타입들
// package/common과 중복되지 않는 타입들만 정의

import type { ApiResponse as CommonApiResponse } from '@iitp-dabt/common';

// FE 전용 ApiResponse 확장 (에러 코드별 공통 처리)
export interface ApiResponse<T = any> extends CommonApiResponse<T> {
  showPopup?: boolean;
  redirectTo?: string;
  autoLogout?: boolean;
  details?: any;
}

// 데이터 없음 상태 타입 (FE 전용)
export type DataState<T> = 
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'empty' }
  | { status: 'error'; error: string };

// 빈 데이터 응답 타입 (FE 전용)
export interface EmptyResponse {
  items: [];
  total: 0;
  page: 1;
  limit: number;
  totalPages: 0;
}