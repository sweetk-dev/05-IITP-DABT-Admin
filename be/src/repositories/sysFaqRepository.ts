import { SysFaq, SysFaqCreationAttributes } from '../models/sysFaq';
import { Op } from 'sequelize';

/**
 * FAQ 목록 조회 (페이징)
 */
export async function findFaqs(options: {
  where?: any;
  limit?: number;
  offset?: number;
  order?: any[];
}): Promise<{
  faqs: SysFaq[];
  total: number;
  page: number;
  limit: number;
}> {
  const limit = options.limit || 10;
  const offset = options.offset || 0;
  const order = options.order || [
    [SysFaq.sequelize!.col('sort_order'), 'ASC'],
    [SysFaq.sequelize!.col('created_at'), 'DESC']
  ];

  const { count, rows } = await SysFaq.findAndCountAll({
    where: options.where || {},
    limit,
    offset,
    order
  });

  return {
    faqs: rows,
    total: count,
    page: Math.floor(offset / limit) + 1,
    limit
  };
}

/**
 * FAQ ID로 조회
 */
export async function findFaqById(faqId: number): Promise<SysFaq | null> {
  return SysFaq.findByPk(faqId);
}

/**
 * FAQ 생성
 */
export async function createFaq(faqData: SysFaqCreationAttributes): Promise<SysFaq> {
  return SysFaq.create(faqData);
}

/**
 * FAQ 수정
 */
export async function updateFaq(faqId: number, updateData: Partial<SysFaqCreationAttributes>): Promise<SysFaq | null> {
  const [affectedCount] = await SysFaq.update(updateData, {
    where: { faqId }
  });
  
  if (affectedCount > 0) {
    return findFaqById(faqId);
  }
  return null;
}

/**
 * FAQ 삭제
 */
export async function deleteFaq(faqId: number): Promise<boolean> {
  const deletedCount = await SysFaq.destroy({ where: { faqId } });
  return deletedCount > 0;
}

/**
 * FAQ 조회수 증가
 */
export async function incrementHitCount(faqId: number): Promise<void> {
  await SysFaq.increment('hitCnt', {
    where: { faqId }
  });
} 