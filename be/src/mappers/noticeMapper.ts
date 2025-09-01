import type { AdminNoticeItem, UserNoticeItem } from '@iitp-dabt/common';
import type { SysNoticeAttributes } from '../models/sysNotice';
import { toIsoString } from '../utils/timeUtils';




type NoticeSource = Pick<
  SysNoticeAttributes,
  'noticeId' | 'title' | 'content' | 'noticeType' | 'pinnedYn' | 'publicYn' | 'postedAt' | 'startDt' | 'endDt' | 'createdBy' | 'updatedBy' | 'createdAt' | 'updatedAt'
>;

export function toAdminNoticeItem(n: NoticeSource): AdminNoticeItem {
  const createdOrPosted = (n as any).createdAt || n.postedAt;
  return {
    noticeId: n.noticeId,
    title: n.title,
    content: n.content,
    noticeType: n.noticeType,
    pinnedYn: n.pinnedYn,
    publicYn: n.publicYn,
    postedAt: toIsoString(n.postedAt)!,
    startDt: toIsoString(n.startDt),
    endDt: toIsoString(n.endDt),
    createdBy: n.createdBy,
    updatedBy: n.updatedBy,
    createdAt: toIsoString(createdOrPosted)!,
    updatedAt: toIsoString(n.updatedAt)
  };
}

export function toUserNoticeItem(n: NoticeSource): UserNoticeItem {
  return {
    noticeId: n.noticeId,
    title: n.title,
    content: n.content,
    noticeType: n.noticeType,
    pinnedYn: n.pinnedYn,
    postedAt: toIsoString(n.postedAt)!
  };
}


