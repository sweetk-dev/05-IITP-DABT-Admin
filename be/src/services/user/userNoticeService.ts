import SysNoticeRepository from '../../repositories/sysNoticeRepository';
import { appLogger } from '../../utils/logger';
import type { UserNoticeHomeRes } from '@iitp-dabt/common';

export interface UserNoticeListParams {
  page?: number;
  limit?: number;
  noticeType?: 'G' | 'S' | 'E';
  publicOnly?: boolean;
  includeExpired?: boolean;
}

export const getUserNoticeList = async (params: UserNoticeListParams = {}) => {
  const { page = 1, limit = 10, noticeType, publicOnly = true, includeExpired = false } = params;
  const result = await SysNoticeRepository.getNoticeList({
    page,
    limit,
    noticeType,
    publicOnly,
    includeExpired,
    isAdmin: false
  });
  appLogger.info('사용자 공지 목록 조회 서비스', { page, limit, noticeType, publicOnly, includeExpired });
  return result;
};

export const getUserNoticeDetail = async (noticeId: number) => {
  const n = await SysNoticeRepository.getNoticeById(noticeId);
  if (!n || n.publicYn !== 'Y') return null;
  return n;
};

export const getUserNoticeHome = async (): Promise<UserNoticeHomeRes> => {
  const pinned = await SysNoticeRepository.getPinnedNotices(5, false);
  const recent = await SysNoticeRepository.getRecentNotices(5, false);

  const combinedMap = new Map<number, any>();
  pinned.forEach(n => combinedMap.set(n.noticeId!, n));
  for (const n of recent) {
    if (combinedMap.size >= 5) break;
    if (!combinedMap.has(n.noticeId!)) combinedMap.set(n.noticeId!, n);
  }

  const notices = Array.from(combinedMap.values()).map(n => ({
    noticeId: n.noticeId,
    title: n.title,
    content: n.content,
    noticeType: n.noticeType,
    pinnedYn: n.pinnedYn,
    postedAt: (n.postedAt instanceof Date ? n.postedAt : new Date(n.postedAt)).toISOString(),
  }));

  appLogger.info('사용자 홈 공지사항 조회 서비스', { count: notices.length });
  return { notices };
};
