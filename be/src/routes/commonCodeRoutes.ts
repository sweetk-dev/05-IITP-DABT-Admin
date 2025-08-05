import { Router } from 'express';
import { API_URLS } from '@iitp-dabt/common';
import { routerMiddleware } from '../middleware';
import {
  getCommonCodes,
  getCommonCodesDetail,
  getCommonCode,
  getCommonCodeDetail,
  getCommonCodesByType,
  getCommonCodesByTypeDetail,
  getCommonCodesByParent,
  getCommonCodesByParentDetail,
  createCommonCode,
  updateCommonCode,
  deleteCommonCode,
} from '../controllers/common/commonCodeController';

const router = Router();

// === 기본 조회 API (사용자용) ===
// 그룹별 조회
router.get(API_URLS.COMMON_CODE.BASIC.BY_GROUP, ...routerMiddleware.public, getCommonCodes);
// 코드 상세 조회
router.get(API_URLS.COMMON_CODE.BASIC.BY_ID, ...routerMiddleware.public, getCommonCode);
// 타입별 조회
router.get(API_URLS.COMMON_CODE.BASIC.BY_TYPE, ...routerMiddleware.public, getCommonCodesByType);
// 계층형 조회
router.get(API_URLS.COMMON_CODE.BASIC.BY_PARENT, ...routerMiddleware.public, getCommonCodesByParent);

// === 관리자용 상세 조회 API ===
// 그룹별 조회 (상세)
router.get(API_URLS.COMMON_CODE.ADMIN.BY_GROUP, ...routerMiddleware.admin, getCommonCodesDetail);
// 코드 상세 조회 (상세)
router.get(API_URLS.COMMON_CODE.ADMIN.BY_ID, ...routerMiddleware.admin, getCommonCodeDetail);
// 타입별 조회 (상세)
router.get(API_URLS.COMMON_CODE.ADMIN.BY_TYPE, ...routerMiddleware.admin, getCommonCodesByTypeDetail);
// 계층형 조회 (상세)
router.get(API_URLS.COMMON_CODE.ADMIN.BY_PARENT, ...routerMiddleware.admin, getCommonCodesByParentDetail);

// === 관리자용 코드 관리 API ===
// 코드 생성
router.post(API_URLS.COMMON_CODE.CODE.CREATE, ...routerMiddleware.admin, createCommonCode);
// 코드 수정
router.put(API_URLS.COMMON_CODE.CODE.UPDATE, ...routerMiddleware.admin, updateCommonCode);
// 코드 삭제
router.delete(API_URLS.COMMON_CODE.CODE.DELETE, ...routerMiddleware.admin, deleteCommonCode);

export default router; 