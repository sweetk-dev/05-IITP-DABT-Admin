import { ErrorCode } from '@iitp-dabt/common';
import type { ApiResponse } from '../types/api';

// 에러 코드별 FE 전용 응답 설정
export function enhanceApiResponse<T>(response: any): ApiResponse<T> {
  if (!response.success) {
    const enhancedResponse: ApiResponse<T> = {
      ...response,
      showPopup: shouldShowPopup(response.errorCode),
      redirectTo: getRedirectUrl(response.errorCode),
      autoLogout: shouldAutoLogout(response.errorCode),
      details: response.details || {}
    };
    return enhancedResponse;
  }
  
  return response as ApiResponse<T>;
}

// 팝업 표시가 필요한 에러 코드들
function shouldShowPopup(errorCode?: number): boolean {
  if (!errorCode) return false;
  
  const showPopupCodes = [
    ErrorCode.UNAUTHORIZED,
    ErrorCode.TOKEN_EXPIRED,
    ErrorCode.INVALID_TOKEN,
    ErrorCode.ACCESS_DENIED,
    ErrorCode.LOGIN_FAILED,
    ErrorCode.NETWORK_ERROR,
    ErrorCode.REQUEST_TIMEOUT
  ];
  
  return showPopupCodes.includes(errorCode);
}

// 자동 로그아웃이 필요한 에러 코드들
function shouldAutoLogout(errorCode?: number): boolean {
  if (!errorCode) return false;
  
  const autoLogoutCodes = [
    ErrorCode.TOKEN_EXPIRED,
    ErrorCode.INVALID_TOKEN,
    ErrorCode.UNAUTHORIZED
  ];
  
  return autoLogoutCodes.includes(errorCode);
}

// 리다이렉트가 필요한 에러 코드들
function getRedirectUrl(errorCode?: number): string | undefined {
  if (!errorCode) return undefined;
  
  switch (errorCode) {
    case ErrorCode.TOKEN_EXPIRED:
    case ErrorCode.INVALID_TOKEN:
    case ErrorCode.UNAUTHORIZED:
      return '/login';
    case ErrorCode.ACCESS_DENIED:
      return '/';
    default:
      return undefined;
  }
}

// API 응답 처리 및 에러 핸들링
export function handleApiResponse<T>(
  response: ApiResponse<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void
): void {
  if (response.success && response.data) {
    onSuccess?.(response.data);
  } else {
    const errorMessage = response.errorMessage || '알 수 없는 오류가 발생했습니다.';
    onError?.(errorMessage);
    
    // 자동 로그아웃 처리
    if (response.autoLogout) {
      // TODO: 로그아웃 처리
      console.log('자동 로그아웃 처리');
    }
    
    // 팝업 표시
    if (response.showPopup) {
      // TODO: 팝업 표시 처리
      console.log('팝업 표시:', errorMessage);
    }
    
    // 리다이렉트 처리
    if (response.redirectTo) {
      // TODO: 리다이렉트 처리
      console.log('리다이렉트:', response.redirectTo);
    }
  }
} 