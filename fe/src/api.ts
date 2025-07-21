import { API_BASE_URL, API_TIMEOUT } from './config';

export interface ApiResponse<T = any> {
  result: 'ok' | 'fail';
  data?: T;
  message?: string;
  errorCode?: number;
}

export async function apiFetch<T = any>(
  path: string,
  options?: RequestInit & { timeoutMs?: number }
): Promise<ApiResponse<T>> {
  const timeoutMs = options?.timeoutMs ?? API_TIMEOUT; // 환경변수에서 기본값 사용
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    const data = await res.json();
    if (!res.ok) {
      return {
        result: 'fail',
        message: data?.message || '알 수 없는 오류가 발생했습니다.',
        errorCode: data?.errorCode,
      };
    }
    return data;
  } catch (e: any) {
    clearTimeout(id);
    if (e.name === 'AbortError') {
      return {
        result: 'fail',
        message: '요청 시간이 초과되었습니다. 네트워크 상태를 확인해 주세요.',
      };
    }
    return {
      result: 'fail',
      message: '네트워크 오류가 발생했습니다.',
    };
  }
} 