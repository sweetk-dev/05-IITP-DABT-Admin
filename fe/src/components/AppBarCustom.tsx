import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AppBarCustom() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const userName = '홍길동'; // TODO: 실제 사용자명 연동

  // 로고(왼쪽 상단, 항상 고정)
  const Logo = (
    <Box id="appbar-logo" display="flex" alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => navigate('/') }>
      <Typography variant="h6" color="inherit" noWrap sx={{ mr: 1, color: '#7B3F00', fontWeight: 700 }}>
        IITP
      </Typography>
      <img src="/iitp_cms_logo_img_1.png" alt="IITP Logo" style={{ height: 40, marginRight: 12 }} />
    </Box>
  );

  // 로그인 페이지
  if (location.pathname === '/login') {
    return (
      <AppBar position="fixed" color="default" elevation={1} sx={{ background: '#fff', boxShadow: 'none', zIndex: 1200 }}>
        <Toolbar sx={{ minHeight: '64px !important', px: { xs: '10%', md: '10%' }, justifyContent: 'space-between' }}>
          {Logo}
          <IconButton color="primary" onClick={() => navigate('/')}> <HomeIcon /> </IconButton>
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
          {Logo}
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
          {Logo}
          <Box display="flex" alignItems="center">
            <IconButton color="primary" onClick={() => navigate('/')}> <HomeIcon /> </IconButton>
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