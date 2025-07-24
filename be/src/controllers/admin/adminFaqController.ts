import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError } from '../../utils/errorHandler';
import { 
  findFaqs, 
  findFaqById, 
  createFaq, 
  updateFaq, 
  deleteFaq,
  getFaqCountByType 
} from '../../repositories/sysFaqRepository';

// FAQ 목록 조회 (관리자용)
export const getFaqList = async (req: Request, res: Response) => {
  try {
    const { page, limit, faqType, search, useYn } = req.query;
    const result = await findFaqs({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      faqType: faqType as string,
      search: search as string,
      useYn: useYn as string
    });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Admin FAQ list error:', error);
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
    console.error('Admin FAQ detail error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// FAQ 생성
export const createFaqItem = async (req: Request, res: Response) => {
  try {
    const { faqType, question, answer, sortOrder, createdBy } = req.body;

    if (!faqType || !question || !answer) {
      return sendError(res, ErrorCode.INVALID_REQUEST);
    }

    const result = await createFaq({
      faqType,
      question,
      answer,
      sortOrder,
      createdBy
    });

    res.json({
      success: true,
      data: {
        message: 'FAQ가 생성되었습니다.',
        faqId: result.faqId
      }
    });
  } catch (error) {
    console.error('Admin FAQ create error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// FAQ 수정
export const updateFaqItem = async (req: Request, res: Response) => {
  try {
    const { faqId } = req.params;
    const { faqType, question, answer, sortOrder, useYn, updatedBy } = req.body;

    const success = await updateFaq(parseInt(faqId), {
      faqType,
      question,
      answer,
      sortOrder,
      useYn,
      updatedBy
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
    console.error('Admin FAQ update error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// FAQ 삭제
export const deleteFaqItem = async (req: Request, res: Response) => {
  try {
    const { faqId } = req.params;
    const success = await deleteFaq(parseInt(faqId));

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
    console.error('Admin FAQ delete error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// FAQ 타입별 통계
export const getFaqStats = async (req: Request, res: Response) => {
  try {
    const stats = await getFaqCountByType();
    res.json({
      success: true,
      data: {
        stats
      }
    });
  } catch (error) {
    console.error('Admin FAQ stats error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
}; 