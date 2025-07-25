import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
// import { sendError, sendSuccess } from '../../utils/errorHandler';
// import { 
//   getQnaList, 
//   getQnaDetail, 
//   answerQna, 
//   updateQna, 
//   deleteQna 
// } from '../../services/admin/adminQnaService';
// import { 
//   AdminQnaListReq, 
//   AdminQnaListRes, 
//   AdminQnaDetailReq, 
//   AdminQnaDetailRes,
//   AdminQnaAnswerReq,
//   AdminQnaAnswerRes,
//   AdminQnaUpdateReq,
//   AdminQnaUpdateRes,
//   AdminQnaDeleteRes
// } from '@iitp-dabt/common';

// 임시 더미 함수들 (나중에 구현 예정)
export const getQnaListForAdmin = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

export const getQnaDetailForAdmin = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

export const answerQnaForAdmin = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

export const updateQnaForAdmin = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

export const deleteQnaForAdmin = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

// // QnA 목록 조회 (관리자용)
// export const getQnaListForAdmin = async (req: Request<{}, {}, {}, AdminQnaListReq>, res: Response) => {
//   try {
//     const { page = 1, limit = 10, search } = req.query;
    
//     const result = await getQnaList({
//       page: parseInt(page as string),
//       limit: parseInt(limit as string),
//       search
//     });

//     const response: AdminQnaListRes = {
//       qnas: result.qnas.map(qna => ({
//         qnaId: qna.qnaId,
//         userId: qna.userId,
//         qnaType: qna.qnaType,
//         title: qna.title,
//         content: qna.content,
//         secretYn: qna.secretYn,
//         status: qna.status,
//         writerName: qna.writerName || '',
//         createdAt: qna.createdAt.toISOString(),
//         answeredAt: qna.answeredAt?.toISOString(),
//         answeredBy: qna.answeredBy
//       })),
//       total: result.total,
//       page: result.page,
//       limit: result.limit,
//       totalPages: Math.ceil(result.total / result.limit),
//       items: result.qnas
//     };

//     sendSuccess(res, response);
//   } catch (error) {
//     sendError(res, ErrorCode.QNA_NOT_FOUND);
//   }
// };

// // QnA 상세 조회 (관리자용)
// export const getQnaDetailForAdmin = async (req: Request<AdminQnaDetailReq>, res: Response) => {
//   try {
//     const { qnaId } = req.params;
    
//     const qna = await getQnaDetail(parseInt(qnaId));
//     if (!qna) {
//       return sendError(res, ErrorCode.QNA_NOT_FOUND);
//     }

//     const response: AdminQnaDetailRes = {
//       qna: {
//         qnaId: qna.qnaId,
//         userId: qna.userId,
//         qnaType: qna.qnaType,
//         title: qna.title,
//         content: qna.content,
//         secretYn: qna.secretYn,
//         status: qna.status,
//         writerName: qna.writerName || '',
//         createdAt: qna.createdAt.toISOString(),
//         answeredAt: qna.answeredAt?.toISOString(),
//         answeredBy: qna.answeredBy,
//         answerContent: qna.answerContent
//       }
//     };

//     sendSuccess(res, response);
//   } catch (error) {
//     sendError(res, ErrorCode.QNA_NOT_FOUND);
//   }
// };

// // QnA 답변 (관리자용)
// export const answerQnaForAdmin = async (req: Request<{ qnaId: string }, {}, AdminQnaAnswerReq>, res: Response) => {
//   try {
//     const { qnaId } = req.params;
//     const { answer, answeredBy } = req.body;
    
//     const result = await answerQna(parseInt(qnaId), answer, answeredBy);

//     const response: AdminQnaAnswerRes = {
//       success: result,
//       message: '답변이 등록되었습니다.'
//     };

//     sendSuccess(res, response);
//   } catch (error) {
//     sendError(res, ErrorCode.QNA_ANSWER_FAILED);
//   }
// };

// // QnA 수정 (관리자용)
// export const updateQnaForAdmin = async (req: Request<{ qnaId: string }, {}, AdminQnaUpdateReq>, res: Response) => {
//   try {
//     const { qnaId } = req.params;
//     const { title, content, updatedBy } = req.body;
    
//     const result = await updateQna(parseInt(qnaId), { title, content, updatedBy });

//     const response: AdminQnaUpdateRes = {
//       success: result,
//       message: 'QnA가 수정되었습니다.'
//     };

//     sendSuccess(res, response);
//   } catch (error) {
//     sendError(res, ErrorCode.QNA_UPDATE_FAILED);
//   }
// };

// // QnA 삭제 (관리자용)
// export const deleteQnaForAdmin = async (req: Request<{ qnaId: string }>, res: Response) => {
//   try {
//     const { qnaId } = req.params;
    
//     const result = await deleteQna(parseInt(qnaId));

//     const response: AdminQnaDeleteRes = {
//       success: result,
//       message: 'QnA가 삭제되었습니다.'
//     };

//     sendSuccess(res, response);
//   } catch (error) {
//     sendError(res, ErrorCode.QNA_DELETE_FAILED);
//   }
// }; 