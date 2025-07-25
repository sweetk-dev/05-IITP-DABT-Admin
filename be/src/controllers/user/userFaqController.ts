import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError } from '../../utils/errorHandler';
import { findActiveFaqs, findFaqById, incrementHitCount } from '../../repositories/sysFaqRepository';
import { appLogger } from '../../utils/logger';

// FAQ 목록 조회 (사용자용)
export const getFaqList = async (req: Request, res: Response) => {
  try {
    const { page, limit, faqType, search } = req.query;
    const result = await findActiveFaqs({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      faqType: faqType as string,
      search: search as string
    });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    appLogger.error('User FAQ list error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// FAQ 상세 조회 (사용자용)
export const getFaqDetail = async (req: Request, res: Response) => {
  try {
    const { faqId } = req.params;
    const faq = await findFaqById(parseInt(faqId));
    
    if (!faq) {
      return sendError(res, ErrorCode.NOT_FOUND);
    }

    // 조회수 증가
    await incrementHitCount(parseInt(faqId));

    res.json({
      success: true,
      data: {
        faq
      }
    });
  } catch (error) {
    appLogger.error('User FAQ detail error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
}; 