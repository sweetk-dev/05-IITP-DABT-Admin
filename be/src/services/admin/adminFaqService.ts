// import { 
//   findFaqs, 
//   findFaqById, 
//   createFaq, 
//   updateFaq, 
//   deleteFaq, 
//   getFaqStats 
// } from '../../repositories/sysFaqRepository';

// // FAQ 목록 조회 (관리자용)
// export const getFaqList = async (options: {
//   page: number;
//   limit: number;
//   faqType?: string;
//   search?: string;
//   useYn?: string;
// }) => {
//   const result = await findFaqs(options);
//   return {
//     faqs: result.faqs,
//     total: result.total,
//     page: result.page,
//     limit: result.limit
//   };
// };

// // FAQ 상세 조회 (관리자용)
// export const getFaqDetail = async (faqId: number) => {
//   return await findFaqById(faqId);
// };

// // FAQ 생성 (관리자용)
// export const createFaqForAdmin = async (data: {
//   faqType: string;
//   question: string;
//   answer: string;
//   sortOrder?: number;
//   useYn?: string;
// }) => {
//   return await createFaq({
//     faqType: data.faqType,
//     question: data.question,
//     answer: data.answer,
//     sortOrder: data.sortOrder || 0,
//     useYn: data.useYn || 'Y',
//     createdBy: 'admin'
//   });
// };

// // FAQ 수정 (관리자용)
// export const updateFaqForAdmin = async (faqId: number, data: {
//   faqType?: string;
//   question?: string;
//   answer?: string;
//   sortOrder?: number;
//   useYn?: string;
// }) => {
//   return await updateFaq(faqId, {
//     ...data,
//     updatedBy: 'admin'
//   });
// };

// // FAQ 삭제 (관리자용)
// export const deleteFaqForAdmin = async (faqId: number) => {
//   return await deleteFaq(faqId, 'admin');
// };

// // FAQ 통계 (관리자용)
// export const getFaqStatsForAdmin = async () => {
//   return await getFaqStats();
// }; 