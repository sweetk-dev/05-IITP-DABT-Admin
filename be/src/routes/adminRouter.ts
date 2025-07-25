import express from 'express';
import { adminLogin, adminLogout } from '../controllers/admin/adminAuthController';
import { 
  getFaqListForAdmin, 
  getFaqDetailForAdmin, 
  createFaqForAdmin, 
  updateFaqForAdmin, 
  deleteFaqForAdmin, 
  getFaqStatsForAdmin 
} from '../controllers/admin/adminFaqController';
import { 
  getQnaListForAdmin, 
  getQnaDetailForAdmin, 
  answerQnaForAdmin, 
  updateQnaForAdmin, 
  deleteQnaForAdmin 
} from '../controllers/admin/adminQnaController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// 인증 관련
router.post('/auth/admin/login', adminLogin);
router.post('/auth/admin/logout', authMiddleware, adminLogout);

// FAQ 관리
router.get('/admin/faq', authMiddleware, getFaqListForAdmin);
router.get('/admin/faq/:faqId', authMiddleware, getFaqDetailForAdmin);
router.post('/admin/faq', authMiddleware, createFaqForAdmin);
router.put('/admin/faq/:faqId', authMiddleware, updateFaqForAdmin);
router.delete('/admin/faq/:faqId', authMiddleware, deleteFaqForAdmin);
router.get('/admin/faq/stats', authMiddleware, getFaqStatsForAdmin);

// QnA 관리
router.get('/admin/qna', authMiddleware, getQnaListForAdmin);
router.get('/admin/qna/:qnaId', authMiddleware, getQnaDetailForAdmin);
router.post('/admin/qna/:qnaId/answer', authMiddleware, answerQnaForAdmin);
router.put('/admin/qna/:qnaId', authMiddleware, updateQnaForAdmin);
router.delete('/admin/qna/:qnaId', authMiddleware, deleteQnaForAdmin);

export default router; 