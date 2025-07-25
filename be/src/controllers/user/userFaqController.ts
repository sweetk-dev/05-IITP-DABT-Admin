import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
// import { sendError, sendSuccess } from '../../utils/errorHandler';
// import { 
//   getFaqList, 
//   getFaqDetail, 
//   incrementHitCount 
// } from '../../services/user/userFaqService';
// import { 
//   UserFaqListReq, 
//   UserFaqListRes, 
//   UserFaqDetailReq, 
//   UserFaqDetailRes 
// } from '@iitp-dabt/common';

// 임시 더미 함수들 (나중에 구현 예정)
export const getFaqListForUser = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

export const getFaqDetailForUser = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

// // FAQ 목록 조회 (사용자용)
// export const getFaqListForUser = async (req: Request<{}, {}, {}, UserFaqListReq>, res: Response) => {
//   try {
//     const { page = 1, limit = 10, faqType, search } = req.query;
    
//     const result = await getFaqList({
//       page: parseInt(page as string),
//       limit: parseInt(limit as string),
//       faqType,
//       search
//     });

//     const response: UserFaqListRes = {
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

// // FAQ 상세 조회 (사용자용)
// export const getFaqDetailForUser = async (req: Request<UserFaqDetailReq>, res: Response) => {
//   try {
//     const { faqId } = req.params;
    
//     const faq = await getFaqDetail(parseInt(faqId));
//     if (!faq) {
//       return sendError(res, ErrorCode.FAQ_NOT_FOUND);
//     }

//     // 조회수 증가
//     await incrementHitCount(parseInt(faqId));

//     const response: UserFaqDetailRes = {
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