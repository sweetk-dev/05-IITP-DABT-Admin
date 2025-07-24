import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// 모든 관리자 라우트에 인증 미들웨어 적용
router.use(authMiddleware);

// 여기에 관리자 전용 기능들 추가
// 예: 대시보드, 통계, 사용자 관리 등

export default router; 