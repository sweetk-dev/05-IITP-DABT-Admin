import { Router } from 'express';
import { adminLogin, adminLogout, adminRefresh } from '../controllers/admin/adminAuthController';
import { userLogin, userLogout, userRefreshToken } from '../controllers/user/userAuthController';
import { routerMiddleware } from '../middleware';
import { API_URLS } from '@iitp-dabt/common';

const router = Router();

// 관리자 인증 (로그 + trim)
router.post(API_URLS.AUTH.ADMIN.LOGIN, ...routerMiddleware.dataOnly, adminLogin);
router.post(API_URLS.AUTH.ADMIN.LOGOUT, ...routerMiddleware.dataOnly, adminLogout);
router.post(API_URLS.AUTH.ADMIN.REFRESH, ...routerMiddleware.dataOnly, adminRefresh);

// 사용자 인증 (로그 + trim)
router.post(API_URLS.AUTH.USER.LOGIN, ...routerMiddleware.dataOnly, userLogin);
router.post(API_URLS.AUTH.USER.LOGOUT, ...routerMiddleware.dataOnly, userLogout);
router.post(API_URLS.AUTH.USER.REFRESH, ...routerMiddleware.dataOnly, userRefreshToken);

export default router; 