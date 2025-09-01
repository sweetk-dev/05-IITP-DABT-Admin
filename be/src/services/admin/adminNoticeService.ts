import SysNoticeRepository from '../../repositories/sysNoticeRepository';
import { appLogger } from '../../utils/logger';
import { ErrorCode } from '@iitp-dabt/common';
import { ResourceError, BusinessError } from '../../utils/customErrors';

export interface AdminNoticeListParams {
  page: number;
  limit: number;
  noticeType?: 'G' | 'S' | 'E';
  publicYn?: 'Y' | 'N';
  pinnedYn?: 'Y' | 'N';
  search?: string;
}

export const getNoticeListAdmin = async (params: AdminNoticeListParams) => {
  try {
    const { page, limit, noticeType, publicYn } = params;
    const result = await SysNoticeRepository.getNoticeList({
      page,
      limit,
      noticeType,
      publicOnly: publicYn === 'Y',
      includeExpired: true,
      isAdmin: true
    });
    return result;
  } catch (error) {
    appLogger.error('공지사항 목록 조회 중 오류 발생', { error, params });
    throw new BusinessError(
      ErrorCode.DATABASE_ERROR,
      '공지사항 목록 조회 중 오류가 발생했습니다.',
      { params, originalError: error }
    );
  }
};

export const getNoticeDetailAdmin = async (noticeId: number) => {
  try {
    const notice = await SysNoticeRepository.getNoticeById(noticeId);
    if (!notice) {
      throw new ResourceError(
        ErrorCode.NOTICE_NOT_FOUND,
        '공지사항을 찾을 수 없습니다.',
        'notice',
        noticeId
      );
    }
    return notice;
  } catch (error) {
    if (error instanceof ResourceError) {
      throw error;
    }
    appLogger.error('공지사항 상세 조회 중 오류 발생', { error, noticeId });
    throw new BusinessError(
      ErrorCode.DATABASE_ERROR,
      '공지사항 상세 조회 중 오류가 발생했습니다.',
      { noticeId, originalError: error }
    );
  }
};

export interface AdminNoticeCreateData {
  title: string;
  content: string;
  noticeType: 'G' | 'S' | 'E';
  pinnedYn?: 'Y' | 'N';
  publicYn?: 'Y' | 'N';
  startDt?: string;
  endDt?: string;
}

export const createNoticeAdmin = async (data: AdminNoticeCreateData, actorTag: string) => {
  try {
    const created = await SysNoticeRepository.createNotice({
      title: data.title,
      content: data.content,
      noticeType: data.noticeType,
      pinnedYn: data.pinnedYn ?? 'N',
      publicYn: data.publicYn ?? 'Y',
      postedAt: new Date(),
      startDt: data.startDt ? new Date(data.startDt) : undefined,
      endDt: data.endDt ? new Date(data.endDt) : undefined,
      createdBy: actorTag
    } as any);
    
    appLogger.info('공지사항 생성 성공', { noticeId: (created as any).noticeId, actorTag });
    return created;
  } catch (error) {
    appLogger.error('공지사항 생성 중 오류 발생', { error, data, actorTag });
    throw new BusinessError(
      ErrorCode.NOTICE_CREATE_FAILED,
      '공지사항 생성 중 오류가 발생했습니다.',
      { data, actorTag, originalError: error }
    );
  }
};

export interface AdminNoticeUpdateData {
  title?: string;
  content?: string;
  noticeType?: 'G' | 'S' | 'E';
  pinnedYn?: 'Y' | 'N';
  publicYn?: 'Y' | 'N';
  startDt?: string;
  endDt?: string;
}

export const updateNoticeAdmin = async (noticeId: number, data: AdminNoticeUpdateData, actorTag: string) => {
  try {
    const updated = await SysNoticeRepository.updateNotice(noticeId, {
      ...data,
      startDt: data.startDt ? new Date(data.startDt) : undefined,
      endDt: data.endDt ? new Date(data.endDt) : undefined,
      updatedBy: actorTag
    } as any);
    
    if (!updated) {
      throw new ResourceError(
        ErrorCode.NOTICE_NOT_FOUND,
        '수정할 공지사항을 찾을 수 없습니다.',
        'notice',
        noticeId
      );
    }
    
    appLogger.info('공지사항 수정 성공', { noticeId, actorTag });
    return updated;
  } catch (error) {
    if (error instanceof ResourceError) {
      throw error;
    }
    appLogger.error('공지사항 수정 중 오류 발생', { error, noticeId, data, actorTag });
    throw new BusinessError(
      ErrorCode.NOTICE_UPDATE_FAILED,
      '공지사항 수정 중 오류가 발생했습니다.',
      { noticeId, data, actorTag, originalError: error }
    );
  }
};

export const deleteNoticeAdmin = async (noticeId: number) => {
  try {
    const deleted = await SysNoticeRepository.deleteNotice(noticeId);
    
    if (!deleted) {
      throw new ResourceError(
        ErrorCode.NOTICE_NOT_FOUND,
        '삭제할 공지사항을 찾을 수 없습니다.',
        'notice',
        noticeId
      );
    }
    
    appLogger.info('공지사항 삭제 성공', { noticeId });
    return deleted;
  } catch (error) {
    if (error instanceof ResourceError) {
      throw error;
    }
    appLogger.error('공지사항 삭제 중 오류 발생', { error, noticeId });
    throw new BusinessError(
      ErrorCode.NOTICE_DELETE_FAILED,
      '공지사항 삭제 중 오류가 발생했습니다.',
      { noticeId, originalError: error }
    );
  }
};


// FAQ 목록 삭제 (관리자용)
export const deleteNoticeListAdmin = async (noticeIds: number[]) => {
  try {
    const deletedCount = await SysNoticeRepository.deleteNoticeList(noticeIds);
    if (deletedCount == 0) {
      throw new ResourceError(
        ErrorCode.NOTICE_NOT_FOUND,
        '삭제할 공지사항을 찾을 수 없습니다.',
        'notice',
        noticeIds.toString()
      );
    }

    appLogger.info('공지사항 목록 삭제 성공', { noticeIds });
    return deletedCount;
  } catch (error) {
    if (error instanceof ResourceError) {
      throw error;
    }
    appLogger.error('공지사항 목록 삭제 중 오류 발생', { error, noticeIds });
    throw new BusinessError(
      ErrorCode.NOTICE_DELETE_FAILED,
      '공지사항 목록 삭제 중 오류가 발생했습니다.',
      { noticeIds, originalError: error }
    );
  }
}

