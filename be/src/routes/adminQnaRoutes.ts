import express from 'express';
import { 
  getQnaList, 
  getQnaDetail, 
  answerQnaItem, 
  updateQnaItem, 
  deleteQnaItem 
} from '../controllers/admin/adminQnaController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// 모든 관리자 라우트에 인증 미들웨어 적용
router.use(authMiddleware);

// QnA 목록 조회 (관리자용)
router.get('/', getQnaList);

// QnA 상세 조회 (관리자용)
router.get('/:qnaId', getQnaDetail);

// QnA 답변 (관리자용)
router.post('/:qnaId/answer', answerQnaItem);

// QnA 수정 (관리자용)
router.put('/:qnaId', updateQnaItem);

// QnA 삭제 (관리자용)
router.delete('/:qnaId', deleteQnaItem);

export default router; 