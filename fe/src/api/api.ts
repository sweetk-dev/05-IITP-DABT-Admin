import { API_BASE_URL, API_TIMEOUT } from '../config';
import { getAccessToken, getRefreshToken, saveTokens, removeTokens } from '../store/auth';

export interface ApiResponse<T = any> {
  result: 'ok' | 'fail';
  data?: T;
  message?: string;
  errorCode?: number;
  accessToken?: string;
}

let isRefreshing = false;
let failedQueue: any[] = [];

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

export async function apiFetch<T = any>(
  path: string,
  options?: RequestInit & { timeoutMs?: number }
): Promise<ApiResponse<T>> {
  const timeoutMs = options?.timeoutMs ?? API_TIMEOUT;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  const accessToken = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options?.headers || {}),
  };

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, signal: controller.signal });
    clearTimeout(id);
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 401) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => apiFetch(path, { ...options, headers: { ...headers, Authorization: `Bearer ${token}` } }))
            .catch(err => Promise.reject(err));
        }
        isRefreshing = true;
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          return fetch(`${API_BASE_URL}/user/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          })
            .then(refreshRes => refreshRes.json())
            .then(refreshData => {
              saveTokens(refreshData.accessToken, refreshToken);
              processQueue(null, refreshData.accessToken);
              return apiFetch(path, { ...options, headers: { ...headers, Authorization: `Bearer ${refreshData.accessToken}` } });
            })
            .catch(err => {
              processQueue(err, null);
              removeTokens();
              window.location.href = '/login';
              return Promise.reject(err);
            })
            .finally(() => { isRefreshing = false; });
        } else {
          removeTokens();
          window.location.href = '/login';
          return Promise.reject(new Error('No refresh token'));
        }
      }
      return { result: 'fail', message: data?.message || '알 수 없는 오류가 발생했습니다.', errorCode: data?.errorCode };
    }
    return data;
  } catch (e: any) {
    clearTimeout(id);
    if (e.name === 'AbortError') {
      return { result: 'fail', message: '요청 시간이 초과되었습니다.' };
    }
    return { result: 'fail', message: '네트워크 오류가 발생했습니다.' };
  }
} 