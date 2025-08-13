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
import { API_URLS, type AdminFaqDetailParams, type AdminQnaDetailParams, type AdminNoticeDetailParams, type AdminOpenApiDetailParams, type AdminOpenApiUpdateParams, type AdminOpenApiDeleteParams, type AdminOpenApiExtendParams } from '@iitp-dabt/common';

const router = express.Router();

// 관리자 프로필
router.get(API_URLS.ADMIN.PROFILE, ...routerMiddleware.admin, getAdminProfile);
router.put(API_URLS.ADMIN.PROFILE, ...routerMiddleware.admin, updateAdminProfile);
router.put(API_URLS.ADMIN.PASSWORD, ...routerMiddleware.admin, changeAdminPassword);

// FAQ 관리
router.get(API_URLS.ADMIN.FAQ.LIST, ...routerMiddleware.admin, getFaqListForAdmin);
router.get<AdminFaqDetailParams>(API_URLS.ADMIN.FAQ.DETAIL, ...routerMiddleware.admin, getFaqDetailForAdmin as any);
router.post(API_URLS.ADMIN.FAQ.CREATE, ...routerMiddleware.admin, createFaqForAdmin);
router.put<AdminFaqDetailParams>(API_URLS.ADMIN.FAQ.UPDATE, ...routerMiddleware.admin, updateFaqForAdmin as any);
router.delete<AdminFaqDetailParams>(API_URLS.ADMIN.FAQ.DELETE, ...routerMiddleware.admin, deleteFaqForAdmin as any);

// QnA 관리
router.get(API_URLS.ADMIN.QNA.LIST, ...routerMiddleware.admin, getQnaListForAdmin);
router.get<AdminQnaDetailParams>(API_URLS.ADMIN.QNA.DETAIL, ...routerMiddleware.admin, getQnaDetailForAdmin as any);
router.post<AdminQnaDetailParams>(API_URLS.ADMIN.QNA.ANSWER, ...routerMiddleware.admin, answerQnaForAdmin as any);
router.put<AdminQnaDetailParams>(API_URLS.ADMIN.QNA.UPDATE, ...routerMiddleware.admin, updateQnaForAdmin as any);
router.delete<AdminQnaDetailParams>(API_URLS.ADMIN.QNA.DELETE, ...routerMiddleware.admin, deleteQnaForAdmin as any);

// Notice 관리
router.get(API_URLS.ADMIN.NOTICE.LIST, ...routerMiddleware.admin, getNoticeListForAdmin);
router.get<AdminNoticeDetailParams>(API_URLS.ADMIN.NOTICE.DETAIL, ...routerMiddleware.admin, getNoticeDetailForAdmin as any);
router.post(API_URLS.ADMIN.NOTICE.CREATE, ...routerMiddleware.admin, createNoticeForAdmin);
router.put<AdminNoticeDetailParams>(API_URLS.ADMIN.NOTICE.UPDATE, ...routerMiddleware.admin, updateNoticeForAdmin as any);
router.delete<AdminNoticeDetailParams>(API_URLS.ADMIN.NOTICE.DELETE, ...routerMiddleware.admin, deleteNoticeForAdmin as any);

// OpenAPI 관련
router.get(API_URLS.ADMIN.OPEN_API.LIST, ...routerMiddleware.admin, getOpenApiListForAdmin);
router.get<AdminOpenApiDetailParams>(API_URLS.ADMIN.OPEN_API.DETAIL, ...routerMiddleware.admin, getOpenApiDetailForAdmin as any);
router.post(API_URLS.ADMIN.OPEN_API.CREATE, ...routerMiddleware.admin, createOpenApiForAdmin);
router.put<AdminOpenApiUpdateParams>(API_URLS.ADMIN.OPEN_API.UPDATE, ...routerMiddleware.admin, updateOpenApiForAdmin as any);
router.delete<AdminOpenApiDeleteParams>(API_URLS.ADMIN.OPEN_API.DELETE, ...routerMiddleware.admin, deleteOpenApiForAdmin as any);
router.post<AdminOpenApiExtendParams>(API_URLS.ADMIN.OPEN_API.EXTEND, ...routerMiddleware.admin, extendOpenApiAdmin as any);
router.get(API_URLS.ADMIN.OPEN_API.STATUS, ...routerMiddleware.admin, statusOpenApiAdmin);

export default router; 