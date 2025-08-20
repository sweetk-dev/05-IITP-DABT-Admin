import { AppBar as MuiAppBar, Toolbar, Box, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Logo, HomeIconButton, DashboardIconButton } from './AppBarCommon';
import { logoutUser, logoutAdmin } from '../api';
import { clearLoginInfo } from '../store/user';
import { getUserName, getUserType, getAdminRole } from '../store/user';
import { ROUTES } from '../routes';
import { AccountCircle } from '@mui/icons-material';
import ThemedButton from './common/ThemedButton';
import AdminMenuBar from './AdminMenuBar';

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
  const muiTheme = useTheme();
  const colors = {
    text: muiTheme.palette.text.primary,
    textSecondary: muiTheme.palette.text.secondary,
  } as const;

  // 공통 AppBar 스타일 정의
  const commonAppBarStyles = {
    background: 'rgba(255, 255, 255, 0.92)',
    backdropFilter: 'blur(10px)', // 블러 효과
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', // 그림자 효과
    zIndex: 1200,
    position: 'sticky',
    top: 0,
    minHeight: 'var(--appbar-height, 74px)',
    // expose px height for layout calc
    '--header-height-px': '64px',
    // 상단바 아래 그라데이션 라인 추가
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: themeType === 'admin' 
        ? 'linear-gradient(to right, rgba(45, 49, 66, 0.8), rgba(45, 49, 66, 0.4), rgba(45, 49, 66, 0.8))' // 어드민 테마
        : 'linear-gradient(to right, rgba(4, 97, 160, 0.8), rgba(4, 97, 160, 0.4), rgba(4, 97, 160, 0.8))', // 유저 테마
      pointerEvents: 'none',
      zIndex: 1
    }
  };

  // 헤더 실제 높이를 관찰하여 CSS 변수로 노출
  const appBarRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const root = document.documentElement;
    const updateHeaderHeight = () => {
      const height = appBarRef.current?.offsetHeight || 64;
      root.style.setProperty('--header-height-px', `${height}px`);
    };
    updateHeaderHeight();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateHeaderHeight) : null;
    if (ro && appBarRef.current) ro.observe(appBarRef.current);
    window.addEventListener('resize', updateHeaderHeight);
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      if (ro && appBarRef.current) ro.unobserve(appBarRef.current);
    };
  }, [type]);

  // 공통 툴바 스타일 정의
  const commonToolbarStyles = {
    minHeight: 'var(--appbar-height, 74px) !important',
    px: { xs: 2, sm: 3, md: 4 },
    justifyContent: 'space-between'
  };

  const handleAdminLogout = async () => {
    try {
      await logoutAdmin({});
    } catch (error) {
      console.error('Admin logout failed:', error);
    } finally {
      clearLoginInfo();
      navigate(ROUTES.ADMIN.LOGIN, { replace: true });
    }
  };

  const handleUserLogout = async () => {
    try {
      await logoutUser({});
    } catch (error) {
      console.error('User logout failed:', error);
    } finally {
      clearLoginInfo();
      navigate('/', { replace: true }); // 홈화면으로 이동
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
        position="sticky"
        color="default"
        elevation={0}
        sx={commonAppBarStyles}
        ref={appBarRef}
      >
        <Toolbar id="appbar-auth-toolbar" sx={commonToolbarStyles}>
          <AppBarRow
            left={<Logo serviceName={SERVICE_NAME} />}
            right={<HomeIconButton />}
          />
        </Toolbar>
      </MuiAppBar>
    );
  }

  if (type === 'admin-login') {
    return (
      <MuiAppBar
        id="appbar-admin-login"
        position="sticky"
        color="default"
        elevation={0}
        sx={commonAppBarStyles}
        ref={appBarRef}
      >
        <Toolbar id="appbar-admin-login-toolbar" sx={commonToolbarStyles}>
          <AppBarRow
            left={<Logo serviceName={SERVICE_NAME + ' - Admin'} />}
          />
        </Toolbar>
      </MuiAppBar>
    );
  }

  if (type === 'admin') {
    return (
      <>
        <MuiAppBar
          id="appbar-admin"
          position="sticky"
          color="default"
          elevation={0}
          sx={commonAppBarStyles}
          ref={appBarRef}
        >
          <Toolbar id="appbar-admin-toolbar" sx={commonToolbarStyles}>
            <AppBarRow
              left={
                <Box 
                  id="appbar-admin-logo-container"
                  onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)} 
                  sx={{ cursor: 'pointer' }}
                >
                  <Logo serviceName={SERVICE_NAME + ' - Admin'} />
                </Box>
              }
              right={
                <>
                  <HomeIconButton to={ROUTES.ADMIN.DASHBOARD} />
                  <ThemedButton 
                    id="appbar-admin-profile-btn"
                    variant="text"
                    startIcon={<AccountCircle />} 
                    sx={{ 
                      ml: 2
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
                    variant="text"
                    sx={{ 
                      ml: 2
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
        <AdminMenuBar />
      </>
    );
  }

  if (type === 'public') {
    return (
      <MuiAppBar
        id="appbar-public"
        position="sticky"
        color="default"
        elevation={0}
        sx={commonAppBarStyles}
        ref={appBarRef}
      >
        <Toolbar id="appbar-public-toolbar" sx={commonToolbarStyles}>
          <AppBarRow
            left={<Logo serviceName={SERVICE_NAME} />}
            right={
              <>
                <ThemedButton
                  id="appbar-public-login-btn"
                  variant="primary"
                  sx={{
                    ml: 1,
                    fontSize: '1rem',
                    borderRadius: 2,
                    px: 2.5,
                    py: 0.75
                  }}
                  onClick={() => navigate('/login')}
                >
                  로그인
                </ThemedButton>
                <ThemedButton
                  id="appbar-public-register-btn"
                  variant="outlined"
                  sx={{
                    ml: 1,
                    fontSize: '1rem',
                    borderRadius: 2,
                    px: 2.5,
                    py: 0.75
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
    <>
      <MuiAppBar
        id="appbar-user"
        position="sticky"
        color="default"
        elevation={0}
        sx={commonAppBarStyles}
        ref={appBarRef}
      >
        <Toolbar id="appbar-user-toolbar" sx={commonToolbarStyles}>
          <AppBarRow
            left={<Logo serviceName={SERVICE_NAME} />}
            right={
              <>
                <HomeIconButton to="/" />
                <DashboardIconButton to={ROUTES.USER.DASHBOARD} />
                <ThemedButton 
                  id="appbar-user-profile-btn"
                  variant="text"
                  startIcon={<AccountCircle />} 
                  sx={{ 
                    ml: 2
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
                  variant="text"
                  sx={{ 
                    ml: 2
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
    </>
  );
} 