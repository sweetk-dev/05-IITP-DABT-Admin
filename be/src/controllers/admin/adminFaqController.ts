import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError, sendSuccess, sendDatabaseError } from '../../utils/errorHandler';
import { findFaqs, findFaqById, createFaq, updateFaq, deleteFaq, getFaqStats } from '../../repositories/sysFaqRepository';
import { 
  AdminFaqListQuery, 
  AdminFaqListResponse, 
  AdminFaqDetailParams, 
  AdminFaqDetailResponse,
  AdminFaqCreateRequest,
  AdminFaqCreateResponse,
  AdminFaqUpdateRequest,
  AdminFaqUpdateResponse,
  AdminFaqDeleteResponse,
  AdminFaqStatsResponse
} from '../../types/admin';

// FAQ 목록 조회 (관리자용)
export const getFaqList = async (req: Request<{}, {}, {}, AdminFaqListQuery>, res: Response) => {
  try {
    const { page, limit, faqType, search } = req.query;
    const result = await findFaqs({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      faqType: faqType as string,
      search: search as string
    });
    
    const response: AdminFaqListResponse = {
      faqs: result.faqs.map(faq => ({
        faqId: faq.faqId,
        faqType: faq.faqType,
        question: faq.question,
        answer: faq.answer,
        hitCnt: faq.hitCnt,
        sortOrder: faq.sortOrder,
        useYn: faq.useYn,
        createdAt: faq.createdAt.toISOString(),
        updatedAt: faq.updatedAt?.toISOString() || ''
      })),
      total: result.total,
      page: result.page,
      limit: result.limit
    };
    
    sendSuccess(res, response, undefined, 'ADMIN_FAQ_LIST', { page, limit, faqType, search });
  } catch (error) {
    sendDatabaseError(res, '조회', 'FAQ 목록');
  }
};

// FAQ 상세 조회 (관리자용)
export const getFaqDetail = async (req: Request<AdminFaqDetailParams>, res: Response) => {
  try {
    const { faqId } = req.params;
    const faq = await findFaqById(parseInt(faqId));
    
    if (!faq) {
      return sendError(res, ErrorCode.FAQ_NOT_FOUND);
    }

    const response: AdminFaqDetailResponse = {
      faq: {
        faqId: faq.faqId,
        faqType: faq.faqType,
        question: faq.question,
        answer: faq.answer,
        hitCnt: faq.hitCnt,
        sortOrder: faq.sortOrder,
        useYn: faq.useYn,
        createdAt: faq.createdAt.toISOString(),
        updatedAt: faq.updatedAt?.toISOString() || ''
      }
    };

    sendSuccess(res, response, undefined, 'ADMIN_FAQ_DETAIL', { faqId });
  } catch (error) {
    sendDatabaseError(res, '조회', 'FAQ 상세');
  }
};

// FAQ 생성 (관리자용)
export const createFaqItem = async (req: Request<{}, {}, AdminFaqCreateRequest>, res: Response) => {
  try {
    const { faqType, question, answer, sortOrder, useYn } = req.body;
    const createdBy = req.user?.userId;

    if (!faqType || !question || !answer) {
      return sendError(res, ErrorCode.INVALID_REQUEST);
    }

    const result = await createFaq({
      faqType,
      question,
      answer,
      sortOrder: sortOrder || 0,
      hitCnt: 0,
      useYn: useYn || 'Y',
      createdBy: createdBy?.toString()
    });

    const response: AdminFaqCreateResponse = {
      faqId: result.faqId,
      message: 'FAQ가 등록되었습니다.'
    };

    sendSuccess(res, response, undefined, 'ADMIN_FAQ_CREATE', { faqId: result.faqId, faqType });
  } catch (error) {
    sendDatabaseError(res, '생성', 'FAQ');
  }
};

// FAQ 수정 (관리자용)
export const updateFaqItem = async (req: Request<AdminFaqDetailParams, {}, AdminFaqUpdateRequest>, res: Response) => {
  try {
    const { faqId } = req.params;
    const { faqType, question, answer, sortOrder, useYn } = req.body;
    const updatedBy = req.user?.userId;

    const success = await updateFaq(parseInt(faqId), {
      faqType,
      question,
      answer,
      sortOrder,
      useYn,
      updatedBy: updatedBy?.toString()
    });

    if (!success) {
      return sendError(res, ErrorCode.FAQ_NOT_FOUND);
    }

    const response: AdminFaqUpdateResponse = {
      success: true,
      message: 'FAQ가 수정되었습니다.'
    };

    sendSuccess(res, response, undefined, 'ADMIN_FAQ_UPDATE', { faqId, faqType });
  } catch (error) {
    sendDatabaseError(res, '수정', 'FAQ');
  }
};

// FAQ 삭제 (관리자용)
export const deleteFaqItem = async (req: Request<AdminFaqDetailParams>, res: Response) => {
  try {
    const { faqId } = req.params;
    const deletedBy = req.user?.userId;

    const success = await deleteFaq(parseInt(faqId), deletedBy?.toString());

    if (!success) {
      return sendError(res, ErrorCode.FAQ_NOT_FOUND);
    }

    const response: AdminFaqDeleteResponse = {
      success: true,
      message: 'FAQ가 삭제되었습니다.'
    };

    sendSuccess(res, response, undefined, 'ADMIN_FAQ_DELETE', { faqId });
  } catch (error) {
    sendDatabaseError(res, '삭제', 'FAQ');
  }
};

// FAQ 통계 (관리자용)
export const getFaqStats = async (req: Request, res: Response) => {
  try {
    const stats = await getFaqStats();

    const response: AdminFaqStatsResponse = {
      totalFaqs: stats.totalFaqs,
      activeFaqs: stats.activeFaqs,
      totalHits: stats.totalHits,
      topFaqs: stats.topFaqs.map(faq => ({
        faqId: faq.faqId,
        question: faq.question,
        hitCnt: faq.hitCnt
      }))
    };

    sendSuccess(res, response, undefined, 'ADMIN_FAQ_STATS');
  } catch (error) {
    sendDatabaseError(res, '조회', 'FAQ 통계');
  }
}; 