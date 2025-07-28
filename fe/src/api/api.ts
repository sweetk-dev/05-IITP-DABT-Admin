import { ErrorCode } from '@iitp-dabt/common';
import { ensureValidToken, removeTokens } from '../store/auth';
import { getUserType } from '../store/user';
import { ROUTES } from '../routes';

// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:30000/api';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT ? parseInt(import.meta.env.VITE_API_TIMEOUT) : 10000;

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  errorMessage?: string;
  errorCode?: number;
}

// 사용자 친화적 에러 메시지 생성
function createUserFriendlyMessage(data: any): string {
  if (data?.errorMessage) {
    return data.errorMessage;
  }
  
  if (data?.errorCode) {
    switch (data.errorCode) {
      case ErrorCode.UNAUTHORIZED:
        return '인증이 필요합니다. 다시 로그인해주세요.';
      case ErrorCode.TOKEN_EXPIRED:
        return '로그인 세션이 만료되었습니다. 다시 로그인해주세요.';
      case ErrorCode.INVALID_TOKEN:
        return '유효하지 않은 인증 정보입니다. 다시 로그인해주세요.';
      case ErrorCode.ACCESS_DENIED:
        return '접근 권한이 없습니다.';
      case ErrorCode.USER_NOT_FOUND:
        return '사용자를 찾을 수 없습니다.';
      case ErrorCode.LOGIN_FAILED:
        return '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.';
      case ErrorCode.NETWORK_ERROR:
        return '네트워크 오류가 발생했습니다.';
      case ErrorCode.REQUEST_TIMEOUT:
        return '요청 시간이 초과되었습니다.';
      default:
        return '오류가 발생했습니다. 다시 시도해주세요.';
    }
  }
  
  return '알 수 없는 오류가 발생했습니다.';
}

/**
 * 공개 API 요청 함수 (인증 불필요)
 */
export async function publicApiFetch<T = any>(
  path: string,
  options?: RequestInit & { timeoutMs?: number }
): Promise<ApiResponse<T>> {
  const timeoutMs = options?.timeoutMs ?? API_TIMEOUT;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    };

    const res = await fetch(`${API_BASE_URL}${path}`, { 
      ...options, 
      headers, 
      signal: controller.signal 
    });
    
    clearTimeout(id);
    const data = await res.json();
    
    if (!res.ok) {
      return { 
        success: false, 
        errorMessage: createUserFriendlyMessage(data), 
        errorCode: data?.errorCode 
      };
    }
    
    return data;
  } catch (e: any) {
    clearTimeout(id);
    
    if (e.name === 'AbortError') {
      return { 
        success: false, 
        errorMessage: '요청 시간이 초과되었습니다.',
        errorCode: ErrorCode.REQUEST_TIMEOUT
      };
    }
    
    return { 
      success: false, 
      errorMessage: '네트워크 오류가 발생했습니다.',
      errorCode: ErrorCode.NETWORK_ERROR
    };
  }
}

/**
 * API 요청 함수
 */
export async function apiFetch<T = any>(
  path: string,
  options?: RequestInit & { timeoutMs?: number }
): Promise<ApiResponse<T>> {
  const timeoutMs = options?.timeoutMs ?? API_TIMEOUT;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // 토큰 상태 확인 및 갱신
    const accessToken = await ensureValidToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options?.headers || {}),
    };

    const res = await fetch(`${API_BASE_URL}${path}`, { 
      ...options, 
      headers, 
      signal: controller.signal 
    });
    
    clearTimeout(id);
    const data = await res.json();
    
    if (!res.ok) {
      if (res.status === 401) {
        // 401 에러 시 토큰 제거하고 사용자 타입에 따라 적절한 로그인 페이지로 리다이렉트
        removeTokens();
        const userType = getUserType();
        if (userType === 'A') {
          window.location.href = ROUTES.ADMIN.LOGIN;
        } else {
          window.location.href = ROUTES.PUBLIC.LOGIN;
        }
        return { 
          success: false, 
          errorMessage: '인증이 만료되었습니다. 다시 로그인해주세요.',
          errorCode: ErrorCode.UNAUTHORIZED
        };
      }
      
      return { 
        success: false, 
        errorMessage: createUserFriendlyMessage(data), 
        errorCode: data?.errorCode 
      };
    }
    
    return data;
  } catch (e: any) {
    clearTimeout(id);
    
    if (e.name === 'AbortError') {
      return { 
        success: false, 
        errorMessage: '요청 시간이 초과되었습니다.',
        errorCode: ErrorCode.REQUEST_TIMEOUT
      };
    }
    
    // 토큰 갱신 실패 시 사용자 타입에 따라 적절한 로그인 페이지로 리다이렉트
    if (e.message === 'Token refresh failed' || e.message === 'No refresh token available') {
      removeTokens();
      const userType = getUserType();
      if (userType === 'A') {
        window.location.href = ROUTES.ADMIN.LOGIN;
      } else {
        window.location.href = ROUTES.PUBLIC.LOGIN;
      }
      return { 
        success: false, 
        errorMessage: '인증이 만료되었습니다. 다시 로그인해주세요.',
        errorCode: ErrorCode.UNAUTHORIZED
      };
    }
    
    return { 
      success: false, 
      errorMessage: '네트워크 오류가 발생했습니다.',
      errorCode: ErrorCode.NETWORK_ERROR
    };
  }
} 