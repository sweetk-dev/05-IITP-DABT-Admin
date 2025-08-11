import { Op } from 'sequelize';
import { 
  findQnas, 
  findQnaById, 
  answerQna as answerQnaRepo, 
  updateQna as updateQnaRepo, 
  deleteQna as deleteQnaRepo 
} from '../../repositories/sysQnaRepository';
import { appLogger } from '../../utils/logger';

export interface QnaListParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export interface QnaAnswerData {
  answer: string;
}

export interface QnaUpdateData {
  title?: string;
  content?: string;
  qnaType?: string;
  secretYn?: string;
}

/**
 * QnA 목록 조회 (관리자용)
 */
export const getQnaList = async (params: QnaListParams) => {
  try {
    const { page, limit, search, status } = params;
    const offset = (page - 1) * limit;

    // 검색 조건 구성
    const whereConditions: any = {};
    
    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (status) {
      whereConditions.status = status;
    }

    const result = await findQnas({
      where: whereConditions,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      qnas: result.rows,
      total: result.count,
      page,
      limit
    };
  } catch (error) {
    appLogger.error('QnA 목록 조회 중 오류 발생', { error, params });
    throw error;
  }
};

/**
 * QnA 상세 조회 (관리자용)
 */
export const getQnaDetail = async (qnaId: number) => {
  try {
    const qna = await findQnaById(qnaId);
    if (!qna) {
      throw new Error('QNA_NOT_FOUND');
    }
    return qna;
  } catch (error) {
    appLogger.error('QnA 상세 조회 중 오류 발생', { error, qnaId });
    throw error;
  }
};

/**
 * QnA 답변 (관리자용)
 */
export const answerQna = async (qnaId: number, answerData: QnaAnswerData, adminId: number) => {
  try {
    const answeredQna = await answerQnaRepo(qnaId, {
      answer: answerData.answer,
      answeredBy: adminId,
      answeredAt: new Date(),
      status: 'ANSWERED'
    });

    if (!answeredQna) {
      throw new Error('QNA_NOT_FOUND');
    }

    appLogger.info('QnA 답변 성공', { qnaId, adminId });
    return answeredQna;
  } catch (error) {
    appLogger.error('QnA 답변 중 오류 발생', { error, qnaId, answerData, adminId });
    throw error;
  }
};

/**
 * QnA 수정 (관리자용)
 */
export const updateQna = async (qnaId: number, updateData: QnaUpdateData, adminId: number) => {
  try {
    const updatedQna = await updateQnaRepo(qnaId, {
      ...updateData,
      updatedBy: adminId
    });

    if (!updatedQna) {
      throw new Error('QNA_NOT_FOUND');
    }

    appLogger.info('QnA 수정 성공', { qnaId, adminId });
    return updatedQna;
  } catch (error) {
    appLogger.error('QnA 수정 중 오류 발생', { error, qnaId, updateData, adminId });
    throw error;
  }
};

/**
 * QnA 삭제 (관리자용)
 */
export const deleteQna = async (qnaId: number, adminId: number) => {
  try {
    const deletedQna = await deleteQnaRepo(qnaId, adminId);

    if (!deletedQna) {
      throw new Error('QNA_NOT_FOUND');
    }

    appLogger.info('QnA 삭제 성공', { qnaId, adminId });
    return deletedQna;
  } catch (error) {
    appLogger.error('QnA 삭제 중 오류 발생', { error, qnaId, adminId });
    throw error;
  }
}; 