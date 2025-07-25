import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError, sendValidationError, sendDatabaseError } from '../../utils/errorHandler';
import { findQnasByUser, findQnaById, createQna } from '../../repositories/sysQnaRepository';

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
    sendDatabaseError(res, '조회', 'QnA 목록');
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
      return sendError(res, ErrorCode.QNA_NOT_FOUND);
    }

    // 본인이 작성한 QnA만 조회 가능
    if (qna.userId !== userId) {
      return sendError(res, ErrorCode.QNA_ACCESS_DENIED);
    }

    res.json({
      success: true,
      data: {
        qna
      }
    });
  } catch (error) {
    sendDatabaseError(res, '조회', 'QnA 상세');
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

    // 필수 필드 검증
    if (!qnaType) {
      return sendValidationError(res, 'qnaType', 'QnA 유형이 필요합니다.');
    }
    if (!title) {
      return sendValidationError(res, 'title', '제목이 필요합니다.');
    }
    if (!content) {
      return sendValidationError(res, 'content', '내용이 필요합니다.');
    }

    const result = await createQna({
      userId,
      qnaType,
      title,
      content,
      secretYn: secretYn || 'N',
      writerName: `User_${userId}`,
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
    sendDatabaseError(res, '생성', 'QnA');
  }
}; 