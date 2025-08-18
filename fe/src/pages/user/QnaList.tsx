import { useState, useEffect } from 'react';
import { Box, Typography, Stack, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ThemedButton from '../../components/common/ThemedButton';
import { useNavigate } from 'react-router-dom';
import ThemedCard from '../../components/common/ThemedCard';
// import PageTitle from '../components/common/PageTitle';
// import ThemedButton from '../components/common/ThemedButton';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import SelectField from '../../components/common/SelectField';
import ListHeader from '../../components/common/ListHeader';
import { useQuerySync } from '../../hooks/useQuerySync';
import { useErrorHandler, type UseErrorHandlerResult } from '../../hooks/useErrorHandler';
// import { ArrowBack } from '@mui/icons-material';
import { PAGINATION } from '../../constants/pagination';
import { SPACING } from '../../constants/spacing';
import { useDataFetching } from '../../hooks/useDataFetching';
import { usePagination } from '../../hooks/usePagination';
import { getUserQnaList, getUserQnaListByType, getCommonCodesByGroupId } from '../../api';
import type { UserQnaItem, CommonCodeByGroupRes } from '@iitp-dabt/common';

export default function QnaList() {
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const colors = {
    primary: muiTheme.palette.primary.main,
    border: muiTheme.palette.divider,
    text: muiTheme.palette.text.primary,
    textSecondary: muiTheme.palette.text.secondary,
    background: muiTheme.palette.background.default,
  } as const;

  const [qnaType, setQnaType] = useState<string>('ALL');
  const [qnaTypeOptions, setQnaTypeOptions] = useState<{ value: string; label: string }[]>([
    { value: 'ALL', label: '전체' }
  ]);
  
  const pagination = usePagination({ initialLimit: PAGINATION.DEFAULT_PAGE_SIZE });
  const { query, setQuery } = useQuerySync({ page: 1, limit: pagination.pageSize, qnaType: 'ALL', search: '', status: '' });
  const errorHandler: UseErrorHandlerResult = useErrorHandler();

  // sync query → pagination/state
  useEffect(() => {
    const qp = Number(query.page) || 1;
    if (qp !== pagination.currentPage) pagination.handlePageChange(qp);
    const ql = Number(query.limit) || PAGINATION.DEFAULT_PAGE_SIZE;
    if (ql !== pagination.pageSize) pagination.handlePageSizeChange(ql);
    if ((query.qnaType || 'ALL') !== qnaType) setQnaType((query.qnaType as string) || 'ALL');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, query.limit, query.qnaType]);

  const { data: qnaTypeCodes, isLoading: qnaTypeLoading } = useDataFetching({ fetchFunction: () => getCommonCodesByGroupId('qna_type'), autoFetch: true });

  useEffect(() => {
    if (qnaTypeCodes) {
      const codes = (qnaTypeCodes as CommonCodeByGroupRes).codes || [];
      const options = [ { value: 'ALL', label: '전체' }, ...codes.map((code: any) => ({ value: code.codeId, label: code.codeNm })) ];
      setQnaTypeOptions(options);
    }
  }, [qnaTypeCodes]);

  const { data: qnaData, isLoading, isEmpty, isError } = useDataFetching({
    fetchFunction: () => (qnaType === 'ALL' ? getUserQnaList({ page: pagination.currentPage, limit: pagination.pageSize, search: query.search || undefined }) : getUserQnaListByType(qnaType, { page: pagination.currentPage, limit: pagination.pageSize })),
    dependencies: [pagination.currentPage, pagination.pageSize, qnaType, query.search],
    autoFetch: true,
    onError: (msg) => errorHandler.setInlineError(msg)
  });

  useEffect(() => { if (qnaData) pagination.handlePageSizeChange(qnaData.limit); }, [qnaData]);

  const handlePageChange = (page: number) => { pagination.handlePageChange(page); setQuery({ page }, { replace: true }); };
  const handleQnaTypeChange = (newQnaType: string) => { setQnaType(newQnaType); setQuery({ qnaType: newQnaType, page: 1 }); pagination.handlePageChange(1); };
  const handleQnaClick = (qnaId: number) => { navigate(`/qna/${qnaId}`); };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const getQnaTypeLabel = (type: string) => qnaTypeOptions.find(opt => opt.value === type)?.label ?? type;
  const maskAuthorName = (name: string) => (name.length <= 2 ? name : name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1));

  const handleCreateQna = () => {
    // 로그인 여부에 따라 분기: 미로그인 → 로그인 후 돌아오기
    const isLoggedIn = localStorage.getItem('accessToken');
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/user/qna/create' } });
      return;
    }
    navigate('/user/qna/create');
  };

  return (
    <Box id="qna-list-page" sx={{ minHeight: '100vh', background: colors.background, py: SPACING.LARGE }}>
      <Box id="qna-list-container" sx={{ mx: 'auto', px: { xs: SPACING.MEDIUM, md: SPACING.LARGE } }}>
        {errorHandler.InlineError}

        {/* 헤더 */}
        <ListHeader
          title="Q&A"
          onBack={() => navigate('/')}
          searchPlaceholder="제목/내용 검색"
          searchValue={query.search || ''}
          onSearchChange={(v) => setQuery({ search: v, page: 1 })}
          filters={[{ label: '유형', value: qnaType, options: qnaTypeOptions, onChange: (v: string) => handleQnaTypeChange(v || 'ALL') }]}
          totalCount={qnaData?.total}
        />
        <Box id="qna-create-button-row" sx={{ display: 'flex', justifyContent: 'flex-end', mb: SPACING.MEDIUM }}>
          <ThemedButton id="qna-create-button" variant="primary" onClick={handleCreateQna}>문의하기</ThemedButton>
        </Box>

        {/* Q&A 타입 선택 */}
        <ThemedCard id="qna-type-card" sx={{ mb: SPACING.LARGE }}>
          <Box id="qna-type-card-body" sx={{ p: SPACING.LARGE }}>
            <Typography id="qna-type-title" variant="h6" sx={{ color: colors.text, mb: SPACING.MEDIUM, fontWeight: 500 }}>Q&A 유형 선택</Typography>
            <Box id="qna-type-select">
              <SelectField value={qnaType} onChange={handleQnaTypeChange} options={qnaTypeOptions} label="Q&A 유형" disabled={qnaTypeLoading} />
            </Box>
          </Box>
        </ThemedCard>

        {/* Q&A 목록 */}
        <ThemedCard id="qna-list-card">
          {isLoading ? (
            <Box id="qna-list-loading" sx={{ position: 'relative', minHeight: 400 }}>
              <LoadingSpinner loading={true} />
            </Box>
          ) : isError ? (
            <EmptyState message="Q&A를 불러오는 중 오류가 발생했습니다." />
          ) : isEmpty ? (
            <EmptyState message="등록된 Q&A가 없습니다." />
          ) : (
            <>
              <Stack id="qna-list-stack" spacing={2}>
                {qnaData?.items.map((qna: UserQnaItem) => (
                  <Box id={`qna-item-${qna.qnaId}`} key={qna.qnaId} onClick={() => handleQnaClick(qna.qnaId)} sx={{ p: 3, borderRadius: 2, cursor: 'pointer', transition: 'all 0.2s ease-in-out', border: `1px solid ${colors.border}`, backgroundColor: 'transparent', '&:hover': { backgroundColor: `${colors.primary}15`, borderColor: colors.primary, transform: 'translateY(-1px)', boxShadow: `0 4px 12px ${colors.primary}20` } }}>
                    <Box id={`qna-item-header-${qna.qnaId}`} sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
                      {/* 공개 여부 필드는 타입에 없으므로 생략 또는 별도 매핑 필요 */}
                      <Chip id={`qna-item-type-${qna.qnaId}`} label={getQnaTypeLabel(qna.qnaType)} color="primary" size="small" sx={{ mr: 2, mb: 1 }} />
                      <Chip id={`qna-item-status-${qna.qnaId}`} label={qna.answeredYn === 'Y' ? '답변완료' : '답변대기'} color={qna.answeredYn === 'Y' ? 'success' : 'warning'} size="small" sx={{ mr: 2, mb: 1 }} />
                      <Typography id={`qna-item-date-${qna.qnaId}`} variant="caption" sx={{ color: colors.textSecondary, ml: 'auto', mb: 1 }}>{formatDate(qna.createdAt)}</Typography>
                    </Box>
                    <Typography id={`qna-item-title-${qna.qnaId}`} variant="h6" sx={{ color: colors.text, fontWeight: 500, mb: 1 }}>{qna.title}</Typography>
                    <Typography id={`qna-item-content-${qna.qnaId}`} variant="body2" sx={{ color: colors.textSecondary, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', mb: 1 }}>{qna.content}</Typography>
                    <Typography id={`qna-item-writer-${qna.qnaId}`} variant="caption" sx={{ color: colors.textSecondary, opacity: 0.7 }}>작성자: {maskAuthorName(qna.writerName)}</Typography>
                  </Box>
                ))}
              </Stack>

              {qnaData && qnaData.totalPages > 0 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={qnaData.totalPages}
                  onPageChange={handlePageChange}
                  pageSize={pagination.pageSize}
                  onPageSizeChange={(size) => { pagination.handlePageSizeChange(size); setQuery({ limit: size, page: 1 }); }}
                />
              )}
            </>
          )}
        </ThemedCard>
      </Box>
    </Box>
  );
} 