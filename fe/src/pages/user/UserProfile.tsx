import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { ROUTES, ROUTE_META } from '../../routes';
import { getThemeColors } from '../../theme';
import ListHeader from '../../components/common/ListHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import StatusChip from '../../components/common/StatusChip';

export default function UserProfile() {
  const navigate = useNavigate();

  // ROUTE_META에서 페이지 정보 동적 가져오기
  const pageMeta = (ROUTE_META as any)[ROUTES.USER.PROFILE];
  const pageTitle = pageMeta?.title || '사용자 프로필';

  const theme: 'user' | 'admin' = 'user';
  const colors = getThemeColors(theme);

  // 임시 사용자 데이터 (실제로는 API에서 가져옴)
  const userData = {
    name: '김사용자',
    email: 'user@example.com',
    phone: '010-9876-5432',
    company: '테스트 기업',
    department: '개발팀',
    lastLogin: '2024-01-15 16:45:00',
    status: '활성',
    avatar: '/avatars/user.jpg'
  };

  const handleEditProfile = () => {
    // 프로필 편집 페이지로 이동
    console.log('프로필 편집');
  };

  const handleBackToDashboard = () => {
    navigate(ROUTES.USER.DASHBOARD);
  };

  const getStatusColor = (status: string) => {
    return status === '활성' ? 'success' : 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      <ThemedCard sx={{ mb: 3 }}>
        <ListHeader
          title={pageTitle}
          icon={<PersonIcon />}
          actionsRight={
            <ThemedButton
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToDashboard}
            >
              대시보드로
            </ThemedButton>
          }
        />
      </ThemedCard>

      <Grid container spacing={3}>
        {/* 프로필 카드 */}
        <Grid item xs={12} md={4}>
          <ThemedCard>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Avatar
                src={userData.avatar}
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              >
                {userData.name.charAt(0)}
              </Avatar>
              <Typography variant="h5" gutterBottom sx={{ color: colors.text, fontWeight: 'bold' }}>
                {userData.name}
              </Typography>
              <StatusChip
                label={userData.status}
                kind={getStatusColor(userData.status)}
                size="medium"
                sx={{ mb: 2 }}
              />
              <Box sx={{ mt: 3 }}>
                <ThemedButton
                  variant="primary"
                  startIcon={<EditIcon />}
                  onClick={handleEditProfile}
                  fullWidth
                >
                  프로필 편집
                </ThemedButton>
              </Box>
            </CardContent>
          </ThemedCard>
        </Grid>

        {/* 상세 정보 */}
        <Grid item xs={12} md={8}>
          <ThemedCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: colors.text, mb: 3 }}>
                상세 정보
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ mr: 2, color: colors.primary }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">이메일</Typography>
                      <Typography variant="body1" sx={{ color: colors.text }}>
                        {userData.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ mr: 2, color: colors.primary }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">전화번호</Typography>
                      <Typography variant="body1" sx={{ color: colors.text }}>
                        {userData.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ mr: 2, color: colors.primary }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">회사</Typography>
                      <Typography variant="body1" sx={{ color: colors.text }}>
                        {userData.company}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 2, color: colors.primary }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">부서</Typography>
                      <Typography variant="body1" sx={{ color: colors.text }}>
                        {userData.department}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 2, color: colors.primary }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">마지막 로그인</Typography>
                      <Typography variant="body1" sx={{ color: colors.text }}>
                        {userData.lastLogin}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* 서비스 이용 정보 */}
              <Typography variant="h6" gutterBottom sx={{ color: colors.text, mb: 2 }}>
                서비스 이용 정보
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2, border: `1px solid ${colors.border}`, borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Q&A 작성</Typography>
                    <Typography variant="body2" sx={{ color: colors.text, fontWeight: 'bold' }}>
                      허용
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2, border: `1px solid ${colors.border}`, borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">OpenAPI 사용</Typography>
                    <Typography variant="body2" sx={{ color: colors.text, fontWeight: 'bold' }}>
                      허용
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2, border: `1px solid ${colors.border}`, borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">FAQ 조회</Typography>
                    <Typography variant="body2" sx={{ color: colors.text, fontWeight: 'bold' }}>
                      허용
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2, border: `1px solid ${colors.border}`, borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">공지사항 조회</Typography>
                    <Typography variant="body2" sx={{ color: colors.text, fontWeight: 'bold' }}>
                      허용
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </ThemedCard>
        </Grid>
      </Grid>
    </Box>
  );
} 