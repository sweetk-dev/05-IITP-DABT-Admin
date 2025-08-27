import { SysQna, SysQnaCreationAttributes } from '../models/sysQna';
import { Op } from 'sequelize';

/**
 * QnA 목록 조회 (페이징)
 */
export async function findQnas(options: {
  where?: any;
  limit?: number;
  offset?: number;
  order?: any[];
}): Promise<{
  qnas: SysQna[];
  total: number;
  page: number;
  limit: number;
}> {
  const limit = options.limit || 10;
  const offset = options.offset || 0;
  const order = options.order || [[SysQna.sequelize!.col('created_at'), 'DESC']];

  const { count, rows } = await SysQna.findAndCountAll({
    where: options.where || {},
    limit,
    offset,
    order
  });

  return {
    qnas: rows,
    total: count,
    page: Math.floor(offset / limit) + 1,
    limit
  };
}

/**
 * QnA ID로 조회
 */
export async function findQnaById(qnaId: number): Promise<SysQna | null> {
  return SysQna.findByPk(qnaId);
}

/**
 * QnA 생성
 */
export async function createQna(qnaData: SysQnaCreationAttributes): Promise<SysQna> {
  return SysQna.create(qnaData);
}

/**
 * QnA 수정
 */
export async function updateQna(qnaId: number, updateData: Partial<SysQnaCreationAttributes>): Promise<SysQna | null> {
  const [affectedCount] = await SysQna.update(updateData, {
    where: { qnaId }
  });
  
  if (affectedCount > 0) {
    return findQnaById(qnaId);
  }
  return null;
}

/**
 * QnA 삭제
 */
export async function deleteQna(qnaId: number, deletedBy?: string): Promise<SysQna | null> {
  const qna = await findQnaById(qnaId);
  if (!qna) {
    return null;
  }

  const [affectedCount] = await SysQna.update({
    delYn: 'Y',
    deletedBy,
    deletedAt: new Date()
  }, {
    where: { qnaId }
  });

  if (affectedCount > 0) {
    return findQnaById(qnaId);
  }
  return null;
}

/**
 * QnA 답변 등록/수정
 */
export async function answerQna(qnaId: number, answerData: {
  answerContent: string;
  answeredBy: string;
}): Promise<SysQna | null> {
  const [affectedCount] = await SysQna.update({
    answerContent: answerData.answerContent,
    answeredBy: answerData.answeredBy,
    answeredAt: new Date(),
    updatedAt: new Date(),
    answeredYn: 'Y'
  }, {
    where: { qnaId }
  });

  if (affectedCount > 0) {
    return findQnaById(qnaId);
  }
  return null;
} 


/**
 * QnA 상태 통계 조회
 */
export async function getQnaStats(): Promise<{
  total: number;
  answered: number;
  unanswered: number; 
}> {
  const total = await SysQna.count({
    where: { delYn: 'N' }
  });

  const answered = await SysQna.count({
    where: {
      delYn: 'N',
      answeredYn: 'Y'
    }
  });

  const unanswered = await SysQna.count({
    where: {
      delYn: 'N',
      answeredYn: 'N'
    }
  });

  return {
    total,
    answered,
    unanswered 
  };
}