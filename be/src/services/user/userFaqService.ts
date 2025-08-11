import { 
  UserFaqListReq, 
  UserFaqListRes, 
  UserFaqDetailRes
} from '@iitp-dabt/common';
import { 
  findFaqs,
  findFaqById,
  incrementHitCount
} from '../../repositories/sysFaqRepository';
import { appLogger } from '../../utils/logger';

/**
 * 사용자 FAQ 목록 조회 (비즈니스 로직)
 */
export const getUserFaqList = async (params: UserFaqListReq): Promise<UserFaqListRes> => {
  try {
    const { page = 1, limit = 10 } = params;
    const offset = (page - 1) * limit;

    const result = await findFaqs({
      where: { delYn: 'N', useYn: 'Y' },
      limit,
      offset,
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']]
    });
    
    appLogger.info('사용자 FAQ 목록 조회 서비스 호출', { params });
    
    return {
      faqs: result.faqs.map(faq => ({
        faqId: faq.faqId,
        faqType: faq.faqType,
        question: faq.question,
        answer: faq.answer,
        hitCnt: faq.hitCnt,
        sortOrder: faq.sortOrder,
        useYn: faq.useYn,
        createdAt: faq.createdAt.toISOString(),
        updatedAt: faq.updatedAt?.toISOString()
      })),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit)
    };
  } catch (error) {
    appLogger.error('사용자 FAQ 목록 조회 서비스 오류', { error });
    throw error;
  }
};

/**
 * 사용자 FAQ 상세 조회 (비즈니스 로직)
 */
export const getUserFaqDetail = async (faqId: number): Promise<UserFaqDetailRes> => {
  try {
    const faq = await findFaqById(faqId);
    if (!faq || faq.delYn === 'Y' || faq.useYn !== 'Y') {
      throw new Error('FAQ를 찾을 수 없습니다.');
    }
    
    // 조회수 증가
    await incrementHitCount(faqId);
    
    appLogger.info('사용자 FAQ 상세 조회 서비스 호출', { faqId });
    
    return {
      faq: {
        faqId: faq.faqId,
        faqType: faq.faqType,
        question: faq.question,
        answer: faq.answer,
        hitCnt: faq.hitCnt + 1, // 증가된 조회수 반영
        sortOrder: faq.sortOrder,
        useYn: faq.useYn,
        createdAt: faq.createdAt.toISOString(),
        updatedAt: faq.updatedAt?.toISOString()
      }
    };
  } catch (error) {
    appLogger.error('사용자 FAQ 상세 조회 서비스 오류', { error, faqId });
    throw error;
  }
}; 