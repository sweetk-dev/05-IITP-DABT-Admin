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

// 허용 가능한 특수문자 상수
const ALLOWED_SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:\'",./<>?';

/**
 * 비밀번호 유효성 검사
 * @param password 검사할 비밀번호
 * @returns 유효한 비밀번호 형식인지 여부
 * 
 * 조건:
 * - 최소 8자 이상
 * - 영문자 포함 (대문자 또는 소문자)
 * - 숫자 포함
 * - 특수문자 포함 (!@#$%^&*()_+-=[]{}|;':",./<>?)
 */
export function isValidPassword(password: string): boolean {
  const validation = validatePassword(password);
  return validation.isValid;
}

/**
 * 비밀번호 검증 및 상세 에러 메시지 반환
 * @param password 검사할 비밀번호
 * @returns 검증 결과와 상세 에러 메시지
 */
export function validatePassword(password: string): { isValid: boolean; errorMessage?: string } {
  if (!password || typeof password !== 'string') {
    return { isValid: false, errorMessage: '비밀번호를 입력해 주세요.' };
  }

  // 허용되지 않는 특수문자 확인
  const allowedSpecialChars = /[!@#$%^&*()_+\-=\[\]{}|;':",./<>?]/g;
  const allSpecialChars = /[^A-Za-z0-9]/g;
  
  const allChars = password.match(allSpecialChars) || [];
  const invalidChars = allChars.filter(char => !allowedSpecialChars.test(char));
  
  if (invalidChars.length > 0) {
    const uniqueInvalidChars = [...new Set(invalidChars)];
    return { 
      isValid: false, 
      errorMessage: '허용되지 않는 특수문자: ' + uniqueInvalidChars.join(', ') + '. 허용 가능한 특수문자: ' + ALLOWED_SPECIAL_CHARS
    };
  }

  // 길이 확인
  if (password.length < 8) {
    return { isValid: false, errorMessage: '비밀번호는 8자리 이상이어야 합니다.' };
  }

  // 영문자 확인
  if (!/[a-zA-Z]/.test(password)) {
    return { isValid: false, errorMessage: '비밀번호는 영문자를 포함해야 합니다.' };
  }

  // 숫자 확인
  if (!/\d/.test(password)) {
    return { isValid: false, errorMessage: '비밀번호는 숫자를 포함해야 합니다.' };
  }

  // 특수문자 확인
  if (!allowedSpecialChars.test(password)) {
    return { isValid: false, errorMessage: '비밀번호는 특수문자를 포함해야 합니다. 허용 가능한 특수문자: ' + ALLOWED_SPECIAL_CHARS };
  }

  return { isValid: true };
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