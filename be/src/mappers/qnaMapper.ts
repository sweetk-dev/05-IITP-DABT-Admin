import type { AdminQnaItem, AdminQnaDetailItem, UserQnaItem } from '@iitp-dabt/common';
import type { SysQna } from '../models/sysQna';

function toIsoString(value?: Date | string | number): string | undefined {
  if (!value) return undefined;
  const d = value instanceof Date ? value : new Date(value);
  return d.toISOString();
}

export function toAdminQnaItem(qna: SysQna): AdminQnaItem {
  return {
    qnaId: (qna as any).qnaId,
    userId: (qna as any).userId,
    qnaType: (qna as any).qnaType,
    title: (qna as any).title,
    content: (qna as any).content,
    secretYn: (qna as any).secretYn,
    status: (qna as any).status,
    writerName: (qna as any).writerName || '',
    createdAt: toIsoString((qna as any).createdAt)!,
    answeredAt: toIsoString((qna as any).answeredAt),
    answeredBy: (qna as any).answeredBy ? Number((qna as any).answeredBy) : undefined,
    updatedAt: toIsoString((qna as any).updatedAt),
    deletedAt: toIsoString((qna as any).deletedAt),
    createdBy: (qna as any).createdBy,
    updatedBy: (qna as any).updatedBy,
    deletedBy: (qna as any).deletedBy
  };
}

export function toAdminQnaDetailItem(qna: SysQna): AdminQnaDetailItem {
  return {
    ...toAdminQnaItem(qna),
    answerContent: (qna as any).answerContent
  };
}

export function toUserQnaItem(qna: SysQna): UserQnaItem {
  return {
    qnaId: (qna as any).qnaId,
    qnaType: (qna as any).qnaType,
    title: (qna as any).title,
    content: (qna as any).content,
    secretYn: (qna as any).secretYn,
    status: (qna as any).status,
    writerName: (qna as any).writerName,
    createdAt: toIsoString((qna as any).createdAt)!,
    answeredAt: toIsoString((qna as any).answeredAt)
  };
}


