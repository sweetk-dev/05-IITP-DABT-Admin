import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
// import { sendError, sendSuccess } from '../../utils/errorHandler';
// import { 
//   getFaqList, 
//   getFaqDetail, 
//   createFaq, 
//   updateFaq, 
//   deleteFaq, 
//   getFaqStats 
// } from '../../services/admin/adminFaqService';
// import { 
//   AdminFaqListReq, 
//   AdminFaqListRes, 
//   AdminFaqDetailReq, 
//   AdminFaqDetailRes,
//   AdminFaqCreateReq,
//   AdminFaqCreateRes,
//   AdminFaqUpdateReq,
//   AdminFaqUpdateRes,
//   AdminFaqDeleteRes,
//   AdminFaqStatsRes
// } from '@iitp-dabt/common';

// 임시 더미 함수들 (나중에 구현 예정)
export const getFaqListForAdmin = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

export const getFaqDetailForAdmin = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

export const createFaqForAdmin = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

export const updateFaqForAdmin = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

export const deleteFaqForAdmin = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
};


// // FAQ 목록 조회 (관리자용)
// export const getFaqListForAdmin = async (req: Request<{}, {}, {}, AdminFaqListReq>, res: Response) => {
//   try {
//     const { page = 1, limit = 10, faqType, search, useYn } = req.query;
    
//     const result = await getFaqList({
//       page: parseInt(page as string),
//       limit: parseInt(limit as string),
//       faqType,
//       search,
//       useYn
//     });

//     const response: AdminFaqListRes = {
//       faqs: result.faqs.map(faq => ({
//         faqId: faq.faqId,
//         faqType: faq.faqType,
//         question: faq.question,
//         answer: faq.answer,
//         hitCnt: faq.hitCnt,
//         sortOrder: faq.sortOrder,
//         useYn: faq.useYn,
//         createdAt: faq.createdAt.toISOString(),
//         updatedAt: faq.updatedAt?.toISOString()
//       })),
//       total: result.total,
//       page: result.page,
//       limit: result.limit,
//       totalPages: Math.ceil(result.total / result.limit),
//       items: result.faqs
//     };

//     sendSuccess(res, response);
//   } catch (error) {
//     sendError(res, ErrorCode.FAQ_NOT_FOUND);
//   }
// };

// // FAQ 상세 조회 (관리자용)
// export const getFaqDetailForAdmin = async (req: Request<AdminFaqDetailReq>, res: Response) => {
//   try {
//     const { faqId } = req.params;
    
//     const faq = await getFaqDetail(parseInt(faqId));
//     if (!faq) {
//       return sendError(res, ErrorCode.FAQ_NOT_FOUND);
//     }

//     const response: AdminFaqDetailRes = {
//       faq: {
//         faqId: faq.faqId,
//         faqType: faq.faqType,
//         question: faq.question,
//         answer: faq.answer,
//         hitCnt: faq.hitCnt,
//         sortOrder: faq.sortOrder,
//         useYn: faq.useYn,
//         createdAt: faq.createdAt.toISOString(),
//         updatedAt: faq.updatedAt?.toISOString()
//       }
//     };

//     sendSuccess(res, response);
//   } catch (error) {
//     sendError(res, ErrorCode.FAQ_NOT_FOUND);
//   }
// };

// // FAQ 생성 (관리자용)
// export const createFaqForAdmin = async (req: Request<{}, {}, AdminFaqCreateReq>, res: Response) => {
//   try {
//     const { faqType, question, answer, sortOrder, useYn } = req.body;
    
//     const result = await createFaq({
//       faqType,
//       question,
//       answer,
//       sortOrder,
//       useYn
//     });

//     const response: AdminFaqCreateRes = {
//       faqId: result.faqId,
//       message: 'FAQ가 생성되었습니다.'
//     };

//     sendSuccess(res, response);
//   } catch (error) {
//     sendError(res, ErrorCode.FAQ_CREATE_FAILED);
//   }
// };

// // FAQ 수정 (관리자용)
// export const updateFaqForAdmin = async (req: Request<{ faqId: string }, {}, AdminFaqUpdateReq>, res: Response) => {
//   try {
//     const { faqId } = req.params;
//     const updateData = req.body;
    
//     const result = await updateFaq(parseInt(faqId), updateData);

//     const response: AdminFaqUpdateRes = {
//       success: result,
//       message: 'FAQ가 수정되었습니다.'
//     };

//     sendSuccess(res, response);
//   } catch (error) {
//     sendError(res, ErrorCode.FAQ_UPDATE_FAILED);
//   }
// };

// // FAQ 삭제 (관리자용)
// export const deleteFaqForAdmin = async (req: Request<{ faqId: string }>, res: Response) => {
//   try {
//     const { faqId } = req.params;
    
//     const result = await deleteFaq(parseInt(faqId));

//     const response: AdminFaqDeleteRes = {
//       success: result,
//       message: 'FAQ가 삭제되었습니다.'
//     };

//     sendSuccess(res, response);
//   } catch (error) {
//     sendError(res, ErrorCode.FAQ_DELETE_FAILED);
//   }
// };

// // FAQ 통계 (관리자용)
// export const getFaqStatsForAdmin = async (req: Request, res: Response) => {
//   try {
//     const stats = await getFaqStats();

//     const response: AdminFaqStatsRes = {
//       totalFaqs: stats.totalFaqs,
//       activeFaqs: stats.activeFaqs,
//       totalHits: stats.totalHits,
//       topFaqs: stats.topFaqs
//     };

//     sendSuccess(res, response);
//   } catch (error) {
//     sendError(res, ErrorCode.FAQ_STATS_FAILED);
//   }
// }; 