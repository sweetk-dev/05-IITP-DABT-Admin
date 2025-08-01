import { useState, useEffect } from 'react';
import { Box, Typography, Stack, Chip, Divider } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getThemeColors } from '../theme';
import ThemedCard from '../components/common/ThemedCard';
import PageTitle from '../components/common/PageTitle';
import ThemedButton from '../components/common/ThemedButton';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowBack, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { useDataFetching } from '../hooks/useDataFetching';
import { getUserNoticeDetail, getUserNoticeList } from '../api';
import { SPACING } from '../constants/spacing';
import type { NoticeItem } from '../types/api';

export default function NoticeDetail() {
  const navigate = useNavigate();
  const { noticeId } = useParams<{ noticeId: string }>();
  const theme = 'user';
  const colors = getThemeColors(theme);

  const [allNotices, setAllNotices] = useState<NoticeItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const {
    data: notice,
    isLoading,
    isEmpty,
    isError,
    refetch
  } = useDataFetching({
    fetchFunction: () => getUserNoticeDetail(Number(noticeId)),
    dependencies: [noticeId],
    autoFetch: !!noticeId
  });

  // 전체 공지사항 목록을 가져와서 이전/다음 글 기능 구현
  useEffect(() => {
    const fetchAllNotices = async () => {
      try {
        const response = await getUserNoticeList({ page: 1, limit: 1000 });
        setAllNotices(response.items);
        
        // 현재 공지사항의 인덱스 찾기
        const index = response.items.findIndex(n => n.noticeId === Number(noticeId));
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
          maxWidth: 1000,
          mx: 'auto',
          //Ｐ가 이상하면 ４로 수정 현재는 ３임 
          px: { xs: SPACING.MEDIUM, md: SPACING.LARGE }
        }}
      >
        {/* 헤더 */}
      {/*Ｐ가 이상하면 ４로 수정 현재는 ３임 */}
        <Box sx={{ mb: SPACING.LARGE }}>
          <ThemedButton
            theme={theme}
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBackToList}
            sx={{ mb: SPACING.MEDIUM }}
          >
            목록으로
          </ThemedButton>
          <PageTitle title="공지사항" theme={theme} />
        </Box>

        {/* 공지사항 상세 */}
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
              message="공지사항을 찾을 수 없습니다." 
              theme={theme}
            />
          ) : notice ? (
            //Ｐ가 이상하면 ４로 수정 현재는 ３임 
            <Box sx={{ p: SPACING.LARGE }}>
              {/* 헤더 정보 */}
              <Box sx={{ mb: SPACING.LARGE }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: SPACING.MEDIUM }}>
                  <Chip
                    label={getNoticeTypeLabel(notice.noticeType)}
                    color={getNoticeTypeColor(notice.noticeType) as any}
                    size="medium"
                    sx={{ mr: SPACING.MEDIUM }}
                  />
                  {notice.pinnedYn === 'Y' && (
                    <Chip
                      label="고정"
                      color="warning"
                      size="medium"
                      sx={{ mr: SPACING.MEDIUM }}
                    />
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.textSecondary,
                      ml: 'auto'
                    }}
                  >
                    {formatDate(notice.postedAt)}
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: colors.text,
                    fontWeight: 600,
                    mb: SPACING.MEDIUM
                  }}
                >
                  {notice.title}
                </Typography>
              </Box>

              <Divider sx={{ mb: SPACING.LARGE }} />

              {/* 내용 */}
              {/*Ｐ가 이상하면 ４로 수정 현재는 ３임 */}
              <Box sx={{ mb: SPACING.LARGE }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: colors.text,
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {notice.content}
                </Typography>
              </Box>

              {/* 네비게이션 버튼 */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                pt: SPACING.LARGE,
                borderTop: `1px solid ${colors.border}`
              }}>
                <ThemedButton
                  theme={theme}
                  variant="outlined"
                  startIcon={<NavigateBefore />}
                  onClick={handlePreviousNotice}
                  disabled={!hasPrevious}
                >
                  이전글
                </ThemedButton>

                <ThemedButton
                  theme={theme}
                  variant="outlined"
                  onClick={handleBackToList}
                >
                  목록
                </ThemedButton>

                <ThemedButton
                  theme={theme}
                  variant="outlined"
                  endIcon={<NavigateNext />}
                  onClick={handleNextNotice}
                  disabled={!hasNext}
                >
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