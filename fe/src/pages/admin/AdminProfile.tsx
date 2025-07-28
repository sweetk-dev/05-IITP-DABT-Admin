import { Box, Typography, Paper, Chip, Grid, Avatar, Button } from '@mui/material';
import { getUserInfo } from '../../store/user';

export default function AdminProfile() {
  const userInfo = getUserInfo();

  if (!userInfo || userInfo.userType !== 'A') {
    return (
      <Box id="admin-profile-page" sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          관리자 프로필
        </Typography>
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="body1" color="text.secondary">
            관리자 정보를 불러올 수 없습니다.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box id="admin-profile-page" sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        관리자 프로필
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '3rem'
              }}
            >
              {userInfo.name?.charAt(0) || 'A'}
            </Avatar>
            <Typography variant="h6" gutterBottom>
              {userInfo.name || '관리자'}
            </Typography>
            <Chip label={userInfo.role || '관리자'} color="primary" sx={{ mb: 2 }} />
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mb: 1 }}
            >
              프로필 수정
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
            >
              비밀번호 변경
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              기본 정보
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  관리자 ID
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {userInfo.userId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  이름
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {userInfo.name || '미설정'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  역할
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {userInfo.role || '관리자'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  상태
                </Typography>
                <Chip label="활성" color="success" size="small" />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 