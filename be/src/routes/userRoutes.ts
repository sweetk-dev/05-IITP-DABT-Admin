import express from 'express';
import { checkEmail, register, getProfile } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// 이메일 중복 체크
router.post('/email/check', checkEmail);

// 사용자 회원가입
router.post('/register', register);

// 사용자 프로필 조회 (인증 필요)
router.get('/profile', authMiddleware, getProfile);

export default router; 