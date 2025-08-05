import express from 'express';
import {
  getFaqListForAdmin,
  getFaqDetailForAdmin,
  createFaqForAdmin,
  updateFaqForAdmin,
  deleteFaqForAdmin
} from '../controllers/admin/adminFaqController';
import {
  getQnaListForAdmin,
  getQnaDetailForAdmin,
  answerQnaForAdmin,
  updateQnaForAdmin,
  deleteQnaForAdmin
} from '../controllers/admin/adminQnaController';
import { getAdminProfile, updateAdminProfile, changeAdminPassword } from '../controllers/admin/adminController';
import { routerMiddleware } from '../middleware';
import { API_URLS } from '@iitp-dabt/common';

const router = express.Router();

// 관리자 프로필
router.get(API_URLS.ADMIN.PROFILE, ...routerMiddleware.admin, getAdminProfile);
router.post(API_URLS.ADMIN.PROFILE, ...routerMiddleware.admin, updateAdminProfile);
router.post(API_URLS.ADMIN.PASSWORD, ...routerMiddleware.admin, changeAdminPassword);

// FAQ 관리
router.get(API_URLS.ADMIN.FAQ.LIST, ...routerMiddleware.admin, getFaqListForAdmin);
router.get(API_URLS.ADMIN.FAQ.DETAIL, ...routerMiddleware.admin, getFaqDetailForAdmin);
router.post(API_URLS.ADMIN.FAQ.CREATE, ...routerMiddleware.admin, createFaqForAdmin);
router.put(API_URLS.ADMIN.FAQ.UPDATE, ...routerMiddleware.admin, updateFaqForAdmin);
router.delete(API_URLS.ADMIN.FAQ.DELETE, ...routerMiddleware.admin, deleteFaqForAdmin);

// QnA 관리
router.get(API_URLS.ADMIN.QNA.LIST, ...routerMiddleware.admin, getQnaListForAdmin);
router.get(API_URLS.ADMIN.QNA.DETAIL, ...routerMiddleware.admin, getQnaDetailForAdmin);
router.post(API_URLS.ADMIN.QNA.ANSWER, ...routerMiddleware.admin, answerQnaForAdmin);
router.put(API_URLS.ADMIN.QNA.UPDATE, ...routerMiddleware.admin, updateQnaForAdmin);
router.delete(API_URLS.ADMIN.QNA.DELETE, ...routerMiddleware.admin, deleteQnaForAdmin);

export default router; 