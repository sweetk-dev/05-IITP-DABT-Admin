import { Request, Response } from 'express';
import { ErrorCode, ADMIN_API_MAPPING, API_URLS } from '@iitp-dabt/common';
import { sendError, sendSuccess, sendValidationError, sendDatabaseError } from '../../utils/errorHandler';
import { 
  getFaqList, 
  getFaqDetail, 
  createFaq, 
  updateFaq, 
  deleteFaq
} from '../../services/admin/adminFaqService';
import { appLogger } from '../../utils/logger';
import { logApiCall } from '../../utils/apiLogger';
import { 
  extractUserIdFromRequest,
  normalizeErrorMessage
} from '../../utils/commonUtils';
import type {
  AdminFaqListQuery,
  AdminFaqListRes,
  AdminFaqDetailParams,
  AdminFaqDetailRes,
  AdminFaqCreateReq,
  AdminFaqCreateRes,
  AdminFaqUpdateReq
} from '@iitp-dabt/common';

/**
 * FAQ 목록 조회 (관리자용)
 * API: GET /api/admin/faq
 * 매핑: ADMIN_API_MAPPING[`GET ${API_URLS.ADMIN.FAQ.LIST}`]
 */
export const getFaqListForAdmin = async (req: Request<{}, {}, {}, AdminFaqListQuery>, res: Response) => {
  let adminId: number | null;
  
  try {
    logApiCall('GET', API_URLS.ADMIN.FAQ.LIST, ADMIN_API_MAPPING as any, 'FAQ 목록 조회 (관리자용)');

    const page = typeof req.query.page === 'string' ? parseInt(req.query.page) || 1 : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) || 10 : 10;
    const faqType = typeof req.query.faqType === 'string' ? req.query.faqType : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const useYn = typeof req.query.useYn === 'string' ? req.query.useYn : undefined;
    
    adminId = extractUserIdFromRequest(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }
    
    const result = await getFaqList({
      page,
      limit,
      faqType,
      search,
      useYn
    });

    const mappedFaqs = result.faqs.map(faq => ({
      faqId: faq.faqId,
      faqType: faq.faqType,
      question: faq.question,
      answer: faq.answer,
      hitCnt: faq.hitCnt,
      sortOrder: faq.sortOrder,
      useYn: faq.useYn,
      createdAt: faq.createdAt.toISOString(),
      updatedAt: faq.updatedAt?.toISOString()
    }));

    const response: AdminFaqListRes = {
      items: mappedFaqs,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit)
    };

    sendSuccess(res, response, undefined, 'ADMIN_FAQ_LIST_VIEW', { adminId, count: result.faqs.length }, true);
  } catch (error) {
    appLogger.error('관리자 FAQ 목록 조회 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '조회', 'FAQ 목록');
      }
    }
    sendError(res, ErrorCode.FAQ_NOT_FOUND);
  }
};

/**
 * FAQ 상세 조회 (관리자용)
 * API: GET /api/admin/faq/:faqId
 * 매핑: ADMIN_API_MAPPING[`GET ${API_URLS.ADMIN.FAQ.DETAIL}`]
 */
export const getFaqDetailForAdmin = async (req: Request<AdminFaqDetailParams>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.ADMIN.FAQ.DETAIL, ADMIN_API_MAPPING as any, 'FAQ 상세 조회 (관리자용)');

    const { faqId } = req.params;
    const adminId = extractUserIdFromRequest(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!faqId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }
    
    const faq = await getFaqDetail(parseInt(faqId));
    if (!faq) {
      return sendError(res, ErrorCode.FAQ_NOT_FOUND);
    }

    const response: AdminFaqDetailRes = {
      faq: {
        faqId: faq.faqId,
        faqType: faq.faqType,
        question: faq.question,
        answer: faq.answer,
        hitCnt: faq.hitCnt,
        sortOrder: faq.sortOrder,
        useYn: faq.useYn,
        createdAt: faq.createdAt.toISOString(),
        updatedAt: faq.updatedAt?.toISOString()
      }
    };

    sendSuccess(res, response, undefined, 'ADMIN_FAQ_DETAIL_VIEW', { adminId, faqId });
  } catch (error) {
    appLogger.error('관리자 FAQ 상세 조회 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '조회', 'FAQ 상세');
      }
    }
    sendError(res, ErrorCode.FAQ_NOT_FOUND);
  }
};

/**
 * FAQ 생성 (관리자용)
 * API: POST /api/admin/faq
 * 매핑: ADMIN_API_MAPPING[`POST ${API_URLS.ADMIN.FAQ.CREATE}`]
 */
export const createFaqForAdmin = async (req: Request<{}, {}, AdminFaqCreateReq>, res: Response) => {
  try {
    logApiCall('POST', API_URLS.ADMIN.FAQ.CREATE, ADMIN_API_MAPPING as any, 'FAQ 생성 (관리자용)');

    const faqData = req.body;
    const adminId = extractUserIdFromRequest(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!faqData.question || !faqData.answer || !faqData.faqType) {
      return sendValidationError(res, 'general', '질문, 답변, FAQ 타입은 필수입니다.');
    }

    const newFaq = await createFaq(faqData, adminId);

    const response: AdminFaqCreateRes = {
      faqId: newFaq.faqId
    };

    sendSuccess(res, response, undefined, 'ADMIN_FAQ_CREATED', { adminId, faqId: newFaq.faqId });
  } catch (error) {
    appLogger.error('관리자 FAQ 생성 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '생성', 'FAQ');
      }
    }
    sendError(res, ErrorCode.FAQ_CREATE_FAILED);
  }
};

/**
 * FAQ 수정 (관리자용)
 * API: PUT /api/admin/faq/:faqId
 * 매핑: ADMIN_API_MAPPING[`PUT ${API_URLS.ADMIN.FAQ.UPDATE}`]
 */
export const updateFaqForAdmin = async (req: Request<{ faqId: string }, {}, AdminFaqUpdateReq>, res: Response) => {
  try {
    logApiCall('PUT', API_URLS.ADMIN.FAQ.UPDATE, ADMIN_API_MAPPING as any, 'FAQ 수정 (관리자용)');

    const { faqId } = req.params;
    const updateData = req.body;
    const adminId = extractUserIdFromRequest(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!faqId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    const updatedFaq = await updateFaq(parseInt(faqId), updateData, adminId);

    sendSuccess(res, undefined, undefined, 'ADMIN_FAQ_UPDATED', { adminId, faqId });
  } catch (error) {
    appLogger.error('관리자 FAQ 수정 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '수정', 'FAQ');
      }
    }
    sendError(res, ErrorCode.FAQ_UPDATE_FAILED);
  }
};

/**
 * FAQ 삭제 (관리자용)
 * API: DELETE /api/admin/faq/:faqId
 * 매핑: ADMIN_API_MAPPING[`DELETE ${API_URLS.ADMIN.FAQ.DELETE}`]
 */
export const deleteFaqForAdmin = async (req: Request<{ faqId: string }>, res: Response) => {
  try {
    logApiCall('DELETE', API_URLS.ADMIN.FAQ.DELETE, ADMIN_API_MAPPING as any, 'FAQ 삭제 (관리자용)');

    const { faqId } = req.params;
    const adminId = extractUserIdFromRequest(req);
    
    if (!adminId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    if (!faqId) {
      return sendError(res, ErrorCode.INVALID_PARAMETER);
    }

    await deleteFaq(parseInt(faqId), adminId);

    sendSuccess(res, undefined, undefined, 'ADMIN_FAQ_DELETED', { adminId, faqId });
  } catch (error) {
    appLogger.error('관리자 FAQ 삭제 중 오류 발생', { error, adminId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '삭제', 'FAQ');
      }
    }
    sendError(res, ErrorCode.FAQ_DELETE_FAILED);
  }
}; 