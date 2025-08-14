import { useEffect } from 'react';
import { Box, Typography, Stack, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
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

interface NoticeItem { noticeId: number; title: string; content: string; noticeType: string; postedAt: string; pinnedYn?: 'Y' | 'N'; }

export default function NoticeList() {
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const colors = {
    primary: muiTheme.palette.primary.main,
    border: muiTheme.palette.divider,
    text: muiTheme.palette.text.primary,
    textSecondary: muiTheme.palette.text.secondary,
    background: muiTheme.palette.background.default,
  } as const;

  const pagination = usePagination({
    initialLimit: PAGINATION.DEFAULT_PAGE_SIZE
  });

  const { data: noticeData, isLoading, isEmpty, isError } = useDataFetching({
    fetchFunction: () => getUserNoticeList({ page: pagination.currentPage, limit: pagination.pageSize }),
    dependencies: [pagination.currentPage, pagination.pageSize],
    autoFetch: true
  });

  useEffect(() => { if (noticeData) pagination.handlePageSizeChange(noticeData.limit); }, [noticeData]);

  const handlePageChange = (page: number) => { pagination.handlePageChange(page); };
  const handleNoticeClick = (noticeId: number) => { navigate(`/notice/${noticeId}`); };
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const getNoticeTypeLabel = (type: string) => (type === 'G' ? '일반' : type === 'S' ? '시스템' : type === 'E' ? '긴급' : '기타');
  const getNoticeTypeColor = (type: string) => (type === 'S' ? 'info' : type === 'E' ? 'error' : 'default');

  return (
    <Box id="notice-list-page" sx={{ minHeight: '100vh', background: colors.background, py: SPACING.LARGE }}>
      <Box id="notice-list-container" sx={{ mx: 'auto', px: { xs: SPACING.MEDIUM, md: SPACING.LARGE } }}>
        {/* 헤더 */}
        <Box sx={{ mb: SPACING.LARGE }}>
          <ThemedButton variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mb: SPACING.MEDIUM }}>
            홈으로
          </ThemedButton>
          <PageTitle title="공지사항" />
        </Box>

        {/* 공지사항 목록 */}
        <ThemedCard>
          {isLoading ? (
            <Box sx={{ position: 'relative', minHeight: 400 }}>
              <LoadingSpinner loading={true} />
            </Box>
          ) : isError ? (
            <EmptyState message="공지사항을 불러오는 중 오류가 발생했습니다." />
          ) : isEmpty ? (
            <EmptyState message="등록된 공지사항이 없습니다." />
          ) : (
            <>
              <Stack spacing={SPACING.MEDIUM}>
                {noticeData?.items.map((notice: NoticeItem) => (
                  <Box key={notice.noticeId} onClick={() => handleNoticeClick(notice.noticeId)} sx={{ p: SPACING.LARGE, borderRadius: 2, cursor: 'pointer', transition: 'all 0.2s ease-in-out', border: `1px solid ${colors.border}`, backgroundColor: 'transparent', '&:hover': { backgroundColor: `${colors.primary}15`, borderColor: colors.primary, transform: 'translateY(-1px)', boxShadow: `0 4px 12px ${colors.primary}20` } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: SPACING.SMALL }}>
                      <Chip label={getNoticeTypeLabel(notice.noticeType)} color={getNoticeTypeColor(notice.noticeType) as any} size="small" sx={{ mr: SPACING.MEDIUM }} />
                      {notice.pinnedYn === 'Y' && <Chip label="고정" color="warning" size="small" sx={{ mr: SPACING.MEDIUM }} />}
                      <Typography variant="caption" sx={{ color: colors.textSecondary, ml: 'auto' }}>{formatDate(notice.postedAt)}</Typography>
                    </Box>
                    <Typography variant="h6" sx={{ color: colors.text, fontWeight: 500, mb: SPACING.SMALL }}>{notice.title}</Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>{notice.content}</Typography>
                  </Box>
                ))}
              </Stack>

              {noticeData && noticeData.totalPages > 1 && (
                <Pagination currentPage={pagination.currentPage} totalPages={noticeData.totalPages} onPageChange={handlePageChange} />
              )}
            </>
          )}
        </ThemedCard>
      </Box>
    </Box>
  );
} 