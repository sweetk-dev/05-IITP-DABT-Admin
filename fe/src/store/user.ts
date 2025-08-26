import { saveTokens, removeTokens, removeTokensByType, removeAllTokens } from './auth';

interface UserInfo {
  userId: number;
  email: string;
  name: string;
  userType: 'U' | 'A';
  role?: string; // 관리자의 경우 role 정보
  roleName?: string; // 관리자의 경우 role 이름
}

// User/Admin 독립적 저장을 위한 prefix 상수
const USER_PREFIX = 'user_';
const ADMIN_PREFIX = 'admin_';
const USER_INFO_KEY = 'userInfo';

/**
 * 현재 활성화된 사용자 타입에 맞는 prefix 자동 반환
 * 우선순위: Admin > User (Admin이 있으면 Admin 우선)
 */
function getCurrentPrefix(forceUserType?: 'U' | 'A'): string {
  // 강제 지정된 타입이 있으면 해당 prefix 반환
  if (forceUserType) {
    return forceUserType === 'A' ? ADMIN_PREFIX : USER_PREFIX;
  }
  
  // localStorage에서 실제 존재하는 데이터 확인하여 자동 판단
  const adminInfo = localStorage.getItem(ADMIN_PREFIX + USER_INFO_KEY);
  const userInfo = localStorage.getItem(USER_PREFIX + USER_INFO_KEY);
  
  // Admin 정보가 있으면 Admin 우선 (관리자가 활성 상태)
  if (adminInfo) {
    try {
      const parsed = JSON.parse(adminInfo);
      if (parsed && parsed.userType === 'A') {
        return ADMIN_PREFIX;
      }
    } catch {}
  }
  
  // User 정보가 있으면 User 사용
  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      if (parsed && parsed.userType === 'U') {
        return USER_PREFIX;
      }
    } catch {}
  }
  
  // 둘 다 없으면 User 기본값 (새 로그인 대비)
  return USER_PREFIX;
}

/**
 * 사용자 정보 저장 (타입에 맞는 prefix 사용)
 */
export function saveUserInfo(userInfo: UserInfo) {
  const prefix = getCurrentPrefix(userInfo.userType);
  localStorage.setItem(prefix + USER_INFO_KEY, JSON.stringify(userInfo));
}

/**
 * 사용자 정보 가져오기 (현재 활성 사용자 타입 기준)
 */
export function getUserInfo(): UserInfo | null {
  const prefix = getCurrentPrefix();
  const userInfoStr = localStorage.getItem(prefix + USER_INFO_KEY);
  if (!userInfoStr) return null;
  
  try {
    return JSON.parse(userInfoStr);
  } catch (error) {
    console.error('Failed to parse user info:', error);
    return null;
  }
}

/**
 * Admin 사용자 정보 가져오기 (Admin 정보 직접 확인)
 */
export function getAdminInfo(): UserInfo | null {
  const adminInfoStr = localStorage.getItem(ADMIN_PREFIX + USER_INFO_KEY);
  if (!adminInfoStr) return null;
  
  try {
    return JSON.parse(adminInfoStr);
  } catch (error) {
    console.error('Failed to parse admin info:', error);
    return null;
  }
}

/**
 * User 사용자 정보 가져오기 (User 정보 직접 확인)
 */
export function getUserInfoDirect(): UserInfo | null {
  const userInfoStr = localStorage.getItem(USER_PREFIX + USER_INFO_KEY);
  if (!userInfoStr) return null;
  
  try {
    return JSON.parse(userInfoStr);
  } catch (error) {
    console.error('Failed to parse user info:', error);
    return null;
  }
}

/**
 * 특정 타입의 사용자 정보만 제거
 */
export function removeUserInfo() {
  const prefix = getCurrentPrefix();
  localStorage.removeItem(prefix + USER_INFO_KEY);
}

/**
 * 모든 사용자 타입의 정보 제거 (완전 초기화)
 */
export function removeAllUserInfo() {
  localStorage.removeItem(USER_PREFIX + USER_INFO_KEY);
  localStorage.removeItem(ADMIN_PREFIX + USER_INFO_KEY);
}

/**
 * 특정 사용자 타입의 정보만 제거
 */
export function removeUserInfoByType(userType: 'U' | 'A') {
  const prefix = userType === 'A' ? ADMIN_PREFIX : USER_PREFIX;
  localStorage.removeItem(prefix + USER_INFO_KEY);
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
 * 현재 활성 사용자 타입 자동 판단 (U: 일반 사용자, A: 관리자)
 * Admin이 있으면 Admin 우선, 없으면 User
 */
export function getUserType(): 'U' | 'A' | null {
  // Admin 정보 먼저 확인 (우선순위)
  const adminInfo = localStorage.getItem(ADMIN_PREFIX + USER_INFO_KEY);
  if (adminInfo) {
    try {
      const parsed = JSON.parse(adminInfo);
      if (parsed && parsed.userType === 'A') {
        return 'A';
      }
    } catch {}
  }
  
  // User 정보 확인
  const userInfo = localStorage.getItem(USER_PREFIX + USER_INFO_KEY);
  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      if (parsed && parsed.userType === 'U') {
        return 'U';
      }
    } catch {}
  }
  
  return null; // 둘 다 없으면 null
}

/**
 * 권한 체크용 Admin Role 반환 (userInfo.role 사용)
 * @returns Admin role code (예: 'S-ADMIN', 'ADMIN', 'EDITOR', 'VIEWER')
 */
export function getAdminRole(): string {
  const adminInfoStr = localStorage.getItem(ADMIN_PREFIX + USER_INFO_KEY);
  if (!adminInfoStr) {
    console.log('[getAdminRole] No admin info found');
    return '';
  }
  
  try {
    const adminInfo = JSON.parse(adminInfoStr);
    const role = adminInfo?.role || '';

    return role;
  } catch (error) {
    console.error('Failed to parse admin info:', error);
    return '';
  }
}

/**
 * 화면 표시용 Admin Role Name 반환 (userInfo.roleName 사용)
 * @returns Admin role display name (예: 'Super Admin', 'Admin', 'Editor', 'Viewer')
 */
export function getAdminRoleName(): string {
  const adminInfoStr = localStorage.getItem(ADMIN_PREFIX + USER_INFO_KEY);
  if (!adminInfoStr) {
    return '관리자';
  }
  
  try {
    const adminInfo = JSON.parse(adminInfoStr);
    const roleName = adminInfo?.roleName || '관리자';

    return roleName;
  } catch (error) {
    console.error('Failed to parse admin info:', error);
    return '관리자';
  }
}

/**
 * 로그인 시 사용자 정보와 토큰을 함께 저장
 * 새로운 타입으로 로그인 시 이전 타입 정보는 유지 (독립적 운영)
 */
export function saveLoginInfo(userInfo: UserInfo, accessToken: string, refreshToken: string) {
  saveUserInfo(userInfo);
  saveTokens(accessToken, refreshToken);
}

/**
 * 로그인 시 이전 다른 타입 정보 정리 후 새 정보 저장 (배타적 운영)
 */
export function saveLoginInfoExclusive(userInfo: UserInfo, accessToken: string, refreshToken: string) {
  // 새로 로그인하는 타입과 반대 타입의 정보 제거
  const oppositeType = userInfo.userType === 'A' ? 'U' : 'A';
  clearLoginInfoByType(oppositeType);
  
  // 새 정보 저장
  saveUserInfo(userInfo);
  saveTokens(accessToken, refreshToken);
}

/**
 * 현재 활성 사용자 타입의 로그인 정보만 제거 (자동 분기)
 */
export function clearLoginInfo() {
  removeUserInfo(); // 현재 타입의 사용자 정보만 제거
  removeTokens();   // 현재 타입의 토큰만 제거
}

/**
 * 특정 사용자 타입의 로그인 정보만 제거
 */
export function clearLoginInfoByType(userType: 'U' | 'A') {
  removeUserInfoByType(userType);
  removeTokensByType(userType);
}

/**
 * 모든 타입의 로그인 정보 완전 제거 (전체 초기화)
 */
export function clearAllLoginInfo() {
  removeAllUserInfo();
  removeAllTokens();
} 