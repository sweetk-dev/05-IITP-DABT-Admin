import crypto from 'crypto';

/**
 * OpenAPI 인증키 생성
 * 60자 길이의 랜덤 문자열 생성
 */
export function generateAuthKey(): string {
  // 60자 길이의 랜덤 문자열 생성
  const randomBytes = crypto.randomBytes(30); // 30 bytes = 60 hex characters
  return randomBytes.toString('hex');
}

/**
 * 인증키 형식 검증
 */
export function isValidAuthKeyFormat(authKey: string): boolean {
  // 60자 길이의 16진수 문자열인지 확인
  return /^[a-f0-9]{60}$/.test(authKey);
} 