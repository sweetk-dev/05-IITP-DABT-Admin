import { apiFetch, enhanceApiResponse } from './api';
import { FULL_API_URLS } from '@iitp-dabt/common';
import type {
  UserQnaListReq,
  UserQnaListRes,
  UserQnaDetailRes,
  UserQnaCreateReq,
  UserQnaCreateRes,
  UserQnaHomeRes,
  AdminQnaListReq,
  AdminQnaListRes,
  AdminQnaDetailRes,
  AdminQnaAnswerReq,
  AdminQnaAnswerRes,
  AdminQnaUpdateReq,
  AdminQnaUpdateRes,
  AdminQnaDeleteRes
} from '@iitp-dabt/common';
import type { ApiResponse } from '../types/api';

/**
 * Q&A 목록 조회 (사용자용)
 */
export async function getUserQnaList(params: UserQnaListReq): Promise<ApiResponse<UserQnaListRes>> {
  const response = await apiFetch<UserQnaListRes>(FULL_API_URLS.USER.QNA.LIST, {
    method: 'POST',
    body: JSON.stringify(params)
  });
  return enhanceApiResponse(response);
}

/**
 * Q&A 상세 조회 (사용자용)
 */
export async function getUserQnaDetail(qnaId: number): Promise<ApiResponse<UserQnaDetailRes>> {
  const url = FULL_API_URLS.USER.QNA.DETAIL.replace(':qnaId', qnaId.toString());
  const response = await apiFetch<UserQnaDetailRes>(url);
  return enhanceApiResponse(response);
}

/**
 * Q&A 생성 (사용자용)
 */
export async function createUserQna(data: UserQnaCreateReq): Promise<ApiResponse<UserQnaCreateRes>> {
  const response = await apiFetch<UserQnaCreateRes>(FULL_API_URLS.USER.QNA.CREATE, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return enhanceApiResponse(response);
}

/**
 * 홈 화면용 Q&A 조회 (최신 5개)
 */
export async function getHomeQnaList(): Promise<ApiResponse<UserQnaHomeRes>> {
  const response = await apiFetch<UserQnaHomeRes>(FULL_API_URLS.USER.QNA.HOME);
  return enhanceApiResponse(response);
}

/**
 * Q&A 타입별 목록 조회 (사용자용)
 */
export async function getUserQnaListByType(qnaType: string, params: Omit<UserQnaListReq, 'qnaType'>): Promise<ApiResponse<UserQnaListRes>> {
  const response = await apiFetch<UserQnaListRes>(FULL_API_URLS.USER.QNA.LIST, {
    method: 'POST',
    body: JSON.stringify({
      ...params,
      qnaType: qnaType === 'ALL' ? undefined : qnaType
    })
  });
  return enhanceApiResponse(response);
}

// ===== 관리자용 API 함수들 =====

/**
 * Q&A 목록 조회 (관리자용)
 */
export async function getAdminQnaList(params: AdminQnaListReq): Promise<ApiResponse<AdminQnaListRes>> {
  return apiFetch<AdminQnaListRes>(FULL_API_URLS.ADMIN.QNA.LIST, {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * Q&A 상세 조회 (관리자용)
 */
export async function getAdminQnaDetail(qnaId: number): Promise<ApiResponse<AdminQnaDetailRes>> {
  const url = FULL_API_URLS.ADMIN.QNA.DETAIL.replace(':qnaId', qnaId.toString());
  return apiFetch<AdminQnaDetailRes>(url);
}

/**
 * Q&A 답변 (관리자용)
 */
export async function answerAdminQna(qnaId: number, data: AdminQnaAnswerReq): Promise<ApiResponse<AdminQnaAnswerRes>> {
  const url = FULL_API_URLS.ADMIN.QNA.ANSWER.replace(':qnaId', qnaId.toString());
  return apiFetch<AdminQnaAnswerRes>(url, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * Q&A 수정 (관리자용)
 */
export async function updateAdminQna(qnaId: number, data: AdminQnaUpdateReq): Promise<ApiResponse<AdminQnaUpdateRes>> {
  const url = FULL_API_URLS.ADMIN.QNA.UPDATE.replace(':qnaId', qnaId.toString());
  return apiFetch<AdminQnaUpdateRes>(url, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

/**
 * Q&A 삭제 (관리자용)
 */
export async function deleteAdminQna(qnaId: number): Promise<ApiResponse<AdminQnaDeleteRes>> {
  const url = FULL_API_URLS.ADMIN.QNA.DELETE.replace(':qnaId', qnaId.toString());
  return apiFetch<AdminQnaDeleteRes>(url, {
    method: 'DELETE'
  });
} 