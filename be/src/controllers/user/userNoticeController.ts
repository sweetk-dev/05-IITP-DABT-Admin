import { Request, Response } from 'express';
import { API_URLS, USER_API_MAPPING, ErrorCode, type UserNoticeListQuery, type UserNoticeListRes, type UserNoticeDetailParams, type UserNoticeDetailRes, type UserNoticeHomeRes } from '@iitp-dabt/common';
import { sendError, sendSuccess, sendValidationError, sendDatabaseError } from '../../utils/errorHandler';
import { logApiCall } from '../../utils/apiLogger';
import { normalizeErrorMessage } from '../../utils/commonUtils';
import { getUserNoticeList, getUserNoticeDetail, getUserNoticeHome } from '../../services/user/userNoticeService';

export const getNoticeListForUser = async (req: Request<{}, {}, {}, UserNoticeListQuery>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.USER.NOTICE.LIST, USER_API_MAPPING as any, '사용자 공지 목록 조회');
    const page = typeof req.query.page === 'string' ? parseInt(req.query.page) || 1 : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) || 10 : 10;
    const noticeType = typeof (req.query as any).noticeType === 'string' ? (req.query as any).noticeType as any : undefined;
    const publicOnly = typeof (req.query as any).publicOnly === 'string' ? (req.query as any).publicOnly === 'true' : true;
    const includeExpired = typeof (req.query as any).includeExpired === 'string' ? (req.query as any).includeExpired === 'true' : false;

    const repo = await getUserNoticeList({ page, limit, noticeType, publicOnly, includeExpired });
    const response: UserNoticeListRes = {
      items: repo.notices.map((n: any) => ({
        noticeId: n.noticeId,
        title: n.title,
        content: n.content,
        noticeType: n.noticeType,
        pinnedYn: n.pinnedYn,
        postedAt: (n.postedAt instanceof Date ? n.postedAt : new Date(n.postedAt)).toISOString(),
      })),
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
    const response: UserNoticeDetailRes = {
      notice: {
        noticeId: n.noticeId,
        title: n.title,
        content: n.content,
        noticeType: n.noticeType as any,
        pinnedYn: n.pinnedYn as any,
        postedAt: (n.postedAt instanceof Date ? n.postedAt : new Date(n.postedAt)).toISOString(),
      }
    };
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

