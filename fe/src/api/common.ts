import { publicApiFetch } from './api';

export interface JwtConfigResponse {
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
  issuer: string;
}

export interface VersionResponse {
  version: string;
  buildDate: string;
}

/**
 * JWT 설정 정보 가져오기
 */
export async function getJwtConfig(): Promise<JwtConfigResponse> {
  const response = await publicApiFetch<JwtConfigResponse>('/common/jwt-config');
  return response.data as JwtConfigResponse;
}

/**
 * 서버 버전 정보 가져오기
 */
export async function getVersion(): Promise<VersionResponse> {
  const response = await publicApiFetch<VersionResponse>('/common/version');
  return response.data as VersionResponse;
} 