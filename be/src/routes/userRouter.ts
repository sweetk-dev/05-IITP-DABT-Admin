import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { userLogin, userLogout } from '../controllers/user/userAuthController';
import { checkEmail, register, getProfile } from '../controllers/user/userController';

const router = express.Router();

// 인증 관련
router.post('/auth/user/login', userLogin);
router.post('/auth/user/logout', authMiddleware, userLogout);

// 사용자 관리
router.post('/user/check-email', checkEmail);
router.post('/user/register', register);
router.get('/user/profile', authMiddleware, getProfile);

export default router; 