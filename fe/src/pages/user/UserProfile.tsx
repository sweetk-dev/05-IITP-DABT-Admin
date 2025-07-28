import { Box, Typography, Paper, Grid, Avatar, Button } from '@mui/material';
import { AccountCircle, Edit } from '@mui/icons-material';
import { getUserName, getUserEmail } from '../../store/user';

export default function UserProfile() {
  const userName = getUserName();
  const userEmail = getUserEmail();

  return (
    <Box id="user-profile-page" sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        프로필
      </Typography>
      
      <Paper id="user-profile-container" sx={{ p: 3, mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box id="user-profile-avatar-section" sx={{ textAlign: 'center' }}>
              <Avatar 
                id="user-profile-avatar"
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto', 
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '3rem'
                }}
              >
                <AccountCircle sx={{ fontSize: 'inherit' }} />
              </Avatar>
              <Button 
                id="user-profile-edit-btn"
                variant="outlined" 
                startIcon={<Edit />}
                size="small"
              >
                프로필 수정
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={9}>
            <Box id="user-profile-info-section">
              <Typography variant="h6" gutterBottom>
                기본 정보
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box id="user-profile-name-field">
                    <Typography variant="body2" color="text.secondary">
                      이름
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {userName}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box id="user-profile-email-field">
                    <Typography variant="body2" color="text.secondary">
                      이메일
                    </Typography>
                    <Typography variant="body1">
                      {userEmail}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box id="user-profile-role-field">
                    <Typography variant="body2" color="text.secondary">
                      사용자 유형
                    </Typography>
                    <Typography variant="body1">
                      일반 사용자
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
} 