import { 
  UserQnaListQuery, 
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
import { QnaSource, toUserQnaItem } from '../../mappers/qnaMapper';

/**
 * 사용자 Q&A 목록 조회 (비즈니스 로직)
 */
export const getUserQnaList = async (
  userId: number,
  params: UserQnaListQuery
): Promise<{ qnas: QnaSource[]; total: number; page: number; limit: number; totalPages: number }> => {
  try {
    const { page = 1, limit = 10, sort } = params as any;
    const offset = (page - 1) * limit;

    // 정렬: 기본 createdAt DESC, 조회수순은 hit_cnt DESC, createdAt DESC
    const order = sort === 'hit-desc'
      ? [["hit_cnt" as any, 'DESC'], ['createdAt' as any, 'DESC']]
      : [['createdAt' as any, 'DESC']];

    const where: any = { delYn: 'N' };
    // mineOnly=true면 내 질문만(비공개 포함), 아니면 전체(공개/비공개) 노출
    if ((params as any).mineOnly && userId) {
      where.userId = userId;
    }
    const result = await findQnas({ where, limit, offset, order });
    
    appLogger.info('사용자 Q&A 목록 조회 서비스 호출', { userId, params });
    
    return {
      qnas: result.qnas as any,
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
export const getUserQnaDetail = async (userId: number, qnaId: number): Promise<QnaSource> => {
  try {
    const qna = await findQnaById(qnaId);
    // 공개 상세: 비공개(secretYn='Y')는 소유자만 접근, 공개(secretYn='N')는 모두 접근
    if (!qna) {
      throw new Error('Q&A를 찾을 수 없거나 접근 권한이 없습니다.');
    }
    if (qna.secretYn === 'Y' && Number(qna.userId) !== Number(userId)) {
      throw new Error('Q&A를 찾을 수 없거나 접근 권한이 없습니다.');
    }
    // 조회수 증가: 공개 QnA이며, 작성자 본인이 아닐 때만 증가
    if (qna.secretYn === 'N' && Number(qna.userId) !== Number(userId)) {
      const current = (qna as any).hitCnt || 0;
      await qna.update({ hitCnt: current + 1, updatedAt: new Date() });
    }
    
    appLogger.info('사용자 Q&A 상세 조회 서비스 호출', { userId, qnaId });
    
    return qna as any;
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
    const created = await createQna({
      userId: userId,
      qnaType: createData.qnaType,
      title: createData.title,
      content: createData.content,
      secretYn: createData.secretYn || 'N',
      writerName: createData.writerName || `User_${userId}`,
      createdBy: `U:${userId}`
    } as any);

    appLogger.info('사용자 Q&A 생성 서비스 성공', { userId, qnaId: (created as any).qnaId });

    return { qnaId: (created as any).qnaId };
  } catch (error) {
    appLogger.error('사용자 Q&A 생성 서비스 오류', { error, userId, createData });
    throw error;
  }
}; 

export const getUserQnaHome = async (userId: number): Promise<UserQnaHomeRes> => {
  const result = await findQnas({
    // 홈 노출: 공개/비공개 모두 최근 5개
    where: { delYn: 'N' },
    limit: 5,
    offset: 0,
    // 정렬은 레포지토리에서 컬럼명으로 처리하므로 모델 의존 제거
    order: [['createdAt', 'DESC']]
  });

  // 컨트롤러에서 toUserQnaItem 매핑 및 isMine 주입 처리
  return { qnas: result.qnas as any } as any;
};