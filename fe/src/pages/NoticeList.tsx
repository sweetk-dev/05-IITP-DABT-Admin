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
import { ArrowBack } from '@mui/icons-material';
import { PAGINATION } from '../constants/pagination';
import { SPACING } from '../constants/spacing';
import { useDataFetching } from '../hooks/useDataFetching';
import { usePagination } from '../hooks/usePagination';
import { getUserNoticeList } from '../api';
import type { NoticeItem } from '../types/api';

export default function NoticeList() {
  const navigate = useNavigate();
  const theme = 'user';
  const colors = getThemeColors(theme);

  const [noticeType, setNoticeType] = useState<string>('ALL');
  
  const pagination = usePagination({
    initialLimit: PAGINATION.DEFAULT_PAGE_SIZE
  });

  const {
    data: noticeData,
    isLoading,
    isEmpty,
    isError,
    refetch
  } = useDataFetching({
    fetchFunction: () => getUserNoticeList({
      page: pagination.currentPage,
      limit: pagination.pageSize,
      noticeType: noticeType === 'ALL' ? undefined : noticeType as 'G' | 'S' | 'E'
    }),
    dependencies: [pagination.currentPage, pagination.pageSize, noticeType],
    autoFetch: true
  });

  useEffect(() => {
    if (noticeData) {
      pagination.handlePageSizeChange(noticeData.limit);
    }
  }, [noticeData]);

  const handlePageChange = (page: number) => {
    pagination.handlePageChange(page);
  };

  const handleNoticeClick = (noticeId: number) => {
    navigate(`/notice/${noticeId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getNoticeTypeLabel = (type: string) => {
    switch (type) {
      case 'G': return '일반';
      case 'S': return '시스템';
      case 'E': return '긴급';
      default: return '기타';
    }
  };

  const getNoticeTypeColor = (type: string) => {
    switch (type) {
      case 'G': return 'default';
      case 'S': return 'info';
      case 'E': return 'error';
      default: return 'default';
    }
  };

  return (
    
    <Box
      sx={{
        minHeight: '100vh',
        background: colors.background,
        //Ｐ가 이상하면 ４로 수정 현재는 ３임
        py: SPACING.LARGE
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          //Ｐ가 이상하면 ４로 수정 현재는 ３임 
          px: { xs: SPACING.MEDIUM, md: SPACING.LARGE }
        }}
      >
        {/* 헤더 */}
        <Box sx={{ mb: SPACING.LARGE }}>
          <ThemedButton
            theme={theme}
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ mb: SPACING.MEDIUM }}
          >
            홈으로
          </ThemedButton>
          <PageTitle title="공지사항" theme={theme} />
        </Box>

        {/* 공지사항 목록 */}
        <ThemedCard theme={theme}>
          {isLoading ? (
            <Box sx={{ position: 'relative', minHeight: 400 }}>
              <LoadingSpinner loading={true} />
            </Box>
          ) : isError ? (
            <EmptyState 
              message="공지사항을 불러오는 중 오류가 발생했습니다." 
              theme={theme}
            />
          ) : isEmpty ? (
            <EmptyState 
              message="등록된 공지사항이 없습니다." 
              theme={theme}
            />
          ) : (
            <>
              <Stack spacing={SPACING.MEDIUM}>
                {noticeData?.items.map((notice: NoticeItem) => (
                  <Box
                    key={notice.noticeId}
                    onClick={() => handleNoticeClick(notice.noticeId)}
                    sx={{
                      p: SPACING.LARGE,
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: SPACING.SMALL }}>
                      <Chip
                        label={getNoticeTypeLabel(notice.noticeType)}
                        color={getNoticeTypeColor(notice.noticeType) as any}
                        size="small"
                        sx={{ mr: SPACING.MEDIUM }}
                      />
                      {notice.pinnedYn === 'Y' && (
                        <Chip
                          label="고정"
                          color="warning"
                          size="small"
                          sx={{ mr: SPACING.MEDIUM }}
                        />
                      )}
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.textSecondary,
                          ml: 'auto'
                        }}
                      >
                        {formatDate(notice.postedAt)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: colors.text,
                        fontWeight: 500,
                        mb: SPACING.SMALL
                      }}
                    >
                      {notice.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.textSecondary,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {notice.content}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              {/* 페이지네이션 */}
              {noticeData && noticeData.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={noticeData.totalPages}
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