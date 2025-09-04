import { useState, useEffect } from 'react';
import { Box, Stack, Chip, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ROUTES, ROUTE_META } from '../../routes';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ListScaffold from '../../components/common/ListScaffold';
import ListItemCard from '../../components/common/ListItemCard';
import ThemedButton from '../../components/common/ThemedButton';
import StatusChip from '../../components/common/StatusChip';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { getAdminQnaList, deleteAdminQnaList } from '../../api/qna';
import { getCommonCodesByGroupId } from '../../api';
import { useDataFetching } from '../../hooks/useDataFetching';
import { usePagination } from '../../hooks/usePagination';
import { PAGINATION } from '../../constants/pagination';
import { SPACING } from '../../constants/spacing';
import { formatYmdHm } from '../../utils/date';
//import { hasContentEditPermission } from '../../utils/auth';
//import { getAdminRole } from '../../store/user';
import { COMMON_CODE_GROUPS } from '@iitp-dabt/common';
import type { AdminQnaListItem, AdminQnaListQuery } from '@iitp-dabt/common';

export default function QnaManage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  //const adminRole = getAdminRole();

  // ROUTE_META에서 페이지 정보 동적 가져오기
  const pageMeta = (ROUTE_META as any)[ROUTES.ADMIN.QNA.LIST];

  // URL 쿼리 파라미터에서 초기 필터 값 읽기
  const initialAnsweredYn = searchParams.get('answeredYn') || '';
  const initialQnaType = searchParams.get('qnaType') || '';
  const initialSearchTerm = searchParams.get('search') || '';

  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState(initialQnaType);
  const [selectedStatus, setSelectedStatus] = useState(initialAnsweredYn);
  
  // 선택된 Q&A 항목들
  const [selectedQnas, setSelectedQnas] = useState<number[]>([]);
  
  // 페이지네이션
  const pagination = usePagination({ initialLimit: PAGINATION.DEFAULT_PAGE_SIZE });
  
  // 공통 코드 조회 (QNA 타입)
  const { data: qnaTypeCodes, isLoading: qnaTypeLoading } = useDataFetching({ 
    fetchFunction: () => getCommonCodesByGroupId(COMMON_CODE_GROUPS.QNA_TYPE), 
    autoFetch: true 
  });
  
  // QNA 타입 옵션 생성 (User QnaList와 동일한 방식)
  const [qnaTypeOptions, setQnaTypeOptions] = useState<{ value: string; label: string }[]>([
    { value: '', label: '전체' }
  ]);
  
  useEffect(() => {
    if (qnaTypeCodes?.codes) {
      const options = [
        { value: '', label: '전체' },
        ...qnaTypeCodes.codes.map((code: any) => ({ 
          value: code.codeId, 
          label: code.codeNm 
        }))
      ];
      setQnaTypeOptions(options);
    }
  }, [qnaTypeCodes]);
  
  // API 데이터 페칭
  const {
    data: qnaData,
    isLoading,
    isError,
    refetch,
    status
  } = useDataFetching({
    fetchFunction: () => getAdminQnaList({
      page: pagination.currentPage,
      limit: pagination.pageSize,
      ...(searchTerm && { searchTerm }),
      ...(selectedCategory && { qnaType: selectedCategory }),
      ...(selectedStatus && { answeredYn: selectedStatus })
    } as AdminQnaListQuery),
    dependencies: [pagination.currentPage, pagination.pageSize, searchTerm, selectedCategory, selectedStatus]
  });

  // error 상태 추출 - useDataFetching의 state에서 error 추출
  const error = status === 'error' ? (qnaData as any)?.error : undefined;

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    pagination.handlePageChange(page);
  };


  // 필터 변경 시 자동 refetch
  useEffect(() => {
    refetch();
  }, [selectedCategory, selectedStatus, refetch]);

  // QNA 타입별 라벨 (User QnaList와 동일한 방식)
  const getTypeLabel = (qnaType: string) => {
    const option = qnaTypeOptions.find(opt => opt.value === qnaType);
    return option ? option.label : qnaType;
  };

  // QNA 타입별 색상
  const getTypeColor = (qnaType: string): 'primary' | 'info' | 'success' | 'warning' | 'default' => {
    const option = qnaTypeOptions.find(opt => opt.value === qnaType);
    if (!option) return 'default';
    
    // qnaTypeOptions의 순서에 따라 색상 매핑
    const colors: ('primary' | 'info' | 'success' | 'warning' | 'default')[] = ['primary', 'info', 'success', 'warning'];
    const index = qnaTypeOptions.findIndex(opt => opt.value === qnaType);
    return index >= 0 && index < colors.length ? colors[index] : 'default';
  };

  // 답변 상태별 라벨
  const getAnsweredLabel = (answeredYn: string) => {
    switch (answeredYn) {
      case 'Y': return '답변완료';
      case 'N': return '답변대기';
      default: return answeredYn;
    }
  };

  // 답변 상태별 색상
  const getAnsweredColor = (answeredYn: string): 'success' | 'warning' => {
    switch (answeredYn) {
      case 'Y': return 'success';
      case 'N': return 'warning';
      default: return 'warning';
    }
  };

  // 개별 Q&A 선택/해제
  const handleQnaSelect = (qnaId: number, checked: boolean) => {
    if (checked) {
      setSelectedQnas(prev => [...prev, qnaId]);
    } else {
      setSelectedQnas(prev => prev.filter(id => id !== qnaId));
    }
  };





  const handleQnaClick = (qnaId: number) => {
    navigate(ROUTES.ADMIN.QNA.DETAIL.replace(':id', String(qnaId)));
  };

  const handleReplyQna = (qnaId: number) => {
    navigate(ROUTES.ADMIN.QNA.REPLY.replace(':id', qnaId.toString()));
  };

  const isEmpty = !qnaData?.items || qnaData.items.length === 0;

  if (isLoading) {
    return <LoadingSpinner loading={true} />;
  }

  if (isError && error) {
    return <ErrorAlert error={error} />;
  }

  return (
    <Box id="admin-qna-manage-page">
      <AdminPageHeader />

      <Box sx={{ p: SPACING.LARGE }}>
        <ListScaffold
          title={pageMeta?.title || 'Q&A 관리'}
          loading={isLoading}
          emptyText={isEmpty ? '등록된 Q&A가 없습니다.' : ''}
          search={{
            value: searchTerm,
            onChange: (v) => { setSearchTerm(v); pagination.handlePageChange(1); },
            placeholder: 'Q&A 제목 또는 작성자로 검색'
          }}

          filters={[
            {
              label: '타입',
              value: selectedCategory,
              options: qnaTypeLoading ? [
                { value: '', label: '로딩 중...' }
              ] : qnaTypeOptions,
              onChange: setSelectedCategory
            },
            {
              label: '답변상태',
              value: selectedStatus,
              options: [
                { value: '', label: '전체' },
                { value: 'Y', label: '답변완료' },
                { value: 'N', label: '답변대기' }
              ],
              onChange: setSelectedStatus
            }
          ]}
          pagination={{
            page: pagination.currentPage,
            totalPages: qnaData?.totalPages || 0,
            onPageChange: handlePageChange,
            pageSize: pagination.pageSize,
            onPageSizeChange: (size) => {
              pagination.handlePageSizeChange(size);
            }
          }}
          wrapInCard={false}
          selectable={{
            enabled: true,
            items: qnaData?.items || [],
            getId: (qna) => qna.qnaId,
            onSelectionChange: (selected) => setSelectedQnas(selected as number[]),
            renderCheckbox: true,
            deleteConfig: {
              apiFunction: async (ids: (number | string)[]) => {
                // LIST_DELETE API 호출 - 일괄 삭제
                await deleteAdminQnaList(ids);
              },
              confirmTitle: 'Q&A 삭제 확인',
              confirmMessage: '선택된 Q&A들을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.',
              successMessage: '선택된 Q&A들이 삭제되었습니다.',
              errorMessage: 'Q&A 삭제 중 오류가 발생했습니다.',
              onDeleteSuccess: () => {
                refetch();
              }
            }
          }}
        >
          <Stack id="qna-list-stack" spacing={SPACING.MEDIUM}>
            {qnaData?.items.map((qna: AdminQnaListItem) => (
              <ListItemCard 
                id={`qna-item-${qna.qnaId}`} 
                key={qna.qnaId} 
                onClick={() => handleQnaClick(qna.qnaId)}
              >
                <Box id={`qna-item-header-${qna.qnaId}`} sx={{ display: 'flex', alignItems: 'center', mb: SPACING.SMALL }}>
                  <Box 
                    onClick={(e) => e.stopPropagation()} 
                    sx={{ mr: SPACING.SMALL }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedQnas.includes(qna.qnaId)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleQnaSelect(qna.qnaId, e.target.checked);
                          }}
                          size="small"
                        />
                      }
                      label=""
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Box>
                  <Chip
                    id={`qna-item-type-${qna.qnaId}`}
                    label={getTypeLabel(qna.qnaType)} 
                    color={getTypeColor(qna.qnaType)}
                    size="small"
                    sx={{ mr: SPACING.MEDIUM }} 
                  />
                  {qna.secretYn === 'Y' && (
                    <Chip
                      id={`qna-item-secret-${qna.qnaId}`}
                      label="비공개"
                      size="small"
                      color="warning"
                      variant="outlined"
                      sx={{ mr: SPACING.MEDIUM }}
                    />
                  )}
                  <StatusChip
                    id={`qna-item-status-${qna.qnaId}`}
                    label={getAnsweredLabel(qna.answeredYn)}
                    kind={getAnsweredColor(qna.answeredYn)}
                    size="small"
                    sx={{ ml: 'auto' }}
                  />
                </Box>
                
                <Typography 
                  id={`qna-item-title-${qna.qnaId}`} 
                  variant="subtitle1" 
                  sx={{ color: 'text.primary', fontWeight: 600, mb: SPACING.SMALL }}
                >
                  {qna.title}
                </Typography>
                
                <Typography 
                  id={`qna-item-content-${qna.qnaId}`} 
                  variant="body2" 
                  sx={{ color: 'text.secondary', mb: SPACING.SMALL }}
                >
                  {qna.title}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: SPACING.SMALL }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    작성자: {qna.writerName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {formatYmdHm(qna.createdAt)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: SPACING.SMALL }}>
                  {qna.answeredYn === 'N' && (
                    <ThemedButton
                      variant="primary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReplyQna(qna.qnaId);
                      }}
                    >
                      답변
                    </ThemedButton>
                  )}
                </Box>
              </ListItemCard>
            ))}
          </Stack>
        </ListScaffold>
      </Box>
    </Box>
  );
}


