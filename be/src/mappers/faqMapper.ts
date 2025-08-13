import type { AdminFaqItem, UserFaqItem } from '@iitp-dabt/common';
import type { SysFaqAttributes } from '../models/sysFaq';

function toIsoString(value?: Date | string | number): string | undefined {
  if (!value) return undefined;
  const d = value instanceof Date ? value : new Date(value);
  return d.toISOString();
}

export type FaqSource = Pick<
  SysFaqAttributes,
  'faqId' | 'faqType' | 'question' | 'answer' | 'hitCnt' | 'sortOrder' | 'useYn' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'
>;

export function toAdminFaqItem(faq: FaqSource): AdminFaqItem {
  return {
    faqId: faq.faqId!,
    faqType: faq.faqType,
    question: faq.question,
    answer: faq.answer,
    hitCnt: faq.hitCnt,
    sortOrder: faq.sortOrder,
    useYn: faq.useYn,
    createdAt: toIsoString(faq.createdAt)!,
    updatedAt: toIsoString(faq.updatedAt),
    createdBy: faq.createdBy,
    updatedBy: faq.updatedBy
  };
}

export function toUserFaqItem(faq: FaqSource): UserFaqItem {
  return {
    faqId: faq.faqId!,
    faqType: faq.faqType,
    question: faq.question,
    answer: faq.answer,
    hitCnt: faq.hitCnt,
    sortOrder: faq.sortOrder
  };
}


