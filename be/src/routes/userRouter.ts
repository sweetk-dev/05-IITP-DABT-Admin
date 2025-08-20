import express from 'express';
import { checkEmail, register, getProfile, updateProfile, changePassword } from '../controllers/user/userController';
import { getFaqListForUser, getFaqDetailForUser, getFaqHomeForUser } from '../controllers/user/userFaqController';
import { getQnaListForUser, getQnaDetailForUser, createQnaForUser, getQnaHomeForUser, deleteQnaForUser } from '../controllers/user/userQnaController';
import { getNoticeListForUser, getNoticeDetailForUser, getNoticeHomeForUser } from '../controllers/user/userNoticeController';
import { 
  getUserOpenApiList, 
  getUserOpenApiDetail, 
  createUserOpenApi, 
  deleteUserOpenApi, 
  extendUserOpenApi 
} from '../controllers/user/userOpenApiController';
import { routerMiddleware } from '../middleware';
import { API_URLS, type UserFaqDetailParams, type UserNoticeDetailParams, type UserQnaDetailParams, type UserOpenApiDetailParams, type UserOpenApiDeleteParams } from '@iitp-dabt/common';

const router = express.Router();

// 사용자 관리
router.post(API_URLS.USER.CHECK_EMAIL, ...routerMiddleware.dataOnly, checkEmail);
router.post(API_URLS.USER.REGISTER, ...routerMiddleware.dataOnly, register);
router.get(API_URLS.USER.PROFILE, ...routerMiddleware.user, getProfile);
router.put(API_URLS.USER.PROFILE, ...routerMiddleware.user, updateProfile);
router.put(API_URLS.USER.PASSWORD, ...routerMiddleware.user, changePassword);

// FAQ 관련 (공개 API) - 정적 → 동적(숫자 제약)
router.get(API_URLS.USER.FAQ.LIST, ...routerMiddleware.public, getFaqListForUser);
router.get(API_URLS.USER.FAQ.HOME, ...routerMiddleware.public, getFaqHomeForUser);
router.get<UserFaqDetailParams>('/faq/:faqId(\\d+)', ...routerMiddleware.public, getFaqDetailForUser as any);

// Notice 관련 (공개 API) - 정적 → 동적(숫자 제약)
router.get(API_URLS.USER.NOTICE.LIST, ...routerMiddleware.public, getNoticeListForUser);
router.get(API_URLS.USER.NOTICE.HOME, ...routerMiddleware.public, getNoticeHomeForUser);
router.get<UserNoticeDetailParams>('/notice/:noticeId(\\d+)', ...routerMiddleware.public, getNoticeDetailForUser as any);

// QnA 관련: 목록/홈/상세는 공개+선택적 인증(사용자 토큰 있으면 userId 주입), 생성은 로그인 필요
router.get(API_URLS.USER.QNA.LIST, ...routerMiddleware.publicOptional, getQnaListForUser);
router.get(API_URLS.USER.QNA.HOME, ...routerMiddleware.publicOptional, getQnaHomeForUser);
router.get('/qna/:qnaId(\\d+)', ...routerMiddleware.publicOptional, getQnaDetailForUser as any);
router.post(API_URLS.USER.QNA.CREATE, ...routerMiddleware.user, createQnaForUser);
router.delete(API_URLS.USER.QNA.DETAIL, ...routerMiddleware.user, deleteQnaForUser as any);

// OpenAPI 관련
router.get(API_URLS.USER.OPEN_API.LIST, ...routerMiddleware.user, getUserOpenApiList);
router.get<UserOpenApiDetailParams>(API_URLS.USER.OPEN_API.DETAIL, ...routerMiddleware.user, getUserOpenApiDetail as any);
router.post(API_URLS.USER.OPEN_API.CREATE, ...routerMiddleware.user, createUserOpenApi);
router.delete<UserOpenApiDeleteParams>(API_URLS.USER.OPEN_API.DELETE, ...routerMiddleware.user, deleteUserOpenApi as any);
router.post(API_URLS.USER.OPEN_API.EXTEND, ...routerMiddleware.user, extendUserOpenApi);

export default router; 