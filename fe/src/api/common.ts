import { publicApiFetch } from './api';
import { FULL_API_URLS } from '@iitp-dabt/common';
import type {
  JwtConfigRes,
  VersionRes
} from '@iitp-dabt/common';
import type { ApiResponse } from '../types/api';

/**
 * JWT 설정 정보 가져오기
 */
export async function getJwtConfig(): Promise<ApiResponse<JwtConfigRes>> {
  return publicApiFetch<JwtConfigRes>(FULL_API_URLS.COMMON.JWT_CONFIG, { method: 'GET' });
}

/**
 * 서버 버전 정보 가져오기
 */
export async function getVersion(): Promise<ApiResponse<VersionRes>> {
  return publicApiFetch<VersionRes>(FULL_API_URLS.COMMON.VERSION, { method: 'GET' });
} 