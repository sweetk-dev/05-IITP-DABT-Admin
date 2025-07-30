import { apiFetch, publicApiFetch } from './api';
import { FULL_API_URLS } from '@iitp-dabt/common';
import type {
  UserNoticeListReq,
  UserNoticeListRes,
  UserNoticeDetailRes,
  UserNoticeHomeRes
} from '@iitp-dabt/common';
import type { ApiResponse } from '../types/api';

/**
 * 공지사항 목록 조회 (사용자용)
 */
export async function getUserNoticeList(params: UserNoticeListReq): Promise<ApiResponse<UserNoticeListRes>> {
  const response = await apiFetch<UserNoticeListRes>(FULL_API_URLS.USER.NOTICE.LIST, {
    method: 'POST',
    body: JSON.stringify(params)
  });
  return enhanceApiResponse(response);
}

/**
 * 공지사항 상세 조회 (사용자용)
 */
export async function getUserNoticeDetail(noticeId: number): Promise<ApiResponse<UserNoticeDetailRes>> {
  const url = FULL_API_URLS.USER.NOTICE.DETAIL.replace(':noticeId', noticeId.toString());
  const response = await apiFetch<UserNoticeDetailRes>(url);
  return enhanceApiResponse(response);
}

/**
 * 홈 화면용 공지사항 조회 (최신 5개)
 */
export async function getHomeNoticeList(): Promise<ApiResponse<UserNoticeHomeRes>> {
  const response = await apiFetch<UserNoticeHomeRes>(FULL_API_URLS.USER.NOTICE.HOME);
  return enhanceApiResponse(response);
} 