import { Box, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { SPACING } from '../../constants/spacing';
import ThemedButton from '../../components/common/ThemedButton';
import ThemedCard from '../../components/common/ThemedCard';
import PageTitle from '../../components/common/PageTitle';
import { getThemeColors } from '../../theme';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const colors = getThemeColors('admin');

  return (
    <Box id="admin-dashboard-page" sx={{ p: SPACING.LARGE }}>
      <Box sx={{ mb: SPACING.TITLE_BOTTOM }}>
        <PageTitle title="관리자 대시보드" />
      </Box>

      <Grid container spacing={SPACING.LARGE}>
        {/* 통계 카드 */}
        <Grid item xs={12} sm={6} md={3}>
          <ThemedCard sx={{ p: SPACING.LARGE, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: colors.text }}>
              총 사용자
            </Typography>
            <Typography variant="h4" sx={{ mt: SPACING.SMALL }}>
              1,234
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
              56
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
              89
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              대기 중인 문의
            </Typography>
          </ThemedCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <ThemedCard sx={{ p: SPACING.LARGE, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: colors.text }}>
              오늘 방문자
            </Typography>
            <Typography variant="h4" sx={{ mt: SPACING.SMALL }}>
              234
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              일일 방문자 수
            </Typography>
          </ThemedCard>
        </Grid>

        {/* 관리 메뉴 */}
        <Grid item xs={12}>
          <ThemedCard sx={{ p: SPACING.LARGE }}>
            <Typography variant="h6" sx={{ mb: SPACING.MEDIUM }}>
              관리 메뉴
            </Typography>
            <Grid container spacing={SPACING.MEDIUM}>
              <Grid item>
                <ThemedButton 
                  
                  variant="primary" 
                  onClick={() => navigate(ROUTES.ADMIN.FAQ.LIST)}
                  id="admin-dashboard-faq-btn"
                >
                  FAQ 관리
                </ThemedButton>
              </Grid>
              <Grid item>
                <ThemedButton 
                  
                  variant="primary" 
                  onClick={() => navigate(ROUTES.ADMIN.QNA.LIST)}
                  id="admin-dashboard-qna-btn"
                >
                  Q&A 관리
                </ThemedButton>
              </Grid>
              <Grid item>
                <ThemedButton 
                  
                  variant="primary" 
                  onClick={() => navigate(ROUTES.ADMIN.USERS.LIST)}
                  id="admin-dashboard-users-btn"
                >
                  사용자 관리
                </ThemedButton>
              </Grid>
              <Grid item>
                <ThemedButton 
                  
                  variant="primary" 
                  onClick={() => navigate(ROUTES.ADMIN.SETTINGS)}
                  id="admin-dashboard-settings-btn"
                >
                  시스템 설정
                </ThemedButton>
              </Grid>
            </Grid>
          </ThemedCard>
        </Grid>

        {/* 최근 활동 */}
        <Grid item xs={12} md={6}>
          <ThemedCard sx={{ p: SPACING.LARGE }}>
            <Typography variant="h6" sx={{ mb: SPACING.MEDIUM }}>
              최근 활동
            </Typography>
            <Box>
              <Typography variant="body2" sx={{ mb: SPACING.SMALL }}>
                • 새로운 사용자 가입: user@example.com (2분 전)
              </Typography>
              <Typography variant="body2" sx={{ mb: SPACING.SMALL }}>
                • FAQ 업데이트: "API 사용법" (15분 전)
              </Typography>
              <Typography variant="body2" sx={{ mb: SPACING.SMALL }}>
                • Q&A 답변 완료: "로그인 오류" (1시간 전)
              </Typography>
              <Typography variant="body2" sx={{ mb: SPACING.SMALL }}>
                • 시스템 백업 완료 (2시간 전)
              </Typography>
            </Box>
          </ThemedCard>
        </Grid>

        {/* 시스템 상태 */}
        <Grid item xs={12} md={6}>
          <ThemedCard sx={{ p: SPACING.LARGE }}>
            <Typography variant="h6" sx={{ mb: SPACING.MEDIUM }}>
              시스템 상태
            </Typography>
            <Box>
              <Typography variant="body2" sx={{ mb: SPACING.SMALL, color: 'success.main' }}>
                ✅ 데이터베이스: 정상
              </Typography>
              <Typography variant="body2" sx={{ mb: SPACING.SMALL, color: 'success.main' }}>
                ✅ API 서버: 정상
              </Typography>
              <Typography variant="body2" sx={{ mb: SPACING.SMALL, color: 'success.main' }}>
                ✅ 파일 시스템: 정상
              </Typography>
              <Typography variant="body2" sx={{ mb: SPACING.SMALL, color: 'warning.main' }}>
                ⚠️ 메모리 사용량: 75%
              </Typography>
            </Box>
          </ThemedCard>
        </Grid>
      </Grid>
    </Box>
  );
} 