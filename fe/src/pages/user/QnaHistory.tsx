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
// import ErrorAlert from '../../components/ErrorAlert';
import { ROUTES } from '../../routes';
import { PAGINATION } from '../../constants/pagination';
import ThemedButton from '../../components/common/ThemedButton';
import CommonDialog from '../../components/CommonDialog';
import { deleteUserQna } from '../../api';
import { Delete as DeleteIcon } from '@mui/icons-material';
// import { getThemeColors } from '../../theme';
import { useDataFetching } from '../../hooks/useDataFetching';
import { usePagination } from '../../hooks/usePagination';
import { handleApiResponse } from '../../utils/apiResponseHandler';
// import type { UserQnaDetailRes } from '@iitp-dabt/common';
// EmptyState handled by ListScaffold
import StatusChip from '../../components/common/StatusChip';
import QnaTypeChip from '../../components/common/QnaTypeChip';
import { useQuerySync } from '../../hooks/useQuerySync';
import ListScaffold from '../../components/common/ListScaffold';

interface QnaHistoryProps {
	id?: string;
}

export const QnaHistory: React.FC<QnaHistoryProps> = ({ id = 'qna-history' }) => {
	const navigate = useNavigate();
	const [expandedQna, setExpandedQna] = useState<number | null>(null);
	const [qnaDetails, setQnaDetails] = useState<Record<number, any>>({});
	const { query } = useQuerySync({ qnaId: '' });
	const [pendingExpandId, setPendingExpandId] = useState<number | null>(null);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [targetDeleteId, setTargetDeleteId] = useState<number | null>(null);
	// QnA 유형 공통코드 로드 (라벨 표시용)
	const { data: qnaTypeCodes } = useDataFetching({ fetchFunction: () => getCommonCodesByGroupId('qna_type'), autoFetch: true });
	
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

	const handleQnaExpand = async (qnaId: number) => {
		if (expandedQna === qnaId) {
			setExpandedQna(null);
			return;
		}

		setExpandedQna(qnaId);

		// 이미 로드된 상세 정보가 있으면 재사용
		if (qnaDetails[qnaId]) {
			return;
		}

		try {
			const response = await getUserQnaDetail(qnaId);
			handleApiResponse(response, (data) => {
				setQnaDetails(prev => ({ ...prev, [qnaId]: data }));
			});
		} catch (err) {
			console.error('QnA 상세 정보 로드 실패:', err);
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

	// 쿼리파라미터로 전달된 qnaId가 있으면 해당 항목이 포함된 페이지로 이동 후 자동 펼침
	useEffect(() => {
		const paramId = Number(query.qnaId);
		if (!paramId) return;
		let cancelled = false;
		(async () => {
			try {
				// 현재 페이지에 있는지 먼저 확인
				if (qnaList?.items?.some((i: any) => i.qnaId === paramId)) {
					setPendingExpandId(paramId);
					return;
				}
				// 전체 페이지 탐색해서 포함된 페이지로 이동
				const first = await getUserQnaList({ page: 1, limit: pagination.pageSize, mineOnly: true } as any);
				const totalPages = (first as any)?.totalPages || 1;
				for (let p = 1; p <= totalPages; p++) {
					const res = p === 1 ? first : await getUserQnaList({ page: p, limit: pagination.pageSize, mineOnly: true } as any);
					const items = (res as any)?.items || [];
					if (items.some((i: any) => i.qnaId === paramId)) {
						if (!cancelled) {
							pagination.handlePageChange(p);
							setPendingExpandId(paramId);
						}
						break;
					}
				}
			} catch {}
		})();
		return () => { cancelled = true; };
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query.qnaId]);

	// 리스트가 로드되면 대기 중인 항목을 자동 펼침
	useEffect(() => {
		if (!pendingExpandId || !qnaList?.items) return;
		if (qnaList.items.some((i: any) => i.qnaId === pendingExpandId)) {
			handleQnaExpand(pendingExpandId);
			setPendingExpandId(null);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [qnaList]);

	const handleBack = () => {
		navigate(ROUTES.USER.DASHBOARD);
	};

	const formatDate = (dateString: string) => {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleDateString('ko-KR');
	};

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
					{qnaList.items.map((qna: any, index: number) => (
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
								<ThemedButton
									id={`expand-qna-${qna.qnaId}`}
									variant="outlined"
									size="small"
									onClick={() => handleQnaExpand(qna.qnaId)}
								>
									{expandedQna === qna.qnaId ? '접기' : '상세보기'}
								</ThemedButton>
							</ListItem>
							
							{expandedQna === qna.qnaId && (
								<Accordion expanded={true} sx={{ boxShadow: 'none' }}>
									<AccordionDetails>
										<Box sx={{ pl: 2, pr: 2, pb: 2 }}>
											<Typography variant="h6" gutterBottom>
												문의 내용
											</Typography>
											<Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
												{qna.content}
											</Typography>
											
											{qnaDetails[qna.qnaId]?.qna.answerContent && (
												<>
													<Divider sx={{ my: 2 }} />
													<Typography variant="h6" gutterBottom>
														답변
													</Typography>
													<Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
														{qnaDetails[qna.qnaId].qna.answerContent}
													</Typography>
													{qnaDetails[qna.qnaId].qna.answeredAt && (
														<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
															답변일: {qnaDetails[qna.qnaId].qna.answeredAt ? formatDate(qnaDetails[qna.qnaId].qna.answeredAt || '') : '-'}
														</Typography>
													)}
												</>
											)}
											<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
												<ThemedButton variant="dangerSoft" size="small" startIcon={<DeleteIcon />} onClick={() => onRequestDelete(qna.qnaId)}>
													삭제
												</ThemedButton>
											</Box>
										</Box>
									</AccordionDetails>
								</Accordion>
							)}
							
							{index < qnaList.items.length - 1 && <Divider />}
						</React.Fragment>
					))}
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