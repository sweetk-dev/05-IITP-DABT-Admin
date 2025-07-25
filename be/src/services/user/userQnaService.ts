// import { findQnasByUser, findQnaById, createQna } from '../../repositories/sysQnaRepository';

// // QnA 목록 조회 (사용자용)
// export const getQnaList = async (options: {
//   page: number;
//   limit: number;
//   qnaType?: string;
//   search?: string;
//   userId: number;
// }) => {
//   const result = await findQnasByUser(options.userId, {
//     page: options.page,
//     limit: options.limit,
//     qnaType: options.qnaType,
//     search: options.search
//   });
//   return {
//     qnas: result.qnas,
//     total: result.total,
//     page: result.page,
//     limit: result.limit
//   };
// };

// // QnA 상세 조회 (사용자용)
// export const getQnaDetail = async (qnaId: number, userId: number) => {
//   const qna = await findQnaById(qnaId);
//   if (!qna || qna.userId !== userId) {
//     return null;
//   }
//   return qna;
// };

// // QnA 생성 (사용자용)
// export const createQnaForUser = async (data: {
//   userId: number;
//   qnaType: string;
//   title: string;
//   content: string;
//   secretYn?: string;
//   writerName?: string;
// }) => {
//   return await createQna({
//     userId: data.userId,
//     qnaType: data.qnaType,
//     title: data.title,
//     content: data.content,
//     secretYn: data.secretYn || 'N',
//     writerName: data.writerName || `User_${data.userId}`,
//     createdBy: data.userId.toString()
//   });
// }; 