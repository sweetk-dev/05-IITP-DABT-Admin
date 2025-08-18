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
// 그룹별 조회 (정적 → 동적 숫자 제약)
router.get('/:grpId', ...routerMiddleware.public, getCommonCodes as any);
// 코드 상세 조회 (숫자/문자 제약은 도메인에 따라 조정 가능)
router.get('/:grpId/:codeId', ...routerMiddleware.public, getCommonCode as any);
// 타입별 조회
router.get('/type/:codeType', ...routerMiddleware.public, getCommonCodesByType as any);
// 계층형 조회
router.get('/:grpId/parent', ...routerMiddleware.public, getCommonCodesByParent as any);

// === 관리자용 상세 조회 API ===
// 그룹별 조회 (상세)
router.get('/admin/:grpId', ...routerMiddleware.admin, getCommonCodesDetail as any);
// 코드 상세 조회 (상세)
router.get('/admin/:grpId/:codeId', ...routerMiddleware.admin, getCommonCodeDetail as any);
// 타입별 조회 (상세)
router.get('/admin/type/:codeType', ...routerMiddleware.admin, getCommonCodesByTypeDetail as any);
// 계층형 조회 (상세)
router.get('/admin/:grpId/parent', ...routerMiddleware.admin, getCommonCodesByParentDetail as any);

// === 관리자용 코드 관리 API ===
// 코드 생성
router.post('/admin/:grpId/code', ...routerMiddleware.admin, createCommonCode as any);
// 코드 수정
router.put('/admin/:grpId/:codeId', ...routerMiddleware.admin, updateCommonCode as any);
// 코드 삭제
router.delete('/admin/:grpId/:codeId', ...routerMiddleware.admin, deleteCommonCode as any);

export default router; 