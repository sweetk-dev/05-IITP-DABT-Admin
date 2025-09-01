import { Router } from 'express';
import { API_URLS } from '@iitp-dabt/common';
import { routerMiddleware } from '../middleware';
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

// === 기본 조회 API (사용자용) ===
// 그룹별 조회 (정적 → 동적 숫자 제약)
//router.get('/:grpId', ...routerMiddleware.public, getCodes as any);
router.get(API_URLS.COMMON_CODE.BASIC.BY_GROUP, ...routerMiddleware.public, getCodes as any);
// 코드 상세 조회 (숫자/문자 제약은 도메인에 따라 조정 가능)
router.get('/:grpId/:codeId', ...routerMiddleware.public, getCode as any);
// 타입별 조회
router.get('/type/:codeType', ...routerMiddleware.public, getCodesByType as any);
// 계층형 조회
router.get('/:grpId/parent', ...routerMiddleware.public, getCodesByParent as any);

// === 관리자용 상세 조회 API ===
// 그룹별 조회 (상세)
router.get(API_URLS.COMMON_CODE.ADMIN.BY_GROUP, ...routerMiddleware.admin, getCodesByGroupForAdmin as any);
// 코드 상세 조회 (상세)
router.get(API_URLS.COMMON_CODE.ADMIN.BY_ID, ...routerMiddleware.admin, getCodeForAdmin as any);
// 타입별 조회 (상세)
router.get(API_URLS.COMMON_CODE.ADMIN.BY_TYPE, ...routerMiddleware.admin, getCodesByTypeForAdmin as any);
// 계층형 조회 (상세)
router.get(API_URLS.COMMON_CODE.ADMIN.BY_PARENT, ...routerMiddleware.admin, getCodesByParentForAdmin as any);

// === 관리자용 코드 관리 API ===
// 그룹 목록 조회
router.get(API_URLS.COMMON_CODE.GROUP.LIST, ...routerMiddleware.admin, getCodeGroupsForAdmin as any);
// 그룹 생성
router.post(API_URLS.COMMON_CODE.GROUP.CREATE, ...routerMiddleware.admin, createCodeGroupByAdmin as any);
// 그룹 수정
router.put(API_URLS.COMMON_CODE.GROUP.UPDATE, ...routerMiddleware.admin, updateCodeGroupByAdmin as any);
// 그룹 삭제 (단일)
router.delete(API_URLS.COMMON_CODE.GROUP.DELETE, ...routerMiddleware.admin, deleteCodeGroupsByAdmin as any);
// 그룹 삭제 (다중)
router.delete(API_URLS.COMMON_CODE.GROUP.LIST_DELETE, ...routerMiddleware.admin, deleteCodeGroupsByAdmin as any);  

// 코드 생성
router.post(API_URLS.COMMON_CODE.CODE.CREATE, ...routerMiddleware.admin, createCodeByAdmin as any);
// 코드 수정
router.put(API_URLS.COMMON_CODE.CODE.UPDATE, ...routerMiddleware.admin, updateCodeByAdmin as any);
// 코드 삭제 (단일)
router.delete(API_URLS.COMMON_CODE.CODE.DELETE, ...routerMiddleware.admin, deleteCodeByAdmin as any);
// 코드 삭제 (다중)
router.post(API_URLS.COMMON_CODE.CODE.LIST_DELETE, ...routerMiddleware.admin, deleteCodesInGroupByAdmin as any);

export default router; 