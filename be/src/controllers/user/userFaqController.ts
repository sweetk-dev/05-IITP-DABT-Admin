import { Request, Response } from 'express';
import { 
  ErrorCode,
  USER_API_MAPPING,
  API_URLS,
  UserFaqListReq,
  UserFaqListRes,
  UserFaqDetailReq,
  UserFaqDetailRes
} from '@iitp-dabt/common';
import { sendError, sendSuccess } from '../../utils/errorHandler';
import { appLogger } from '../../utils/logger';
import { 
  getUserFaqList, 
  getUserFaqDetail 
} from '../../services/user/userFaqService';

/**
 * 사용자 FAQ 목록 조회
 * API: GET /api/user/faq
 * 매핑: USER_API_MAPPING[`GET ${API_URLS.USER.FAQ.LIST}`]
 */
export const getFaqListForUser = async (req: Request<{}, {}, {}, UserFaqListReq>, res: Response) => {
  try {
    const apiKey = `GET ${API_URLS.USER.FAQ.LIST}`;
    const mapping = USER_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || '사용자 FAQ 목록 조회'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });

    const params = req.query;

    const response = await getUserFaqList(params);
    
    const result: UserFaqListRes = {
      faqs: response.faqs,
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages
    };

    sendSuccess(res, result, undefined, 'USER_FAQ_LIST_VIEW');
  } catch (error) {
    appLogger.error('사용자 FAQ 목록 조회 중 오류 발생', { error });
    sendError(res, ErrorCode.FAQ_NOT_FOUND);
  }
};

/**
 * 사용자 FAQ 상세 조회
 * API: GET /api/user/faq/:faqId
 * 매핑: USER_API_MAPPING[`GET ${API_URLS.USER.FAQ.DETAIL}`]
 */
export const getFaqDetailForUser = async (req: Request<UserFaqDetailReq>, res: Response) => {
  try {
    const apiKey = `GET ${API_URLS.USER.FAQ.DETAIL}`;
    const mapping = USER_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || '사용자 FAQ 상세 조회'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });

    const { faqId } = req.params;
    const keyId = parseInt(faqId);

    const response = await getUserFaqDetail(keyId);
    
    const result: UserFaqDetailRes = {
      faq: response.faq
    };

    sendSuccess(res, result, undefined, 'USER_FAQ_DETAIL_VIEW', { faqId });
  } catch (error) {
    appLogger.error('사용자 FAQ 상세 조회 중 오류 발생', { error });
    sendError(res, ErrorCode.FAQ_NOT_FOUND);
  }
};

// // FAQ 목록 조회 (사용자용)
// export const getFaqListForUser = async (req: Request<{}, {}, {}, UserFaqListReq>, res: Response) => {
//   try {
//     const { page = 1, limit = 10, faqType, search } = req.query;
    
//     const result = await getFaqList({
//       page: parseInt(page as string),
//       limit: parseInt(limit as string),
//       faqType,
//       search
//     });

//     const response: UserFaqListRes = {
//       faqs: result.faqs.map(faq => ({
//         faqId: faq.faqId,
//         faqType: faq.faqType,
//         question: faq.question,
//         answer: faq.answer,
//         hitCnt: faq.hitCnt,
//         sortOrder: faq.sortOrder,
//         useYn: faq.useYn,
//         createdAt: faq.createdAt.toISOString(),
//         updatedAt: faq.updatedAt?.toISOString()
//       })),
//       total: result.total,
//       page: result.page,
//       limit: result.limit,
//       totalPages: Math.ceil(result.total / result.limit),
//       items: result.faqs
//     };

//     sendSuccess(res, response);
//   } catch (error) {
//     sendError(res, ErrorCode.FAQ_NOT_FOUND);
//   }
// };

// // FAQ 상세 조회 (사용자용)
// export const getFaqDetailForUser = async (req: Request<UserFaqDetailReq>, res: Response) => {
//   try {
//     const { faqId } = req.params;
    
//     const faq = await getFaqDetail(parseInt(faqId));
//     if (!faq) {
//       return sendError(res, ErrorCode.FAQ_NOT_FOUND);
//     }

//     // 조회수 증가
//     await incrementHitCount(parseInt(faqId));

//     const response: UserFaqDetailRes = {
//       faq: {
//         faqId: faq.faqId,
//         faqType: faq.faqType,
//         question: faq.question,
//         answer: faq.answer,
//         hitCnt: faq.hitCnt,
//         sortOrder: faq.sortOrder,
//         useYn: faq.useYn,
//         createdAt: faq.createdAt.toISOString(),
//         updatedAt: faq.updatedAt?.toISOString()
//       }
//     };

//     sendSuccess(res, response);
//   } catch (error) {
//     sendError(res, ErrorCode.FAQ_NOT_FOUND);
//   }
// }; 