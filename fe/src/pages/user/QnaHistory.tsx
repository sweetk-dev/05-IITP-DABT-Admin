import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Typography,
	List,
	ListItem,
	ListItemText,
	Chip,
	Accordion,
	AccordionDetails,
	Divider
} from '@mui/material';
import { getUserQnaList, getUserQnaDetail, getCommonCodesByGroupId } from '../../api';
import { ROUTES } from '../../routes';
import { PAGINATION } from '../../constants/pagination';
import ThemedButton from '../../components/common/ThemedButton';
import CommonDialog from '../../components/CommonDialog';
import { deleteUserQna } from '../../api';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useDataFetching } from '../../hooks/useDataFetching';
import { usePagination } from '../../hooks/usePagination';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import { COMMON_CODE_GROUPS } from '@iitp-dabt/common';
// EmptyState handled by ListScaffold
import StatusChip from '../../components/common/StatusChip';
import QnaTypeChip from '../../components/common/QnaTypeChip';
import { useQuerySync } from '../../hooks/useQuerySync';
import ListScaffold from '../../components/common/ListScaffold';
import { formatYmdHm } from '../../utils/date';

interface QnaHistoryProps {
	id?: string;
}

export const QnaHistory: React.FC<QnaHistoryProps> = ({ id = 'qna-history' }) => {
	const navigate = useNavigate();
	const [expandedQna, setExpandedQna] = useState<number | null>(null);
	const [qnaDetails, setQnaDetails] = useState<Record<number, any>>({});
	const { query, setQuery } = useQuerySync({ qnaId: '' });
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [targetDeleteId, setTargetDeleteId] = useState<number | null>(null);
	// QnA 유형 공통코드 로드 (라벨 표시용)
	const { data: qnaTypeCodes } = useDataFetching({ fetchFunction: () => getCommonCodesByGroupId(COMMON_CODE_GROUPS.QNA_TYPE), autoFetch: true });
	
	// Pagination 훅 사용
	const pagination = usePagination({
		initialLimit: PAGINATION.DEFAULT_PAGE_SIZE
	});

	// 데이터 페칭 훅 사용
	const {
		data: qnaList,
		isLoading: loading,
		isEmpty,
		isError,
		refetch
	} = useDataFetching({
		fetchFunction: () => getUserQnaList({
			page: pagination.currentPage,
			limit: pagination.pageSize,
			mineOnly: true
		}),
		dependencies: [pagination.currentPage, pagination.pageSize],
		autoFetch: true
	});

	// 페이지 크기 동기화
	useEffect(() => {
		if (qnaList) {
			pagination.handlePageSizeChange(qnaList.limit);
		}
	}, [qnaList]);

	// 페이지 변경 핸들러
	const handlePageChange = (page: number) => {
		pagination.handlePageChange(page);
	};

	const handleQnaExpand = async (qnaId: number | string) => {
		const numQnaId = Number(qnaId);
		
		if (expandedQna === numQnaId) {
			setExpandedQna(null);
			// URL에서 qnaId 쿼리 파라미터 제거
			setQuery({ qnaId: '' }, { replace: true });
			return;
		}

		setExpandedQna(numQnaId);
		// URL에 qnaId 쿼리 파라미터 추가
		setQuery({ qnaId: String(numQnaId) }, { replace: true });

		// 이미 로드된 상세 정보가 있으면 재사용
		if (qnaDetails[numQnaId]) {
			return;
		}

		try {
			const response = await getUserQnaDetail(numQnaId);
			handleApiResponse(response, (data) => {
				setQnaDetails(prev => ({ ...prev, [numQnaId]: data }));
			});
		} catch (err) {
			console.error('[QnaHistory] QnA 상세 정보 로드 실패:', err);
		}
	};

	const onRequestDelete = (qnaId: number) => {
		setTargetDeleteId(qnaId);
		setConfirmOpen(true);
	};

	const onConfirmDelete = async () => {
		if (!targetDeleteId) { setConfirmOpen(false); return; }
		try {
			await deleteUserQna(targetDeleteId);
			setConfirmOpen(false);
			setTargetDeleteId(null);
			// 간단히 리프레시 위해 setExpandedQna도 닫음
			setExpandedQna(null);
			// 현재 페이지의 마지막 항목을 삭제한 경우 이전 페이지로 이동, 아니면 재조회
			const itemCount = (qnaList as any)?.items?.length || 0;
			if (itemCount <= 1 && pagination.currentPage > 1) {
				pagination.handlePageChange(pagination.currentPage - 1);
			} else {
				refetch();
			}
		} catch (e) {
			setConfirmOpen(false);
			setTargetDeleteId(null);
		}
	};

	// 쿼리파라미터로 전달된 qnaId가 있으면 해당 항목을 자동 펼침
	// qnaList가 로드된 후에만 처리하도록 단일 useEffect로 통합
	useEffect(() => {
		const paramId = Number(query.qnaId);
		
		// qnaId가 없거나 qnaList가 아직 로드되지 않았으면 무시
		if (!paramId || !qnaList?.items) {
			return;
		}
		
		// 이미 펼쳐진 항목이면 무시 (무한 루프 방지)
		// 단, expandedQna가 null이 아니고 paramId와 다를 때만 체크
		// (사용자가 수동으로 접기 버튼을 눌렀을 때는 query.qnaId를 제거해야 함)
		if (expandedQna === paramId) {
			return;
		}
		
		// 현재 페이지에 해당 항목이 있는지 확인 (타입 변환 고려)
		const itemInCurrentPage = qnaList.items.some((i: any) => Number(i.qnaId) === paramId);
		
		if (itemInCurrentPage) {
			// 현재 페이지에 있으면 즉시 펼침
			handleQnaExpand(paramId);
		} else {
			// 다른 페이지에 있으면 해당 페이지로 이동 후 펼침
			// 전체 페이지를 탐색하여 해당 항목이 있는 페이지 찾기
			let cancelled = false;
			(async () => {
				try {
					const firstResponse = await getUserQnaList({ page: 1, limit: pagination.pageSize, mineOnly: true } as any);
					// ApiResponse 구조에서 data 추출
					const firstData = (firstResponse as any)?.data || firstResponse;
					const totalPages = firstData?.totalPages || 1;
					
					for (let p = 1; p <= totalPages; p++) {
						if (cancelled) break;
						
						const res = p === 1 ? firstResponse : await getUserQnaList({ page: p, limit: pagination.pageSize, mineOnly: true } as any);
						// ApiResponse 구조에서 data 추출
						const responseData = (res as any)?.data || res;
						const items = responseData?.items || [];
						
						// 타입 변환 고려하여 비교 (qnaId는 number이지만 문자열로 올 수 있음)
						if (items.some((i: any) => Number(i.qnaId) === paramId)) {
							if (!cancelled) {
								// 페이지 변경 후, 다음 렌더링에서 qnaList가 업데이트되면 자동으로 펼쳐짐
								pagination.handlePageChange(p);
							}
							break;
						}
					}
				} catch (err) {
					console.error('[QnaHistory] Error searching for qnaId:', err);
				}
			})();
			
			return () => {
				cancelled = true;
			};
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query.qnaId, qnaList]);

	const handleBack = () => {
		navigate(ROUTES.USER.DASHBOARD);
	};

	const formatDate = (dateString: string) => formatYmdHm(dateString);

	return (
		<Box id={id} sx={{ p: 3 }}>
			<ListScaffold
				title="내 문의 내역"
				onBack={handleBack}
				total={qnaList?.total}
				loading={loading}
				errorText={isError ? '문의 내역을 불러오는 중 오류가 발생했습니다.' : ''}
				emptyText={isEmpty ? '등록된 문의가 없습니다.' : ''}
				pagination={{ page: pagination.currentPage, totalPages: qnaList?.totalPages || 0, onPageChange: handlePageChange }}
				wrapInCard={false}
			>
				{qnaList?.items && qnaList.items.length > 0 && (
				<List>
					{qnaList.items.map((qna: any, index: number) => {
						const isExpanded = expandedQna === Number(qna.qnaId);
						return (
						<React.Fragment key={qna.qnaId}>
							<ListItem>
								<ListItemText
									primary={
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											{/* 순서: 유형 → 상태 → 비공개 → 날짜 */}
											<QnaTypeChip typeId={qna.qnaType} label={((qnaTypeCodes as any)?.codes || []).find((c: any) => c.codeId === qna.qnaType)?.codeNm || qna.qnaType} />
											<Chip label={qna.status === 'answered' ? '답변완료' : '답변대기'} color={qna.status === 'answered' ? 'success' : 'warning'} size="small" />
											{qna.secretYn === 'Y' && (<StatusChip kind="private" />)}
											<Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
												{formatDate(qna.createdAt)}
											</Typography>
										</Box>
									}
									secondary={
										<Typography variant="h6" sx={{ fontWeight: 500, mt: 1 }}>
											{qna.title}
										</Typography>
									}
								/>
								{isExpanded && (
									<ThemedButton 
										variant="dangerSoft" 
										size="small" 
										startIcon={<DeleteIcon />} 
									onClick={(e) => {
										e.stopPropagation();
										onRequestDelete(qna.qnaId);
									}}
										sx={{ mr: 1 }}
									>
										삭제
									</ThemedButton>
								)}
								<ThemedButton
									id={`expand-qna-${qna.qnaId}`}
									variant="outlined"
									size="small"
									onClick={(e) => {
										e.stopPropagation();
										handleQnaExpand(qna.qnaId);
									}}
								>
									{isExpanded ? '접기' : '상세보기'}
								</ThemedButton>
							</ListItem>
							
							{isExpanded && (
								<Accordion 
									expanded={true} 
									sx={{ 
										boxShadow: 'none',
										'& .MuiAccordionDetails-root': {
											pointerEvents: 'auto'
										}
									}}
								>
									<AccordionDetails>
										<Box sx={{ pl: 2, pr: 2, pb: 2 }}>
											<Typography variant="h6" gutterBottom>
												문의 내용
											</Typography>
											<Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
												{qna.content}
											</Typography>
											
											{qnaDetails[Number(qna.qnaId)]?.qna.answerContent && (
												<>
													<Divider sx={{ my: 2 }} />
													<Typography variant="h6" gutterBottom>
														답변
													</Typography>
													<Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
														{qnaDetails[Number(qna.qnaId)].qna.answerContent}
													</Typography>
													{qnaDetails[Number(qna.qnaId)].qna.answeredAt && (
														<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
															답변일: {qnaDetails[Number(qna.qnaId)].qna.answeredAt ? formatDate(qnaDetails[Number(qna.qnaId)].qna.answeredAt || '') : '-'}
														</Typography>
													)}
												</>
											)}
											{/* bottom action buttons removed; delete is shown only when expanded at the top */}
										</Box>
									</AccordionDetails>
								</Accordion>
							)}
							
							{index < qnaList.items.length - 1 && <Divider />}
						</React.Fragment>
						);
					})}
				</List>
				)}
			</ListScaffold>
			<CommonDialog
				open={confirmOpen}
				title="문의 삭제"
				message="이 문의를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
				onClose={() => { setConfirmOpen(false); setTargetDeleteId(null); }}
				onConfirm={onConfirmDelete}
				showCancel
				confirmText="삭제"
				cancelText="취소"
			/>
		</Box>
	);
}; 