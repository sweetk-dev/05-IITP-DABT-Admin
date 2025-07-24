import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorCode, ErrorMetaMap } from '@iitp-dabt/common';
import { useAuth } from './useAuth';

interface ErrorResponse {
  success: false;
  errorCode: ErrorCode;
  errorMessage: string;
}

export const useErrorHandler = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleError = useCallback((error: any) => {
    console.error('Error handled:', error);

    // API 응답 에러인 경우
    if (error?.response?.data) {
      const errorData: ErrorResponse = error.response.data;
      const errorCode = errorData.errorCode;
      const errorMeta = ErrorMetaMap[errorCode] || ErrorMetaMap[ErrorCode.UNKNOWN_ERROR];

      // 자동 로그아웃이 필요한 경우
      if (errorMeta.autoLogout) {
        logout();
        if (errorMeta.redirectTo) {
          navigate(errorMeta.redirectTo);
        }
      }

      // 팝업 표시가 필요한 경우
      if (errorMeta.showPopup) {
        // 여기서 토스트나 알림 컴포넌트를 호출
        // 예: toast.error(errorMeta.message);
        alert(errorMeta.message);
      }

      // 리다이렉트가 필요한 경우
      if (errorMeta.redirectTo && !errorMeta.autoLogout) {
        navigate(errorMeta.redirectTo);
      }

      return {
        errorCode,
        errorMessage: errorMeta.message,
        handled: true
      };
    }

    // 네트워크 에러나 기타 에러
    const errorMeta = ErrorMetaMap[ErrorCode.UNKNOWN_ERROR];
    alert(errorMeta.message);

    return {
      errorCode: ErrorCode.UNKNOWN_ERROR,
      errorMessage: errorMeta.message,
      handled: true
    };
  }, [navigate, logout]);

  return { handleError };
}; 