import express from 'express';
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
import { getAdminProfile, updateAdminProfile, changeAdminPassword } from '../controllers/admin/adminController';
import { authMiddleware } from '../middleware/authMiddleware';
import { API_URLS } from '@iitp-dabt/common';

const router = express.Router();

// 관리자 프로필
router.get(API_URLS.ADMIN.PROFILE, authMiddleware, getAdminProfile);
router.post(API_URLS.ADMIN.PROFILE, authMiddleware, updateAdminProfile);
router.post(API_URLS.ADMIN.PASSWORD, authMiddleware, changeAdminPassword);

// FAQ 관리
router.get(API_URLS.ADMIN.FAQ.LIST, authMiddleware, getFaqListForAdmin);
router.get(API_URLS.ADMIN.FAQ.DETAIL, authMiddleware, getFaqDetailForAdmin);
router.post(API_URLS.ADMIN.FAQ.CREATE, authMiddleware, createFaqForAdmin);
router.put(API_URLS.ADMIN.FAQ.UPDATE, authMiddleware, updateFaqForAdmin);
router.delete(API_URLS.ADMIN.FAQ.DELETE, authMiddleware, deleteFaqForAdmin);
router.get(API_URLS.ADMIN.FAQ.STATS, authMiddleware, getFaqStatsForAdmin);

// QnA 관리
router.get(API_URLS.ADMIN.QNA.LIST, authMiddleware, getQnaListForAdmin);
router.get(API_URLS.ADMIN.QNA.DETAIL, authMiddleware, getQnaDetailForAdmin);
router.post(API_URLS.ADMIN.QNA.ANSWER, authMiddleware, answerQnaForAdmin);
router.put(API_URLS.ADMIN.QNA.UPDATE, authMiddleware, updateQnaForAdmin);
router.delete(API_URLS.ADMIN.QNA.DELETE, authMiddleware, deleteQnaForAdmin);

export default router; 