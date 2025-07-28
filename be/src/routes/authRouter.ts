import { Router } from 'express';
import { adminLogin, adminLogout, adminRefresh } from '../controllers/admin/adminAuthController';
import { userLogin, userLogout, userRefreshToken } from '../controllers/user/userAuthController';
import { accessLogMiddleware } from '../middleware/accessLogMiddleware';
import { API_URLS } from '@iitp-dabt/common';

const router = Router();

// 모든 라우트에 액세스 로그 미들웨어 적용
router.use(accessLogMiddleware);

// 관리자 인증
router.post(API_URLS.AUTH.ADMIN.LOGIN, adminLogin);
router.post(API_URLS.AUTH.ADMIN.LOGOUT, adminLogout);
router.post(API_URLS.AUTH.ADMIN.REFRESH, adminRefresh);

// 사용자 인증
router.post(API_URLS.AUTH.USER.LOGIN, userLogin);
router.post(API_URLS.AUTH.USER.LOGOUT, userLogout);
router.post(API_URLS.AUTH.USER.REFRESH, userRefreshToken);

export default router; 