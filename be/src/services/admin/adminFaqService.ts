import { Op } from 'sequelize';
import { 
  findFaqs, 
  findFaqById, 
  createFaq as createFaqRepo, 
  updateFaq as updateFaqRepo, 
  deleteFaq as deleteFaqRepo 
} from '../../repositories/faqRepository';
import { appLogger } from '../../utils/logger';

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
      faqs: result.rows,
      total: result.count,
      page,
      limit
    };
  } catch (error) {
    appLogger.error('FAQ 목록 조회 중 오류 발생', { error, params });
    throw error;
  }
};

/**
 * FAQ 상세 조회 (관리자용)
 */
export const getFaqDetail = async (faqId: number) => {
  try {
    const faq = await findFaqById(faqId);
    if (!faq) {
      throw new Error('FAQ_NOT_FOUND');
    }
    return faq;
  } catch (error) {
    appLogger.error('FAQ 상세 조회 중 오류 발생', { error, faqId });
    throw error;
  }
};

/**
 * FAQ 생성 (관리자용)
 */
export const createFaq = async (faqData: FaqCreateData, adminId: number) => {
  try {
    const newFaq = await createFaqRepo({
      ...faqData,
      createdBy: adminId,
      updatedBy: adminId
    });

    appLogger.info('FAQ 생성 성공', { faqId: newFaq.faqId, adminId });
    return newFaq;
  } catch (error) {
    appLogger.error('FAQ 생성 중 오류 발생', { error, faqData, adminId });
    throw error;
  }
};

/**
 * FAQ 수정 (관리자용)
 */
export const updateFaq = async (faqId: number, updateData: FaqUpdateData, adminId: number) => {
  try {
    const updatedFaq = await updateFaqRepo(faqId, {
      ...updateData,
      updatedBy: adminId
    });

    if (!updatedFaq) {
      throw new Error('FAQ_NOT_FOUND');
    }

    appLogger.info('FAQ 수정 성공', { faqId, adminId });
    return updatedFaq;
  } catch (error) {
    appLogger.error('FAQ 수정 중 오류 발생', { error, faqId, updateData, adminId });
    throw error;
  }
};

/**
 * FAQ 삭제 (관리자용)
 */
export const deleteFaq = async (faqId: number, adminId: number) => {
  try {
    const deletedFaq = await deleteFaqRepo(faqId, adminId);

    if (!deletedFaq) {
      throw new Error('FAQ_NOT_FOUND');
    }

    appLogger.info('FAQ 삭제 성공', { faqId, adminId });
    return deletedFaq;
  } catch (error) {
    appLogger.error('FAQ 삭제 중 오류 발생', { error, faqId, adminId });
    throw error;
  }
};


