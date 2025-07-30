import { Router } from 'express';
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
  getCommonCodeStats
} from '../controllers/common/commonCodeController';

const router = Router();

// 공개 API (로그만) - 사용자용
router.get('/:grpId', ...routerMiddleware.public, getCommonCodes);
router.get('/:grpId/:codeId', ...routerMiddleware.public, getCommonCode);
router.get('/type/:codeType', ...routerMiddleware.public, getCommonCodesByType);
router.get('/:grpId/parent', ...routerMiddleware.public, getCommonCodesByParent);

// 관리자 API (로그 + trim + 관리자 인증) - 관리자용 상세 정보 포함
router.get('/admin/:grpId', ...routerMiddleware.admin, getCommonCodesDetail);
router.get('/admin/:grpId/:codeId', ...routerMiddleware.admin, getCommonCodeDetail);
router.get('/admin/type/:codeType', ...routerMiddleware.admin, getCommonCodesByTypeDetail);
router.get('/admin/:grpId/parent', ...routerMiddleware.admin, getCommonCodesByParentDetail);
router.post('/', ...routerMiddleware.admin, createCommonCode);
router.put('/:grpId/:codeId', ...routerMiddleware.admin, updateCommonCode);
router.delete('/:grpId/:codeId', ...routerMiddleware.admin, deleteCommonCode);
router.get('/stats/overview', ...routerMiddleware.admin, getCommonCodeStats);

export default router; 