/**
 * 백엔드 전용 공통 유틸리티 함수들
 * 중복 코드 방지 및 재사용성 향상을 위한 공통 함수들
 */

import { Request } from 'express';
import { getAdminRole, isSAdmin } from './auth';  

/**
 * 사용자 타입 상수
 */
export const USER_TYPE_ADMIN = 'A' as const;
export const USER_TYPE_GENERAL = 'U' as const;

export type UserType = typeof USER_TYPE_ADMIN | typeof USER_TYPE_GENERAL;

/**
 * Request에서 사용자 정보 추출
 * @param req Express Request 객체 (모든 제네릭 타입 지원)
 * @returns 사용자 정보 또는 null
 */
export function extractUserFromRequest<T = any>(req: Request<any, any, any, T>) {
  return req.user || null;
}

/**
 * Request에서 사용자 ID 추출
 * @param req Express Request 객체 (모든 제네릭 타입 지원)
 * @returns 사용자 ID 또는 null
 */
export function extractUserIdFromRequest<T = any>(req: Request<any, any, any, T>): number | null {
  return req.user?.userId || null;
}

/**
 * Request에서 사용자 타입 추출
 * @param req Express Request 객체 (모든 제네릭 타입 지원)
 * @returns 사용자 타입 또는 null
 */
export function extractUserTypeFromRequest<T = any>(req: Request<any, any, any, T>): UserType | null {
  return req.user?.userType || null;
}

/**
 * 관리자 권한 확인
 * @param userType 사용자 타입
 * @returns 관리자 여부
 */
export function isAdmin(userType: string | null): boolean {
  return userType === USER_TYPE_ADMIN;
}

/**
 * 사용자 권한 확인
 * @param userType 사용자 타입
 * @returns 사용자 여부
 */
export function isUser(userType: string | null): boolean {
  return userType === USER_TYPE_GENERAL;
}



/**
 * 슈퍼 관리자 여부 체크 
 * @param req 
 * @returns  { adminId: number, isSuper: boolean}
 */
export function checkSuperRole(req: Request): { adminId: number, isSuper: boolean} | null {
  const adminId = extractUserIdFromRequest(req);
  const adminRole = getAdminRole(req as any);

   if (!adminId) { 
    return  null;
  }

  const isSuper  = isSAdmin(adminRole);
  return {adminId, isSuper };
}



/**
 * 숫자 파라미터 검증 및 변환
 * @param value 검증할 값
 * @param min 최소값 (선택)
 * @param max 최대값 (선택)
 * @returns 변환된 숫자 또는 null
 */
export function validateAndParseNumber(value: any, min?: number, max?: number): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  const num = Number(value);
  if (isNaN(num)) {
    return null;
  }
  
  if (min !== undefined && num < min) {
    return null;
  }
  
  if (max !== undefined && num > max) {
    return null;
  }
  
  return num;
}

/**
 * 페이지네이션 파라미터 검증 및 기본값 설정
 * @param page 페이지 번호
 * @param limit 페이지 크기
 * @param defaultLimit 기본 페이지 크기
 * @param maxLimit 최대 페이지 크기
 * @returns 검증된 페이지네이션 파라미터
 */
export function validatePaginationParams(
  page: any, 
  limit: any, 
  defaultLimit: number = 10, 
  maxLimit: number = 100
) {
  const validatedPage = validateAndParseNumber(page, 1) || 1;
  const validatedLimit = validateAndParseNumber(limit, 1, maxLimit) || defaultLimit;
  
  return {
    page: validatedPage,
    limit: validatedLimit,
    offset: (validatedPage - 1) * validatedLimit
  };
}

/**
 * 정렬 파라미터 검증
 * @param sortBy 정렬 필드
 * @param sortOrder 정렬 순서
 * @param allowedFields 허용된 정렬 필드들
 * @returns 검증된 정렬 파라미터
 */
export function validateSortParams(
  sortBy: string | undefined,
  sortOrder: string | undefined,
  allowedFields: string[]
): { sortBy: string; sortOrder: 'ASC' | 'DESC' } {
  const defaultSortBy = allowedFields[0] || 'createdAt';
  const defaultSortOrder: 'ASC' | 'DESC' = 'DESC';
  
  const validatedSortBy = allowedFields.includes(sortBy || '') ? sortBy! : defaultSortBy;
  const validatedSortOrder = (sortOrder?.toUpperCase() === 'ASC' || sortOrder?.toUpperCase() === 'DESC') 
    ? sortOrder.toUpperCase() as 'ASC' | 'DESC' 
    : defaultSortOrder;
  
  return {
    sortBy: validatedSortBy,
    sortOrder: validatedSortOrder
  };
}

/**
 * 검색 파라미터 정규화
 * @param searchTerm 검색어
 * @returns 정규화된 검색어
 */
export function normalizeSearchTerm(searchTerm: string | undefined): string | null {
  if (!searchTerm || typeof searchTerm !== 'string') {
    return null;
  }
  
  const normalized = searchTerm.trim();
  return normalized.length > 0 ? normalized : null;
}

/**
 * 날짜 범위 파라미터 검증
 * @param startDate 시작일
 * @param endDate 종료일
 * @returns 검증된 날짜 범위 또는 null
 */
export function validateDateRange(startDate: string | undefined, endDate: string | undefined) {
  if (!startDate && !endDate) {
    return null;
  }
  
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  
  // 유효하지 않은 날짜 체크
  if (start && isNaN(start.getTime())) {
    return null;
  }
  if (end && isNaN(end.getTime())) {
    return null;
  }
  
  // 시작일이 종료일보다 늦은 경우
  if (start && end && start > end) {
    return null;
  }
  
  return { startDate: start, endDate: end };
}

/**
 * IP 주소 추출 (프록시 환경 고려)
 * @param req Express Request 객체
 * @returns IP 주소
 */
export function extractClientIP(req: Request): string {
  return req.headers['x-forwarded-for'] as string || 
         req.headers['x-real-ip'] as string || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         'unknown';
}

/**
 * User Agent 정규화
 * @param userAgent User Agent 문자열
 * @returns 정규화된 User Agent
 */
export function normalizeUserAgent(userAgent: string | undefined): string {
  if (!userAgent || typeof userAgent !== 'string') {
    return 'unknown';
  }
  
  // 너무 긴 User Agent는 잘라내기
  const maxLength = 500;
  return userAgent.length > maxLength ? userAgent.substring(0, maxLength) : userAgent;
}

/**
 * 에러 메시지 정규화
 * @param error 에러 객체 또는 문자열
 * @returns 정규화된 에러 메시지
 */
export function normalizeErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (error && typeof error === 'object' && error.message) {
    return String(error.message);
  }
  
  return 'Unknown error';
}

/**
 * 객체에서 null/undefined 값 제거
 * @param obj 정리할 객체
 * @returns 정리된 객체
 */
export function removeNullValues<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: Partial<T> = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== null && obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  }
  
  return cleaned;
}

/**
 * 객체 깊은 복사 (간단한 버전)
 * @param obj 복사할 객체
 * @returns 복사된 객체
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T;
  }
  
  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
} 