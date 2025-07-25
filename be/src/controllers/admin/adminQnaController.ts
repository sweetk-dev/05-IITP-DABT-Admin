import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError } from '../../utils/errorHandler';
import {
  findQnas,
  findQnaById,
  updateQna,
  deleteQna,
  answerQna
} from '../../repositories/sysQnaRepository';
import { appLogger } from '../../utils/logger';

// QnA 목록 조회 (관리자용)
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
    appLogger.error('Admin QnA list error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// QnA 상세 조회 (관리자용)
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
    appLogger.error('Admin QnA detail error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// QnA 답변 (관리자용)
export const answerQnaItem = async (req: Request, res: Response) => {
  try {
    const { qnaId } = req.params;
    const { answer, answeredBy } = req.body;

    if (!answer) {
      return sendError(res, ErrorCode.INVALID_REQUEST);
    }

    const success = await answerQna(parseInt(qnaId), {
      answerContent: answer,
      answeredBy: answeredBy || req.user?.userId
    });

    if (!success) {
      return sendError(res, ErrorCode.NOT_FOUND);
    }

    res.json({
      success: true,
      data: {
        message: 'QnA 답변이 등록되었습니다.'
      }
    });
  } catch (error) {
    appLogger.error('Admin QnA answer error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// QnA 수정 (관리자용)
export const updateQnaItem = async (req: Request, res: Response) => {
  try {
    const { qnaId } = req.params;
    const { title, content, updatedBy } = req.body;

    const success = await updateQna(parseInt(qnaId), {
      title,
      content,
      updatedBy: updatedBy || req.user?.userId
    });

    if (!success) {
      return sendError(res, ErrorCode.NOT_FOUND);
    }

    res.json({
      success: true,
      data: {
        message: 'QnA가 수정되었습니다.'
      }
    });
  } catch (error) {
    appLogger.error('Admin QnA update error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// QnA 삭제 (관리자용)
export const deleteQnaItem = async (req: Request, res: Response) => {
  try {
    const { qnaId } = req.params;
    const deletedBy = req.user?.userId ? req.user.userId.toString() : 'admin';

    const success = await deleteQna(parseInt(qnaId), deletedBy);

    if (!success) {
      return sendError(res, ErrorCode.NOT_FOUND);
    }

    res.json({
      success: true,
      data: {
        message: 'QnA가 삭제되었습니다.'
      }
    });
  } catch (error) {
    appLogger.error('Admin QnA delete error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
}; 