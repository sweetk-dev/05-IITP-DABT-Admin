import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError } from '../../utils/errorHandler';
import { findQnasByUser, findQnaById, createQna } from '../../repositories/sysQnaRepository';
import { appLogger } from '../../utils/logger';

// QnA 목록 조회 (사용자용)
export const getQnaList = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    const { page, limit, qnaType } = req.query;
    const result = await findQnasByUser(userId, {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      qnaType: qnaType as string
    });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    appLogger.error('User QnA list error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// QnA 상세 조회 (사용자용)
export const getQnaDetail = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    const { qnaId } = req.params;
    const qna = await findQnaById(parseInt(qnaId));
    
    if (!qna) {
      return sendError(res, ErrorCode.NOT_FOUND);
    }

    // 본인이 작성한 QnA만 조회 가능
    if (qna.userId !== userId) {
      return sendError(res, ErrorCode.FORBIDDEN);
    }

    res.json({
      success: true,
      data: {
        qna
      }
    });
  } catch (error) {
    appLogger.error('User QnA detail error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// QnA 생성 (사용자용)
export const createQnaItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    const { qnaType, title, content, secretYn } = req.body;

    if (!qnaType || !title || !content) {
      return sendError(res, ErrorCode.INVALID_REQUEST);
    }

    const result = await createQna({
      userId,
      qnaType,
      title,
      content,
      secretYn: secretYn || 'N',
      writerName: req.user?.name,
      createdBy: userId.toString()
    });

    res.json({
      success: true,
      data: {
        qnaId: result.qnaId,
        message: 'QnA가 등록되었습니다.'
      }
    });
  } catch (error) {
    appLogger.error('User QnA create error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
}; 