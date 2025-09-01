import { Op } from 'sequelize';
import { 
  findQnas, 
  findQnaById, 
  answerQna as answerQnaRepo, 
  updateQna as updateQnaRepo, 
  deleteQna as deleteQnaRepo,
  deleteQnaList as deleteQnaListRepo, 
  getQnaStats  
} from '../../repositories/sysQnaRepository';
import type { SysQna } from '../../models/sysQna';
import { appLogger } from '../../utils/logger';
import { ErrorCode, } from '@iitp-dabt/common';
import { ResourceError, BusinessError } from '../../utils/customErrors';

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
  answerContent?: string;
}

export interface QnaListResult {
  qnas: SysQna[];
  total: number;
  page: number;
  limit: number;
}

/**
 * QnA 목록 조회 (관리자용)
 */
export const getQnaList = async (params: QnaListParams): Promise<QnaListResult> => {
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
      // status는 'Y' | 'N' 기준으로 answeredYn 필터로 매핑
      if (status === 'Y' || status === 'N') {
        whereConditions.answeredYn = status;
      }
    }

    const result = await findQnas({
      where: whereConditions,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      qnas: result.qnas,
      total: result.total,
      page: result.page,
      limit: result.limit
    };
  } catch (error) {
    appLogger.error('QnA 목록 조회 중 오류 발생', { error, params });
    throw new BusinessError(
      ErrorCode.DATABASE_ERROR,
      'QnA 목록 조회 중 오류가 발생했습니다.',
      { params, originalError: error }
    );
  }
};

/**
 * QnA 상세 조회 (관리자용)
 */
export const getQnaDetail = async (qnaId: number): Promise<SysQna> => {
  try {
    const qna = await findQnaById(qnaId);
    if (!qna) {
      throw new ResourceError(
        ErrorCode.QNA_NOT_FOUND,
        'QnA를 찾을 수 없습니다.',
        'qna',
        qnaId
      );
    }
    return qna;
  } catch (error) {
    if (error instanceof ResourceError) {
      throw error;
    }
    appLogger.error('QnA 상세 조회 중 오류 발생', { error, qnaId });
    throw new BusinessError(
      ErrorCode.DATABASE_ERROR,
      'QnA 상세 조회 중 오류가 발생했습니다.',
      { qnaId, originalError: error }
    );
  }
};

/**
 * QnA 답변 (관리자용)
 */
export const answerQna = async (qnaId: number, answerData: QnaAnswerData, actorTag: string): Promise<SysQna> => {
  try {
    const answeredQna = await answerQnaRepo(qnaId, {
      answerContent: answerData.answer,
      answeredBy: actorTag
    });

    if (!answeredQna) {
      throw new ResourceError(
        ErrorCode.QNA_NOT_FOUND,
        'QnA를 찾을 수 없습니다.',
        'qna',
        qnaId
      );
    }

    appLogger.info('QnA 답변 성공', { qnaId, actorTag });
    return answeredQna;
  } catch (error) {
    if (error instanceof ResourceError) {
      throw error;
    }
    appLogger.error('QnA 답변 중 오류 발생', { error, qnaId, answerData, actorTag });
    throw new BusinessError(
      ErrorCode.QNA_ANSWER_FAILED,
      'QnA 답변 중 오류가 발생했습니다.',
      { qnaId, answerData, actorTag, originalError: error }
    );
  }
};

/**
 * QnA 수정 (관리자용)
 */
export const updateQna = async (qnaId: number, updateData: QnaUpdateData, actorTag: string): Promise<SysQna> => {
  try {
    const updatedQna = await updateQnaRepo(qnaId, {
      ...updateData,
      updatedBy: actorTag,
      updatedAt: new Date()
    });

    if (!updatedQna) {
      throw new ResourceError(
        ErrorCode.QNA_NOT_FOUND,
        'QnA를 찾을 수 없습니다.',
        'qna',
        qnaId
      );
    }

    appLogger.info('QnA 수정 성공', { qnaId, actorTag });
    return updatedQna;
  } catch (error) {
    if (error instanceof ResourceError) {
      throw error;
    }
    appLogger.error('QnA 수정 중 오류 발생', { error, qnaId, updateData, actorTag });
    throw new BusinessError(
      ErrorCode.QNA_UPDATE_FAILED,
      'QnA 수정 중 오류가 발생했습니다.',
      { qnaId, updateData, actorTag, originalError: error }
    );
  }
};

/**
 * QnA 삭제 (관리자용)
 */
export const deleteQna = async (qnaId: number, actorTag: string): Promise<SysQna> => {
  try {
    const deletedQna = await deleteQnaRepo(qnaId, actorTag);

    if (!deletedQna) {
      throw new ResourceError(
        ErrorCode.QNA_NOT_FOUND,
        'QnA를 찾을 수 없습니다.',
        'qna',
        qnaId
      );
    }

    appLogger.info('QnA 삭제 성공', { qnaId, actorTag });
    return deletedQna;
  } catch (error) {
    if (error instanceof ResourceError) {
      throw error;
    }
    appLogger.error('QnA 삭제 중 오류 발생', { error, qnaId, actorTag });
    throw new BusinessError(
      ErrorCode.QNA_DELETE_FAILED,
      'QnA 삭제 중 오류가 발생했습니다.',
      { qnaId, actorTag, originalError: error }
    );
  }
}; 


/**
 * QnA 목록 삭제 (관리자용)
 */
export const deleteQnaList = async (qnaIds: number[], actorTag: string): Promise<void> => {
  try {
    const deleteCount = await deleteQnaListRepo(qnaIds, actorTag);
    if (deleteCount === 0) {
      throw new ResourceError(
        ErrorCode.QNA_NOT_FOUND,
        '삭제할 QnA를 찾을 수 없습니다.',
        'qna',
        qnaIds.toString()
      );
    }
  } catch (error) {
    appLogger.error('QnA 목록 삭제 중 오류 발생', { error, qnaIds, actorTag });
    throw new BusinessError(
      ErrorCode.QNA_DELETE_FAILED,
      'QnA 목록 삭제 중 오류가 발생했습니다.',
      { qnaIds, actorTag, originalError: error }
    );
  }
}




/**
 * QnA 상태(통계) 조회 (관리자용)
 */
export const getQnaStatus = async (): Promise<{ total: number; answered: number; unanswered: number }> => {
  try {
    const stats = await getQnaStats();
    return {
      total: stats.total,
      answered: stats.answered,
      unanswered: stats.unanswered
    };
  } catch (error) {
    appLogger.error('QnA 상태 통계 조회 중 오류 발생', { error });
    throw new BusinessError(
      ErrorCode.DATABASE_ERROR,
      'QnA 상태 통계 조회 중 오류가 발생했습니다.',
      { originalError: error }
    );
  }
};