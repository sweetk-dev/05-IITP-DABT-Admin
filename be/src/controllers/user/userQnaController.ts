import { Request, Response } from 'express';
import { 
  ErrorCode,
  USER_API_MAPPING,
  API_URLS,
  UserQnaListReq,
  UserQnaListRes,
  UserQnaDetailReq,
  UserQnaDetailRes,
  UserQnaCreateReq,
  UserQnaCreateRes
} from '@iitp-dabt/common';
import { sendError, sendSuccess, sendValidationError, sendDatabaseError } from '../../utils/errorHandler';
import { appLogger } from '../../utils/logger';
import { extractUserIdFromRequest } from '../../utils/commonUtils';
import { 
  getUserQnaList, 
  getUserQnaDetail, 
  createUserQna 
} from '../../services/user/userQnaService';

/**
 * 사용자 Q&A 목록 조회
 * API: GET /api/user/qna
 * 매핑: USER_API_MAPPING[`GET ${API_URLS.USER.QNA.LIST}`]
 */
export const getQnaListForUser = async (req: Request<{}, {}, {}, UserQnaListReq>, res: Response) => {
  try {
    const apiKey = `GET ${API_URLS.USER.QNA.LIST}`;
    const mapping = USER_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || '사용자 Q&A 목록 조회'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });

    const userId = extractUserIdFromRequest(req);
    
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    const params = req.query;

    const response = await getUserQnaList(userId, params);
    
    const result: UserQnaListRes = {
      qnas: response.qnas,
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages
    };

    sendSuccess(res, result, undefined, 'USER_QNA_LIST_VIEW', { userId }, true); // isListResponse: true
  } catch (error) {
    appLogger.error('사용자 Q&A 목록 조회 중 오류 발생', { error, userId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = error.message;
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '조회', 'Q&A 목록');
      }
    }
    sendError(res, ErrorCode.QNA_NOT_FOUND);
  }
};

/**
 * 사용자 Q&A 상세 조회
 * API: GET /api/user/qna/:qnaId
 * 매핑: USER_API_MAPPING[`GET ${API_URLS.USER.QNA.DETAIL}`]
 */
export const getQnaDetailForUser = async (req: Request<UserQnaDetailReq>, res: Response) => {
  try {
    const apiKey = `GET ${API_URLS.USER.QNA.DETAIL}`;
    const mapping = USER_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || '사용자 Q&A 상세 조회'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });

    const userId = extractUserIdFromRequest(req);
    
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    const { qnaId } = req.params;
    const keyId = parseInt(qnaId);

    const response = await getUserQnaDetail(userId, keyId);
    
    const result: UserQnaDetailRes = {
      qna: response.qna
    };

    sendSuccess(res, result, undefined, 'USER_QNA_DETAIL_VIEW', { userId, qnaId });
  } catch (error) {
    appLogger.error('사용자 Q&A 상세 조회 중 오류 발생', { error, userId: extractUserIdFromRequest(req) });
    if (error instanceof Error) {
      const errorMsg = error.message;
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return sendValidationError(res, 'general', errorMsg);
      }
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '조회', 'Q&A 상세');
      }
    }
    sendError(res, ErrorCode.QNA_NOT_FOUND);
  }
};

/**
 * 사용자 Q&A 생성
 * API: POST /api/user/qna
 * 매핑: USER_API_MAPPING[`POST ${API_URLS.USER.QNA.CREATE}`]
 */
export const createQnaForUser = async (req: Request<{}, {}, UserQnaCreateReq>, res: Response) => {
  try {
    const apiKey = `POST ${API_URLS.USER.QNA.CREATE}`;
    const mapping = USER_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || '사용자 Q&A 생성'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });

    const userId = extractUserIdFromRequest(req);
    
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    const { qnaType, title, content, secretYn, writerName } = req.body;

    const result = await createUserQna(userId, { qnaType, title, content, secretYn, writerName });

    sendSuccess(res, result, result.message, 'USER_QNA_CREATE', { 
      userId, 
      qnaId: result.qnaId,
      qnaType,
      title 
    });
  } catch (error) {
    appLogger.error('사용자 Q&A 생성 중 오류 발생', { error, userId: extractUserIdFromRequest(req) });
    sendError(res, ErrorCode.QNA_CREATE_FAILED);
  }
}; 