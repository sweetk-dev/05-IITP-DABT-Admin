import { Request, Response } from 'express';
import { 
  ErrorCode,
  USER_API_MAPPING,
  API_URLS,
  UserQnaListQuery,
  UserQnaListRes,
  UserQnaDetailParams,
  UserQnaDetailRes,
  UserQnaCreateReq,
  UserQnaCreateRes,
  UserQnaHomeRes
} from '@iitp-dabt/common';
import { sendError, sendSuccess, sendValidationError, sendDatabaseError } from '../../utils/errorHandler';
import { appLogger } from '../../utils/logger';
import { logApiCall } from '../../utils/apiLogger';
import { extractUserIdFromRequest } from '../../utils/commonUtils';
import { 
  getUserQnaList, 
  getUserQnaDetail, 
  createUserQna, 
  getUserQnaHome 
} from '../../services/user/userQnaService';
import { toUserQnaItem } from '../../mappers/qnaMapper';

/**
 * 사용자 Q&A 목록 조회
 * API: GET /api/user/qna
 * 매핑: USER_API_MAPPING[`GET ${API_URLS.USER.QNA.LIST}`]
 */
export const getQnaListForUser = async (req: Request<{}, {}, {}, UserQnaListQuery>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.USER.QNA.LIST, USER_API_MAPPING as any, '사용자 Q&A 목록 조회');
    const userId = extractUserIdFromRequest(req) || 0; // 공개 접근 허용: userId 없으면 0으로 조회
    const params = req.query as any;
    const domain = await getUserQnaList(userId, params);
    const result: UserQnaListRes = {
      items: domain.qnas.map(src => ({ ...toUserQnaItem(src), isMine: Number(src.userId) === Number(userId) } as any)),
      total: domain.total,
      page: domain.page,
      limit: domain.limit,
      totalPages: domain.totalPages
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
    // 비-DB 오류 시 빈 리스트로 성공 응답
    const page = Number((req.query as any).page) || 1;
    const limit = Number((req.query as any).limit) || 10;
    const empty: UserQnaListRes = { items: [], total: 0, page, limit, totalPages: 0 } as any;
    return sendSuccess(res, empty, undefined, 'USER_QNA_LIST_VIEW', { userId: extractUserIdFromRequest(req), count: 0 }, true);
  }
};

export const getQnaHomeForUser = async (req: Request, res: Response) => {
  try {
    logApiCall('GET', API_URLS.USER.QNA.HOME, USER_API_MAPPING as any, '사용자 Q&A 홈 조회');
    const userId = extractUserIdFromRequest(req) || 0; // 공개 접근 허용
    const data = await getUserQnaHome(userId);
    const response: UserQnaHomeRes = {
      qnas: (data.qnas as any[]).map((src: any) => ({
        ...toUserQnaItem(src),
        isMine: Number(src.userId) === Number(userId)
      }) as any)
    } as any;
    sendSuccess(res, response, undefined, 'USER_QNA_HOME_VIEW', { userId, count: response.qnas.length });
  } catch (error) {
    // 홈 리스트: DB 에러가 아닌 경우 빈 리스트로 성공 응답
    if (error instanceof Error) {
      const errorMsg = error.message;
      if (errorMsg.includes('database') || errorMsg.includes('connection')) {
        return sendDatabaseError(res, '조회', 'Q&A');
      }
    }
    const empty: UserQnaHomeRes = { qnas: [] } as any;
    return sendSuccess(res, empty, undefined, 'USER_QNA_HOME_VIEW', { userId: extractUserIdFromRequest(req) || 0, count: 0 });
  }
};

/**
 * 사용자 Q&A 상세 조회
 * API: GET /api/user/qna/:qnaId
 * 매핑: USER_API_MAPPING[`GET ${API_URLS.USER.QNA.DETAIL}`]
 */
export const getQnaDetailForUser = async (req: Request<UserQnaDetailParams>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.USER.QNA.DETAIL, USER_API_MAPPING as any, '사용자 Q&A 상세 조회');
    const userId = extractUserIdFromRequest(req) || 0; // 공개 접근 허용
    const { qnaId } = req.params;
    const keyId = parseInt(qnaId);
    const qna = await getUserQnaDetail(userId, keyId);
    const result: UserQnaDetailRes = { qna: { ...toUserQnaItem(qna), isMine: Number((qna as any).userId) === Number(userId) } as any } as any;

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
    logApiCall('POST', API_URLS.USER.QNA.CREATE, USER_API_MAPPING as any, '사용자 Q&A 생성');

    const userId = extractUserIdFromRequest(req);
    
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    const { qnaType, title, content, secretYn, writerName } = req.body;

    const result = await createUserQna(userId, { qnaType, title, content, secretYn, writerName });

    sendSuccess(res, { qnaId: result.qnaId } as UserQnaCreateRes, undefined, 'USER_QNA_CREATE', { 
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

/**
 * 사용자 Q&A 삭제
 * API: DELETE /api/user/qna/:qnaId
 * 매핑: USER_API_MAPPING[`DELETE ${API_URLS.USER.QNA.DETAIL}`]
 */
export const deleteQnaForUser = async (req: Request<UserQnaDetailParams>, res: Response) => {
  try {
    logApiCall('DELETE', API_URLS.USER.QNA.DETAIL, USER_API_MAPPING as any, '사용자 Q&A 삭제');
    const userId = extractUserIdFromRequest(req);
    const { qnaId } = req.params;
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }
    const keyId = parseInt(qnaId);
    const svc = await import('../../services/user/userQnaService');
    await svc.deleteUserQna(userId, keyId);
    sendSuccess(res, undefined, undefined, 'USER_QNA_DELETED', { userId, qnaId: keyId });
  } catch (error) {
    appLogger.error('사용자 Q&A 삭제 중 오류 발생', { error, userId: extractUserIdFromRequest(req) });
    sendError(res, ErrorCode.QNA_DELETE_FAILED);
  }
};