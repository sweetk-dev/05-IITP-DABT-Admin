import express from 'express';
import { checkEmail, register, getProfile, updateProfile, changePassword } from '../controllers/user/userController';
import { getFaqListForUser, getFaqDetailForUser, getFaqHomeForUser } from '../controllers/user/userFaqController';
import { getQnaListForUser, getQnaDetailForUser, createQnaForUser, getQnaHomeForUser } from '../controllers/user/userQnaController';
import { getNoticeListForUser, getNoticeDetailForUser, getNoticeHomeForUser } from '../controllers/user/userNoticeController';
import { 
  getUserOpenApiList, 
  getUserOpenApiDetail, 
  createUserOpenApi, 
  deleteUserOpenApi, 
  extendUserOpenApi 
} from '../controllers/user/userOpenApiController';
import { routerMiddleware } from '../middleware';
import { API_URLS } from '@iitp-dabt/common';

const router = express.Router();

// 사용자 관리
router.post(API_URLS.USER.CHECK_EMAIL, ...routerMiddleware.dataOnly, checkEmail);
router.post(API_URLS.USER.REGISTER, ...routerMiddleware.dataOnly, register);
router.get(API_URLS.USER.PROFILE, ...routerMiddleware.user, getProfile);
router.put(API_URLS.USER.PROFILE, ...routerMiddleware.user, updateProfile);
router.put(API_URLS.USER.PASSWORD, ...routerMiddleware.user, changePassword);

// FAQ 관련 (공개 API)
router.get(API_URLS.USER.FAQ.LIST, ...routerMiddleware.public, getFaqListForUser);
router.get(API_URLS.USER.FAQ.DETAIL, ...routerMiddleware.public, getFaqDetailForUser);
router.get(API_URLS.USER.FAQ.HOME, ...routerMiddleware.public, getFaqHomeForUser);

// Notice 관련 (공개 API)
router.get(API_URLS.USER.NOTICE.LIST, ...routerMiddleware.public, getNoticeListForUser);
router.get(API_URLS.USER.NOTICE.DETAIL, ...routerMiddleware.public, getNoticeDetailForUser);
router.get(API_URLS.USER.NOTICE.HOME, ...routerMiddleware.public, getNoticeHomeForUser);

// QnA 관련
router.get(API_URLS.USER.QNA.LIST, ...routerMiddleware.user, getQnaListForUser);
router.get(API_URLS.USER.QNA.DETAIL, ...routerMiddleware.user, getQnaDetailForUser);
router.post(API_URLS.USER.QNA.CREATE, ...routerMiddleware.user, createQnaForUser);
router.get(API_URLS.USER.QNA.HOME, ...routerMiddleware.user, getQnaHomeForUser);

// OpenAPI 관련
router.get(API_URLS.USER.OPEN_API.LIST, ...routerMiddleware.user, getUserOpenApiList);
router.get(API_URLS.USER.OPEN_API.DETAIL, ...routerMiddleware.user, getUserOpenApiDetail);
router.post(API_URLS.USER.OPEN_API.CREATE, ...routerMiddleware.user, createUserOpenApi);
router.delete(API_URLS.USER.OPEN_API.DELETE, ...routerMiddleware.user, deleteUserOpenApi);
router.post(API_URLS.USER.OPEN_API.EXTEND, ...routerMiddleware.user, extendUserOpenApi);

export default router; 