import { Router } from 'express';
import { API_URLS } from '@iitp-dabt/common';
import { routerMiddleware } from '../middleware';
import { roleGuard } from '../middleware/roleMiddleware';
import {
  getCodes,
  getCode,  
  getCodesByType,
  getCodesByParent,
  getCodeGroupsForAdmin,
  getCodesByGroupForAdmin,
  createCodeGroupByAdmin,
  updateCodeGroupByAdmin,
  deleteCodeGroupsByAdmin,
  getCodeForAdmin,
  getCodesByTypeForAdmin,
  getCodesByParentForAdmin,
  createCodeByAdmin,
  updateCodeByAdmin,
  deleteCodeByAdmin,
  deleteCodesInGroupByAdmin
} from '../controllers/common/commonCodeController';

const router = Router();

/*
 * 관리자용 경로(/admin/...)는 조회까지 포함해 S-ADMIN 전용이다 (roleGuard.codeManagement).
 * - 코드 관리 메뉴 자체가 S-ADMIN 전용(utils/auth.ts hasMenuAccess)이고, 관리자용 조회는 그 화면에서만 쓴다.
 * - 생성·수정·삭제 컨트롤러에도 S-ADMIN 검사가 있지만 일괄 삭제처럼 빠진 곳이 있어 라우터에서 한 번에 막는다.
 * - 일반 화면의 코드 조회는 아래 기본 조회 API(공개)를 쓰므로 영향이 없다.
 */

// === 관리자용 그룹 관리 API (가장 구체적인 경로) ===
// 그룹 목록 조회
router.get(API_URLS.COMMON_CODE.GROUP.LIST, ...routerMiddleware.admin, roleGuard.codeManagement, getCodeGroupsForAdmin as any);
// 그룹 생성
router.post(API_URLS.COMMON_CODE.GROUP.CREATE, ...routerMiddleware.admin, roleGuard.codeManagement, createCodeGroupByAdmin as any);
// 그룹 수정
router.put(API_URLS.COMMON_CODE.GROUP.UPDATE, ...routerMiddleware.admin, roleGuard.codeManagement, updateCodeGroupByAdmin as any);
// 그룹 삭제 (단일)
router.delete(API_URLS.COMMON_CODE.GROUP.DELETE, ...routerMiddleware.admin, roleGuard.codeManagement, deleteCodeGroupsByAdmin as any);
// 그룹 삭제 (다중)
router.delete(API_URLS.COMMON_CODE.GROUP.LIST_DELETE, ...routerMiddleware.admin, roleGuard.codeManagement, deleteCodeGroupsByAdmin as any);  

// === 관리자용 코드 관리 API ===
// 코드 생성
router.post(API_URLS.COMMON_CODE.CODE.CREATE, ...routerMiddleware.admin, roleGuard.codeManagement, createCodeByAdmin as any);
// 코드 수정
router.put(API_URLS.COMMON_CODE.CODE.UPDATE, ...routerMiddleware.admin, roleGuard.codeManagement, updateCodeByAdmin as any);
// 코드 삭제 (단일)
router.delete(API_URLS.COMMON_CODE.CODE.DELETE, ...routerMiddleware.admin, roleGuard.codeManagement, deleteCodeByAdmin as any);
// 코드 삭제 (다중)
router.post(API_URLS.COMMON_CODE.CODE.LIST_DELETE, ...routerMiddleware.admin, roleGuard.codeManagement, deleteCodesInGroupByAdmin as any);

// === 관리자용 상세 조회 API ===
// 그룹별 조회 (상세)
router.get(API_URLS.COMMON_CODE.ADMIN.BY_GROUP, ...routerMiddleware.admin, roleGuard.codeManagement, getCodesByGroupForAdmin as any);
// 코드 상세 조회 (상세)
router.get(API_URLS.COMMON_CODE.ADMIN.BY_ID, ...routerMiddleware.admin, roleGuard.codeManagement, getCodeForAdmin as any);
// 타입별 조회 (상세)
router.get(API_URLS.COMMON_CODE.ADMIN.BY_TYPE, ...routerMiddleware.admin, roleGuard.codeManagement, getCodesByTypeForAdmin as any);
// 계층형 조회 (상세)
router.get(API_URLS.COMMON_CODE.ADMIN.BY_PARENT, ...routerMiddleware.admin, roleGuard.codeManagement, getCodesByParentForAdmin as any);

// === 기본 조회 API (사용자용) - 가장 일반적인 경로를 마지막에 정의 ===
// 그룹별 조회
router.get(API_URLS.COMMON_CODE.BASIC.BY_GROUP, ...routerMiddleware.public, getCodes as any);
// 코드 상세 조회
router.get(API_URLS.COMMON_CODE.BASIC.BY_ID, ...routerMiddleware.public, getCode as any);
// 타입별 조회
router.get(API_URLS.COMMON_CODE.BASIC.BY_TYPE, ...routerMiddleware.public, getCodesByType as any);
// 계층형 조회
router.get(API_URLS.COMMON_CODE.BASIC.BY_PARENT, ...routerMiddleware.public, getCodesByParent as any);

export default router; 