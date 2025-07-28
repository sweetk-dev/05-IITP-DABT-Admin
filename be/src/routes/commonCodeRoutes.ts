import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { accessLogMiddleware } from '../middleware/accessLogMiddleware';
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

// 모든 라우트에 액세스 로그 미들웨어 적용
router.use(accessLogMiddleware);

// 공개 API (인증 불필요) - 사용자용
router.get('/:grpId', getCommonCodes);
router.get('/:grpId/:codeId', getCommonCode);
router.get('/type/:codeType', getCommonCodesByType);
router.get('/:grpId/parent', getCommonCodesByParent);

// 관리자 API (인증 필요) - 관리자용 상세 정보 포함
router.use(authMiddleware);
router.get('/admin/:grpId', getCommonCodesDetail);
router.get('/admin/:grpId/:codeId', getCommonCodeDetail);
router.get('/admin/type/:codeType', getCommonCodesByTypeDetail);
router.get('/admin/:grpId/parent', getCommonCodesByParentDetail);
router.post('/', createCommonCode);
router.put('/:grpId/:codeId', updateCommonCode);
router.delete('/:grpId/:codeId', deleteCommonCode);
router.get('/stats/overview', getCommonCodeStats);

export default router; 