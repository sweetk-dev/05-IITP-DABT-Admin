import { apiFetch, publicApiFetch } from './api';
import { FULL_API_URLS } from '@iitp-dabt/common';
import type { 
  UserQnaListReq,
  UserQnaListRes,
  UserQnaDetailRes,
  UserQnaCreateReq,
  UserQnaCreateRes,
  AdminQnaListReq,
  AdminQnaListRes,
  AdminQnaDetailRes,
  AdminQnaAnswerReq,
  AdminQnaAnswerRes,
  AdminQnaUpdateReq,
  AdminQnaUpdateRes,
  AdminQnaDeleteRes,
  ApiResponse
} from '@iitp-dabt/common';

// ===== User QnA API =====

/**
 * 사용자 QnA 목록 조회
 */
export async function getUserQnaList(_params: UserQnaListReq): Promise<ApiResponse<UserQnaListRes>> {
  return publicApiFetch<UserQnaListRes>(FULL_API_URLS.USER.QNA_LIST, {
    method: 'GET',
    // TODO: 쿼리 파라미터 처리
  });
}

/**
 * 사용자 QnA 상세 조회
 */
export async function getUserQnaDetail(qnaId: number): Promise<ApiResponse<UserQnaDetailRes>> {
  const url = FULL_API_URLS.USER.QNA_DETAIL.replace(':qnaId', qnaId.toString());
  return publicApiFetch<UserQnaDetailRes>(url, {
    method: 'GET',
  });
}

/**
 * 사용자 QnA 생성
 */
export async function createUserQna(params: UserQnaCreateReq): Promise<ApiResponse<UserQnaCreateRes>> {
  return apiFetch<UserQnaCreateRes>(FULL_API_URLS.USER.QNA_CREATE, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// ===== Admin QnA API =====

/**
 * 관리자 QnA 목록 조회
 */
export async function getAdminQnaList(_params: AdminQnaListReq): Promise<ApiResponse<AdminQnaListRes>> {
  return apiFetch<AdminQnaListRes>(FULL_API_URLS.ADMIN.QNA_LIST, {
    method: 'GET',
    // TODO: 쿼리 파라미터 처리
  });
}

/**
 * 관리자 QnA 상세 조회
 */
export async function getAdminQnaDetail(qnaId: number): Promise<ApiResponse<AdminQnaDetailRes>> {
  const url = FULL_API_URLS.ADMIN.QNA_DETAIL.replace(':qnaId', qnaId.toString());
  return apiFetch<AdminQnaDetailRes>(url, {
    method: 'GET',
  });
}

/**
 * 관리자 QnA 답변 등록
 */
export async function answerAdminQna(qnaId: number, params: AdminQnaAnswerReq): Promise<ApiResponse<AdminQnaAnswerRes>> {
  const url = FULL_API_URLS.ADMIN.QNA_ANSWER.replace(':qnaId', qnaId.toString());
  return apiFetch<AdminQnaAnswerRes>(url, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * 관리자 QnA 수정
 */
export async function updateAdminQna(qnaId: number, params: AdminQnaUpdateReq): Promise<ApiResponse<AdminQnaUpdateRes>> {
  const url = FULL_API_URLS.ADMIN.QNA_UPDATE.replace(':qnaId', qnaId.toString());
  return apiFetch<AdminQnaUpdateRes>(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

/**
 * 관리자 QnA 삭제
 */
export async function deleteAdminQna(qnaId: number): Promise<ApiResponse<AdminQnaDeleteRes>> {
  const url = FULL_API_URLS.ADMIN.QNA_DELETE.replace(':qnaId', qnaId.toString());
  return apiFetch<AdminQnaDeleteRes>(url, {
    method: 'DELETE',
  });
} 