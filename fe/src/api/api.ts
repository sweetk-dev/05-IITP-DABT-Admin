import { API_BASE_URL, API_TIMEOUT } from '../config';
import { 
  getAccessToken, 
  getRefreshToken, 
  saveTokens, 
  removeTokens,
  shouldRefreshAccessToken,
  validateAndCleanTokens
} from '../store/auth';
import { getUserFriendlyMessage } from '../types/errorCodes';
import { ErrorCode } from '@iitp-dabt/common';
import type { ApiResponse } from '@iitp-dabt/common';

// 토큰 갱신 상태 관리
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * 토큰 갱신 요청
 */
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    if (data.success && data.data?.accessToken) {
      saveTokens(data.data.accessToken, refreshToken);
      return data.data.accessToken;
    } else {
      throw new Error(data.errorMessage || 'Token refresh failed');
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    removeTokens();
    throw error;
  }
}

/**
 * API 요청 전 토큰 상태 확인 및 갱신
 */
async function ensureValidToken(): Promise<string | null> {
  // 토큰 유효성 검사 및 정리
  validateAndCleanTokens();
  
  const accessToken = getAccessToken();
  
  // 토큰이 없으면 null 반환
  if (!accessToken) {
    return null;
  }
  
  // 토큰 갱신이 필요한지 확인
  if (shouldRefreshAccessToken()) {
    console.log('Access token needs refresh, attempting to refresh...');
    
    if (isRefreshing) {
      // 이미 갱신 중이면 대기
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
    }
    
    isRefreshing = true;
    
    try {
      const newToken = await refreshAccessToken();
      processQueue(null, newToken);
      return newToken;
    } catch (error) {
      processQueue(error, null);
      throw error;
    } finally {
      isRefreshing = false;
    }
  }
  
  return accessToken;
}

/**
 * 사용자 친화적인 에러 메시지 생성
 */
function createUserFriendlyMessage(data: any): string {
  if (data?.errorCode && typeof data.errorCode === 'number') {
    return getUserFriendlyMessage(data.errorCode as ErrorCode, data.errorMessage);
  }
  return data?.errorMessage || '알 수 없는 오류가 발생했습니다.';
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
        // 401 에러 시 토큰 제거하고 로그인 페이지로 리다이렉트
        removeTokens();
        window.location.href = '/login';
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
    
    // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
    if (e.message === 'Token refresh failed' || e.message === 'No refresh token available') {
      removeTokens();
      window.location.href = '/login';
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

/**
 * 인증이 필요하지 않은 API 요청 (로그인, 회원가입 등)
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