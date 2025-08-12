import { Request, Response } from 'express';
import { ErrorCode, ADMIN_API_MAPPING, API_URLS, type AdminNoticeListQuery, type AdminNoticeListRes, type AdminNoticeDetailParams, type AdminNoticeDetailRes, type AdminNoticeCreateReq, type AdminNoticeCreateRes, type AdminNoticeUpdateReq } from '@iitp-dabt/common';
import { sendError, sendSuccess, sendValidationError, sendDatabaseError } from '../../utils/errorHandler';
import { logApiCall } from '../../utils/apiLogger';
import { extractUserIdFromRequest, normalizeErrorMessage } from '../../utils/commonUtils';
import { getNoticeListAdmin, getNoticeDetailAdmin, createNoticeAdmin, updateNoticeAdmin, deleteNoticeAdmin } from '../../services/admin/adminNoticeService';

export const getNoticeListForAdmin = async (req: Request<{}, {}, {}, AdminNoticeListQuery>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.ADMIN.NOTICE.LIST, ADMIN_API_MAPPING as any, '공지사항 목록 조회 (관리자용)');

    const page = typeof req.query.page === 'string' ? parseInt(req.query.page) || 1 : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) || 10 : 10;
    const noticeType = typeof (req.query as any).noticeType === 'string' ? (req.query as any).noticeType as any : undefined;
    const publicYn = typeof (req.query as any).publicYn === 'string' ? (req.query as any).publicYn as any : undefined;
    const pinnedYn = typeof (req.query as any).pinnedYn === 'string' ? (req.query as any).pinnedYn as any : undefined;
    const search = typeof (req.query as any).search === 'string' ? (req.query as any).search : undefined;

    const adminId = extractUserIdFromRequest(req);
    if (!adminId) return sendError(res, ErrorCode.UNAUTHORIZED);

    const repoResult = await getNoticeListAdmin({
      page,
      limit,
      noticeType,
      publicYn,
      pinnedYn,
      search
    });

    const response: AdminNoticeListRes = {
      items: repoResult.notices.map((n: any) => ({
        noticeId: n.noticeId,
        title: n.title,
        content: n.content,
        noticeType: n.noticeType,
        pinnedYn: n.pinnedYn,
        publicYn: n.publicYn,
        postedAt: (n.postedAt instanceof Date ? n.postedAt : new Date(n.postedAt)).toISOString(),
        startDt: n.startDt ? new Date(n.startDt).toISOString() : undefined,
        endDt: n.endDt ? new Date(n.endDt).toISOString() : undefined,
        createdBy: n.createdBy,
        updatedBy: n.updatedBy,
        createdAt: (n.createdAt instanceof Date ? n.createdAt : new Date(n.createdAt)).toISOString(),
        updatedAt: n.updatedAt ? (n.updatedAt instanceof Date ? n.updatedAt : new Date(n.updatedAt)).toISOString() : undefined,
      })),
      total: repoResult.total,
      page: repoResult.page,
      limit: repoResult.limit,
      totalPages: repoResult.totalPages
    };

    sendSuccess(res, response, undefined, 'ADMIN_NOTICE_LIST_VIEW', { adminId, count: response.items.length }, true);
  } catch (error) {
    if (error instanceof Error) {
      const msg = normalizeErrorMessage(error);
      if (msg.includes('validation')) return sendValidationError(res, 'general', msg);
      if (msg.includes('database')) return sendDatabaseError(res, '조회', '공지사항');
    }
    sendError(res, ErrorCode.NOTICE_NOT_FOUND);
  }
};

export const getNoticeDetailForAdmin = async (req: Request<AdminNoticeDetailParams>, res: Response) => {
  try {
    logApiCall('GET', API_URLS.ADMIN.NOTICE.DETAIL, ADMIN_API_MAPPING as any, '공지사항 상세 조회 (관리자용)');

    const { noticeId } = req.params;
    const adminId = extractUserIdFromRequest(req);
    if (!adminId) return sendError(res, ErrorCode.UNAUTHORIZED);
    if (!noticeId) return sendError(res, ErrorCode.INVALID_PARAMETER);

    const n = await getNoticeDetailAdmin(parseInt(noticeId));
    if (!n) return sendError(res, ErrorCode.NOTICE_NOT_FOUND);

    const response: AdminNoticeDetailRes = {
      notice: {
        noticeId: n.noticeId,
        title: n.title,
        content: n.content,
        noticeType: n.noticeType as any,
        pinnedYn: n.pinnedYn as any,
        publicYn: (n as any).publicYn,
        postedAt: (n.postedAt instanceof Date ? n.postedAt : new Date(n.postedAt)).toISOString(),
        startDt: n.startDt ? new Date(n.startDt).toISOString() : undefined,
        endDt: n.endDt ? new Date(n.endDt).toISOString() : undefined,
        createdBy: (n as any).createdBy,
        updatedBy: (n as any).updatedBy,
        createdAt: (n.createdAt instanceof Date ? n.createdAt : new Date(n.createdAt)).toISOString(),
        updatedAt: n.updatedAt ? (n.updatedAt instanceof Date ? n.updatedAt : new Date(n.updatedAt)).toISOString() : undefined,
      }
    };

    sendSuccess(res, response, undefined, 'ADMIN_NOTICE_DETAIL_VIEW', { adminId, noticeId });
  } catch (error) {
    if (error instanceof Error) {
      const msg = normalizeErrorMessage(error);
      if (msg.includes('validation')) return sendValidationError(res, 'general', msg);
      if (msg.includes('database')) return sendDatabaseError(res, '조회', '공지사항');
    }
    sendError(res, ErrorCode.NOTICE_NOT_FOUND);
  }
};

export const createNoticeForAdmin = async (req: Request<{}, {}, AdminNoticeCreateReq>, res: Response) => {
  try {
    logApiCall('POST', API_URLS.ADMIN.NOTICE.CREATE, ADMIN_API_MAPPING as any, '공지사항 생성 (관리자용)');

    const adminId = extractUserIdFromRequest(req);
    if (!adminId) return sendError(res, ErrorCode.UNAUTHORIZED);

    const { title, content, noticeType, pinnedYn, publicYn, startDt, endDt } = req.body as any;
    if (!title || !content || !noticeType) {
      return sendValidationError(res, 'general', '제목, 내용, 공지유형은 필수입니다.');
    }

    const created = await createNoticeAdmin({
      title,
      content,
      noticeType: noticeType as any,
      pinnedYn,
      publicYn,
      startDt,
      endDt
    }, adminId);

    const response: AdminNoticeCreateRes = { noticeId: created.noticeId };
    sendSuccess(res, response, undefined, 'ADMIN_NOTICE_CREATED', { adminId, noticeId: created.noticeId });
  } catch (error) {
    if (error instanceof Error) {
      const msg = normalizeErrorMessage(error);
      if (msg.includes('validation')) return sendValidationError(res, 'general', msg);
      if (msg.includes('database')) return sendDatabaseError(res, '생성', '공지사항');
    }
    sendError(res, ErrorCode.NOTICE_CREATE_FAILED);
  }
};

export const updateNoticeForAdmin = async (req: Request<{ noticeId: string }, {}, AdminNoticeUpdateReq>, res: Response) => {
  try {
    logApiCall('PUT', API_URLS.ADMIN.NOTICE.UPDATE, ADMIN_API_MAPPING as any, '공지사항 수정 (관리자용)');

    const adminId = extractUserIdFromRequest(req);
    if (!adminId) return sendError(res, ErrorCode.UNAUTHORIZED);
    const { noticeId } = req.params;
    if (!noticeId) return sendError(res, ErrorCode.INVALID_PARAMETER);

    const updated = await updateNoticeAdmin(parseInt(noticeId), req.body as any, adminId);
    if (!updated) return sendError(res, ErrorCode.NOTICE_NOT_FOUND);

    sendSuccess(res, undefined, undefined, 'ADMIN_NOTICE_UPDATED', { adminId, noticeId });
  } catch (error) {
    if (error instanceof Error) {
      const msg = normalizeErrorMessage(error);
      if (msg.includes('validation')) return sendValidationError(res, 'general', msg);
      if (msg.includes('database')) return sendDatabaseError(res, '수정', '공지사항');
    }
    sendError(res, ErrorCode.NOTICE_UPDATE_FAILED);
  }
};

export const deleteNoticeForAdmin = async (req: Request<{ noticeId: string }>, res: Response) => {
  try {
    logApiCall('DELETE', API_URLS.ADMIN.NOTICE.DELETE, ADMIN_API_MAPPING as any, '공지사항 삭제 (관리자용)');

    const adminId = extractUserIdFromRequest(req);
    if (!adminId) return sendError(res, ErrorCode.UNAUTHORIZED);
    const { noticeId } = req.params;
    if (!noticeId) return sendError(res, ErrorCode.INVALID_PARAMETER);

    const ok = await deleteNoticeAdmin(parseInt(noticeId));
    if (!ok) return sendError(res, ErrorCode.NOTICE_NOT_FOUND);

    sendSuccess(res, undefined, undefined, 'ADMIN_NOTICE_DELETED', { adminId, noticeId });
  } catch (error) {
    if (error instanceof Error) {
      const msg = normalizeErrorMessage(error);
      if (msg.includes('validation')) return sendValidationError(res, 'general', msg);
      if (msg.includes('database')) return sendDatabaseError(res, '삭제', '공지사항');
    }
    sendError(res, ErrorCode.NOTICE_DELETE_FAILED);
  }
};


