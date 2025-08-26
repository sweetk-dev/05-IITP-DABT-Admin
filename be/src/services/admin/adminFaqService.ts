import { Op } from 'sequelize';
import { 
  findFaqs, 
  findFaqById, 
  createFaq as createFaqRepo, 
  updateFaq as updateFaqRepo, 
  deleteFaq as deleteFaqRepo 
} from '../../repositories/sysFaqRepository';
import { appLogger } from '../../utils/logger';
import { ErrorCode } from '@iitp-dabt/common';
import { ResourceError, BusinessError } from '../../utils/customErrors';

export interface FaqListParams {
  page: number;
  limit: number;
  faqType?: string;
  search?: string;
  useYn?: string;
}

export interface FaqListResult {
  faqs: any[];
  total: number;
  page: number;
  limit: number;
}

export interface FaqCreateData {
  faqType: string;
  question: string;
  answer: string;
  sortOrder?: number;
  useYn?: string;
}

export interface FaqUpdateData {
  faqType?: string;
  question?: string;
  answer?: string;
  sortOrder?: number;
  useYn?: string;
}

/**
 * FAQ 목록 조회 (관리자용)
 */
export const getFaqList = async (params: FaqListParams): Promise<FaqListResult> => {
  try {
    const { page, limit, faqType, search, useYn } = params;
    const offset = (page - 1) * limit;

    // 검색 조건 구성
    const whereConditions: any = {};
    
    if (faqType) {
      whereConditions.faqType = faqType;
    }
    
    if (search) {
      whereConditions[Op.or] = [
        { question: { [Op.like]: `%${search}%` } },
        { answer: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (useYn) {
      whereConditions.useYn = useYn;
    }

    const result = await findFaqs({
      where: whereConditions,
      limit,
      offset,
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']]
    });

    return {
      faqs: result.faqs,
      total: result.total,
      page,
      limit
    };
  } catch (error) {
    appLogger.error('FAQ 목록 조회 중 오류 발생', { error, params });
    throw new BusinessError(
      ErrorCode.DATABASE_ERROR,
      'FAQ 목록 조회 중 오류가 발생했습니다.',
      { params, originalError: error }
    );
  }
};

/**
 * FAQ 상세 조회 (관리자용)
 */
export const getFaqDetail = async (faqId: number) => {
  try {
    const faq = await findFaqById(faqId);
    if (!faq) {
      throw new ResourceError(
        ErrorCode.FAQ_NOT_FOUND,
        'FAQ를 찾을 수 없습니다.',
        'faq',
        faqId
      );
    }
    return faq;
  } catch (error) {
    if (error instanceof ResourceError) {
      throw error;
    }
    appLogger.error('FAQ 상세 조회 중 오류 발생', { error, faqId });
    throw new BusinessError(
      ErrorCode.DATABASE_ERROR,
      'FAQ 상세 조회 중 오류가 발생했습니다.',
      { faqId, originalError: error }
    );
  }
};

/**
 * FAQ 생성 (관리자용)
 */
export const createFaq = async (faqData: FaqCreateData, actorTag: string) => {
  try {
    const newFaq = await createFaqRepo({
      ...faqData,
      createdBy: actorTag,
      updatedBy: actorTag
    });

    appLogger.info('FAQ 생성 성공', { faqId: newFaq.faqId, actorTag });
    return newFaq;
  } catch (error) {
    appLogger.error('FAQ 생성 중 오류 발생', { error, faqData, actorTag });
    throw error;
  }
};

/**
 * FAQ 수정 (관리자용)
 */
export const updateFaq = async (faqId: number, updateData: FaqUpdateData, actorTag: string) => {
  try {
    const updatedFaq = await updateFaqRepo(faqId, {
      ...updateData,
      updatedBy: actorTag,
      updatedAt: new Date()
    });

    if (!updatedFaq) {
      throw new ResourceError(
        ErrorCode.FAQ_NOT_FOUND,
        'FAQ를 찾을 수 없습니다.',
        'faq',
        faqId
      );
    }

    appLogger.info('FAQ 수정 성공', { faqId, actorTag });
    return updatedFaq;
  } catch (error) {
    if (error instanceof ResourceError) {
      throw error;
    }
    appLogger.error('FAQ 수정 중 오류 발생', { error, faqId, updateData, actorTag });
    throw new BusinessError(
      ErrorCode.DATABASE_ERROR,
      'FAQ 수정 중 오류가 발생했습니다.',
      { faqId, updateData, originalError: error }
    );
  }
};

/**
 * FAQ 삭제 (관리자용)
 */
export const deleteFaq = async (faqId: number) => {
  try {
    const ok = await deleteFaqRepo(faqId);
    if (!ok) throw new ResourceError(
      ErrorCode.FAQ_NOT_FOUND,
      'FAQ를 찾을 수 없습니다.',
      'faq',
      faqId
    );

    appLogger.info('FAQ 삭제 성공', { faqId });
    return ok;
  } catch (error) {
    if (error instanceof ResourceError) {
      throw error;
    }
    appLogger.error('FAQ 삭제 중 오류 발생', { error, faqId });
    throw new BusinessError(
      ErrorCode.DATABASE_ERROR,
      'FAQ 삭제 중 오류가 발생했습니다.',
      { faqId, originalError: error }
    );
  }
};


