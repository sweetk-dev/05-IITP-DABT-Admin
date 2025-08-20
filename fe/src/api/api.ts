import { ErrorCode } from '@iitp-dabt/common';
import { ensureValidToken, removeTokens, getAccessToken, getRefreshToken, saveTokens } from '../store/auth';
import { FULL_API_URLS } from '@iitp-dabt/common';
import { getUserType, clearLoginInfo } from '../store/user';
import { ROUTES } from '../routes';
import { API_BASE_URL, API_TIMEOUT } from '../config';
import type { ApiResponse } from '../types/api';
import { enhanceApiResponse } from '../utils/apiResponseHandler';
export { enhanceApiResponse };

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
    // Optional-auth: include token if present without forcing refresh/redirects
    const optionalToken = getAccessToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(optionalToken ? { Authorization: `Bearer ${optionalToken}` } : {}),
      ...(options?.headers || {}),
    } as Record<string, string>;

    const res = await fetch(`${API_BASE_URL}${path}`, { 
      ...options, 
      headers, 
      signal: controller.signal 
    });
    
    clearTimeout(id);
    const data = await res.json();
    
    if (!res.ok) {
      // Optional: 401일 때 한 번만 리프레시 후 재시도
      if (res.status === 401) {
        try {
          const refreshToken = getRefreshToken();
          const userType = getUserType();
          if (refreshToken) {
            const refreshUrl = userType === 'A' ? FULL_API_URLS.AUTH.ADMIN.REFRESH : FULL_API_URLS.AUTH.USER.REFRESH;
            const r = await fetch(`${API_BASE_URL}${refreshUrl}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken }) });
            if (r.ok) {
              const rd = await r.json();
              const newAccess = rd?.data?.token || rd?.token;
              const newRefresh = rd?.data?.refreshToken || rd?.refreshToken || refreshToken;
              if (newAccess) { saveTokens(newAccess, newRefresh); }
              const retryHeaders = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${newAccess}`
              } as Record<string, string>;
              const retryRes = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { ...(options?.headers || {}), ...retryHeaders }, signal: controller.signal });
              const retryData = await retryRes.json();
              if (retryRes.ok) {
                return enhanceApiResponse<T>(retryData);
              }
              // 재시도 실패 시 아래 일반 에러 처리로 진행
              return enhanceApiResponse<T>({ success: false, errorMessage: createUserFriendlyMessage(retryData), errorCode: retryData?.errorCode });
            }
          }
        } catch {/* fallthrough */}
      }
      return enhanceApiResponse<T>({ 
        success: false, 
        errorMessage: createUserFriendlyMessage(data), 
        errorCode: data?.errorCode 
      });
    }
    
    // 204 No Content 처리
    if (res.status === 204) {
      return enhanceApiResponse<T>({ 
        success: true, 
        data: undefined 
      });
    }
    
    return enhanceApiResponse<T>(data);
  } catch (e: any) {
    clearTimeout(id);
    
    if (e.name === 'AbortError') {
      return enhanceApiResponse<T>({ 
        success: false, 
        errorMessage: '요청 시간이 초과되었습니다.',
        errorCode: ErrorCode.REQUEST_TIMEOUT
      });
    }
    
    return enhanceApiResponse<T>({ 
      success: false, 
      errorMessage: '네트워크 오류가 발생했습니다.',
      errorCode: ErrorCode.NETWORK_ERROR
    });
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
        // 사용자 정보까지 정리하여 헤더/레이아웃이 즉시 비로그인 상태로 전환되도록 함
        clearLoginInfo();
        const userType = getUserType();
        // 서버가 FE 공통 포맷으로 에러 코드를 내려주는 경우 우선 사용
        const serverErrorCode = data?.errorCode as number | undefined;
        const redirectTo = (userType === 'A') ? ROUTES.ADMIN.LOGIN : ROUTES.PUBLIC.LOGIN;
        try {
          const returnTo = window.location.pathname + window.location.search + window.location.hash;
          sessionStorage.setItem('returnTo', returnTo);
        } catch {}
        // TOKEN_REQUIRED, TOKEN_EXPIRED, INVALID_TOKEN, UNAUTHORIZED 모두 로그인 화면으로 보냄
        if (
          serverErrorCode === ErrorCode.TOKEN_REQUIRED ||
          serverErrorCode === ErrorCode.TOKEN_EXPIRED ||
          serverErrorCode === ErrorCode.INVALID_TOKEN ||
          serverErrorCode === ErrorCode.UNAUTHORIZED ||
          serverErrorCode === undefined
        ) {
          window.location.href = redirectTo;
        } else {
          window.location.href = redirectTo;
        }
        return enhanceApiResponse<T>({ 
          success: false, 
          errorMessage: '인증이 만료되었습니다. 다시 로그인해주세요.',
          errorCode: serverErrorCode ?? ErrorCode.UNAUTHORIZED
        });
      }
      
      return enhanceApiResponse<T>({ 
        success: false, 
        errorMessage: createUserFriendlyMessage(data), 
        errorCode: data?.errorCode 
      });
    }
    
    return enhanceApiResponse<T>(data);
  } catch (e: any) {
    clearTimeout(id);
    
    if (e.name === 'AbortError') {
      return enhanceApiResponse<T>({ 
        success: false, 
        errorMessage: '요청 시간이 초과되었습니다.',
        errorCode: ErrorCode.REQUEST_TIMEOUT
      });
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
      return enhanceApiResponse<T>({ 
        success: false, 
        errorMessage: '인증이 만료되었습니다. 다시 로그인해주세요.',
        errorCode: ErrorCode.UNAUTHORIZED
      });
    }
    
    return enhanceApiResponse<T>({ 
      success: false, 
      errorMessage: '네트워크 오류가 발생했습니다.',
      errorCode: ErrorCode.NETWORK_ERROR
    });
  }
} 

// 공통 URL 빌더 (undefined/null 제거, 배열 지원)
export function buildUrl(basePath: string, query?: Record<string, any>): string {
  if (!query || Object.keys(query).length === 0) return basePath;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, String(v)));
    } else {
      params.append(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}