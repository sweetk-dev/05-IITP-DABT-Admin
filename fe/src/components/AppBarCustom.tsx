import { AppBar, Toolbar, Button, Box } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useLocation, useNavigate } from 'react-router-dom';
import { HomeIconButton, Logo } from './AppBarCommon';

export default function AppBarCustom() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const userName = '홍길동'; // TODO: 실제 사용자명 연동
  const SERVICE_NAME = "장애인 자립 생활 지원 플랫폼 API 센터";

  // 로그인 페이지
  if (location.pathname === '/login') {
    return (
      <AppBar position="fixed" color="default" elevation={1} sx={{ background: '#fff', boxShadow: 'none', zIndex: 1200 }}>
        <Toolbar sx={{ minHeight: '64px !important', px: { xs: '10%', md: '10%' }, justifyContent: 'space-between' }}>
          <Logo serviceName={SERVICE_NAME} />
          <HomeIconButton />
        </Toolbar>
      </AppBar>
    );
  }

  // 로그인 필요 없는 공개 페이지(공지/FAQ 등)
  const publicPaths = ['/', '/notice', '/notice/:id', '/faq', '/faq/:id', '/qna', '/qna/:id', '/register'];
  const isPublic = publicPaths.some(path => location.pathname === path || location.pathname.startsWith(path.replace(':id', '')));

  if (!isLoggedIn && isPublic) {
    return (
      <AppBar position="fixed" color="default" elevation={1} sx={{ background: '#fff', boxShadow: 'none', zIndex: 1200 }}>
        <Toolbar sx={{ minHeight: '64px !important', px: { xs: '10%', md: '10%' }, justifyContent: 'flex-start' }}>
          <Logo serviceName={SERVICE_NAME} />
          <Button color="primary" variant="outlined" style={{ marginLeft: 'auto', marginRight: 8 }} onClick={() => navigate('/login')}>로그인</Button>
          <Button color="primary" variant="contained" onClick={() => navigate('/register')}>회원가입</Button>
        </Toolbar>
      </AppBar>
    );
  }

  // 로그인한 일반 유저 페이지(대시보드 등)
  if (isLoggedIn) {
    return (
      <AppBar position="fixed" color="default" elevation={1} sx={{ background: '#fff', boxShadow: 'none', zIndex: 1200 }}>
        <Toolbar sx={{ minHeight: '64px !important', px: { xs: '10%', md: '10%' }, justifyContent: 'space-between' }}>
          <Logo serviceName={SERVICE_NAME} />
          <Box display="flex" alignItems="center">
            <HomeIconButton to="/" />
            <Button color="primary" startIcon={<AccountCircle />} sx={{ ml: 2 }} onClick={() => navigate('/profile')}>
              {userName}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  // 기본(예비)
  return null;
} 