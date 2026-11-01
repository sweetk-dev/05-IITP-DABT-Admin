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

/**
 * 비공개(secretYn='Y') 문의를 작성자가 아닌 사람에게 보여 줄 때 쓰는 제목.
 * 화면의 안내 문구("비공개 질문입니다. 작성자만 열람할 수 있습니다.")와 맞춘다.
 */
export const SECRET_QNA_MASKED_TITLE = '비공개 질문입니다.';

/**
 * 작성자 이름 가운데를 * 로 가린다 (예: 홍길동 → 홍*동, 2자 이하는 그대로).
 * 화면의 작성자 표시 규칙과 같아서, 화면에서 한 번 더 가려도 결과가 바뀌지 않는다.
 */
export function maskWriterName(name?: string | null): string {
  if (!name) return '';
  return name.length <= 2 ? name : name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
}

/**
 * 사용자 화면용 Q&A 항목 변환 (보는 사람 기준)
 *
 * - 공개 문의, 또는 본인이 쓴 비공개 문의: 그대로 내보낸다.
 * - 남이 쓴 비공개 문의: 목록에 "비공개 글이 있다"는 사실과 유형·답변 상태·작성일만 남기고
 *   제목·본문·답변은 내보내지 않는다. 작성자 이름은 가린다.
 *   목록 API 는 로그인 없이도 열리므로, 응답 자체에 내용이 실리면 화면에서 숨겨도 노출된 것과 같다.
 * - 본인 여부는 일반 사용자 토큰의 사용자 ID 로만 판단한다(비로그인·관리자 토큰은 본인 아님).
 *
 * @param qna Q&A 원본
 * @param viewerUserId 보는 사람의 일반 사용자 ID (없으면 null/0)
 */
export function toUserQnaItemForViewer(qna: QnaSource, viewerUserId: number | null | undefined): UserQnaItem {
  const isMine = !!viewerUserId && Number(qna.userId) === Number(viewerUserId);
  const item = toUserQnaItem(qna);
  if (qna.secretYn === 'Y' && !isMine) {
    const { answerContent: _omitAnswer, ...rest } = item;
    return {
      ...rest,
      title: SECRET_QNA_MASKED_TITLE,
      content: '',
      writerName: maskWriterName(item.writerName),
      isMine: false
    };
  }
  return { ...item, isMine };
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


