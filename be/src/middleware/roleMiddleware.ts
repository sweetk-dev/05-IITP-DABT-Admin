import { RequestHandler } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError } from '../utils/errorHandler';
import { USER_TYPE_ADMIN } from '../utils/commonUtils';
import {
  hasReadPermission,
  hasContentEditPermission,
  hasUserAccountReadPermission,
  hasUserAccountEditPermission,
  hasOpenApiKeyEditPermission,
  hasAccountManagementPermission,
  hasCodeManagementPermission
} from '../utils/auth';

/**
 * 관리자 역할(Role) 검사 미들웨어
 *
 * `routerMiddleware.admin`(관리자 토큰 검증) 뒤에 붙여서, 토큰에 담긴 역할 코드(role)가
 * 그 작업에 허용된 역할인지 라우터 단계에서 확인한다.
 *
 * 왜 라우터 단계인가
 * - 관리자 토큰만 확인하고 역할을 컨트롤러마다 따로 검사하면, 검사가 빠진 컨트롤러는
 *   역할과 상관없이(VIEWER 포함) 쓰기 작업이 가능해진다. 허용 역할을 라우트 정의 바로 옆에 두어
 *   한눈에 보이고 빠지지 않게 한다.
 * - 컨트롤러 안의 기존 검사(isSAdmin 등)는 그대로 둔다. 같은 기준의 두 번째 방어선이다.
 *
 * 판정 기준
 * - 판정 함수는 `utils/auth.ts` 의 권한 헬퍼를 그대로 쓴다. 화면의 메뉴·버튼 노출 조건
 *   (`fe/src/utils/auth.ts` 의 같은 이름 함수)과 같은 기준이어야 화면에서 보이는 버튼이 서버에서 막히지 않는다.
 * - 역할 코드가 없거나 정의되지 않은 값이면 거부한다(기본 거부). 헬퍼가 허용 목록 방식이라 자연히 그렇게 된다.
 * - 관리자 토큰이 아닌 경우(일반 사용자 토큰)도 거부한다. `routerMiddleware.admin` 이 이미 막지만,
 *   이 미들웨어를 다른 체인에 잘못 붙여도 안전하도록 한 번 더 본다.
 */

/** 관리자 역할 코드를 받아 허용 여부를 돌려주는 판정 함수 */
export type AdminPermissionCheck = (adminRole: string | null) => boolean;

const DEFAULT_DENIED_MESSAGE = '해당 작업을 수행할 권한이 없습니다.';

/**
 * 역할 검사 미들웨어 생성
 * @param check 허용 여부 판정 함수 (utils/auth.ts 의 권한 헬퍼)
 * @param deniedMessage 거부 시 응답 메시지
 */
export const requireRole = (
  check: AdminPermissionCheck,
  deniedMessage: string = DEFAULT_DENIED_MESSAGE
): RequestHandler<any, any, any, any> => {
  return (req, res, next) => {
    if (req.user?.userType !== USER_TYPE_ADMIN) {
      return sendError(res, ErrorCode.FORBIDDEN);
    }
    const adminRole = req.user?.admRole || null;
    if (!check(adminRole)) {
      return sendError(res, ErrorCode.FORBIDDEN, deniedMessage);
    }
    next();
  };
};

/**
 * 라우터에서 쓰는 역할 검사 묶음
 *
 * | 이름            | 허용 역할                         | 쓰는 곳 |
 * |-----------------|-----------------------------------|---------|
 * | read            | S-ADMIN, ADMIN, EDITOR, VIEWER    | FAQ·공지·Q&A·인증키 조회 |
 * | contentEdit     | S-ADMIN, ADMIN, EDITOR            | FAQ·공지 작성/수정/삭제, Q&A 답변/수정/삭제 |
 * | userAccountRead | S-ADMIN, ADMIN, EDITOR, VIEWER    | 사용자 계정 목록·상세 |
 * | userAccountEdit | S-ADMIN, ADMIN                    | 사용자 계정 생성/수정/삭제/비밀번호/상태, 이메일 중복 확인 |
 * | openApiKeyEdit  | S-ADMIN, ADMIN                    | 인증키 발급/수정/기간연장/삭제 |
 * | superAdmin      | S-ADMIN                           | 운영자 계정 관리 전체 |
 * | codeManagement  | S-ADMIN                           | 공통코드 관리(관리자용 조회 포함) |
 */
export const roleGuard = {
  read: requireRole(hasReadPermission),
  contentEdit: requireRole(hasContentEditPermission, '콘텐츠 편집 권한이 필요합니다.'),
  userAccountRead: requireRole(hasUserAccountReadPermission),
  userAccountEdit: requireRole(hasUserAccountEditPermission, '사용자 계정 편집 권한이 필요합니다.'),
  openApiKeyEdit: requireRole(hasOpenApiKeyEditPermission, '인증키 관리 권한이 필요합니다.'),
  superAdmin: requireRole(hasAccountManagementPermission, 'S-ADMIN 권한이 필요합니다.'),
  codeManagement: requireRole(hasCodeManagementPermission, 'S-ADMIN 권한이 필요합니다.')
} as const;
