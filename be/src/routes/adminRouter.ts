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
router.get<AdminFaqDetailParams>('/faq/:faqId(\\d+)', ...routerMiddleware.admin, getFaqDetailForAdmin as any);
router.post(API_URLS.ADMIN.FAQ.CREATE, ...routerMiddleware.admin, createFaqForAdmin);
router.put<AdminFaqDetailParams>('/faq/:faqId(\\d+)', ...routerMiddleware.admin, updateFaqForAdmin as any);
router.delete<AdminFaqDetailParams>('/faq/:faqId(\\d+)', ...routerMiddleware.admin, deleteFaqForAdmin as any);

// QnA 관리
router.get(API_URLS.ADMIN.QNA.LIST, ...routerMiddleware.admin, getQnaListForAdmin);
router.get<AdminQnaDetailParams>('/qna/:qnaId(\\d+)', ...routerMiddleware.admin, getQnaDetailForAdmin as any);
router.post<AdminQnaDetailParams>('/qna/:qnaId(\\d+)/answer', ...routerMiddleware.admin, answerQnaForAdmin as any);
router.put<AdminQnaDetailParams>('/qna/:qnaId(\\d+)', ...routerMiddleware.admin, updateQnaForAdmin as any);
router.delete<AdminQnaDetailParams>('/qna/:qnaId(\\d+)', ...routerMiddleware.admin, deleteQnaForAdmin as any);

// Notice 관리
router.get(API_URLS.ADMIN.NOTICE.LIST, ...routerMiddleware.admin, getNoticeListForAdmin);
router.get<AdminNoticeDetailParams>('/notice/:noticeId(\\d+)', ...routerMiddleware.admin, getNoticeDetailForAdmin as any);
router.post(API_URLS.ADMIN.NOTICE.CREATE, ...routerMiddleware.admin, createNoticeForAdmin);
router.put<AdminNoticeDetailParams>('/notice/:noticeId(\\d+)', ...routerMiddleware.admin, updateNoticeForAdmin as any);
router.delete<AdminNoticeDetailParams>('/notice/:noticeId(\\d+)', ...routerMiddleware.admin, deleteNoticeForAdmin as any);

// OpenAPI 관련
router.get(API_URLS.ADMIN.OPEN_API.LIST, ...routerMiddleware.admin, getOpenApiListForAdmin);
router.get<AdminOpenApiDetailParams>('/openapi/keys/:keyId(\\d+)', ...routerMiddleware.admin, getOpenApiDetailForAdmin as any);
router.post(API_URLS.ADMIN.OPEN_API.CREATE, ...routerMiddleware.admin, createOpenApiForAdmin);
router.put<AdminOpenApiUpdateParams>('/openapi/keys/:keyId(\\d+)', ...routerMiddleware.admin, updateOpenApiForAdmin as any);
router.delete<AdminOpenApiDeleteParams>('/openapi/keys/:keyId(\\d+)', ...routerMiddleware.admin, deleteOpenApiForAdmin as any);
router.post<AdminOpenApiExtendParams>('/openapi/keys/:keyId(\\d+)/extend', ...routerMiddleware.admin, extendOpenApiAdmin as any);
router.get(API_URLS.ADMIN.OPEN_API.STATUS, ...routerMiddleware.admin, statusOpenApiAdmin);

export default router; 