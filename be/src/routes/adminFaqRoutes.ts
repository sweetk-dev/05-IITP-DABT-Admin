import express from 'express';
import { 
  getFaqList, 
  getFaqDetail, 
  createFaqItem, 
  updateFaqItem, 
  deleteFaqItem,
  getFaqStats 
} from '../controllers/admin/adminFaqController';

const router = express.Router();

// FAQ 목록 조회 (관리자용)
router.get('/', getFaqList);

// FAQ 상세 조회 (관리자용)
router.get('/:faqId', getFaqDetail);

// FAQ 생성
router.post('/', createFaqItem);

// FAQ 수정
router.put('/:faqId', updateFaqItem);

// FAQ 삭제
router.delete('/:faqId', deleteFaqItem);

// FAQ 타입별 통계
router.get('/stats/type-count', getFaqStats);

export default router; 