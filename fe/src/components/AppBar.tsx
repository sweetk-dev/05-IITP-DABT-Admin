import { AppBar as MuiAppBar, Toolbar, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Logo, HomeIconButton } from './AppBarCommon';
import { logoutUser, logoutAdmin } from '../api';
import { getUserName, getUserType, getAdminRole } from '../store/user';
import { ROUTES } from '../routes';
import { AccountCircle } from '@mui/icons-material';
import ThemedButton from './common/ThemedButton';
import { getThemeColors } from '../theme';

const SERVICE_NAME = 'IITP DABT';

interface AppBarRowProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
}

function AppBarRow({ left, right }: AppBarRowProps) {
  return (
    <Box 
      id="appbar-row-container"
      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
    >
      <Box id="appbar-left-section" sx={{ display: 'flex', alignItems: 'center' }}>
        {left}
      </Box>
      <Box id="appbar-right-section" sx={{ display: 'flex', alignItems: 'center' }}>
        {right}
      </Box>
    </Box>
  );
}

export default function AppBar({ type = 'user' }: { type?: 'user' | 'public' | 'auth' | 'admin-login' | 'admin' }) {
  const navigate = useNavigate();
  const userName = getUserName();
  const userType = getUserType();
  const adminRole = getAdminRole();

  // 테마 결정
  const themeType = type === 'admin' || type === 'admin-login' ? 'admin' : 'user';
  const colors = getThemeColors(themeType);

  const handleAdminLogout = async () => {
    try {
      await logoutAdmin({});
      navigate(ROUTES.ADMIN.LOGIN);
    } catch (error) {
      console.error('Admin logout failed:', error);
    }
  };

  const handleUserLogout = async () => {
    try {
      await logoutUser({});
      navigate('/'); // 홈화면으로 이동
    } catch (error) {
      console.error('User logout failed:', error);
    }
  };

  const handleProfileClick = () => {
    if (userType === 'A') {
      navigate(ROUTES.ADMIN.PROFILE);
    } else {
      navigate(ROUTES.USER.PROFILE);
    }
  };

  if (type === 'auth') {
    return (
      <MuiAppBar
        id="appbar-auth"
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          background: 'transparent',
          boxShadow: 'none',
          zIndex: 9999,
          minHeight: 'var(--appbar-height)',
        }}
      >
        <Toolbar id="appbar-auth-toolbar" sx={{ minHeight: 'var(--appbar-height) !important', px: { xs: '10%', md: '10%' }, justifyContent: 'space-between' }}>
          <AppBarRow
            left={<Logo serviceName={SERVICE_NAME} theme={themeType} />}
            right={<HomeIconButton theme={themeType} />}
          />
        </Toolbar>
      </MuiAppBar>
    );
  }

  if (type === 'admin-login') {
    return (
      <MuiAppBar
        id="appbar-admin-login"
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          background: 'transparent',
          boxShadow: 'none',
          zIndex: 9999,
          minHeight: 'var(--appbar-height)',
        }}
      >
        <Toolbar id="appbar-admin-login-toolbar" sx={{ minHeight: 'var(--appbar-height) !important', px: { xs: '10%', md: '10%' }, justifyContent: 'space-between' }}>
          <AppBarRow
            left={<Logo serviceName={SERVICE_NAME + ' - Admin'} theme={themeType} />}
          />
        </Toolbar>
      </MuiAppBar>
    );
  }

  if (type === 'admin') {
    return (
      <MuiAppBar
        id="appbar-admin"
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          background: 'transparent',
          boxShadow: 'none',
          zIndex: 9999,
          minHeight: 'var(--appbar-height)',
        }}
      >
        <Toolbar id="appbar-admin-toolbar" sx={{ minHeight: 'var(--appbar-height) !important', px: { xs: '10%', md: '10%' }, justifyContent: 'space-between' }}>
          <AppBarRow
            left={
              <Box 
                id="appbar-admin-logo-container"
                onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)} 
                sx={{ cursor: 'pointer' }}
              >
                <Logo serviceName={SERVICE_NAME + ' - Admin'} theme={themeType} />
              </Box>
            }
            right={
              <>
                <HomeIconButton to={ROUTES.ADMIN.DASHBOARD} theme={themeType} />
                <ThemedButton 
                  id="appbar-admin-profile-btn"
                  theme={themeType}
                  variant="text"
                  startIcon={<AccountCircle />} 
                  sx={{ 
                    ml: 2,
                    color: colors.text
                  }}
                  onClick={handleProfileClick}
                >
                  <Box id="appbar-admin-user-info">
                    <Typography variant="caption" component="span" sx={{ fontWeight: 'bold', color: colors.text }}>
                      {userName}
                    </Typography>
                    <Typography variant="caption" component="div" sx={{ opacity: 0.7, color: colors.textSecondary }}>
                      {adminRole}
                    </Typography>
                  </Box>
                </ThemedButton>
                <ThemedButton 
                  id="appbar-admin-logout-btn"
                  theme={themeType}
                  variant="text"
                  sx={{ 
                    ml: 2,
                    color: colors.text
                  }} 
                  onClick={handleAdminLogout}
                >
                  로그아웃
                </ThemedButton>
              </>
            }
          />
        </Toolbar>
      </MuiAppBar>
    );
  }

  if (type === 'public') {
    return (
      <MuiAppBar
        id="appbar-public"
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          background: 'transparent',
          boxShadow: 'none',
          zIndex: 9999,
          minHeight: 'var(--appbar-height)',
        }}
      >
        <Toolbar id="appbar-public-toolbar" sx={{ minHeight: 'var(--appbar-height) !important', px: { xs: '10%', md: '10%' }, justifyContent: 'space-between' }}>
          <AppBarRow
            left={<Logo serviceName={SERVICE_NAME} theme={themeType} />}
            right={
              <>
                <ThemedButton
                  id="appbar-public-login-btn"
                  theme={themeType}
                  variant="primary"
                  sx={{
                    ml: 1,
                    fontSize: '1rem',
                    borderRadius: 2,
                    px: 2.5,
                    py: 0.75,
                    color: colors.text
                  }}
                  onClick={() => navigate('/login')}
                >
                  로그인
                </ThemedButton>
                <ThemedButton
                  id="appbar-public-register-btn"
                  theme={themeType}
                  variant="outlined"
                  sx={{
                    ml: 1,
                    fontSize: '1rem',
                    borderRadius: 2,
                    px: 2.5,
                    py: 0.75,
                    color: colors.text
                  }}
                  onClick={() => navigate('/register')}
                >
                  회원가입
                </ThemedButton>
              </>
            }
          />
        </Toolbar>
      </MuiAppBar>
    );
  }

  // 기본: 일반 유저
  return (
    <MuiAppBar
      id="appbar-user"
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        background: 'transparent',
        boxShadow: 'none',
        zIndex: 9999,
        minHeight: 'var(--appbar-height)',
      }}
    >
      <Toolbar id="appbar-user-toolbar" sx={{ minHeight: 'var(--appbar-height) !important', px: { xs: '10%', md: '10%' }, justifyContent: 'space-between' }}>
        <AppBarRow
          left={<Logo serviceName={SERVICE_NAME} theme={themeType} />}
          right={
            <>
              <HomeIconButton to="/" theme={themeType} />
              <ThemedButton 
                id="appbar-user-profile-btn"
                theme={themeType}
                variant="text"
                startIcon={<AccountCircle />} 
                sx={{ 
                  ml: 2,
                  color: colors.text
                }} 
                onClick={handleProfileClick}
              >
                <Box id="appbar-user-info">
                  <Typography variant="caption" component="span" sx={{ fontWeight: 'bold', color: colors.text }}>
                    {userName}
                  </Typography>
                </Box>
              </ThemedButton>
              <ThemedButton 
                id="appbar-user-logout-btn"
                theme={themeType}
                variant="text"
                sx={{ 
                  ml: 2,
                  color: colors.text
                }} 
                onClick={handleUserLogout}
              >
                로그아웃
              </ThemedButton>
            </>
          }
        />
      </Toolbar>
    </MuiAppBar>
  );
} 