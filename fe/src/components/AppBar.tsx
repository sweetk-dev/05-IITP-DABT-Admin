import { AppBar as MuiAppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';
import { Logo, HomeIconButton } from './AppBarCommon';
import { logoutAdmin, logoutUser } from '../api';
import { getUserName, getUserType, getAdminRole } from '../store/user';
import { ROUTES } from '../routes';

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
      navigate(ROUTES.PUBLIC.LOGIN);
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
        elevation={1}
        sx={{
          background: '#fff',
          boxShadow: 'none',
          zIndex: 1200,
          minHeight: 'var(--appbar-height)',
        }}
      >
        <Toolbar id="appbar-auth-toolbar" sx={{ minHeight: 'var(--appbar-height) !important', px: { xs: '10%', md: '10%' }, justifyContent: 'space-between' }}>
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
        position="fixed"
        color="default"
        elevation={1}
        sx={{
          background: '#fff',
          boxShadow: 'none',
          zIndex: 1200,
          minHeight: 'var(--appbar-height)',
        }}
      >
        <Toolbar id="appbar-admin-login-toolbar" sx={{ minHeight: 'var(--appbar-height) !important', px: { xs: '10%', md: '10%' }, justifyContent: 'space-between' }}>
          <AppBarRow
            left={<Logo serviceName={SERVICE_NAME + ' - Admin'} />}
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
        elevation={1}
        sx={{
          background: '#fff',
          boxShadow: 'none',
          zIndex: 1200,
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
                <Logo serviceName={SERVICE_NAME + ' - Admin'} />
              </Box>
            }
            right={
              <>
                <HomeIconButton to={ROUTES.ADMIN.DASHBOARD} />
                <Button 
                  id="appbar-admin-profile-btn"
                  color="primary" 
                  startIcon={<AccountCircle />} 
                  sx={{ ml: 2 }}
                  onClick={handleProfileClick}
                >
                  <Box id="appbar-admin-user-info">
                    <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                      {userName}
                    </Typography>
                    <Typography variant="caption" component="div" sx={{ color: 'text.secondary' }}>
                      {adminRole}
                    </Typography>
                  </Box>
                </Button>
                <Button 
                  id="appbar-admin-logout-btn"
                  color="secondary" 
                  sx={{ ml: 2 }} 
                  onClick={handleAdminLogout}
                >
                  로그아웃
                </Button>
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
        elevation={1}
        sx={{
          background: '#fff',
          boxShadow: 'none',
          zIndex: 1200,
          minHeight: 'var(--appbar-height)',
        }}
      >
        <Toolbar id="appbar-public-toolbar" sx={{ minHeight: 'var(--appbar-height) !important', px: { xs: '10%', md: '10%' }, justifyContent: 'space-between' }}>
          <AppBarRow
            left={<Logo serviceName={SERVICE_NAME} />}
            right={
              <>
                <Button
                  id="appbar-public-login-btn"
                  variant="contained"
                  sx={{
                    ml: 1,
                    backgroundColor: '#1976D2',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    borderRadius: 2,
                    px: 2.5,
                    py: 0.75,
                    boxShadow: 'none',
                    '&:hover': { backgroundColor: '#1565c0' },
                  }}
                  onClick={() => navigate('/login')}
                >
                  로그인
                </Button>
                <Button
                  id="appbar-public-register-btn"
                  variant="outlined"
                  sx={{
                    ml: 1,
                    borderColor: '#90CAF9',
                    color: '#1976D2',
                    backgroundColor: '#E3F2FD',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    borderRadius: 2,
                    px: 2.5,
                    py: 0.75,
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#1976D2',
                      color: '#fff',
                      borderColor: '#1976D2',
                    },
                  }}
                  onClick={() => navigate('/register')}
                >
                  회원가입
                </Button>
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
      elevation={1}
      sx={{
        background: '#fff',
        boxShadow: 'none',
        zIndex: 1200,
        minHeight: 'var(--appbar-height)',
      }}
    >
      <Toolbar id="appbar-user-toolbar" sx={{ minHeight: 'var(--appbar-height) !important', px: { xs: '10%', md: '10%' }, justifyContent: 'space-between' }}>
        <AppBarRow
          left={<Logo serviceName={SERVICE_NAME} />}
          right={
            <>
              <HomeIconButton to="/" />
              <Button 
                id="appbar-user-profile-btn"
                color="primary" 
                startIcon={<AccountCircle />} 
                sx={{ ml: 2 }} 
                onClick={handleProfileClick}
              >
                <Box id="appbar-user-info">
                  <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                    {userName}
                  </Typography>
                </Box>
              </Button>
              <Button 
                id="appbar-user-logout-btn"
                color="secondary" 
                sx={{ ml: 2 }} 
                onClick={handleUserLogout}
              >
                로그아웃
              </Button>
            </>
          }
        />
      </Toolbar>
    </MuiAppBar>
  );
} 