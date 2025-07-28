import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <Box id="admin-dashboard-page" sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          관리자 대시보드
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* 통계 카드 */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              총 사용자
            </Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              1,234
            </Typography>
            <Typography variant="body2" color="text.secondary">
              활성 사용자 수
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              FAQ 게시물
            </Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              56
            </Typography>
            <Typography variant="body2" color="text.secondary">
              등록된 FAQ 수
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              Q&A 문의
            </Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              89
            </Typography>
            <Typography variant="body2" color="text.secondary">
              대기 중인 문의
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              오늘 방문자
            </Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              234
            </Typography>
            <Typography variant="body2" color="text.secondary">
              일일 방문자 수
            </Typography>
          </Paper>
        </Grid>

        {/* 관리 메뉴 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              관리 메뉴
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Button 
                  variant="contained" 
                  onClick={() => navigate(ROUTES.ADMIN.FAQ.LIST)}
                  id="admin-dashboard-faq-btn"
                >
                  FAQ 관리
                </Button>
              </Grid>
              <Grid item>
                <Button 
                  variant="contained" 
                  onClick={() => navigate(ROUTES.ADMIN.QNA.LIST)}
                  id="admin-dashboard-qna-btn"
                >
                  Q&A 관리
                </Button>
              </Grid>
              <Grid item>
                <Button 
                  variant="contained" 
                  onClick={() => navigate(ROUTES.ADMIN.USERS.LIST)}
                  id="admin-dashboard-users-btn"
                >
                  사용자 관리
                </Button>
              </Grid>
              <Grid item>
                <Button 
                  variant="contained" 
                  onClick={() => navigate(ROUTES.ADMIN.SETTINGS)}
                  id="admin-dashboard-settings-btn"
                >
                  시스템 설정
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* 최근 활동 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              최근 활동
            </Typography>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • 새로운 사용자 가입: user@example.com (2분 전)
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • FAQ 업데이트: "API 사용법" (15분 전)
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Q&A 답변 완료: "로그인 오류" (1시간 전)
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • 시스템 백업 완료 (2시간 전)
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* 시스템 상태 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              시스템 상태
            </Typography>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, color: 'success.main' }}>
                ✅ 데이터베이스: 정상
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: 'success.main' }}>
                ✅ API 서버: 정상
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: 'success.main' }}>
                ✅ 파일 시스템: 정상
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: 'warning.main' }}>
                ⚠️ 메모리 사용량: 75%
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 