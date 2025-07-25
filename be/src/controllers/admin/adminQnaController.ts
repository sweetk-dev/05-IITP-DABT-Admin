import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError, sendSuccess, sendDatabaseError } from '../../utils/errorHandler';
import {
  findQnas,
  findQnaById,
  updateQna,
  deleteQna,
  answerQna
} from '../../repositories/sysQnaRepository';
import { 
  AdminQnaListQuery, 
  AdminQnaListResponse, 
  AdminQnaDetailParams, 
  AdminQnaDetailResponse,
  AdminQnaAnswerRequest,
  AdminQnaAnswerResponse,
  AdminQnaUpdateRequest,
  AdminQnaUpdateResponse,
  AdminQnaDeleteResponse
} from '../../types/admin';

// QnA 목록 조회 (관리자용)
export const getQnaList = async (req: Request<{}, {}, {}, AdminQnaListQuery>, res: Response) => {
  try {
    const { page, limit, search } = req.query;
    const result = await findQnas({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string
    });
    
    const response: AdminQnaListResponse = {
      qnas: result.qnas.map(qna => ({
        qnaId: qna.qnaId,
        userId: qna.userId,
        qnaType: qna.qnaType,
        title: qna.title,
        content: qna.content,
        secretYn: qna.secretYn,
        status: qna.status,
        writerName: qna.writerName,
        createdAt: qna.createdAt.toISOString(),
        answeredAt: qna.answeredAt?.toISOString(),
        answeredBy: qna.answeredBy
      })),
      total: result.total,
      page: result.page,
      limit: result.limit
    };
    
    sendSuccess(res, response, undefined, 'ADMIN_QNA_LIST', { page, limit, search });
  } catch (error) {
    sendDatabaseError(res, '조회', 'QnA 목록');
  }
};

// QnA 상세 조회 (관리자용)
export const getQnaDetail = async (req: Request<AdminQnaDetailParams>, res: Response) => {
  try {
    const { qnaId } = req.params;
    const qna = await findQnaById(parseInt(qnaId));
    
    if (!qna) {
      return sendError(res, ErrorCode.QNA_NOT_FOUND);
    }

    const response: AdminQnaDetailResponse = {
      qna: {
        qnaId: qna.qnaId,
        userId: qna.userId,
        qnaType: qna.qnaType,
        title: qna.title,
        content: qna.content,
        secretYn: qna.secretYn,
        status: qna.status,
        writerName: qna.writerName,
        createdAt: qna.createdAt.toISOString(),
        answerContent: qna.answerContent,
        answeredAt: qna.answeredAt?.toISOString(),
        answeredBy: qna.answeredBy
      }
    };

    sendSuccess(res, response, undefined, 'ADMIN_QNA_DETAIL', { qnaId });
  } catch (error) {
    sendDatabaseError(res, '조회', 'QnA 상세');
  }
};

// QnA 답변 (관리자용)
export const answerQnaItem = async (req: Request<AdminQnaDetailParams, {}, AdminQnaAnswerRequest>, res: Response) => {
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
      return sendError(res, ErrorCode.QNA_NOT_FOUND);
    }

    const response: AdminQnaAnswerResponse = {
      success: true,
      message: 'QnA 답변이 등록되었습니다.'
    };

    sendSuccess(res, response, undefined, 'ADMIN_QNA_ANSWER', { qnaId });
  } catch (error) {
    sendDatabaseError(res, '답변', 'QnA');
  }
};

// QnA 수정 (관리자용)
export const updateQnaItem = async (req: Request<AdminQnaDetailParams, {}, AdminQnaUpdateRequest>, res: Response) => {
  try {
    const { qnaId } = req.params;
    const { title, content, updatedBy } = req.body;

    const success = await updateQna(parseInt(qnaId), {
      title,
      content,
      updatedBy: updatedBy || req.user?.userId
    });

    if (!success) {
      return sendError(res, ErrorCode.QNA_NOT_FOUND);
    }

    const response: AdminQnaUpdateResponse = {
      success: true,
      message: 'QnA가 수정되었습니다.'
    };

    sendSuccess(res, response, undefined, 'ADMIN_QNA_UPDATE', { qnaId });
  } catch (error) {
    sendDatabaseError(res, '수정', 'QnA');
  }
};

// QnA 삭제 (관리자용)
export const deleteQnaItem = async (req: Request<AdminQnaDetailParams>, res: Response) => {
  try {
    const { qnaId } = req.params;
    const deletedBy = req.user?.userId;

    const success = await deleteQna(parseInt(qnaId), deletedBy?.toString());

    if (!success) {
      return sendError(res, ErrorCode.QNA_NOT_FOUND);
    }

    const response: AdminQnaDeleteResponse = {
      success: true,
      message: 'QnA가 삭제되었습니다.'
    };

    sendSuccess(res, response, undefined, 'ADMIN_QNA_DELETE', { qnaId });
  } catch (error) {
    sendDatabaseError(res, '삭제', 'QnA');
  }
}; 