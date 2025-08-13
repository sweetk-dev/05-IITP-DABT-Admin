import { Request, Response } from 'express';
import { API_URLS, USER_API_MAPPING, ErrorCode, type UserNoticeListQuery, type UserNoticeListRes, type UserNoticeDetailParams, type UserNoticeDetailRes, type UserNoticeHomeRes } from '@iitp-dabt/common';
import { sendError, sendSuccess, sendValidationError, sendDatabaseError } from '../../utils/errorHandler';
import { logApiCall } from '../../utils/apiLogger';
import { normalizeErrorMessage } from '../../utils/commonUtils';
import { getUserNoticeList, getUserNoticeDetail, getUserNoticeHome } from '../../services/user/userNoticeService';
import { toUserNoticeItem } from '../../mappers/noticeMapper';
import { getNumberQuery, getStringQuery, getBooleanQuery } from '../../utils/queryParsers';

export const getNoticeListForUser = async (req: Request<{}, {}, {}, UserNoticeListQuery>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.USER.NOTICE.LIST, USER_API_MAPPING as any, '사용자 공지 목록 조회');
    const page = getNumberQuery(req.query, 'page', 1)!;
    const limit = getNumberQuery(req.query, 'limit', 10)!;
    const noticeType = getStringQuery(req.query, 'noticeType') as any;
    const publicOnly = getBooleanQuery(req.query, 'publicOnly', true)!;
    const includeExpired = getBooleanQuery(req.query, 'includeExpired', false)!;

    const repo = await getUserNoticeList({ page, limit, noticeType, publicOnly, includeExpired });
    const response: UserNoticeListRes = {
      items: repo.notices.map(toUserNoticeItem),
      total: repo.total,
      page: repo.page,
      limit: repo.limit,
      totalPages: repo.totalPages
    };
    sendSuccess(res, response, undefined, 'USER_NOTICE_LIST_VIEW', { count: response.items.length }, true);
  } catch (error) {
    if (error instanceof Error) {
      const msg = normalizeErrorMessage(error);
      if (msg.includes('validation')) return sendValidationError(res, 'general', msg);
      if (msg.includes('database')) return sendDatabaseError(res, '조회', '공지사항');
    }
    sendError(res, ErrorCode.NOTICE_NOT_FOUND);
  }
};

export const getNoticeDetailForUser = async (req: Request<UserNoticeDetailParams>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.USER.NOTICE.DETAIL, USER_API_MAPPING as any, '사용자 공지 상세 조회');
    const { noticeId } = req.params;
    if (!noticeId) return sendError(res, ErrorCode.INVALID_PARAMETER);
    const n = await getUserNoticeDetail(parseInt(noticeId));
    if (!n) return sendError(res, ErrorCode.NOTICE_NOT_FOUND);
    const response: UserNoticeDetailRes = { notice: toUserNoticeItem(n) };
    sendSuccess(res, response, undefined, 'USER_NOTICE_DETAIL_VIEW', { noticeId });
  } catch (error) {
    if (error instanceof Error) {
      const msg = normalizeErrorMessage(error);
      if (msg.includes('validation')) return sendValidationError(res, 'general', msg);
      if (msg.includes('database')) return sendDatabaseError(res, '조회', '공지사항');
    }
    sendError(res, ErrorCode.NOTICE_NOT_FOUND);
  }
};


export const getNoticeHomeForUser = async (_req: Request, res: Response) => {
  try {
    logApiCall('GET', API_URLS.USER.NOTICE.HOME, USER_API_MAPPING as any, '사용자 공지 홈 조회');
    const data = await getUserNoticeHome();
    const response: UserNoticeHomeRes = data;
    sendSuccess(res, response, undefined, 'USER_NOTICE_HOME_VIEW', { count: response.notices.length });
  } catch (error) {
    sendError(res, ErrorCode.NOTICE_NOT_FOUND);
  }
};

