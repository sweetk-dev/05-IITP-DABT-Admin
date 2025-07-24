import { SysFaq, SysFaqCreationAttributes } from '../models/sysFaq';
import { Op } from 'sequelize';

/**
 * FAQ ID로 조회
 */
export async function findFaqById(faqId: number): Promise<SysFaq | null> {
  return SysFaq.findByPk(faqId);
}

/**
 * FAQ 생성
 */
export async function createFaq(faqData: {
  faqType: string;
  question: string;
  answer: string;
  sortOrder?: number;
  createdBy?: string;
}): Promise<{ faqId: number }> {
  const faq = await SysFaq.create({
    faqType: faqData.faqType,
    question: faqData.question,
    answer: faqData.answer,
    sortOrder: faqData.sortOrder || 0,
    hitCnt: 0,
    useYn: 'Y',
    createdBy: faqData.createdBy
  });
  return { faqId: faq.faqId };
}

/**
 * FAQ 업데이트
 */
export async function updateFaq(faqId: number, updateData: {
  faqType?: string;
  question?: string;
  answer?: string;
  sortOrder?: number;
  useYn?: string;
  updatedBy?: string;
}): Promise<boolean> {
  const [affectedRows] = await SysFaq.update({
    faqType: updateData.faqType,
    question: updateData.question,
    answer: updateData.answer,
    sortOrder: updateData.sortOrder,
    useYn: updateData.useYn,
    updatedBy: updateData.updatedBy
  }, {
    where: { faqId }
  });
  return affectedRows > 0;
}

/**
 * FAQ 조회수 증가
 */
export async function incrementHitCount(faqId: number): Promise<boolean> {
  const [affectedRows] = await SysFaq.increment('hitCnt', {
    where: { 
      faqId,
      useYn: 'Y'
    }
  });
  return affectedRows > 0;
}

/**
 * FAQ 목록 조회 (페이징)
 */
export async function findFaqs(options: {
  page?: number;
  limit?: number;
  faqType?: string;
  search?: string;
  useYn?: string;
}): Promise<{
  faqs: SysFaq[];
  total: number;
}> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;

  const whereClause: any = {};

  if (options.faqType) {
    whereClause.faqType = options.faqType;
  }

  if (options.useYn) {
    whereClause.useYn = options.useYn;
  }

  if (options.search) {
    whereClause[Op.or] = [
      { question: { [Op.iLike]: `%${options.search}%` } },
      { answer: { [Op.iLike]: `%${options.search}%` } }
    ];
  }

  const { count, rows } = await SysFaq.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [['sortOrder', 'ASC'], ['faqId', 'DESC']]
  });

  return {
    faqs: rows,
    total: count
  };
}

/**
 * 사용 가능한 FAQ 목록 조회 (공개용)
 */
export async function findActiveFaqs(faqType?: string): Promise<SysFaq[]> {
  const whereClause: any = {
    useYn: 'Y'
  };

  if (faqType) {
    whereClause.faqType = faqType;
  }

  return SysFaq.findAll({
    where: whereClause,
    order: [['sortOrder', 'ASC'], ['faqId', 'DESC']]
  });
}

/**
 * FAQ 삭제
 */
export async function deleteFaq(faqId: number): Promise<boolean> {
  const [affectedRows] = await SysFaq.destroy({
    where: { faqId }
  });
  return affectedRows > 0;
}

/**
 * FAQ 타입별 개수 조회
 */
export async function getFaqCountByType(): Promise<Array<{ faqType: string; count: number }>> {
  const result = await SysFaq.findAll({
    attributes: [
      'faqType',
      [SysFaq.sequelize!.fn('COUNT', SysFaq.sequelize!.col('faq_id')), 'count']
    ],
    group: ['faqType'],
    where: {
      useYn: 'Y'
    }
  });

  return result.map(item => ({
    faqType: item.faqType,
    count: parseInt(item.get('count') as string)
  }));
} 