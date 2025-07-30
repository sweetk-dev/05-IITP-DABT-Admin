import { useState, useEffect } from 'react';
import { Box, Typography, Stack, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getThemeColors } from '../theme';
import ThemedCard from '../components/common/ThemedCard';
import PageTitle from '../components/common/PageTitle';
import ThemedButton from '../components/common/ThemedButton';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import SelectField from '../components/common/SelectField';
import { ArrowBack } from '@mui/icons-material';
import { PAGINATION } from '../constants/pagination';
import { useDataFetching } from '../hooks/useDataFetching';
import { usePagination } from '../hooks/usePagination';
import { getUserQnaList, getUserQnaListByType, getCommonCodesByGroupId } from '../api';
import type { QnaItem, CommonCodeItem } from '../types/api';

export default function QnaList() {
  const navigate = useNavigate();
  const theme = 'user';
  const colors = getThemeColors(theme);

  const [qnaType, setQnaType] = useState<string>('ALL');
  const [qnaTypeOptions, setQnaTypeOptions] = useState<{ value: string; label: string }[]>([
    { value: 'ALL', label: '전체' }
  ]);
  
  const pagination = usePagination({
    initialLimit: PAGINATION.DEFAULT_PAGE_SIZE
  });

  // Q&A 타입 옵션 조회
  const {
    data: qnaTypeCodes,
    isLoading: qnaTypeLoading,
    refetch: refetchQnaTypes
  } = useDataFetching({
    fetchFunction: () => getCommonCodesByGroupId('QNA_TYPE'),
    autoFetch: true
  });

  // Q&A 타입 옵션 설정
  useEffect(() => {
    if (qnaTypeCodes) {
      const options = [
        { value: 'ALL', label: '전체' },
        ...qnaTypeCodes.map((code: CommonCodeItem) => ({
          value: code.codeValue,
          label: code.codeName
        }))
      ];
      setQnaTypeOptions(options);
    }
  }, [qnaTypeCodes]);

  // Q&A 목록 조회
  const {
    data: qnaData,
    isLoading,
    isEmpty,
    isError,
    refetch
  } = useDataFetching({
    fetchFunction: () => {
      if (qnaType === 'ALL') {
        return getUserQnaList({
          page: pagination.currentPage,
          limit: pagination.pageSize
        });
      } else {
        return getUserQnaListByType(qnaType, {
          page: pagination.currentPage,
          limit: pagination.pageSize
        });
      }
    },
    dependencies: [pagination.currentPage, pagination.pageSize, qnaType],
    autoFetch: true
  });

  useEffect(() => {
    if (qnaData) {
      pagination.handlePageSizeChange(qnaData.limit);
    }
  }, [qnaData]);

  const handlePageChange = (page: number) => {
    pagination.handlePageChange(page);
  };

  const handleQnaTypeChange = (newQnaType: string) => {
    setQnaType(newQnaType);
    pagination.handlePageChange(1); // 첫 페이지로 이동
  };

  const handleQnaClick = (qnaId: number) => {
    navigate(`/qna/${qnaId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getQnaTypeLabel = (type: string) => {
    const option = qnaTypeOptions.find(opt => opt.value === type);
    return option ? option.label : type;
  };

  const maskAuthorName = (name: string) => {
    if (name.length <= 2) return name;
    return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: colors.background,
        py: 4
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, md: 4 }
        }}
      >
        {/* 헤더 */}
        <Box sx={{ mb: 4 }}>
          <ThemedButton
            theme={theme}
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ mb: 2 }}
          >
            홈으로
          </ThemedButton>
          <PageTitle title="Q&A" theme={theme} />
        </Box>

        {/* Q&A 타입 선택 */}
        <ThemedCard theme={theme} sx={{ mb: 3 }}>
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: colors.text,
                mb: 2,
                fontWeight: 500
              }}
            >
              Q&A 유형 선택
            </Typography>
            <SelectField
              value={qnaType}
              onChange={handleQnaTypeChange}
              options={qnaTypeOptions}
              label="Q&A 유형"
              theme={theme}
              disabled={qnaTypeLoading}
            />
          </Box>
        </ThemedCard>

        {/* Q&A 목록 */}
        <ThemedCard theme={theme}>
          {isLoading ? (
            <Box sx={{ position: 'relative', minHeight: 400 }}>
              <LoadingSpinner loading={true} />
            </Box>
          ) : isError ? (
            <EmptyState 
              message="Q&A를 불러오는 중 오류가 발생했습니다." 
              theme={theme}
            />
          ) : isEmpty ? (
            <EmptyState 
              message="등록된 Q&A가 없습니다." 
              theme={theme}
            />
          ) : (
            <>
              <Stack spacing={2}>
                {qnaData?.items.map((qna: QnaItem) => (
                  <Box
                    key={qna.qnaId}
                    onClick={() => handleQnaClick(qna.qnaId)}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      border: `1px solid ${colors.border}`,
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: `${colors.primary}15`,
                        borderColor: colors.primary,
                        transform: 'translateY(-1px)',
                        boxShadow: `0 4px 12px ${colors.primary}20`
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={qna.publicYn === 'Y' ? '공개' : '비공개'}
                        color={qna.publicYn === 'Y' ? 'success' : 'default'}
                        size="small"
                        sx={{ mr: 2, mb: 1 }}
                      />
                      <Chip
                        label={getQnaTypeLabel(qna.qnaType)}
                        color="primary"
                        size="small"
                        sx={{ mr: 2, mb: 1 }}
                      />
                      <Chip
                        label={qna.answeredYn === 'Y' ? '답변완료' : '답변대기'}
                        color={qna.answeredYn === 'Y' ? 'success' : 'warning'}
                        size="small"
                        sx={{ mr: 2, mb: 1 }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.textSecondary,
                          ml: 'auto',
                          mb: 1
                        }}
                      >
                        {formatDate(qna.postedAt)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: colors.text,
                        fontWeight: 500,
                        mb: 1
                      }}
                    >
                      {qna.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.textSecondary,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        mb: 1
                      }}
                    >
                      {qna.content}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.textSecondary,
                        opacity: 0.7
                      }}
                    >
                      작성자: {maskAuthorName(qna.authorName)}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              {/* 페이지네이션 */}
              {qnaData && qnaData.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={qnaData.totalPages}
                  onPageChange={handlePageChange}
                  theme={theme}
                />
              )}
            </>
          )}
        </ThemedCard>
      </Box>
    </Box>
  );
} 