import { 
  UserFaqListQuery, 
  UserFaqHomeRes
} from '@iitp-dabt/common';
import type { SysFaq } from '../../models/sysFaq';
import { 
  findFaqs,
  findFaqById,
  incrementHitCount
} from '../../repositories/sysFaqRepository';
import { appLogger } from '../../utils/logger';
import { toUserFaqItem } from '../../mappers/faqMapper';

/**
 * 사용자 FAQ 목록 조회 (비즈니스 로직)
 */
export const getUserFaqList = async (params: UserFaqListQuery): Promise<{ faqs: SysFaq[]; total: number; page: number; limit: number; }> => {
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
      faqs: result.faqs as any,
      total: result.total,
      page: result.page,
      limit: result.limit
    };
  } catch (error) {
    appLogger.error('사용자 FAQ 목록 조회 서비스 오류', { error });
    throw error;
  }
};

/**
 * 사용자 FAQ 상세 조회 (비즈니스 로직)
 */
export const getUserFaqDetail = async (faqId: number): Promise<SysFaq> => {
  try {
    const faq = await findFaqById(faqId);
    if (!faq || faq.useYn !== 'Y') {
      throw new Error('FAQ를 찾을 수 없습니다.');
    }
    
    // 조회수 증가
    await incrementHitCount(faqId);
    // 메모리 상에서도 증가 반영
    (faq as any).hitCnt = (faq as any).hitCnt + 1;
    
    appLogger.info('사용자 FAQ 상세 조회 서비스 호출', { faqId });
    
    return faq as any;
  } catch (error) {
    appLogger.error('사용자 FAQ 상세 조회 서비스 오류', { error, faqId });
    throw error;
  }
}; 

/**
 * 사용자 FAQ 홈 조회 (상위 노출용)
 */
export const getUserFaqHome = async (): Promise<UserFaqHomeRes> => {
  // 상단 노출 기준: sortOrder ASC, createdAt DESC, 최대 5개
  const result = await findFaqs({
    where: { delYn: 'N', useYn: 'Y' },
    limit: 5,
    offset: 0,
    order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']]
  });

  return { faqs: result.faqs.map(toUserFaqItem as any) };
};