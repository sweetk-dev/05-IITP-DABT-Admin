import express from 'express';
import { getQnaList, getQnaDetail, createQnaItem } from '../controllers/user/userQnaController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// QnA 목록 조회 (사용자용)
router.get('/', getQnaList);

// QnA 상세 조회 (사용자용)
router.get('/:qnaId', getQnaDetail);

// QnA 작성 (사용자용, 인증 필요)
router.post('/', authMiddleware, createQnaItem);

export default router; 