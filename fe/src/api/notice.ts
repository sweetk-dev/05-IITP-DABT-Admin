import { apiFetch, publicApiFetch } from './api';
import { FULL_API_URLS } from '@iitp-dabt/common';
import type {
  UserNoticeListReq,
  UserNoticeListRes,
  UserNoticeDetailRes,
  UserNoticeHomeRes,
  ApiResponse
} from '@iitp-dabt/common';

/**
 * 공지사항 목록 조회 (사용자용)
 */
export async function getUserNoticeList(params: UserNoticeListReq): Promise<ApiResponse<UserNoticeListRes>> {
  return apiFetch<UserNoticeListRes>(FULL_API_URLS.USER.NOTICE.LIST, {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 공지사항 상세 조회 (사용자용)
 */
export async function getUserNoticeDetail(noticeId: number): Promise<ApiResponse<UserNoticeDetailRes>> {
  const url = FULL_API_URLS.USER.NOTICE.DETAIL.replace(':noticeId', noticeId.toString());
  return apiFetch<UserNoticeDetailRes>(url);
}

/**
 * 홈 화면용 공지사항 조회 (최신 5개)
 */
export async function getHomeNoticeList(): Promise<ApiResponse<UserNoticeHomeRes>> {
  return apiFetch<UserNoticeHomeRes>(FULL_API_URLS.USER.NOTICE.HOME);
} 