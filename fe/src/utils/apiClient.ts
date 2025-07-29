import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { ErrorCode } from '@iitp-dabt/common';
import { getUserType } from '../store/user';
import { ROUTES } from '../routes';

// API 타임아웃 설정 (기본값: 10초)
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT 
  ? parseInt(import.meta.env.VITE_API_TIMEOUT) 
  : 10000;

// API 응답 타입
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  errorMessage?: string;
  errorCode?: number;
}

// API 클라이언트 생성
const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 요청 인터셉터 - 토큰 추가
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터 - 에러 처리
  client.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      return response;
    },
    (error: AxiosError<ApiResponse>) => {
      // 토큰 만료 에러 처리 (Backend에서 이미 로그 기록됨)
      if (error.response?.data?.errorCode === ErrorCode.TOKEN_EXPIRED) {
        // 토큰 만료 시 자동 로그아웃 처리
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // 사용자 타입에 따라 적절한 로그인 페이지로 리다이렉트
        const userType = getUserType();
        if (userType === 'A') {
          window.location.href = ROUTES.ADMIN.LOGIN;
        } else {
          window.location.href = ROUTES.PUBLIC.LOGIN;
        }
      }
      
      return Promise.reject(error);
    }
  );

  return client;
};

export default createApiClient;

// 사용자 API 클라이언트
export const userApiClient = createApiClient('/api/user');

// 관리자 API 클라이언트
export const adminApiClient = createApiClient('/api/admin');

// 공통 API 클라이언트
export const commonApiClient = createApiClient('/api/common');

// 사용자 인증 API 클라이언트
export const userAuthApiClient = createApiClient('/api/auth/user');

// 관리자 인증 API 클라이언트
export const adminAuthApiClient = createApiClient('/api/auth/admin');

// API 호출 래퍼 함수
export const apiCall = async <T>(
  client: AxiosInstance,
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: any
): Promise<T> => {
  try {
    const response = await client[method](url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 