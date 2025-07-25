// import { findActiveFaqs, findFaqById, incrementHitCount } from '../../repositories/sysFaqRepository';

// // FAQ 목록 조회 (사용자용)
// export const getFaqList = async (options: {
//   page: number;
//   limit: number;
//   faqType?: string;
//   search?: string;
// }) => {
//   const result = await findActiveFaqs(options);
//   return {
//     faqs: result.faqs,
//     total: result.total,
//     page: result.page,
//     limit: result.limit
//   };
// };

// // FAQ 상세 조회 (사용자용)
// export const getFaqDetail = async (faqId: number) => {
//   return await findFaqById(faqId);
// };

// // 조회수 증가
// export const incrementFaqHitCount = async (faqId: number) => {
//   return await incrementHitCount(faqId);
// }; 