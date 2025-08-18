import { useState, useEffect } from 'react';
import { Box, Typography, Chip, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import { useDataFetching } from '../../hooks/useDataFetching';
import { getUserNoticeDetail, getUserNoticeList } from '../../api';
import { SPACING } from '../../constants/spacing';
import PageHeader from '../../components/common/PageHeader';

interface SimpleNoticeItem { noticeId: number; }

export default function NoticeDetail() {
  const navigate = useNavigate();
  const { noticeId } = useParams<{ noticeId: string }>();
  const muiTheme = useTheme();
  const colors = {
    primary: muiTheme.palette.primary.main,
    border: muiTheme.palette.divider,
    text: muiTheme.palette.text.primary,
    textSecondary: muiTheme.palette.text.secondary,
    background: muiTheme.palette.background.default,
  } as const;

  const [allNotices, setAllNotices] = useState<SimpleNoticeItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const {
    data: notice,
    isLoading,
    isEmpty,
    isError
  } = useDataFetching({
    fetchFunction: () => getUserNoticeDetail(Number(noticeId)),
    dependencies: [noticeId],
    autoFetch: !!noticeId
  });

  useEffect(() => {
    const fetchAllNotices = async () => {
      try {
        const response = await getUserNoticeList({ page: 1, limit: 1000 });
        const items: SimpleNoticeItem[] = (response as any)?.items ?? (response as any)?.notices ?? [];
        setAllNotices(items);
        const index = items.findIndex((n: any) => n.noticeId === Number(noticeId));
        setCurrentIndex(index);
      } catch (error) {
        console.error('전체 공지사항 목록 조회 실패:', error);
      }
    };

    if (noticeId) {
      fetchAllNotices();
    }
  }, [noticeId]);

  const handleBackToList = () => {
    navigate('/notice');
  };

  const handlePreviousNotice = () => {
    if (currentIndex > 0) {
      const prevNotice = allNotices[currentIndex - 1];
      navigate(`/notice/${prevNotice.noticeId}`);
    }
  };

  const handleNextNotice = () => {
    if (currentIndex < allNotices.length - 1) {
      const nextNotice = allNotices[currentIndex + 1];
      navigate(`/notice/${nextNotice.noticeId}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
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

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allNotices.length - 1;

  return (
    <Box id="notice-detail-page" sx={{ minHeight: '100vh', background: colors.background, py: SPACING.LARGE }}>
      <Box id="notice-detail-container" sx={{ mx: 'auto', px: { xs: SPACING.MEDIUM, md: SPACING.LARGE } }}>
        {/* 헤더 */}
        <Box id="notice-detail-header">
          <PageHeader title="공지사항" onBack={handleBackToList} />
        </Box>

        {/* 공지사항 상세 */}
        <ThemedCard id="notice-detail-card">
          {isLoading ? (
            <Box id="notice-detail-loading" sx={{ position: 'relative', minHeight: 400 }}>
              <LoadingSpinner loading={true} />
            </Box>
          ) : isError ? (
            <Box id="notice-detail-error">
              <EmptyState message="공지사항을 불러오는 중 오류가 발생했습니다." />
            </Box>
          ) : isEmpty ? (
            <Box id="notice-detail-empty">
              <EmptyState message="공지사항을 찾을 수 없습니다." />
            </Box>
          ) : notice ? (
            <Box id="notice-detail-body" sx={{ p: SPACING.LARGE }}>
              {/* 헤더 정보 */}
              <Box id="notice-detail-header" sx={{ mb: SPACING.LARGE }}>
                <Box id="notice-detail-header-row" sx={{ display: 'flex', alignItems: 'center', mb: SPACING.MEDIUM }}>
                  <Chip id="notice-detail-type" label={getNoticeTypeLabel((notice as any).noticeType)} color={getNoticeTypeColor((notice as any).noticeType) as any} size="medium" sx={{ mr: SPACING.MEDIUM }} />
                  {(notice as any).pinnedYn === 'Y' && (
                    <Chip id="notice-detail-pinned" label="고정" color="warning" size="medium" sx={{ mr: SPACING.MEDIUM }} />
                  )}
                  <Typography id="notice-detail-posted-at" variant="body2" sx={{ color: colors.textSecondary, ml: 'auto' }}>
                    {formatDate((notice as any).postedAt)}
                  </Typography>
                </Box>
                <Typography id="notice-detail-title" variant="h4" sx={{ color: colors.text, fontWeight: 600, mb: SPACING.MEDIUM }}>
                  {(notice as any).title}
                </Typography>
              </Box>

              <Divider id="notice-detail-divider" sx={{ mb: SPACING.LARGE }} />

              {/* 내용 */}
              <Box id="notice-detail-content" sx={{ mb: SPACING.LARGE }}>
                <Typography id="notice-detail-content-text" variant="body1" sx={{ color: colors.text, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {(notice as any).content}
                </Typography>
              </Box>

              {/* 네비게이션 버튼 */}
              <Box id="notice-detail-nav" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: SPACING.LARGE, borderTop: `1px solid ${colors.border}` }}>
                <ThemedButton id="notice-detail-prev-btn" variant="outlined" startIcon={<NavigateBefore />} onClick={handlePreviousNotice} disabled={!hasPrevious}>
                  이전글
                </ThemedButton>

                <ThemedButton id="notice-detail-list-btn" variant="outlined" onClick={handleBackToList}>
                  목록
                </ThemedButton>

                <ThemedButton id="notice-detail-next-btn" variant="outlined" endIcon={<NavigateNext />} onClick={handleNextNotice} disabled={!hasNext}>
                  다음글
                </ThemedButton>
              </Box>
            </Box>
          ) : null}
        </ThemedCard>
      </Box>
    </Box>
  );
} 