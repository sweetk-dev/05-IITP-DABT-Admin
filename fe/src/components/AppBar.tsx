import MuiAppBar from '@mui/material/AppBar';
import { Toolbar, Button, Box } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { HomeIconButton, Logo } from './AppBarCommon';

const SERVICE_NAME = "장애인 자립 생활 지원 플랫폼 API 센터";

function AppBarRow({ left, right }: { left: React.ReactNode, right?: React.ReactNode }) {
  // Uses CSS variable --appbar-top-margin for top margin
  return (
    <Box sx={{ mt: 'var(--appbar-top-margin)', display: 'flex', alignItems: 'baseline', width: '100%' }}>
      {left}
      {right && (
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'baseline' }}>{right}</Box>
      )}
    </Box>
  );
}

export default function AppBar({ type = 'user' }: { type?: 'user' | 'public' | 'auth' | 'admin-login' | 'admin' }) {
  const navigate = useNavigate();
  const userName = '홍길동'; // TODO: 실제 사용자명 연동
  const adminName = '관리자'; // TODO: 실제 관리자명 연동

  if (type === 'auth') {
    return (
      <MuiAppBar
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
        <Toolbar sx={{ minHeight: 'var(--appbar-height) !important', px: { xs: '10%', md: '10%' }, justifyContent: 'space-between' }}>
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
        <Toolbar sx={{ minHeight: 'var(--appbar-height) !important', px: { xs: '10%', md: '10%' }, justifyContent: 'space-between' }}>
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
        <Toolbar sx={{ minHeight: 'var(--appbar-height) !important', px: { xs: '10%', md: '10%' }, justifyContent: 'space-between' }}>
          <AppBarRow
            left={<Logo serviceName={SERVICE_NAME + ' - Admin'} />}
            right={
              <>
                <HomeIconButton to="/admin/dashboard" />
                <Button color="primary" startIcon={<AccountCircle />} sx={{ ml: 2 }}>
                  {adminName}
                </Button>
                <Button color="secondary" sx={{ ml: 2 }} onClick={() => {/* TODO: 로그아웃 처리 */}}>
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
        <Toolbar sx={{ minHeight: 'var(--appbar-height) !important', px: { xs: '10%', md: '10%' }, justifyContent: 'space-between' }}>
          <AppBarRow
            left={<Logo serviceName={SERVICE_NAME} />}
            right={
              <>
                <Button
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
      <Toolbar sx={{ minHeight: 'var(--appbar-height) !important', px: { xs: '10%', md: '10%' }, justifyContent: 'space-between' }}>
        <AppBarRow
          left={<Logo serviceName={SERVICE_NAME} />}
          right={
            <>
              <HomeIconButton to="/" />
              <Button color="primary" startIcon={<AccountCircle />} sx={{ ml: 2 }} onClick={() => navigate('/profile')}>
                {userName}
              </Button>
            </>
          }
        />
      </Toolbar>
    </MuiAppBar>
  );
} 