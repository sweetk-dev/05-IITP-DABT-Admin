import { ErrorCode } from '@iitp-dabt/common';
import type { ApiResponse } from '../types/api';
import { getUserType } from '../store/user';
import { removeTokensByType } from '../store/auth';
import { RouteUtils } from '../routes';

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
    ErrorCode.TOKEN_REQUIRED,
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
    ErrorCode.UNAUTHORIZED,
    ErrorCode.TOKEN_REQUIRED
  ];
  
  return autoLogoutCodes.includes(errorCode);
}

// 리다이렉트가 필요한 에러 코드들
function getRedirectUrl(errorCode?: number): string | undefined {
  if (!errorCode) return undefined;
  
  const userType = getUserType();
  
  switch (errorCode) {
    case ErrorCode.TOKEN_EXPIRED:
    case ErrorCode.INVALID_TOKEN:
    case ErrorCode.UNAUTHORIZED:
    case ErrorCode.TOKEN_REQUIRED:
      // 사용자 타입에 따라 적절한 로그인 페이지로 리다이렉트
      if (userType === 'A') {
        return '/admin/login';
      } else {
        return '/login';
      }
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
      // 토큰 에러 발생 시 해당 사용자 타입의 토큰 정보 자동 제거
      const userType = getUserType();
      removeTokensByType(userType === 'A' ? 'A' : 'U');
    }
    
    // 팝업 표시
    if (response.showPopup) {
      //console.log('팝업 표시:', errorMessage);
      // 실제 팝업 표시는 UI 컴포넌트에서 처리
    }
    
    // 리다이렉트 처리: 공개 페이지에서도 토큰 오류 시 즉시 이동
    if (response.redirectTo) {
      // onError로 메시지 노출 후, 아주 짧은 지연 뒤 이동하여 사용자에게 안내가 보이도록 함
      setTimeout(() => {
        try {
          const returnTo = window.location.pathname + window.location.search + window.location.hash;
          try { sessionStorage.setItem('returnTo', returnTo); } catch {}
          // basename을 고려한 전체 URL 생성
          const fullUrl = RouteUtils.getFullUrl(response.redirectTo as string);
          window.location.href = fullUrl;
        } catch {
          // fallback 무시
        }
      }, 100);
    }
  }
} 