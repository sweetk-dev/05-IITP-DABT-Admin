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
import { roleGuard } from '../middleware/roleMiddleware';
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

/*
 * 역할별 허용 범위 (roleGuard — middleware/roleMiddleware.ts)
 * - 관리자 토큰 검증(routerMiddleware.admin) 뒤에 역할 검사를 붙인다. 기준은 utils/auth.ts 권한 헬퍼이며
 *   화면의 메뉴·버튼 노출 조건과 같다.
 *   조회(목록·상세·통계)            : S-ADMIN, ADMIN, EDITOR, VIEWER
 *   FAQ·공지·Q&A 작성/수정/답변/삭제 : S-ADMIN, ADMIN, EDITOR
 *   인증키 발급/수정/연장/삭제       : S-ADMIN, ADMIN
 *   사용자 계정 생성/수정/삭제 등    : S-ADMIN, ADMIN
 *   운영자 계정 관리                 : S-ADMIN
 * - 본인 프로필·비밀번호 변경은 본인 계정만 다루므로 관리자 토큰이면 허용한다.
 */

// 관리자 프로필 (본인 계정)
router.get(API_URLS.ADMIN.PROFILE, ...routerMiddleware.admin, getAdminProfile);
router.put(API_URLS.ADMIN.PROFILE, ...routerMiddleware.admin, updateAdminProfile);
router.put(API_URLS.ADMIN.PASSWORD, ...routerMiddleware.admin, changeAdminPassword);

// FAQ 관리 (조회: 전체 관리자 / 편집: EDITOR 이상)
router.get(API_URLS.ADMIN.FAQ.LIST, ...routerMiddleware.admin, roleGuard.read, getFaqListForAdmin);
router.get<AdminFaqDetailParams>(API_URLS.ADMIN.FAQ.DETAIL, ...routerMiddleware.admin, roleGuard.read, getFaqDetailForAdmin as any);
router.post(API_URLS.ADMIN.FAQ.CREATE, ...routerMiddleware.admin, roleGuard.contentEdit, createFaqForAdmin);
router.put<AdminFaqDetailParams>(API_URLS.ADMIN.FAQ.UPDATE, ...routerMiddleware.admin, roleGuard.contentEdit, updateFaqForAdmin as any);
router.delete<AdminFaqDetailParams>(API_URLS.ADMIN.FAQ.DELETE, ...routerMiddleware.admin, roleGuard.contentEdit, deleteFaqForAdmin as any);
router.post(API_URLS.ADMIN.FAQ.LIST_DELETE, ...routerMiddleware.admin, roleGuard.contentEdit, deleteFaqListForAdmin as any);

// QnA 관리 (조회: 전체 관리자 / 답변·수정·삭제: EDITOR 이상)
router.get(API_URLS.ADMIN.QNA.LIST, ...routerMiddleware.admin, roleGuard.read, getQnaListForAdmin);
router.get(API_URLS.ADMIN.QNA.STATUS, ...routerMiddleware.admin, roleGuard.read, statusQnaForAdmin as any);
router.get<AdminQnaDetailParams>(API_URLS.ADMIN.QNA.DETAIL, ...routerMiddleware.admin, roleGuard.read, getQnaDetailForAdmin as any);
router.post<AdminQnaDetailParams>(API_URLS.ADMIN.QNA.ANSWER, ...routerMiddleware.admin, roleGuard.contentEdit, answerQnaForAdmin as any);
router.put<AdminQnaDetailParams>(API_URLS.ADMIN.QNA.UPDATE, ...routerMiddleware.admin, roleGuard.contentEdit, updateQnaForAdmin as any);
router.delete<AdminQnaDetailParams>(API_URLS.ADMIN.QNA.DELETE, ...routerMiddleware.admin, roleGuard.contentEdit, deleteQnaForAdmin as any);
router.post(API_URLS.ADMIN.QNA.LIST_DELETE, ...routerMiddleware.admin, roleGuard.contentEdit, deleteQnaListForAdmin as any);

// Notice 관리 (조회: 전체 관리자 / 편집: EDITOR 이상)
router.get(API_URLS.ADMIN.NOTICE.LIST, ...routerMiddleware.admin, roleGuard.read, getNoticeListForAdmin);
router.get<AdminNoticeDetailParams>(API_URLS.ADMIN.NOTICE.DETAIL, ...routerMiddleware.admin, roleGuard.read, getNoticeDetailForAdmin as any);
router.post(API_URLS.ADMIN.NOTICE.CREATE, ...routerMiddleware.admin, roleGuard.contentEdit, createNoticeForAdmin);
router.put<AdminNoticeDetailParams>(API_URLS.ADMIN.NOTICE.UPDATE, ...routerMiddleware.admin, roleGuard.contentEdit, updateNoticeForAdmin as any);
router.delete<AdminNoticeDetailParams>(API_URLS.ADMIN.NOTICE.DELETE, ...routerMiddleware.admin, roleGuard.contentEdit, deleteNoticeForAdmin as any);
router.post(API_URLS.ADMIN.NOTICE.LIST_DELETE, ...routerMiddleware.admin, roleGuard.contentEdit, deleteNoticeListForAdmin as any);

// OpenAPI 인증키 관리 (조회: 전체 관리자 / 발급·수정·연장·삭제: ADMIN 이상)
router.get(API_URLS.ADMIN.OPEN_API.LIST, ...routerMiddleware.admin, roleGuard.read, getOpenApiListForAdmin);
router.get(API_URLS.ADMIN.OPEN_API.STATUS, ...routerMiddleware.admin, roleGuard.read, statusOpenApiAdmin);  // ✅ STATUS를 먼저!
router.post(API_URLS.ADMIN.OPEN_API.CREATE, ...routerMiddleware.admin, roleGuard.openApiKeyEdit, createOpenApiForAdmin);
router.post<AdminOpenApiExtendParams>(API_URLS.ADMIN.OPEN_API.EXTEND, ...routerMiddleware.admin, roleGuard.openApiKeyEdit, extendOpenApiAdmin as any);  // ✅ EXTEND를 먼저!
router.get<AdminOpenApiDetailParams>(API_URLS.ADMIN.OPEN_API.DETAIL, ...routerMiddleware.admin, roleGuard.read, getOpenApiDetailForAdmin as any);  // ✅ DETAIL을 나중에
router.put<AdminOpenApiUpdateParams>(API_URLS.ADMIN.OPEN_API.UPDATE, ...routerMiddleware.admin, roleGuard.openApiKeyEdit, updateOpenApiForAdmin as any);
router.delete<AdminOpenApiDeleteParams>(API_URLS.ADMIN.OPEN_API.DELETE, ...routerMiddleware.admin, roleGuard.openApiKeyEdit, deleteOpenApiForAdmin as any);
router.post(API_URLS.ADMIN.OPEN_API.LIST_DELETE, ...routerMiddleware.admin, roleGuard.openApiKeyEdit, deleteOpenApiListForAdmin as any);

// 운영자 계정 관리 (S-Admin 전용 — 컨트롤러의 isSAdmin 검사와 이중으로 막는다)
router.get(API_URLS.ADMIN.ADMIN_ACCOUNT.LIST, ...routerMiddleware.admin, roleGuard.superAdmin, getAdminAccountList);
router.post(API_URLS.ADMIN.ADMIN_ACCOUNT.CREATE, ...routerMiddleware.admin, roleGuard.superAdmin, createAdminAccount);
router.post(API_URLS.ADMIN.ADMIN_ACCOUNT.CHECK_EMAIL, ...routerMiddleware.admin, roleGuard.superAdmin, checkAdminEmail);  // ✅ CHECK_EMAIL을 먼저!
router.put<AdminAccountPasswordChangeParams>(API_URLS.ADMIN.ADMIN_ACCOUNT.PASSWORD_CHANGE, ...routerMiddleware.admin, roleGuard.superAdmin, changeAdminAccountPassword as any);  // ✅ PASSWORD_CHANGE를 먼저!
router.put<AdminAccountRoleUpdateParams>(API_URLS.ADMIN.ADMIN_ACCOUNT.ROLE_UPDATE, ...routerMiddleware.admin, roleGuard.superAdmin, updateAdminRole as any);  // ✅ ROLE_UPDATE를 먼저!
router.get<AdminAccountDetailParams>(API_URLS.ADMIN.ADMIN_ACCOUNT.DETAIL, ...routerMiddleware.admin, roleGuard.superAdmin, getAdminAccountDetail as any);  // ✅ DETAIL을 나중에
router.put<AdminAccountUpdateParams>(API_URLS.ADMIN.ADMIN_ACCOUNT.UPDATE, ...routerMiddleware.admin, roleGuard.superAdmin, updateAdminAccount as any);
router.delete<AdminAccountDeleteParams>(API_URLS.ADMIN.ADMIN_ACCOUNT.DELETE, ...routerMiddleware.admin, roleGuard.superAdmin, deleteAdminAccount as any);
router.post(API_URLS.ADMIN.ADMIN_ACCOUNT.LIST_DELETE, ...routerMiddleware.admin, roleGuard.superAdmin, deleteAdminAccountList as any);

// 사용자 계정 관리 (조회: 전체 관리자 / 생성·수정·삭제·비밀번호·상태 변경: ADMIN 이상)
router.get(API_URLS.ADMIN.USER_ACCOUNT.LIST, ...routerMiddleware.admin, roleGuard.userAccountRead, getUserAccountList);
router.post(API_URLS.ADMIN.USER_ACCOUNT.CREATE, ...routerMiddleware.admin, roleGuard.userAccountEdit, createUserAccount);
router.post(API_URLS.ADMIN.USER_ACCOUNT.CHECK_EMAIL, ...routerMiddleware.admin, roleGuard.userAccountEdit, checkUserEmail);  // ✅ CHECK_EMAIL을 먼저!
router.put<UserAccountPasswordChangeParams>(API_URLS.ADMIN.USER_ACCOUNT.PASSWORD_CHANGE, ...routerMiddleware.admin, roleGuard.userAccountEdit, changeUserPassword as any);  // ✅ PASSWORD_CHANGE를 먼저!
router.put<UserAccountStatusUpdateParams>(API_URLS.ADMIN.USER_ACCOUNT.STATUS_UPDATE, ...routerMiddleware.admin, roleGuard.userAccountEdit, updateUserStatus as any);  // ✅ STATUS_UPDATE를 먼저!
router.get<UserAccountDetailParams>(API_URLS.ADMIN.USER_ACCOUNT.DETAIL, ...routerMiddleware.admin, roleGuard.userAccountRead, getUserAccountDetail as any);  // ✅ DETAIL을 나중에
router.put<UserAccountUpdateParams>(API_URLS.ADMIN.USER_ACCOUNT.UPDATE, ...routerMiddleware.admin, roleGuard.userAccountEdit, updateUserAccount as any);
router.delete<UserAccountDeleteParams>(API_URLS.ADMIN.USER_ACCOUNT.DELETE, ...routerMiddleware.admin, roleGuard.userAccountEdit, deleteUserAccount as any);
router.post(API_URLS.ADMIN.USER_ACCOUNT.LIST_DELETE, ...routerMiddleware.admin, roleGuard.userAccountEdit, deleteUserAccountList as any);

export default router; 