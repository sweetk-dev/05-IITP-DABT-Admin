import express from 'express';
import { userLogin, userLogout } from '../controllers/user/userAuthController';

const router = express.Router();

// 사용자 로그인
router.post('/login', userLogin);

// 사용자 로그아웃
router.post('/logout', userLogout);

export default router; 