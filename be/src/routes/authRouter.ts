import express from 'express';
import { adminLogin, adminLogout } from '../controllers/admin/adminAuthController';
import { userLogin, userLogout, userRefreshToken } from '../controllers/user/userAuthController';
import { authMiddleware } from '../middleware/authMiddleware';
import { API_URLS } from '@iitp-dabt/common';

const router = express.Router();

// Admin 인증
router.post(API_URLS.AUTH.ADMIN.LOGIN, adminLogin);
router.post(API_URLS.AUTH.ADMIN.LOGOUT, authMiddleware, adminLogout);

// User 인증
router.post(API_URLS.AUTH.USER.LOGIN, userLogin);
router.post(API_URLS.AUTH.USER.REFRESH, userRefreshToken);
router.post(API_URLS.AUTH.USER.LOGOUT, authMiddleware, userLogout);

export default router; 