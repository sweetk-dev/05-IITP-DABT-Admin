import express from 'express';
import { adminLogin, adminLogout } from '../controllers/admin/adminAuthController';

const router = express.Router();

// 관리자 로그인
router.post('/login', adminLogin);

// 관리자 로그아웃
router.post('/logout', adminLogout);

export default router; 