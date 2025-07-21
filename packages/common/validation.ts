// FE/BE 공통 이메일/비밀번호 패턴 검증 유틸

export function isValidEmail(email: string): boolean {
  return /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email);
}
 
export function isValidPassword(password: string): boolean {
  // 8자 이상, 영문/숫자/특수문자 포함
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
} 