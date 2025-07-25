import express from 'express';
import { checkEmail, register, getProfile } from '../controllers/user/userController';
import { getFaqListForUser, getFaqDetailForUser } from '../controllers/user/userFaqController';
import { getQnaListForUser, getQnaDetailForUser, createQnaForUser } from '../controllers/user/userQnaController';
import { authMiddleware } from '../middleware/authMiddleware';
import { API_URLS } from '@iitp-dabt/common';

const router = express.Router();

// 사용자 관리
router.post(API_URLS.USER.CHECK_EMAIL, checkEmail);
router.post(API_URLS.USER.REGISTER, register);
router.get(API_URLS.USER.PROFILE, authMiddleware, getProfile);

// FAQ 관련
router.get(API_URLS.USER.FAQ.LIST, getFaqListForUser);
router.get(API_URLS.USER.FAQ.DETAIL, getFaqDetailForUser);

// QnA 관련
router.get(API_URLS.USER.QNA.LIST, authMiddleware, getQnaListForUser);
router.get(API_URLS.USER.QNA.DETAIL, authMiddleware, getQnaDetailForUser);
router.post(API_URLS.USER.QNA.CREATE, authMiddleware, createQnaForUser);

export default router; 