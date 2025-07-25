import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorCode } from '@iitp-dabt/common';
import { getErrorUIMeta, shouldShowPopup, shouldAutoLogout, getRedirectPath } from '../types/errorCodes';

interface ErrorResponse {
  success: false;
  errorCode: ErrorCode;
  errorMessage: string;
}

export const useErrorHandler = () => {
  const navigate = useNavigate();
  
  // 임시 더미 logout 함수 (나중에 실제 useAuth로 교체)
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    console.log('User logged out');
  }, []);

  const handleError = useCallback((error: any) => {
    console.error('Error handled:', error);

    // API 응답 에러인 경우
    if (error?.response?.data) {
      const errorData: ErrorResponse = error.response.data;
      const errorCode = errorData.errorCode;
      const errorUIMeta = getErrorUIMeta(errorCode);

      // 자동 로그아웃이 필요한 경우
      if (shouldAutoLogout(errorCode)) {
        logout();
        const redirectPath = getRedirectPath(errorCode);
        if (redirectPath) {
          navigate(redirectPath);
        }
      }

      // 팝업 표시가 필요한 경우
      if (shouldShowPopup(errorCode)) {
        // 여기서 토스트나 알림 컴포넌트를 호출
        // 예: toast.error(errorUIMeta.message);
        alert(errorUIMeta.message);
      }

      // 리다이렉트가 필요한 경우
      const redirectPath = getRedirectPath(errorCode);
      if (redirectPath && !shouldAutoLogout(errorCode)) {
        navigate(redirectPath);
      }

      return {
        errorCode,
        errorMessage: errorUIMeta.message,
        handled: true
      };
    }

    // 네트워크 에러나 기타 에러
    const errorUIMeta = getErrorUIMeta(ErrorCode.UNKNOWN_ERROR);
    alert(errorUIMeta.message);

    return {
      errorCode: ErrorCode.UNKNOWN_ERROR,
      errorMessage: errorUIMeta.message,
      handled: true
    };
  }, [navigate, logout]);

  return { handleError };
}; 