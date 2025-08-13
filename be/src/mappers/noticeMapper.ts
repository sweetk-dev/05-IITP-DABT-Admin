import type { AdminNoticeItem, UserNoticeItem } from '@iitp-dabt/common';
import type { SysNotice } from '../models/sysNotice';

function toIsoString(value?: Date | string | number): string | undefined {
  if (!value) return undefined;
  const d = value instanceof Date ? value : new Date(value);
  return d.toISOString();
}

export function toAdminNoticeItem(n: SysNotice): AdminNoticeItem {
  const createdOrPosted = (n as any).createdAt || (n as any).postedAt;
  return {
    noticeId: (n as any).noticeId,
    title: (n as any).title,
    content: (n as any).content,
    noticeType: (n as any).noticeType,
    pinnedYn: (n as any).pinnedYn,
    publicYn: (n as any).publicYn,
    postedAt: toIsoString((n as any).postedAt)!,
    startDt: toIsoString((n as any).startDt),
    endDt: toIsoString((n as any).endDt),
    createdBy: (n as any).createdBy,
    updatedBy: (n as any).updatedBy,
    createdAt: toIsoString(createdOrPosted)!,
    updatedAt: toIsoString((n as any).updatedAt)
  };
}

export function toUserNoticeItem(n: SysNotice): UserNoticeItem {
  return {
    noticeId: (n as any).noticeId,
    title: (n as any).title,
    content: (n as any).content,
    noticeType: (n as any).noticeType,
    pinnedYn: (n as any).pinnedYn,
    postedAt: toIsoString((n as any).postedAt)!
  };
}


