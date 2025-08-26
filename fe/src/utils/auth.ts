import {CODE_SYS_ADMIN_ROLES} from '@iitp-dabt/common';

/**
 * 프론트엔드 권한 관리 유틸리티
 * 백엔드 권한 체계와 동일하게 구현
 */

/**
 * S-Admin 권한 확인 (최고 권한 - 모든 기능 접근 가능)
 * @param adminRole 관리자 역할
 * @returns S-Admin 여부
 */
export function isSAdmin(adminRole: string | null): boolean {
  return adminRole === CODE_SYS_ADMIN_ROLES.SUPER_ADMIN;
}

/**
 * 일반 Admin 권한 확인 (ADMIN, EDITOR, VIEWER 포함)
 * @param adminRole 관리자 역할
 * @returns 일반 Admin 여부
 */
export function isAdmin(adminRole: string | null): boolean {
  return adminRole === CODE_SYS_ADMIN_ROLES.SUPER_ADMIN 
                      || adminRole === CODE_SYS_ADMIN_ROLES.ADMIN 
                      || adminRole === CODE_SYS_ADMIN_ROLES.EDITOR 
                      || adminRole === CODE_SYS_ADMIN_ROLES.VIEWER;
}

/**
 * 콘텐츠 편집 권한 확인 (S-ADMIN, ADMIN, EDITOR)
 * - FAQ, Q&A, 공지사항 등의 편집(생성/수정/삭제)
 * @param adminRole 관리자 역할
 * @returns 콘텐츠 편집 권한 여부
 */
export function hasContentEditPermission(adminRole: string | null): boolean {
  return adminRole === CODE_SYS_ADMIN_ROLES.SUPER_ADMIN 
          || adminRole === CODE_SYS_ADMIN_ROLES.ADMIN 
          || adminRole === CODE_SYS_ADMIN_ROLES.EDITOR;
}

/**
 * 읽기 권한 확인 (모든 관리자)
 * @param adminRole 관리자 역할 (role code)
 * @returns 읽기 권한 여부
 */
export function hasReadPermission(adminRole: string | null): boolean {
  return adminRole === CODE_SYS_ADMIN_ROLES.SUPER_ADMIN 
          || adminRole === CODE_SYS_ADMIN_ROLES.ADMIN 
          || adminRole === CODE_SYS_ADMIN_ROLES.EDITOR 
          || adminRole === CODE_SYS_ADMIN_ROLES.VIEWER;
}

/**
 * 운영자 계정 관리 권한 확인 (S-ADMIN만 가능)
 * - 운영자 관리 메뉴
 * - 코드 관리 메뉴
 * @param adminRole 관리자 역할
 * @returns 운영자 계정 관리 권한 여부
 */
export function hasAccountManagementPermission(adminRole: string | null): boolean {
  return adminRole === CODE_SYS_ADMIN_ROLES.SUPER_ADMIN;
}

/**
 * 사용자 계정 조회 권한 확인 (모든 관리자)
 * - 사용자 관리 메뉴 접근 (조회)
 * - 사용자 계정 정보 조회
 * @param adminRole 관리자 역할
 * @returns 사용자 계정 조회 권한 여부
 */
export function hasUserAccountReadPermission(adminRole: string | null): boolean {
  return adminRole === CODE_SYS_ADMIN_ROLES.SUPER_ADMIN 
                        || adminRole === CODE_SYS_ADMIN_ROLES.ADMIN 
                        || adminRole === CODE_SYS_ADMIN_ROLES.EDITOR 
                        || adminRole === CODE_SYS_ADMIN_ROLES.VIEWER;
}

/**
 * 사용자 계정 편집 권한 확인 (S-ADMIN, ADMIN만)
 * - 사용자 계정 생성/수정/삭제
 * - EDITOR, VIEWER는 편집 불가
 * @param adminRole 관리자 역할
 * @returns 사용자 계정 편집 권한 여부
 */
export function hasUserAccountEditPermission(adminRole: string | null): boolean {
  return adminRole === CODE_SYS_ADMIN_ROLES.SUPER_ADMIN || adminRole === CODE_SYS_ADMIN_ROLES.ADMIN;
}

/**
 * 시스템 설정 권한 확인 (S-ADMIN만 가능)
 * - 시스템 설정 메뉴 (향후 추가 예정)
 * - 데이터베이스 설정
 * - 시스템 환경 설정
 * @param adminRole 관리자 역할
 * @returns 시스템 설정 권한 여부
 */
export function hasSystemConfigPermission(adminRole: string | null): boolean {
  return adminRole === CODE_SYS_ADMIN_ROLES.SUPER_ADMIN;
}

/**
 * 메뉴 접근 권한 확인
 * @param adminRole 관리자 역할
 * @param menuName 메뉴명
 * @returns 해당 메뉴 접근 권한 여부
 */
export function hasMenuAccess(adminRole: string | null, menuName: string): boolean {
  switch (menuName) {
    case 'dashboard':
    case 'openapi':
    case 'qna':
    case 'faq':
    case 'notice':
    case 'user-management':
      return hasReadPermission(adminRole);
    
    case 'operator-management':
    case 'code-management':
      return hasAccountManagementPermission(adminRole);
    
    default:
      return hasReadPermission(adminRole);
  }
}

/**
 * 메뉴별 편집 권한 확인
 * @param adminRole 관리자 역할
 * @param menuName 메뉴명
 * @returns 해당 메뉴 편집 권한 여부
 */
export function hasMenuEditPermission(adminRole: string | null, menuName: string): boolean {
  switch (menuName) {
    case 'qna':
    case 'faq':
    case 'notice':
      return hasContentEditPermission(adminRole);
    
    case 'user-management':
      return hasUserAccountEditPermission(adminRole);
    
    case 'operator-management':
    case 'code-management':
      return hasAccountManagementPermission(adminRole);
    
    default:
      return false;
  }
}

/**
 * 버튼/액션 권한 확인
 * @param adminRole 관리자 역할
 * @param actionType 액션 타입
 * @returns 해당 액션 권한 여부
 */
export function hasActionPermission(adminRole: string | null, actionType: string): boolean {
  switch (actionType) {
    case 'create':
    case 'update':
    case 'delete':
      return hasContentEditPermission(adminRole);
    
    case 'user-create':
    case 'user-update':
    case 'user-delete':
      return hasUserAccountEditPermission(adminRole);
    
    case 'operator-create':
    case 'operator-update':
    case 'operator-delete':
      return hasAccountManagementPermission(adminRole);
    
    case 'code-create':
    case 'code-update':
    case 'code-delete':
      return hasAccountManagementPermission(adminRole);
    
    default:
      return hasReadPermission(adminRole);
  }
}
