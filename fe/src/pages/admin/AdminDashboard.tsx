import { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { SPACING } from '../../constants/spacing';
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
    isError: qnaStatsError
  } = useDataFetching({
    fetchFunction: () => getAdminQnaStats(),
    autoFetch: true
  });

  // OpenAPI 통계 데이터 조회
  const {
    data: openApiStatsData,
    isLoading: openApiStatsLoading,
    isError: openApiStatsError
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
  const qnaStats = qnaStatsData as AdminQnaStatusRes;
  const openApiStats = openApiStatsData as AdminOpenApiStatsRes;

  return (
    <Box id="admin-dashboard-page" sx={{ p: SPACING.LARGE }}>
      <Box sx={{ mb: SPACING.TITLE_BOTTOM }}>
        <PageHeader title="관리자 대시보드" />
      </Box>

      {/* 에러 알림 */}
      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}

      {/* OpenAPI 상태 섹션 */}
      <Box sx={{ mb: SPACING.LARGE * 2 }}>
        <Typography variant="h5" sx={{ mb: SPACING.LARGE, color: colors.text, fontWeight: 'bold' }}>
          OpenAPI 키 상태
        </Typography>
        <Grid container spacing={SPACING.LARGE}>
          <Grid item xs={12} sm={6} md={3}>
            <ThemedCard sx={{ p: SPACING.LARGE, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: colors.text }}>
                총 API 키
              </Typography>
              <Typography variant="h4" sx={{ mt: SPACING.SMALL }}>
                {openApiStatsLoading ? '...' : (openApiStats?.total || 0)}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                전체 발급된 키 수
              </Typography>
            </ThemedCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ThemedCard sx={{ p: SPACING.LARGE, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: colors.text }}>
                활성 키
              </Typography>
              <Typography variant="h4" sx={{ mt: SPACING.SMALL, color: '#4caf50' }}>
                {openApiStatsLoading ? '...' : (openApiStats?.active || 0)}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                현재 사용 가능한 키
              </Typography>
            </ThemedCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ThemedCard sx={{ p: SPACING.LARGE, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: colors.text }}>
                만료된 키
              </Typography>
              <Typography variant="h4" sx={{ mt: SPACING.SMALL, color: '#ff9800' }}>
                {openApiStatsLoading ? '...' : (openApiStats?.expired || 0)}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                기간 만료된 키
              </Typography>
            </ThemedCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ThemedCard sx={{ p: SPACING.LARGE, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: colors.text }}>
                비활성 키
              </Typography>
              <Typography variant="h4" sx={{ mt: SPACING.SMALL, color: '#9e9e9e' }}>
                {openApiStatsLoading ? '...' : (openApiStats?.inactive || 0)}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                사용 중지된 키
              </Typography>
            </ThemedCard>
          </Grid>

          {/* 대기 중인 API 키 - 있을 때만 표시 */}
          {openApiStats?.pending !== undefined && openApiStats.pending > 0 && (
            <Grid item xs={12} sm={6} md={3}>
              <ThemedCard sx={{ 
                p: SPACING.LARGE, 
                textAlign: 'center',
                border: '2px solid #ff5722',
                backgroundColor: '#fff3e0'
              }}>
                <Typography variant="h6" sx={{ color: '#e65100' }}>
                  대기 중인 키
                </Typography>
                <Typography variant="h4" sx={{ mt: SPACING.SMALL, color: '#e65100' }}>
                  {openApiStatsLoading ? '...' : openApiStats.pending}
                </Typography>
                <Typography variant="body2" sx={{ color: '#e65100' }}>
                  승인 대기 중 ⚠️
                </Typography>
              </ThemedCard>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Q&A 상태 섹션 */}
      <Box>
        <Typography variant="h5" sx={{ mb: SPACING.LARGE, color: colors.text, fontWeight: 'bold' }}>
          Q&A 문의 상태
        </Typography>
        <Grid container spacing={SPACING.LARGE}>
          <Grid item xs={12} sm={6} md={3}>
            <ThemedCard sx={{ p: SPACING.LARGE, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: colors.text }}>
                총 문의
              </Typography>
              <Typography variant="h4" sx={{ mt: SPACING.SMALL }}>
                {qnaStatsLoading ? '...' : (qnaStats?.total || 0)}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                전체 문의 건수
              </Typography>
            </ThemedCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ThemedCard sx={{ p: SPACING.LARGE, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: colors.text }}>
                답변 완료
              </Typography>
              <Typography variant="h4" sx={{ mt: SPACING.SMALL, color: '#4caf50' }}>
                {qnaStatsLoading ? '...' : (qnaStats?.answered || 0)}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                답변 완료된 문의
              </Typography>
            </ThemedCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ThemedCard 
              sx={{ 
                p: SPACING.LARGE, 
                textAlign: 'center',
                cursor: qnaStats?.unanswered > 0 ? 'pointer' : 'default',
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
                ...(qnaStats?.unanswered > 0 ? {
                  // 클릭 가능한 상태 - 긴급 처리 필요
                  border: '2px solid #f44336',
                  backgroundColor: '#ffebee',
                  boxShadow: '0 2px 4px rgba(244, 67, 54, 0.1)',
                  '&:hover': {
                    backgroundColor: '#ffcdd2',
                    borderColor: '#d32f2f',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 12px rgba(244, 67, 54, 0.3)'
                  },
                  '&:active': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 8px rgba(244, 67, 54, 0.2)'
                  },
                  // 클릭 가능함을 나타내는 시각적 표시
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 8,
                    height: 8,
                    backgroundColor: '#f44336',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  },
                  '@keyframes pulse': {
                    '0%': {
                      opacity: 1,
                      transform: 'scale(1)'
                    },
                    '50%': {
                      opacity: 0.7,
                      transform: 'scale(1.2)'
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'scale(1)'
                    }
                  }
                } : {
                  // 클릭 불가능한 상태 - 일반 카드
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.background
                })
              }}
              onClick={qnaStats?.unanswered > 0 ? () => {
                // Q&A 관리 페이지로 이동하면서 미답변 필터 적용
                navigate(`${ROUTES.ADMIN.QNA.LIST}?answeredYn=N`);
              } : undefined}
            >
              <Typography variant="h6" sx={{ 
                color: qnaStats?.unanswered > 0 ? '#c62828' : colors.text,
                fontWeight: qnaStats?.unanswered > 0 ? 'bold' : 'normal'
              }}>
                미답변
              </Typography>
              <Typography variant="h4" sx={{ 
                mt: SPACING.SMALL, 
                color: qnaStats?.unanswered > 0 ? '#c62828' : 'inherit',
                fontWeight: qnaStats?.unanswered > 0 ? 'bold' : 'normal'
              }}>
                {qnaStatsLoading ? '...' : (qnaStats?.unanswered || 0)}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: qnaStats?.unanswered > 0 ? '#c62828' : colors.textSecondary,
                fontWeight: qnaStats?.unanswered > 0 ? '500' : 'normal',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5
              }}>
                {qnaStats?.unanswered > 0 ? (
                  <>
                    📋 클릭하여 처리하기
                  </>
                ) : (
                  '답변 대기 중'
                )}
              </Typography>
              
              {/* 클릭 가능한 상태일 때 화살표 아이콘 추가 */}
              {qnaStats?.unanswered > 0 && (
                <Box sx={{ 
                  position: 'absolute',
                  bottom: 8,
                  right: 12,
                  color: '#c62828',
                  fontSize: '1.2rem',
                  opacity: 0.7
                }}>
                  →
                </Box>
              )}
            </ThemedCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ThemedCard sx={{ p: SPACING.LARGE, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: colors.text }}>
                답변률
              </Typography>
              <Typography variant="h4" sx={{ mt: SPACING.SMALL, color: '#2196f3' }}>
                {qnaStatsLoading ? '...' : 
                  qnaStats?.total > 0 
                    ? `${Math.round((qnaStats.answered / qnaStats.total) * 100)}%`
                    : '0%'
                }
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                전체 문의 대비 답변률
              </Typography>
            </ThemedCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
} 