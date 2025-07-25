import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError } from '../../utils/errorHandler';
import { findFaqs, findFaqById, createFaq, updateFaq, deleteFaq, getFaqStats } from '../../repositories/sysFaqRepository';
import { appLogger } from '../../utils/logger';

// FAQ 목록 조회 (관리자용)
export const getFaqList = async (req: Request, res: Response) => {
  try {
    const { page, limit, faqType, search } = req.query;
    const result = await findFaqs({
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
    appLogger.error('Admin FAQ list error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// FAQ 상세 조회 (관리자용)
export const getFaqDetail = async (req: Request, res: Response) => {
  try {
    const { faqId } = req.params;
    const faq = await findFaqById(parseInt(faqId));
    
    if (!faq) {
      return sendError(res, ErrorCode.NOT_FOUND);
    }

    res.json({
      success: true,
      data: {
        faq
      }
    });
  } catch (error) {
    appLogger.error('Admin FAQ detail error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// FAQ 생성 (관리자용)
export const createFaqItem = async (req: Request, res: Response) => {
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

    res.json({
      success: true,
      data: {
        faqId: result.faqId,
        message: 'FAQ가 등록되었습니다.'
      }
    });
  } catch (error) {
    appLogger.error('Admin FAQ create error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// FAQ 수정 (관리자용)
export const updateFaqItem = async (req: Request, res: Response) => {
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
      return sendError(res, ErrorCode.NOT_FOUND);
    }

    res.json({
      success: true,
      data: {
        message: 'FAQ가 수정되었습니다.'
      }
    });
  } catch (error) {
    appLogger.error('Admin FAQ update error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// FAQ 삭제 (관리자용)
export const deleteFaqItem = async (req: Request, res: Response) => {
  try {
    const { faqId } = req.params;
    const deletedBy = req.user?.userId;

    const success = await deleteFaq(parseInt(faqId), deletedBy?.toString());

    if (!success) {
      return sendError(res, ErrorCode.NOT_FOUND);
    }

    res.json({
      success: true,
      data: {
        message: 'FAQ가 삭제되었습니다.'
      }
    });
  } catch (error) {
    appLogger.error('Admin FAQ delete error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// FAQ 통계 (관리자용)
export const getFaqStats = async (req: Request, res: Response) => {
  try {
    const stats = await getFaqStats();

    res.json({
      success: true,
      data: {
        stats
      }
    });
  } catch (error) {
    appLogger.error('Admin FAQ stats error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
}; 