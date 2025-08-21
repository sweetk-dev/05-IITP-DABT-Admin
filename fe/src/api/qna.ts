import { apiFetch, publicApiFetch, enhanceApiResponse, buildUrl } from './api';
import { FULL_API_URLS } from '@iitp-dabt/common';
import type {
  UserQnaListQuery as UserQnaListReq,
  UserQnaListRes,
  UserQnaDetailRes,
  UserQnaCreateReq,
  UserQnaCreateRes,
  UserQnaHomeRes,
  AdminQnaListQuery as AdminQnaListReq,
  AdminQnaListRes,
  AdminQnaDetailRes,
  AdminQnaAnswerReq,
  // answer/update/delete는 ApiResponse<void>
  AdminQnaUpdateReq,
  // AdminQnaUpdateRes,
  // AdminQnaDeleteRes
} from '@iitp-dabt/common';
import type { ApiResponse } from '../types/api';

/**
 * Q&A 목록 조회 (사용자용)
 */
export async function getUserQnaList(params: UserQnaListReq): Promise<ApiResponse<UserQnaListRes>> {
  const url = buildUrl(FULL_API_URLS.USER.QNA.LIST, params as any);
  // 공개 리스트는 공개로, mineOnly=true일 때만 인증 요청
  const needsAuth = !!(params as any).mineOnly;
  return needsAuth
    ? apiFetch<UserQnaListRes>(url, { method: 'GET' })
    : publicApiFetch<UserQnaListRes>(url, { method: 'GET' });
}

/**
 * Q&A 상세 조회 (사용자용)
 */
export async function getUserQnaDetail(qnaId: number, options?: { skipHit?: boolean }): Promise<ApiResponse<UserQnaDetailRes>> {
  const base = FULL_API_URLS.USER.QNA.DETAIL.replace(':qnaId', qnaId.toString());
  const url = options?.skipHit ? `${base}?skipHit=true` : base;
  // 공통 함수에서 토큰이 있으면 자동으로 헤더를 포함하므로 공개 경로로 호출
  return publicApiFetch<UserQnaDetailRes>(url, { method: 'GET' });
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
  // 홈은 항상 공개 경로 호출(공통 함수가 토큰 있으면 자동 첨부)
  return publicApiFetch<UserQnaHomeRes>(FULL_API_URLS.USER.QNA.HOME, { method: 'GET' });
}

/**
 * Q&A 타입별 목록 조회 (사용자용)
 */
export async function getUserQnaListByType(qnaType: string, params: Omit<UserQnaListReq, 'qnaType'>): Promise<ApiResponse<UserQnaListRes>> {
  const url = buildUrl(FULL_API_URLS.USER.QNA.LIST, {
    ...params,
    qnaType: qnaType === 'ALL' ? undefined : qnaType
  } as any);
  // 타입별 리스트도 공개 경로 호출(공통 함수가 토큰 있으면 자동 첨부)
  return publicApiFetch<UserQnaListRes>(url, { method: 'GET' });
}

/**
 * Q&A 삭제 (사용자용)
 */
export async function deleteUserQna(qnaId: number): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.USER.QNA.DELETE.replace(':qnaId', qnaId.toString());
  return apiFetch<void>(url, { method: 'DELETE' });
}

// ===== 관리자용 API 함수들 =====

/**
 * Q&A 목록 조회 (관리자용)
 */
export async function getAdminQnaList(params: AdminQnaListReq): Promise<ApiResponse<AdminQnaListRes>> {
  const url = buildUrl(FULL_API_URLS.ADMIN.QNA.LIST, params as any);
  return apiFetch<AdminQnaListRes>(url, { method: 'GET' });
}

/**
 * Q&A 상세 조회 (관리자용)
 */
export async function getAdminQnaDetail(qnaId: number): Promise<ApiResponse<AdminQnaDetailRes>> {
  const url = FULL_API_URLS.ADMIN.QNA.DETAIL.replace(':qnaId', qnaId.toString());
  return apiFetch<AdminQnaDetailRes>(url, { method: 'GET' });
}

/**
 * Q&A 답변 (관리자용)
 */
export async function answerAdminQna(qnaId: number, data: AdminQnaAnswerReq): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.ADMIN.QNA.ANSWER.replace(':qnaId', qnaId.toString());
  return apiFetch<void>(url, {
    method: 'POST',
    body: JSON.stringify({ answer: (data as any).answer ?? (data as any).answerContent })
  });
}

/**
 * Q&A 수정 (관리자용)
 */
export async function updateAdminQna(qnaId: number, data: AdminQnaUpdateReq): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.ADMIN.QNA.UPDATE.replace(':qnaId', qnaId.toString());
  return apiFetch<void>(url, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

/**
 * Q&A 삭제 (관리자용)
 */
export async function deleteAdminQna(qnaId: number): Promise<ApiResponse<void>> {
  const url = FULL_API_URLS.ADMIN.QNA.DELETE.replace(':qnaId', qnaId.toString());
  return apiFetch<void>(url, {
    method: 'DELETE'
  });
} 