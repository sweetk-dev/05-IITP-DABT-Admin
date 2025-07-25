// import { 
//   findQnas, 
//   findQnaById, 
//   answerQna, 
//   updateQna, 
//   deleteQna 
// } from '../../repositories/sysQnaRepository';

// // QnA 목록 조회 (관리자용)
// export const getQnaList = async (options: {
//   page: number;
//   limit: number;
//   search?: string;
// }) => {
//   const result = await findQnas(options);
//   return {
//     qnas: result.qnas,
//     total: result.total,
//     page: result.page,
//     limit: result.limit
//   };
// };

// // QnA 상세 조회 (관리자용)
// export const getQnaDetail = async (qnaId: number) => {
//   return await findQnaById(qnaId);
// };

// // QnA 답변 (관리자용)
// export const answerQnaForAdmin = async (qnaId: number, answer: string, answeredBy?: string) => {
//   return await answerQna(qnaId, {
//     answerContent: answer,
//     answeredBy: answeredBy || 'admin',
//     answeredAt: new Date()
//   });
// };

// // QnA 수정 (관리자용)
// export const updateQnaForAdmin = async (qnaId: number, data: {
//   title?: string;
//   content?: string;
//   updatedBy?: string;
// }) => {
//   return await updateQna(qnaId, {
//     ...data,
//     updatedBy: data.updatedBy || 'admin'
//   });
// };

// // QnA 삭제 (관리자용)
// export const deleteQnaForAdmin = async (qnaId: number) => {
//   return await deleteQna(qnaId, 'admin');
// }; 