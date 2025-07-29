import { Typography, Box, Container } from '@mui/material';
import { useLocation, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import AppBar from './AppBar';
import { isAuthenticated, validateAndCleanTokens } from '../store/auth';
import { ROUTES } from '../routes';

// 따뜻한 색상 팔레트
const bgMain = '#FFF7ED'; // 연한 베이지
const footerBg = '#2D3142'; // 네이비에 가까운 보라
const footerText = '#fff';

// 서비스 이름 (AppBar와 동일하게)
const SERVICE_NAME = 'IITP DABT';

// 공개 페이지 목록 (로그인 없이 접근 가능)
const PUBLIC_PAGES = [
  ROUTES.PUBLIC.HOME, 
  '/notice', 
  ROUTES.PUBLIC.FAQ, 
  ROUTES.PUBLIC.QNA, 
  ROUTES.PUBLIC.LOGIN, 
  ROUTES.PUBLIC.REGISTER, 
  ROUTES.ADMIN.LOGIN
];

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: footerBg,
        color: footerText,
        py: 3,
        mt: 'auto',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {/* Footer 고정 로고 - Footer 내부 오른쪽 상단 */}
      <Box
        className="footer-logo-container"
        sx={{
          position: 'absolute !important',
          top: '-280px !important',
          right: '5% !important',
          zIndex: 1000,
          pointerEvents: 'none',
          transform: 'none !important',
        }}
      >
        <img
          className="footer-logo-image"
          src="/iitp_cms_logo_img_2.png"
          alt="IITP Logo"
          style={{ 
            width: 280, 
            maxWidth: '40vw', 
            height: 'auto',
            opacity: 0.95,
            position: 'relative',
            left: 'auto',
            right: 'auto',
            transform: 'none'
          }}
        />
      </Box>
      
      <Container maxWidth="lg">
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          © 2025 {SERVICE_NAME}. All rights reserved.
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.6, display: 'block', mt: 1 }}>
          장애인 자립 생활 지원 플랫폼 Open Api 센터
        </Typography>
      </Container>
    </Box>
  );
}

export default function Layout() {
  const location = useLocation();
  const isLoggedIn = isAuthenticated();
  
  // 토큰 유효성 검사 및 정리 (컴포넌트 마운트 시)
  useEffect(() => {
    validateAndCleanTokens();
  }, []);

  let appBarType: 'user' | 'public' | 'auth' | 'admin-login' | 'admin' = 'user';

  // 어드민 로그인 화면
  if (location.pathname === ROUTES.ADMIN.LOGIN) {
    appBarType = 'admin-login';
  }
  // 어드민 로그인 후 (모든 /admin/* 경로, 단 /admin/login 제외)
  else if (location.pathname.startsWith('/admin') && location.pathname !== ROUTES.ADMIN.LOGIN) {
    appBarType = 'admin';
  }
  // 로그인/회원가입 화면
  else if (location.pathname === ROUTES.PUBLIC.LOGIN || location.pathname === ROUTES.PUBLIC.REGISTER) {
    appBarType = 'auth';
  }
  // 공개페이지(공지, FAQ, QnA 등) - 로그인 전
  else if (PUBLIC_PAGES.some(page => location.pathname === page || location.pathname.startsWith(page + '/')) && !isLoggedIn) {
    appBarType = 'public';
  }
  // 공개페이지(공지, FAQ, QnA 등) - 로그인 후, 또는 일반 유저 페이지
  else {
    appBarType = 'user';
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      background: bgMain,
    }}>
      {/* AppBar는 자체적으로 position fixed를 사용 */}
      <AppBar type={appBarType} />
      
      {/* 컨텐츠 영역 - 상단바 높이만큼 여백 확보 */}
      <Box sx={{ 
        flex: 1,
        pt: 'calc(var(--appbar-height, 64px) + 32px)',
        pb: '48px',
        minHeight: 'calc(100vh - var(--appbar-height, 64px) - var(--footer-height, 56px))',
        overflow: 'hidden'
      }}>
        <Box sx={{
          height: '100%',
          overflow: 'auto',
          paddingTop: 0
        }}>
          <Outlet />
        </Box>
      </Box>
      
      <Footer />
    </Box>
  );
} 