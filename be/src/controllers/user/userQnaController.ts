import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
// import { sendError, sendSuccess } from '../../utils/errorHandler';
// import { 
//   getQnaList, 
//   getQnaDetail, 
//   createQna 
// } from '../../services/user/userQnaService';
// import { 
//   UserQnaListReq, 
//   UserQnaListRes, 
//   UserQnaDetailReq, 
//   UserQnaDetailRes,
//   UserQnaCreateReq,
//   UserQnaCreateRes
// } from '@iitp-dabt/common';

// 임시 더미 함수들 (나중에 구현 예정)
export const getQnaListForUser = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

export const getQnaDetailForUser = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

export const createQnaForUser = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

// // QnA 목록 조회 (사용자용)
// export const getQnaListForUser = async (req: Request<{}, {}, {}, UserQnaListReq>, res: Response) => {
//   try {
//     const { page = 1, limit = 10, qnaType, search } = req.query;
//     const userId = (req as any).user?.userId;
    
//     if (!userId) {
//       return sendError(res, ErrorCode.UNAUTHORIZED);
//     }
    
//     const result = await getQnaList({
//       page: parseInt(page as string),
//       limit: parseInt(limit as string),
//       qnaType,
//       search,
//       userId
//     });

//     const response: UserQnaListRes = {
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

// // QnA 상세 조회 (사용자용)
// export const getQnaDetailForUser = async (req: Request<UserQnaDetailReq>, res: Response) => {
//   try {
//     const { qnaId } = req.params;
//     const userId = (req as any).user?.userId;
    
//     if (!userId) {
//       return sendError(res, ErrorCode.UNAUTHORIZED);
//     }
    
//     const qna = await getQnaDetail(parseInt(qnaId), userId);
//     if (!qna) {
//       return sendError(res, ErrorCode.QNA_NOT_FOUND);
//     }

//     const response: UserQnaDetailRes = {
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

// // QnA 생성 (사용자용)
// export const createQnaForUser = async (req: Request<{}, {}, UserQnaCreateReq>, res: Response) => {
//   try {
//     const { qnaType, title, content, secretYn, writerName } = req.body;
//     const userId = (req as any).user?.user;
    
//     if (!userId) {
//       return sendError(res, ErrorCode.UNAUTHORIZED);
//     }
    
//     const result = await createQna({
//       userId,
//       qnaType,
//       title,
//       content,
//       secretYn,
//       writerName
//     });

//     const response: UserQnaCreateRes = {
//       qnaId: result.qnaId,
//       message: 'QnA가 등록되었습니다.'
//     };

//     sendSuccess(res, response);
//   } catch (error) {
//     sendError(res, ErrorCode.QNA_CREATE_FAILED);
//   }
// }; 