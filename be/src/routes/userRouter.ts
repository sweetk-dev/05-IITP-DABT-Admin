import express from 'express';
import { checkEmail, register, getProfile, updateProfile, changePassword } from '../controllers/user/userController';
import { getFaqListForUser, getFaqDetailForUser } from '../controllers/user/userFaqController';
import { getQnaListForUser, getQnaDetailForUser, createQnaForUser } from '../controllers/user/userQnaController';
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
router.post(API_URLS.USER.PROFILE, ...routerMiddleware.user, updateProfile);
router.post(API_URLS.USER.PASSWORD, ...routerMiddleware.user, changePassword);

// FAQ 관련 (공개 API)
router.get(API_URLS.USER.FAQ.LIST, ...routerMiddleware.public, getFaqListForUser);
router.get(API_URLS.USER.FAQ.DETAIL, ...routerMiddleware.public, getFaqDetailForUser);

// QnA 관련
router.get(API_URLS.USER.QNA.LIST, ...routerMiddleware.user, getQnaListForUser);
router.get(API_URLS.USER.QNA.DETAIL, ...routerMiddleware.user, getQnaDetailForUser);
router.post(API_URLS.USER.QNA.CREATE, ...routerMiddleware.user, createQnaForUser);

// OpenAPI 관련
router.get(API_URLS.USER.OPEN_API.LIST, ...routerMiddleware.user, getUserOpenApiList);
router.get(API_URLS.USER.OPEN_API.DETAIL, ...routerMiddleware.user, getUserOpenApiDetail);
router.post(API_URLS.USER.OPEN_API.CREATE, ...routerMiddleware.user, createUserOpenApi);
router.delete(API_URLS.USER.OPEN_API.DELETE, ...routerMiddleware.user, deleteUserOpenApi);
router.put(API_URLS.USER.OPEN_API.EXTEND, ...routerMiddleware.user, extendUserOpenApi);

export default router; 