import express from 'express';
import { getFaqList, getFaqDetail } from '../controllers/user/userFaqController';

const router = express.Router();

// FAQ 목록 조회 (사용자용)
router.get('/', getFaqList);

// FAQ 상세 조회 (사용자용)
router.get('/:faqId', getFaqDetail);

export default router; 