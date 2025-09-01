import type { AdminQnaItem, AdminQnaDetailItem, UserQnaItem } from '@iitp-dabt/common';
import type { SysQnaAttributes } from '../models/sysQna';
import { toIsoString } from '../utils/timeUtils';



export type QnaSource = Pick<
  SysQnaAttributes,
  | 'qnaId'
  | 'userId'
  | 'qnaType'
  | 'title'
  | 'content'
  | 'secretYn'
  | 'answeredYn'
  | 'writerName'
  | 'answeredBy'
  | 'answeredAt'
  | 'hitCnt'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'createdBy'
  | 'updatedBy'
  | 'deletedBy'
> & {
  answerContent?: string;
};

export function toAdminQnaItem(qna: QnaSource): AdminQnaItem {
  return {
    qnaId: qna.qnaId!,
    userId: qna.userId,
    qnaType: qna.qnaType,
    title: qna.title,
    content: qna.content,
    secretYn: qna.secretYn,
    answeredYn: qna.answeredYn || 'N',
    writerName: qna.writerName || '',
    hitCnt: (qna as any).hitCnt as any,
    createdAt: toIsoString(qna.createdAt)!,
    answeredAt: toIsoString(qna.answeredAt),
    answeredBy: qna.answeredBy ? Number(qna.answeredBy) : undefined,
    updatedAt: toIsoString(qna.updatedAt),
    deletedAt: toIsoString(qna.deletedAt),
    createdBy: qna.createdBy,
    updatedBy: qna.updatedBy,
    deletedBy: qna.deletedBy
  };
}

export function toAdminQnaDetailItem(qna: QnaSource): AdminQnaDetailItem {
  return {
    ...toAdminQnaItem(qna),
    answerContent: qna.answerContent
  };
}

export function toUserQnaItem(qna: QnaSource): UserQnaItem {
  return {
    qnaId: qna.qnaId!,
    qnaType: qna.qnaType,
    title: qna.title,
    content: qna.content,
    secretYn: qna.secretYn,
    answeredYn: qna.answeredYn || 'N',
    writerName: qna.writerName!,
    hitCnt: (qna as any).hitCnt as any,
    createdAt: toIsoString(qna.createdAt)!,
    answeredAt: toIsoString(qna.answeredAt)
  };
}


