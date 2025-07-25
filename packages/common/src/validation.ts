/**
 * 공통 검증 유틸리티
 * 
 * Frontend와 Backend에서 공통으로 사용되는 검증 함수들
 */

/**
 * 이메일 유효성 검사
 * @param email 검사할 이메일 주소
 * @returns 유효한 이메일 형식인지 여부
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // RFC 5322 표준에 따른 이메일 정규식
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email.trim());
}

/**
 * 비밀번호 유효성 검사
 * @param password 검사할 비밀번호
 * @returns 유효한 비밀번호 형식인지 여부
 * 
 * 조건:
 * - 최소 8자 이상
 * - 영문 대/소문자 포함
 * - 숫자 포함
 * - 특수문자 포함 (!@#$%^&*()_+-=[]{}|;':",./<>?)
 */
export function isValidPassword(password: string): boolean {
  if (!password || typeof password !== 'string') {
    return false;
  }
  
  // 최소 8자, 영문/숫자/특수문자 조합
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;':",./<>?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{}|;':",./<>?]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * 비밀번호 강도 검사
 * @param password 검사할 비밀번호
 * @returns 비밀번호 강도 ('weak' | 'medium' | 'strong')
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (!password || typeof password !== 'string') {
    return 'weak';
  }
  
  let score = 0;
  
  // 길이 체크
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // 문자 종류 체크
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{}|;':",./<>?]/.test(password)) score += 1;
  
  // 연속된 문자나 반복 패턴 체크 (점수 감점)
  if (/(.)\1{2,}/.test(password)) score -= 1; // 같은 문자 3번 이상 반복
  if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(password)) {
    score -= 1; // 연속된 문자
  }
  
  if (score <= 2) return 'weak';
  if (score <= 5) return 'medium';
  return 'strong';
}

/**
 * 이름 유효성 검사
 * @param name 검사할 이름
 * @returns 유효한 이름 형식인지 여부
 */
export function isValidName(name: string): boolean {
  if (!name || typeof name !== 'string') {
    return false;
  }
  
  const trimmedName = name.trim();
  // 2-50자, 한글/영문/숫자/공백 허용
  const nameRegex = /^[가-힣a-zA-Z0-9\s]{2,50}$/;
  return nameRegex.test(trimmedName) && trimmedName.length > 0;
}

/**
 * 소속 유효성 검사
 * @param affiliation 검사할 소속
 * @returns 유효한 소속 형식인지 여부
 */
export function isValidAffiliation(affiliation: string): boolean {
  if (!affiliation || typeof affiliation !== 'string') {
    return false;
  }
  
  const trimmedAffiliation = affiliation.trim();
  // 2-100자, 한글/영문/숫자/공백/특수문자 허용
  const affiliationRegex = /^[가-힣a-zA-Z0-9\s\-_\.]{2,100}$/;
  return affiliationRegex.test(trimmedAffiliation) && trimmedAffiliation.length > 0;
} 