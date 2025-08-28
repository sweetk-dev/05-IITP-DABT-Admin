import { apiFetch, publicApiFetch, buildUrl } from './api';
import { FULL_API_URLS } from '@iitp-dabt/common';
import type {
  UserNoticeListQuery as UserNoticeListReq,
  UserNoticeListRes,
  UserNoticeDetailRes,
  UserNoticeHomeRes,
  AdminNoticeListQuery as AdminNoticeListReq,
  AdminNoticeListRes,
  AdminNoticeDetailRes,
  AdminNoticeCreateReq,
  AdminNoticeCreateRes,
  AdminNoticeUpdateReq,
  // Update/Delete 는 void
} from '@iitp-dabt/common';
import type { ApiResponse } from '../types/api';

/**
 * 공지사항 목록 조회 (사용자용)
 */
export async function getUserNoticeList(params: UserNoticeListReq): Promise<ApiResponse<UserNoticeListRes>> {
  const url = buildUrl(FULL_API_URLS.USER.NOTICE.LIST, params as any);
  return apiFetch<UserNoticeListRes>(url, { method: 'GET' });
}

/**
 * 공지사항 상세 조회 (사용자용)
 */
export async function getUserNoticeDetail(noticeId: number): Promise<ApiResponse<UserNoticeDetailRes>> {
  const url = FULL_API_URLS.USER.NOTICE.DETAIL.replace(':noticeId', noticeId.toString());
  return apiFetch<UserNoticeDetailRes>(url, { method: 'GET' });
}

/**
 * 홈 화면용 공지사항 조회 (최신 5개)
 */
export async function getHomeNoticeList(): Promise<ApiResponse<UserNoticeHomeRes>> {
  return publicApiFetch<UserNoticeHomeRes>(FULL_API_URLS.USER.NOTICE.HOME, { method: 'GET' });
}

// ===== 관리자용 공지 API =====

export async function getAdminNoticeList(params: AdminNoticeListReq): Promise<ApiResponse<AdminNoticeListRes>> {
  const url = buildUrl(FULL_API_URLS.ADMIN.NOTICE.LIST, params as any);
  return apiFetch<AdminNoticeListRes>(url, { method: 'GET' });
}

export async function getAdminNoticeDetail(noticeId: number): Promise<ApiResponse<AdminNoticeDetailRes>> {
  const url = FULL_API_URLS.ADMIN.NOTICE.DETAIL.replace(':noticeId', noticeId.toString());
  return apiFetch<AdminNoticeDetailRes>(url, { method: 'GET' });
}

export async function createAdminNotice(data: AdminNoticeCreateReq): Promise<ApiResponse<AdminNoticeCreateRes>> {
  return apiFetch<AdminNoticeCreateRes>(FULL_API_URLS.ADMIN.NOTICE.CREATE, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateAdminNotice(noticeId: number, data: AdminNoticeUpdateReq): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.ADMIN.NOTICE.UPDATE.replace(':noticeId', noticeId.toString());
  return apiFetch<void>(url, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteAdminNotice(noticeId: number): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.ADMIN.NOTICE.DELETE.replace(':noticeId', noticeId.toString());
  return apiFetch<void>(url, { method: 'DELETE' });
}

/**
 * 공지사항 일괄 삭제 (관리자용)
 */
export async function deleteAdminNoticeList(noticeIds: (number | string)[]): Promise<ApiResponse<void>> {
  return apiFetch<void>(FULL_API_URLS.ADMIN.NOTICE.LIST_DELETE, {
    method: 'DELETE',
    body: JSON.stringify({ noticeIds }),
  });
}