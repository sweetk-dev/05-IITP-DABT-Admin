import { saveTokens, removeTokens } from './auth';

interface UserInfo {
  userId: number;
  email: string;
  name: string;
  userType: 'U' | 'A';
  role?: string; // 관리자의 경우 role 정보
}

const USER_INFO_KEY = 'userInfo';

/**
 * 사용자 정보 저장
 */
export function saveUserInfo(userInfo: UserInfo) {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
}

/**
 * 사용자 정보 가져오기
 */
export function getUserInfo(): UserInfo | null {
  const userInfoStr = localStorage.getItem(USER_INFO_KEY);
  if (!userInfoStr) return null;
  
  try {
    return JSON.parse(userInfoStr);
  } catch (error) {
    console.error('Failed to parse user info:', error);
    return null;
  }
}

/**
 * 사용자 정보 제거
 */
export function removeUserInfo() {
  localStorage.removeItem(USER_INFO_KEY);
}

/**
 * 사용자 이름 가져오기
 */
export function getUserName(): string {
  const userInfo = getUserInfo();
  return userInfo?.name || '사용자';
}

/**
 * 사용자 이메일 가져오기
 */
export function getUserEmail(): string {
  const userInfo = getUserInfo();
  return userInfo?.email || '';
}

/**
 * 사용자 타입 가져오기 (U: 일반 사용자, A: 관리자)
 */
export function getUserType(): 'U' | 'A' | null {
  const userInfo = getUserInfo();
  return userInfo?.userType || null;
}

/**
 * 관리자 role 가져오기
 */
export function getAdminRole(): string {
  const userInfo = getUserInfo();
  return userInfo?.roleName || '관리자';
}

/**
 * 로그인 시 사용자 정보와 토큰을 함께 저장
 */
export function saveLoginInfo(userInfo: UserInfo, accessToken: string, refreshToken: string) {
  saveUserInfo(userInfo);
  saveTokens(accessToken, refreshToken);
}

/**
 * 로그아웃 시 모든 정보 제거
 */
export function clearLoginInfo() {
  removeUserInfo();
  removeTokens();
} 