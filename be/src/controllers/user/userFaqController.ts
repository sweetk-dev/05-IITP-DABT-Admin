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

    const params = req.query;
    const domain = await getUserFaqList(params);
    const result: UserFaqListRes = {
      items: domain.faqs.map(toUserFaqItem),
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
    // 비-DB 오류 시 빈 리스트로 성공 응답
    const page = Number((req.query as any).page) || 1;
    const limit = Number((req.query as any).limit) || 10;
    const empty: UserFaqListRes = { items: [], total: 0, page, limit, totalPages: 0 } as any;
    return sendSuccess(res, empty, undefined, 'USER_FAQ_LIST_VIEW', undefined, true);
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
    // 클라이언트가 명시적으로 조회수 증가를 건너뛰고자 할 때 지원 (세션 뷰 방지 등)
    const skipHitHeader = (req.headers['x-skip-hit'] as string | undefined)?.toLowerCase() === 'true';
    const skipHitQuery = String((req.query as any)?.skipHit || '').toLowerCase() === 'true';
    const domain = await getUserFaqDetail(keyId, skipHitHeader || skipHitQuery);
    const result: UserFaqDetailRes = { faq: toUserFaqItem(domain as any) } as any;

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
    // 홈 리스트: DB 에러가 아닌 경우 빈 리스트로 성공 응답
    if (error instanceof Error) {
      const errorMsg = error.message;
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '조회', 'FAQ');
      }
    }
    const empty: UserFaqHomeRes = { faqs: [] } as any;
    return sendSuccess(res, empty, undefined, 'USER_FAQ_HOME_VIEW', { count: 0 });
  }
};

 