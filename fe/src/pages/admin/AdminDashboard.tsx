import { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { SPACING } from '../../constants/spacing';
import ThemedButton from '../../components/common/ThemedButton';
import ThemedCard from '../../components/common/ThemedCard';
import PageHeader from '../../components/common/PageHeader';
import ErrorAlert from '../../components/ErrorAlert';
import { getThemeColors } from '../../theme';
import { useDataFetching } from '../../hooks/useDataFetching';
import { getAdminOpenApiStats } from '../../api/openApi';
import { getAdminQnaStats } from '../../api/qna';
import type { AdminQnaStatusRes, AdminOpenApiStatsRes } from '@iitp-dabt/common';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const colors = getThemeColors('admin');
  const [error, setError] = useState<string | null>(null);

  // QNA 통계 데이터 조회
  const {
    data: qnaStatsData,
    isLoading: qnaStatsLoading,
    isError: qnaStatsError,
    refetch: refetchQnaStats
  } = useDataFetching({
    fetchFunction: () => getAdminQnaStats(),
    autoFetch: true
  });

  // OpenAPI 통계 데이터 조회
  const {
    data: openApiStatsData,
    isLoading: openApiStatsLoading,
    isError: openApiStatsError,
    refetch: refetchOpenApiStats
  } = useDataFetching({
    fetchFunction: () => getAdminOpenApiStats(),
    autoFetch: true
  });

  // 에러 처리
  useEffect(() => {
    if (qnaStatsError || openApiStatsError) {
      setError('통계 데이터를 불러오는 중 오류가 발생했습니다.');
    } else {
      setError(null);
    }
  }, [qnaStatsError, openApiStatsError]);

  // 데이터 추출
  const qnaStats = qnaStatsData?.data as AdminQnaStatusRes;
  const openApiStats = openApiStatsData?.data as AdminOpenApiStatsRes;

  return (
    <Box id="admin-dashboard-page" sx={{ p: SPACING.LARGE }}>
      <Box sx={{ mb: SPACING.TITLE_BOTTOM }}>
        <PageHeader title="관리자 대시보드" />
      </Box>

      {/* 에러 알림 */}
      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}

      <Grid container spacing={SPACING.LARGE}>
        {/* 통계 카드 */}
        <Grid item xs={12} sm={6} md={3}>
          <ThemedCard sx={{ p: SPACING.LARGE, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: colors.text }}>
              총 사용자
            </Typography>
            <Typography variant="h4" sx={{ mt: SPACING.SMALL }}>
              {openApiStatsLoading ? '...' : (openApiStats?.total || 0)}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              활성 사용자 수
            </Typography>
          </ThemedCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <ThemedCard sx={{ p: SPACING.LARGE, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: colors.text }}>
              FAQ 게시물
            </Typography>
            <Typography variant="h4" sx={{ mt: SPACING.SMALL }}>
              {qnaStatsLoading ? '...' : (qnaStats?.total || 0)}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              등록된 FAQ 수
            </Typography>
          </ThemedCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <ThemedCard sx={{ p: SPACING.LARGE, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: colors.text }}>
              Q&A 문의
            </Typography>
            <Typography variant="h4" sx={{ mt: SPACING.SMALL }}>
              {qnaStatsLoading ? '...' : (qnaStats?.unanswered || 0)}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              대기 중인 문의
            </Typography>
          </ThemedCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <ThemedCard sx={{ p: SPACING.LARGE, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: colors.text }}>
              OpenAPI 키
            </Typography>
            <Typography variant="h4" sx={{ mt: SPACING.SMALL }}>
              {openApiStatsLoading ? '...' : (openApiStats?.active || 0)}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              활성 API 키 수
            </Typography>
          </ThemedCard>
        </Grid>

        {/* API 요청 대기 카드 - pending count가 있을 때만 표시 */}
        {openApiStats?.pending && openApiStats.pending > 0 && (
          <Grid item xs={12} sm={6} md={3}>
            <ThemedCard 
              sx={{ 
                p: SPACING.LARGE, 
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: '#fff3e0',
                border: '2px solid #ff9800',
                '&:hover': {
                  backgroundColor: '#ffe0b2',
                  borderColor: '#f57c00'
                }
              }}
              onClick={() => navigate(ROUTES.ADMIN.OPENAPI.REQUESTS)}
            >
              <Typography variant="h6" sx={{ color: '#e65100' }}>
                API 요청 대기
              </Typography>
              <Typography variant="h4" sx={{ mt: SPACING.SMALL, color: '#e65100' }}>
                {openApiStats.pending}
              </Typography>
              <Typography variant="body2" sx={{ color: '#e65100' }}>
                클릭하여 처리하기
              </Typography>
            </ThemedCard>
          </Grid>
        )}
      </Grid>
    </Box>
  );
} 