import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError } from '../../utils/errorHandler';
import { findQnas, findQnaById, createQna } from '../../repositories/sysQnaRepository';

// QnA 목록 조회 (사용자용)
export const getQnaList = async (req: Request, res: Response) => {
  try {
    const { page, limit, search } = req.query;
    const result = await findQnas({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string
    });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('User QnA list error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// QnA 상세 조회 (사용자용)
export const getQnaDetail = async (req: Request, res: Response) => {
  try {
    const { qnaId } = req.params;
    const qna = await findQnaById(parseInt(qnaId));
    
    if (!qna) {
      return sendError(res, ErrorCode.NOT_FOUND);
    }

    res.json({
      success: true,
      data: {
        qna
      }
    });
  } catch (error) {
    console.error('User QnA detail error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// QnA 작성 (사용자용)
export const createQnaItem = async (req: Request, res: Response) => {
  try {
    const { title, content, userId, secretYn = 'N' } = req.body;

    if (!title || !content) {
      return sendError(res, ErrorCode.INVALID_REQUEST);
    }

    const result = await createQna({
      userId: userId || req.user?.userId,
      qnaType: 'GENERAL',
      title,
      content,
      secretYn,
      createdBy: 'BY-USER'
    });

    res.json({
      success: true,
      data: {
        message: 'QnA가 작성되었습니다.',
        qnaId: result.qnaId
      }
    });
  } catch (error) {
    console.error('User QnA create error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
}; 