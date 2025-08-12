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
import {
  getNoticeListForAdmin,
  getNoticeDetailForAdmin,
  createNoticeForAdmin,
  updateNoticeForAdmin,
  deleteNoticeForAdmin
} from '../controllers/admin/adminNoticeController';
import {
  getOpenApiListForAdmin,
  getOpenApiDetailForAdmin,
  createOpenApiForAdmin,
  updateOpenApiForAdmin,
  deleteOpenApiForAdmin,
  extendOpenApiAdmin,
  statusOpenApiAdmin
} from '../controllers/admin/adminOpenApiController';
import { routerMiddleware } from '../middleware';
import { API_URLS } from '@iitp-dabt/common';

const router = express.Router();

// 관리자 프로필
router.get(API_URLS.ADMIN.PROFILE, ...routerMiddleware.admin, getAdminProfile);
router.put(API_URLS.ADMIN.PROFILE, ...routerMiddleware.admin, updateAdminProfile);
router.put(API_URLS.ADMIN.PASSWORD, ...routerMiddleware.admin, changeAdminPassword);

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

// Notice 관리
router.get(API_URLS.ADMIN.NOTICE.LIST, ...routerMiddleware.admin, getNoticeListForAdmin);
router.get(API_URLS.ADMIN.NOTICE.DETAIL, ...routerMiddleware.admin, getNoticeDetailForAdmin);
router.post(API_URLS.ADMIN.NOTICE.CREATE, ...routerMiddleware.admin, createNoticeForAdmin);
router.put(API_URLS.ADMIN.NOTICE.UPDATE, ...routerMiddleware.admin, updateNoticeForAdmin);
router.delete(API_URLS.ADMIN.NOTICE.DELETE, ...routerMiddleware.admin, deleteNoticeForAdmin);

// OpenAPI 관련
router.get(API_URLS.ADMIN.OPEN_API.LIST, ...routerMiddleware.admin, getOpenApiListForAdmin);
router.get(API_URLS.ADMIN.OPEN_API.DETAIL, ...routerMiddleware.admin, getOpenApiDetailForAdmin);
router.post(API_URLS.ADMIN.OPEN_API.CREATE, ...routerMiddleware.admin, createOpenApiForAdmin);
router.put(API_URLS.ADMIN.OPEN_API.UPDATE, ...routerMiddleware.admin, updateOpenApiForAdmin);
router.delete(API_URLS.ADMIN.OPEN_API.DELETE, ...routerMiddleware.admin, deleteOpenApiForAdmin);
router.post(API_URLS.ADMIN.OPEN_API.EXTEND, ...routerMiddleware.admin, extendOpenApiAdmin);
router.get(API_URLS.ADMIN.OPEN_API.STATUS, ...routerMiddleware.admin, statusOpenApiAdmin);

export default router; 