import { 
  UserFaqListReq, 
  UserFaqListRes, 
  UserFaqDetailRes
} from '@iitp-dabt/common';
import { appLogger } from '../../utils/logger';

/**
 * 사용자 FAQ 목록 조회 (비즈니스 로직)
 */
export const getUserFaqList = async (params: UserFaqListReq): Promise<UserFaqListRes> => {
  try {
    // TODO: 실제 DB 처리 구현 필요
    // const result = await findActiveFaqs(params);
    
    appLogger.info('사용자 FAQ 목록 조회 서비스 호출', { params });
    
    // 임시 빈 결과 반환
    return {
      faqs: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
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
    // TODO: 실제 DB 처리 구현 필요
    // const faq = await findFaqById(faqId);
    // if (!faq) {
    //   throw new Error('FAQ를 찾을 수 없습니다.');
    // }
    // 
    // // 조회수 증가
    // await incrementHitCount(faqId);
    
    appLogger.info('사용자 FAQ 상세 조회 서비스 호출', { faqId });
    
    // 임시 결과 반환
    return {
      faq: {
        faqId: faqId,
        faqType: 'GENERAL',
        question: '',
        answer: '',
        hitCnt: 0,
        sortOrder: 1,
        useYn: 'Y',
        createdAt: new Date().toISOString(),
        updatedAt: undefined
      }
    };
  } catch (error) {
    appLogger.error('사용자 FAQ 상세 조회 서비스 오류', { error, faqId });
    throw error;
  }
}; 