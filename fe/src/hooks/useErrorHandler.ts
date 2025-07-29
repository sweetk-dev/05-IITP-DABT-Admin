import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorCode } from '@iitp-dabt/common';
import { getUserType } from '../store/user';
import { ROUTES } from '../routes';

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
      const errorData = error.response.data;
      const errorCode = errorData.errorCode;

      // 자동 로그아웃이 필요한 경우 (토큰 만료 등)
      if (errorCode === ErrorCode.TOKEN_EXPIRED || errorCode === ErrorCode.INVALID_TOKEN) {
        logout();
        // 사용자 타입에 따라 적절한 로그인 페이지로 리다이렉트
        const userType = getUserType();
        if (userType === 'A') {
          navigate(ROUTES.ADMIN.LOGIN);
        } else {
          navigate(ROUTES.PUBLIC.LOGIN);
        }
      }

      // 에러 메시지 표시
      const errorMessage = errorData.errorMessage || '오류가 발생했습니다.';
      alert(errorMessage);

      return {
        errorCode,
        errorMessage,
        handled: true
      };
    }

    // 네트워크 에러나 기타 에러
    alert('알 수 없는 오류가 발생했습니다.');

    return {
      errorCode: ErrorCode.UNKNOWN_ERROR,
      errorMessage: '알 수 없는 오류가 발생했습니다.',
      handled: true
    };
  }, [navigate, logout]);

  return { handleError };
}; 