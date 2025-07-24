import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError } from '../../utils/errorHandler';
import { findActiveFaqs, findFaqById, incrementHitCount } from '../../repositories/sysFaqRepository';

// FAQ 목록 조회 (사용자용)
export const getFaqList = async (req: Request, res: Response) => {
  try {
    const { faqType } = req.query;
    const faqs = await findActiveFaqs(faqType as string);
    
    res.json({
      success: true,
      data: {
        faqs
      }
    });
  } catch (error) {
    console.error('User FAQ list error:', error);
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

    if (faq.useYn !== 'Y') {
      return sendError(res, ErrorCode.NOT_FOUND);
    }

    // 조회수 증가
    await incrementHitCount(faq.faqId);

    res.json({
      success: true,
      data: {
        faq
      }
    });
  } catch (error) {
    console.error('User FAQ detail error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
}; 