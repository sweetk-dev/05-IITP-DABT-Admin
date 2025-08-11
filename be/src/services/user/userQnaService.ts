import { 
  UserQnaListReq, 
  UserQnaListRes, 
  UserQnaDetailRes,
  UserQnaCreateReq,
  UserQnaCreateRes
} from '@iitp-dabt/common';
import { 
  findQnas,
  findQnaById,
  createQna
} from '../../repositories/sysQnaRepository';
import { appLogger } from '../../utils/logger';

/**
 * 사용자 Q&A 목록 조회 (비즈니스 로직)
 */
export const getUserQnaList = async (userId: number, params: UserQnaListReq): Promise<UserQnaListRes> => {
  try {
    const { page = 1, limit = 10 } = params;
    const offset = (page - 1) * limit;

    const result = await findQnas({
      where: { userId, delYn: 'N' },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    appLogger.info('사용자 Q&A 목록 조회 서비스 호출', { userId, params });
    
    return {
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
        answeredBy: qna.answeredBy,
        answerContent: qna.answerContent
      })),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit)
    };
  } catch (error) {
    appLogger.error('사용자 Q&A 목록 조회 서비스 오류', { error, userId });
    throw error;
  }
};

/**
 * 사용자 Q&A 상세 조회 (비즈니스 로직)
 */
export const getUserQnaDetail = async (userId: number, qnaId: number): Promise<UserQnaDetailRes> => {
  try {
    const qna = await findQnaById(qnaId);
    if (!qna || qna.userId !== userId) {
      throw new Error('Q&A를 찾을 수 없거나 접근 권한이 없습니다.');
    }
    
    appLogger.info('사용자 Q&A 상세 조회 서비스 호출', { userId, qnaId });
    
    return {
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
        answeredAt: qna.answeredAt?.toISOString(),
        answeredBy: qna.answeredBy,
        answerContent: qna.answerContent
      }
    };
  } catch (error) {
    appLogger.error('사용자 Q&A 상세 조회 서비스 오류', { error, userId, qnaId });
    throw error;
  }
};

/**
 * 사용자 Q&A 생성 (비즈니스 로직)
 */
export const createUserQna = async (userId: number, createData: UserQnaCreateReq): Promise<UserQnaCreateRes> => {
  try {
    // TODO: 실제 DB 처리 구현 필요
    // const qnaId = await createQna({
    //   userId: userId,
    //   qnaType: createData.qnaType,
    //   title: createData.title,
    //   content: createData.content,
    //   secretYn: createData.secretYn || 'N',
    //   writerName: createData.writerName || `User_${userId}`,
    //   createdBy: userId.toString()
    // });
    
    appLogger.info('사용자 Q&A 생성 서비스 호출', { userId, createData });
    
    // 임시 결과 반환
    return {
      qnaId: 1,
      message: 'Q&A가 등록되었습니다.'
    };
  } catch (error) {
    appLogger.error('사용자 Q&A 생성 서비스 오류', { error, userId, createData });
    throw error;
  }
}; 