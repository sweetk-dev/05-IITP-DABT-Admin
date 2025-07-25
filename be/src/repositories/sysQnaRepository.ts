import { SysQna, SysQnaCreationAttributes } from '../models/sysQna';
import { Op } from 'sequelize';

/**
 * QnA ID로 조회
 */
export async function findQnaById(qnaId: number): Promise<SysQna | null> {
  return SysQna.findByPk(qnaId);
}

/**
 * QnA 생성
 */
export async function createQna(qnaData: {
  userId: number;
  qnaType: string;
  title: string;
  content: string;
  secretYn?: string;
  writerName?: string;
  createdBy?: string;
}): Promise<{ qnaId: number }> {
  const qna = await SysQna.create({
    userId: qnaData.userId,
    qnaType: qnaData.qnaType,
    title: qnaData.title,
    content: qnaData.content,
    secretYn: qnaData.secretYn || 'N',
    writerName: qnaData.writerName,
    createdBy: qnaData.createdBy
  });
  return { qnaId: qna.qnaId };
}

/**
 * QnA 업데이트
 */
export async function updateQna(qnaId: number, updateData: {
  title?: string;
  content?: string;
  secretYn?: string;
  writerName?: string;
  updatedBy?: string;
}): Promise<boolean> {
  const [affectedRows] = await SysQna.update({
    title: updateData.title,
    content: updateData.content,
    secretYn: updateData.secretYn,
    writerName: updateData.writerName,
    updatedBy: updateData.updatedBy
  }, {
    where: { qnaId }
  });
  return affectedRows > 0;
}

/**
 * QnA 답변 등록/수정
 */
export async function updateAnswer(qnaId: number, answerData: {
  answerContent: string;
  answeredBy: string;
}): Promise<boolean> {
  const [affectedRows] = await SysQna.update({
    answerContent: answerData.answerContent,
    answeredBy: answerData.answeredBy,
    answeredAt: new Date()
  }, {
    where: { qnaId }
  });
  return affectedRows > 0;
}

/**
 * QnA 답변 등록/수정 (answerQna 별칭)
 */
export async function answerQna(qnaId: number, answerData: {
  answerContent: string;
  answeredBy: string;
}): Promise<boolean> {
  return updateAnswer(qnaId, answerData);
}

/**
 * QnA 목록 조회 (페이징)
 */
export async function findQnas(options: {
  page?: number;
  limit?: number;
  userId?: number;
  qnaType?: string;
  secretYn?: string;
  search?: string;
  hasAnswer?: boolean;
}): Promise<{
  qnas: SysQna[];
  total: number;
}> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;

  const whereClause: any = {};

  if (options.userId) {
    whereClause.userId = options.userId;
  }

  if (options.qnaType) {
    whereClause.qnaType = options.qnaType;
  }

  if (options.secretYn) {
    whereClause.secretYn = options.secretYn;
  }

  if (options.hasAnswer !== undefined) {
    if (options.hasAnswer) {
      whereClause.answerContent = { [Op.ne]: null };
    } else {
      whereClause.answerContent = null;
    }
  }

  if (options.search) {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${options.search}%` } },
      { content: { [Op.iLike]: `%${options.search}%` } }
    ];
  }

  const { count, rows } = await SysQna.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });

  return {
    qnas: rows,
    total: count
  };
}

/**
 * 사용자별 QnA 목록 조회
 */
export async function findQnasByUser(userId: number, options: {
  page?: number;
  limit?: number;
  qnaType?: string;
}): Promise<{
  qnas: SysQna[];
  total: number;
}> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;

  const whereClause: any = {
    userId
  };

  if (options.qnaType) {
    whereClause.qnaType = options.qnaType;
  }

  const { count, rows } = await SysQna.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });

  return {
    qnas: rows,
    total: count
  };
}

/**
 * QnA 논리 삭제
 */
export async function deleteQna(qnaId: number, deletedBy: string): Promise<boolean> {
  const [affectedRows] = await SysQna.update({
    deletedBy
  }, {
    where: { qnaId }
  });
  return affectedRows > 0;
}

/**
 * 답변 대기 중인 QnA 개수 조회
 */
export async function getPendingAnswerCount(): Promise<number> {
  return SysQna.count({
    where: {
      answerContent: null
    }
  });
}

/**
 * QnA 타입별 개수 조회
 */
export async function getQnaCountByType(): Promise<Array<{ qnaType: string; count: number }>> {
  const result = await SysQna.findAll({
    attributes: [
      'qnaType',
      [SysQna.sequelize!.fn('COUNT', SysQna.sequelize!.col('qna_id')), 'count']
    ],
    group: ['qnaType']
  });

  return result.map(item => ({
    qnaType: item.qnaType,
    count: parseInt(item.get('count') as string)
  }));
} 