import { Request, Response } from 'express';
import { 
  ErrorCode,
  USER_API_MAPPING,
  API_URLS,
  UserFaqListQuery,
  UserFaqListRes,
  UserFaqDetailParams,
  UserFaqDetailRes,
  UserFaqHomeRes
} from '@iitp-dabt/common';
import { sendError, sendSuccess, sendValidationError, sendDatabaseError } from '../../utils/errorHandler';
import { appLogger } from '../../utils/logger';
import { logApiCall } from '../../utils/apiLogger';
import { 
  getUserFaqList, 
  getUserFaqDetail,
  getUserFaqHome 
} from '../../services/user/userFaqService';
import { toUserFaqItem } from '../../mappers/faqMapper';

/**
 * 사용자 FAQ 목록 조회
 * API: GET /api/user/faq
 * 매핑: USER_API_MAPPING[`GET ${API_URLS.USER.FAQ.LIST}`]
 */
export const getFaqListForUser = async (req: Request<{}, {}, {}, UserFaqListQuery>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.USER.FAQ.LIST, USER_API_MAPPING as any, '사용자 FAQ 목록 조회');

    const params = req.query as any;
    const domain = await getUserFaqList(params);
    const result: UserFaqListRes = {
      items: domain.faqs.map(toUserFaqItem as any),
      total: domain.total,
      page: domain.page,
      limit: domain.limit,
      totalPages: Math.ceil(domain.total / domain.limit)
    };

    sendSuccess(res, result, undefined, 'USER_FAQ_LIST_VIEW', undefined, true); // isListResponse: true
  } catch (error) {
    appLogger.error('사용자 FAQ 목록 조회 중 오류 발생', { error });
    if (error instanceof Error) {
      const errorMsg = error.message;
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '조회', 'FAQ 목록');
      }
    }
    sendError(res, ErrorCode.FAQ_NOT_FOUND);
  }
};

/**
 * 사용자 FAQ 상세 조회
 * API: GET /api/user/faq/:faqId
 * 매핑: USER_API_MAPPING[`GET ${API_URLS.USER.FAQ.DETAIL}`]
 */
export const getFaqDetailForUser = async (req: Request<UserFaqDetailParams>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.USER.FAQ.DETAIL, USER_API_MAPPING as any, '사용자 FAQ 상세 조회');

    const { faqId } = req.params;
    const keyId = parseInt(faqId);

    const domain = await getUserFaqDetail(keyId);
    const result: UserFaqDetailRes = { faq: toUserFaqItem({ ...(domain as any), hitCnt: (domain as any).hitCnt + 1 } as any) } as any;

    sendSuccess(res, result, undefined, 'USER_FAQ_DETAIL_VIEW', { faqId });
  } catch (error) {
    appLogger.error('사용자 FAQ 상세 조회 중 오류 발생', { error });
    if (error instanceof Error) {
      const errorMsg = error.message;
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '조회', 'FAQ 상세');
      }
    }
    sendError(res, ErrorCode.FAQ_NOT_FOUND);
  }
};

export const getFaqHomeForUser = async (_req: Request, res: Response) => {
  try {
    logApiCall('GET', API_URLS.USER.FAQ.HOME, USER_API_MAPPING as any, '사용자 FAQ 홈 조회');
    const data = await getUserFaqHome();
    const response: UserFaqHomeRes = data;
    sendSuccess(res, response, undefined, 'USER_FAQ_HOME_VIEW', { count: response.faqs.length });
  } catch (error) {
    sendError(res, ErrorCode.FAQ_NOT_FOUND);
  }
};

 