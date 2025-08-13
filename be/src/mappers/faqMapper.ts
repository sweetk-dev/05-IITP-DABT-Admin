import type { AdminFaqItem, UserFaqItem } from '@iitp-dabt/common';
import type { SysFaq } from '../models/sysFaq';

function toIsoString(value?: Date | string | number): string | undefined {
  if (!value) return undefined;
  const d = value instanceof Date ? value : new Date(value);
  return d.toISOString();
}

export function toAdminFaqItem(faq: SysFaq): AdminFaqItem {
  return {
    faqId: (faq as any).faqId,
    faqType: (faq as any).faqType,
    question: (faq as any).question,
    answer: (faq as any).answer,
    hitCnt: (faq as any).hitCnt,
    sortOrder: (faq as any).sortOrder,
    useYn: (faq as any).useYn,
    createdAt: toIsoString((faq as any).createdAt)!,
    updatedAt: toIsoString((faq as any).updatedAt),
    createdBy: (faq as any).createdBy,
    updatedBy: (faq as any).updatedBy
  };
}

export function toUserFaqItem(faq: SysFaq): UserFaqItem {
  return {
    faqId: (faq as any).faqId,
    faqType: (faq as any).faqType,
    question: (faq as any).question,
    answer: (faq as any).answer,
    hitCnt: (faq as any).hitCnt,
    sortOrder: (faq as any).sortOrder
  };
}


