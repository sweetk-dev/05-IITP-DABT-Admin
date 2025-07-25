import express from 'express';
import { userLogin, userLogout } from '../controllers/user/userAuthController';
import { getFaqListForUser, getFaqDetailForUser } from '../controllers/user/userFaqController';
import { getQnaListForUser, getQnaDetailForUser, createQnaForUser } from '../controllers/user/userQnaController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// 인증 관련
router.post('/auth/user/login', userLogin);
router.post('/auth/user/logout', authMiddleware, userLogout);

// FAQ 관련
router.get('/user/faq', getFaqListForUser);
router.get('/user/faq/:faqId', getFaqDetailForUser);

// QnA 관련
router.get('/user/qna', authMiddleware, getQnaListForUser);
router.get('/user/qna/:qnaId', authMiddleware, getQnaDetailForUser);
router.post('/user/qna', authMiddleware, createQnaForUser);

export default router; 