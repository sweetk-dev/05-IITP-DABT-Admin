import express from 'express';
import {
  getFaqListForAdmin,
  getFaqDetailForAdmin,
  createFaqForAdmin,
  updateFaqForAdmin,
  deleteFaqForAdmin,
  deleteFaqListForAdmin
} from '../controllers/admin/adminFaqController';
import {
  getQnaListForAdmin,
  getQnaDetailForAdmin,
  answerQnaForAdmin,
  updateQnaForAdmin,
  deleteQnaForAdmin,
  deleteQnaListForAdmin,
  statusQnaForAdmin
} from '../controllers/admin/adminQnaController';
import { getAdminProfile, updateAdminProfile, changeAdminPassword } from '../controllers/admin/adminController';
import {
  getNoticeListForAdmin,
  getNoticeDetailForAdmin,
  createNoticeForAdmin,
  updateNoticeForAdmin,
  deleteNoticeForAdmin,
  deleteNoticeListForAdmin
} from '../controllers/admin/adminNoticeController';
import {
  getOpenApiListForAdmin,
  getOpenApiDetailForAdmin,
  createOpenApiForAdmin,
  updateOpenApiForAdmin,
  deleteOpenApiForAdmin,
  deleteOpenApiListForAdmin,
  extendOpenApiAdmin,
  statusOpenApiAdmin
} from '../controllers/admin/adminOpenApiController';
import {
  getAdminAccountList,
  getAdminAccountDetail,
  createAdminAccount,
  updateAdminAccount,
  deleteAdminAccount,
  deleteAdminAccountList,
  changeAdminAccountPassword,
  updateAdminRole,
  checkAdminEmail
} from '../controllers/admin/adminAccountController';
import {
  getUserAccountList,
  getUserAccountDetail,
  createUserAccount,
  updateUserAccount,
  deleteUserAccount,
  deleteUserAccountList,
  changeUserPassword,
  updateUserStatus,
  checkUserEmail
} from '../controllers/admin/userAccountController';
import { routerMiddleware } from '../middleware';
import { API_URLS, 
  type AdminFaqDetailParams, 
  type AdminQnaDetailParams, 
  type AdminNoticeDetailParams, 
  type AdminOpenApiDetailParams, 
  type AdminOpenApiUpdateParams, 
  type AdminOpenApiDeleteParams, 
  type AdminOpenApiExtendParams, 
  type AdminAccountDetailParams, 
  type AdminAccountUpdateParams, 
  type AdminAccountDeleteParams, 
  type AdminAccountPasswordChangeParams, 
  type AdminAccountRoleUpdateParams, 
  type UserAccountDetailParams, 
  type UserAccountUpdateParams, 
  type UserAccountDeleteParams, 
  type UserAccountPasswordChangeParams, 
  type UserAccountStatusUpdateParams 
} from '@iitp-dabt/common';

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
router.post(API_URLS.ADMIN.FAQ.LIST_DELETE, ...routerMiddleware.admin, deleteFaqListForAdmin as any);

// QnA 관리
router.get(API_URLS.ADMIN.QNA.LIST, ...routerMiddleware.admin, getQnaListForAdmin);
router.get(API_URLS.ADMIN.QNA.STATUS, ...routerMiddleware.admin, statusQnaForAdmin as any);
router.get<AdminQnaDetailParams>(API_URLS.ADMIN.QNA.DETAIL, ...routerMiddleware.admin, getQnaDetailForAdmin as any);
router.post<AdminQnaDetailParams>(API_URLS.ADMIN.QNA.ANSWER, ...routerMiddleware.admin, answerQnaForAdmin as any);
router.put<AdminQnaDetailParams>(API_URLS.ADMIN.QNA.UPDATE, ...routerMiddleware.admin, updateQnaForAdmin as any);
router.delete<AdminQnaDetailParams>(API_URLS.ADMIN.QNA.DELETE, ...routerMiddleware.admin, deleteQnaForAdmin as any);
router.post(API_URLS.ADMIN.QNA.LIST_DELETE, ...routerMiddleware.admin, deleteQnaListForAdmin as any);

// Notice 관리
router.get(API_URLS.ADMIN.NOTICE.LIST, ...routerMiddleware.admin, getNoticeListForAdmin);
router.get<AdminNoticeDetailParams>(API_URLS.ADMIN.NOTICE.DETAIL, ...routerMiddleware.admin, getNoticeDetailForAdmin as any);
router.post(API_URLS.ADMIN.NOTICE.CREATE, ...routerMiddleware.admin, createNoticeForAdmin);
router.put<AdminNoticeDetailParams>(API_URLS.ADMIN.NOTICE.UPDATE, ...routerMiddleware.admin, updateNoticeForAdmin as any);
router.delete<AdminNoticeDetailParams>(API_URLS.ADMIN.NOTICE.DELETE, ...routerMiddleware.admin, deleteNoticeForAdmin as any);
router.post(API_URLS.ADMIN.NOTICE.LIST_DELETE, ...routerMiddleware.admin, deleteNoticeListForAdmin as any);

// OpenAPI 관련
router.get(API_URLS.ADMIN.OPEN_API.LIST, ...routerMiddleware.admin, getOpenApiListForAdmin);
router.get(API_URLS.ADMIN.OPEN_API.STATUS, ...routerMiddleware.admin, statusOpenApiAdmin);  // ✅ STATUS를 먼저!
router.post(API_URLS.ADMIN.OPEN_API.CREATE, ...routerMiddleware.admin, createOpenApiForAdmin);
router.post<AdminOpenApiExtendParams>(API_URLS.ADMIN.OPEN_API.EXTEND, ...routerMiddleware.admin, extendOpenApiAdmin as any);  // ✅ EXTEND를 먼저!
router.get<AdminOpenApiDetailParams>(API_URLS.ADMIN.OPEN_API.DETAIL, ...routerMiddleware.admin, getOpenApiDetailForAdmin as any);  // ✅ DETAIL을 나중에
router.put<AdminOpenApiUpdateParams>(API_URLS.ADMIN.OPEN_API.UPDATE, ...routerMiddleware.admin, updateOpenApiForAdmin as any);
router.delete<AdminOpenApiDeleteParams>(API_URLS.ADMIN.OPEN_API.DELETE, ...routerMiddleware.admin, deleteOpenApiForAdmin as any);
router.post(API_URLS.ADMIN.OPEN_API.LIST_DELETE, ...routerMiddleware.admin, deleteOpenApiListForAdmin as any);

// 운영자 계정 관리 (S-Admin 전용)
router.get(API_URLS.ADMIN.ADMIN_ACCOUNT.LIST, ...routerMiddleware.admin, getAdminAccountList);
router.post(API_URLS.ADMIN.ADMIN_ACCOUNT.CREATE, ...routerMiddleware.admin, createAdminAccount);
router.post(API_URLS.ADMIN.ADMIN_ACCOUNT.CHECK_EMAIL, ...routerMiddleware.admin, checkAdminEmail);  // ✅ CHECK_EMAIL을 먼저!
router.put<AdminAccountPasswordChangeParams>(API_URLS.ADMIN.ADMIN_ACCOUNT.PASSWORD_CHANGE, ...routerMiddleware.admin, changeAdminAccountPassword as any);  // ✅ PASSWORD_CHANGE를 먼저!
router.put<AdminAccountRoleUpdateParams>(API_URLS.ADMIN.ADMIN_ACCOUNT.ROLE_UPDATE, ...routerMiddleware.admin, updateAdminRole as any);  // ✅ ROLE_UPDATE를 먼저!
router.get<AdminAccountDetailParams>(API_URLS.ADMIN.ADMIN_ACCOUNT.DETAIL, ...routerMiddleware.admin, getAdminAccountDetail as any);  // ✅ DETAIL을 나중에
router.put<AdminAccountUpdateParams>(API_URLS.ADMIN.ADMIN_ACCOUNT.UPDATE, ...routerMiddleware.admin, updateAdminAccount as any);
router.delete<AdminAccountDeleteParams>(API_URLS.ADMIN.ADMIN_ACCOUNT.DELETE, ...routerMiddleware.admin, deleteAdminAccount as any);
router.post(API_URLS.ADMIN.ADMIN_ACCOUNT.LIST_DELETE, ...routerMiddleware.admin, deleteAdminAccountList as any);

// 사용자 계정 관리 (일반 Admin도 접근 가능)
router.get(API_URLS.ADMIN.USER_ACCOUNT.LIST, ...routerMiddleware.admin, getUserAccountList);
router.post(API_URLS.ADMIN.USER_ACCOUNT.CREATE, ...routerMiddleware.admin, createUserAccount);
router.post(API_URLS.ADMIN.USER_ACCOUNT.CHECK_EMAIL, ...routerMiddleware.admin, checkUserEmail);  // ✅ CHECK_EMAIL을 먼저!
router.put<UserAccountPasswordChangeParams>(API_URLS.ADMIN.USER_ACCOUNT.PASSWORD_CHANGE, ...routerMiddleware.admin, changeUserPassword as any);  // ✅ PASSWORD_CHANGE를 먼저!
router.put<UserAccountStatusUpdateParams>(API_URLS.ADMIN.USER_ACCOUNT.STATUS_UPDATE, ...routerMiddleware.admin, updateUserStatus as any);  // ✅ STATUS_UPDATE를 먼저!
router.get<UserAccountDetailParams>(API_URLS.ADMIN.USER_ACCOUNT.DETAIL, ...routerMiddleware.admin, getUserAccountDetail as any);  // ✅ DETAIL을 나중에
router.put<UserAccountUpdateParams>(API_URLS.ADMIN.USER_ACCOUNT.UPDATE, ...routerMiddleware.admin, updateUserAccount as any);
router.delete<UserAccountDeleteParams>(API_URLS.ADMIN.USER_ACCOUNT.DELETE, ...routerMiddleware.admin, deleteUserAccount as any);
router.post(API_URLS.ADMIN.USER_ACCOUNT.LIST_DELETE, ...routerMiddleware.admin, deleteUserAccountList as any);

export default router; 