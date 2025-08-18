import { Request, Response } from 'express';
import { ErrorCode, ADMIN_API_MAPPING, API_URLS } from '@iitp-dabt/common';
import { sendError, sendSuccess, sendValidationError, sendDatabaseError } from '../../utils/errorHandler';
import { 
  getQnaList, 
  getQnaDetail, 
  answerQna, 
  updateQna, 
  deleteQna 
} from '../../services/admin/adminQnaService';
import { appLogger } from '../../utils/logger';
import { logApiCall } from '../../utils/apiLogger';
import { 
  extractUserIdFromRequest,
  normalizeErrorMessage
} from '../../utils/commonUtils';
import { getNumberQuery, getStringQuery } from '../../utils/queryParsers';
import type {
  AdminQnaListQuery,
  AdminQnaListRes,
  AdminQnaDetailParams,
  AdminQnaDetailRes,
  AdminQnaAnswerReq,
  AdminQnaUpdateReq
} from '@iitp-dabt/common';
import { toAdminQnaItem, toAdminQnaDetailItem } from '../../mappers/qnaMapper';

/**
 * QnA 목록 조회 (관리자용)
 * API: GET /api/admin/qna
 * 매핑: ADMIN_API_MAPPING[`GET ${API_URLS.ADMIN.QNA.LIST}`]
 */
export const getQnaListForAdmin = async (req: Request<{}, {}, {}, AdminQnaListQuery>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.ADMIN.QNA.LIST, ADMIN_API_MAPPING as any, 'QnA 목록 조회 (관리자용)');

    const page = getNumberQuery(req.query, 'page', 1)!;
    const limit = getNumberQuery(req.query, 'limit', 10)!;
    const search = getStringQuery(req.query, 'search');
    const status = getStringQuery(req.query, 'status');
    
    const adminId = extractUserIdFromRequest(req);
    const actorTag = req.user?.actorTag!;
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    const result = await getQnaList({
      page,
      limit,
      search,
      status
    });

    const response: AdminQnaListRes = {
      items: result.qnas.map(toAdminQnaItem),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit)
    };

    sendSuccess(res, response, undefined, 'ADMIN_QNA_LIST_VIEW', { adminId, count: response.items.length }, true);
  } catch (error) {
    appLogger.error('관리자 QnA 목록 조회 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '조회', 'QnA 목록');
      }
    }
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

/**
 * QnA 상세 조회 (관리자용)
 * API: GET /api/admin/qna/:qnaId
 * 매핑: ADMIN_API_MAPPING[`GET ${API_URLS.ADMIN.QNA.DETAIL}`]
 */
export const getQnaDetailForAdmin = async (req: Request<AdminQnaDetailParams>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.ADMIN.QNA.DETAIL, ADMIN_API_MAPPING as any, 'QnA 상세 조회 (관리자용)');

    const { qnaId } = req.params;
    const adminId = extractUserIdFromRequest(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!qnaId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }
    
    const qna = await getQnaDetail(parseInt(qnaId));
    const response: AdminQnaDetailRes = { qna: toAdminQnaDetailItem(qna) };
    sendSuccess(res, response, undefined, 'ADMIN_QNA_DETAIL_VIEW', { adminId, qnaId });
  } catch (error) {
    appLogger.error('관리자 QnA 상세 조회 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '조회', 'QnA 상세');
      }
    }
    sendError(res, ErrorCode.QNA_NOT_FOUND);
  }
};

/**
 * QnA 답변 (관리자용)
 * API: POST /api/admin/qna/:qnaId/answer
 * 매핑: ADMIN_API_MAPPING[`POST ${API_URLS.ADMIN.QNA.ANSWER}`]
 */
export const answerQnaForAdmin = async (req: Request<{ qnaId: string }, {}, AdminQnaAnswerReq>, res: Response) => {
  try {
    logApiCall('POST', API_URLS.ADMIN.QNA.ANSWER, ADMIN_API_MAPPING as any, 'QnA 답변 (관리자용)');

    const { qnaId } = req.params;
    const { answer } = req.body;
    const adminId = extractUserIdFromRequest(req);
    const actorTag = req.user?.actorTag!;
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!qnaId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    if (!answer) {
      return sendValidationError(res, 'answer', '답변 내용은 필수입니다.');
    }

    await answerQna(parseInt(qnaId), { answer }, actorTag);
    sendSuccess(res, undefined, undefined, 'ADMIN_QNA_ANSWERED', { adminId, qnaId });
  } catch (error) {
    appLogger.error('관리자 QnA 답변 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '답변', 'QnA');
      }
    }
    sendError(res, ErrorCode.QNA_ANSWER_FAILED);
  }
};

/**
 * QnA 수정 (관리자용)
 * API: PUT /api/admin/qna/:qnaId
 * 매핑: ADMIN_API_MAPPING[`PUT ${API_URLS.ADMIN.QNA.UPDATE}`]
 */
export const updateQnaForAdmin = async (req: Request<{ qnaId: string }, {}, AdminQnaUpdateReq>, res: Response) => {
  try {
    logApiCall('PUT', API_URLS.ADMIN.QNA.UPDATE, ADMIN_API_MAPPING as any, 'QnA 수정 (관리자용)');

    const { qnaId } = req.params;
    const updateData = req.body;
    const adminId = extractUserIdFromRequest(req);
    const actorTag = req.user?.actorTag!;
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!qnaId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    await updateQna(parseInt(qnaId), updateData, actorTag);
    sendSuccess(res, undefined, undefined, 'ADMIN_QNA_UPDATED', { adminId, qnaId });
  } catch (error) {
    appLogger.error('관리자 QnA 수정 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '수정', 'QnA');
      }
    }
    sendError(res, ErrorCode.QNA_UPDATE_FAILED);
  }
};

/**
 * QnA 삭제 (관리자용)
 * API: DELETE /api/admin/qna/:qnaId
 * 매핑: ADMIN_API_MAPPING[`DELETE ${API_URLS.ADMIN.QNA.DELETE}`]
 */
export const deleteQnaForAdmin = async (req: Request<{ qnaId: string }>, res: Response) => {
  try {
    logApiCall('DELETE', API_URLS.ADMIN.QNA.DELETE, ADMIN_API_MAPPING as any, 'QnA 삭제 (관리자용)');

    const { qnaId } = req.params;
    const adminId = extractUserIdFromRequest(req);
    const actorTag = req.user?.actorTag!;
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!qnaId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    await deleteQna(parseInt(qnaId), actorTag);
    sendSuccess(res, undefined, undefined, 'ADMIN_QNA_DELETED', { adminId, qnaId });
  } catch (error) {
    appLogger.error('관리자 QnA 삭제 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '삭제', 'QnA');
      }
    }
    sendError(res, ErrorCode.QNA_DELETE_FAILED);
  }
}; 