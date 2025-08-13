import { 
  UserQnaListQuery, 
  UserQnaListRes, 
  UserQnaDetailRes,
  UserQnaCreateReq,
  UserQnaCreateRes,
  UserQnaHomeRes
} from '@iitp-dabt/common';
import { 
  findQnas,
  findQnaById,
  createQna
} from '../../repositories/sysQnaRepository';
import { appLogger } from '../../utils/logger';
import { toUserQnaItem } from '../../mappers/qnaMapper';

/**
 * 사용자 Q&A 목록 조회 (비즈니스 로직)
 */
export const getUserQnaList = async (userId: number, params: UserQnaListQuery): Promise<UserQnaListRes> => {
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
      qnas: result.qnas,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit)
    } as any;
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
    
    return { qna } as any;
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
      qnaId: 1
    };
  } catch (error) {
    appLogger.error('사용자 Q&A 생성 서비스 오류', { error, userId, createData });
    throw error;
  }
}; 

export const getUserQnaHome = async (userId: number): Promise<UserQnaHomeRes> => {
  const result = await findQnas({
    where: { userId, delYn: 'N' },
    limit: 5,
    offset: 0,
    order: [['createdAt', 'DESC']]
  });

  return { qnas: result.qnas.map(toUserQnaItem as any) } as any;
};