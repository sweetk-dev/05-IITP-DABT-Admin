import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError, sendDatabaseError, sendSuccess } from '../../utils/errorHandler';
import { findActiveFaqs, findFaqById, incrementHitCount } from '../../repositories/sysFaqRepository';
import { UserFaqListQuery, UserFaqListResponse, UserFaqDetailParams, UserFaqDetailResponse } from '../../types/user';

// FAQ 목록 조회 (사용자용)
export const getFaqList = async (req: Request<{}, {}, {}, UserFaqListQuery>, res: Response) => {
  try {
    const { page, limit, faqType, search } = req.query;
    const result = await findActiveFaqs({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      faqType: faqType as string,
      search: search as string
    });
    
    const response: UserFaqListResponse = {
      faqs: result.faqs.map(faq => ({
        faqId: faq.faqId,
        faqType: faq.faqType,
        question: faq.question,
        answer: faq.answer,
        hitCnt: faq.hitCnt,
        createdAt: faq.createdAt.toISOString()
      })),
      total: result.total,
      page: result.page,
      limit: result.limit
    };
    
    sendSuccess(res, response, undefined, 'USER_FAQ_LIST', { page, limit, faqType, search });
  } catch (error) {
    sendDatabaseError(res, '조회', 'FAQ 목록');
  }
};

// FAQ 상세 조회 (사용자용)
export const getFaqDetail = async (req: Request<UserFaqDetailParams>, res: Response) => {
  try {
    const { faqId } = req.params;
    const faq = await findFaqById(parseInt(faqId));
    
    if (!faq) {
      return sendError(res, ErrorCode.FAQ_NOT_FOUND);
    }

    // 조회수 증가
    await incrementHitCount(parseInt(faqId));

    const response: UserFaqDetailResponse = {
      faq: {
        faqId: faq.faqId,
        faqType: faq.faqType,
        question: faq.question,
        answer: faq.answer,
        hitCnt: faq.hitCnt,
        createdAt: faq.createdAt.toISOString(),
        updatedAt: faq.updatedAt.toISOString()
      }
    };

    sendSuccess(res, response, undefined, 'USER_FAQ_DETAIL', { faqId });
  } catch (error) {
    sendDatabaseError(res, '조회', 'FAQ 상세');
  }
}; 