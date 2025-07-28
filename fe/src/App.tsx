import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Typography, Box, Container } from '@mui/material';
import { useEffect } from 'react';
import Login from './pages/user/Login';
import Home from './pages/Home';
import AppBar from './components/AppBar';
import Register from './pages/user/Register';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserProfile from './pages/user/UserProfile';
import AdminProfile from './pages/admin/AdminProfile';
import { isAuthenticated, validateAndCleanTokens } from './store/auth';
import { ROUTES } from './routes';

// 따뜻한 색상 팔레트
const bgMain = '#FFF7ED'; // 연한 베이지
const footerBg = '#2D3142'; // 네이비에 가까운 보라
const footerText = '#fff';

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
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          © 2024 IITP DABT Admin. All rights reserved.
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.6, display: 'block', mt: 1 }}>
          장애인 자립 생활 지원 플랫폼 운영관리 시스템
        </Typography>
      </Container>
    </Box>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
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
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: bgMain }}>
      <AppBar type={appBarType} />
      <Box sx={{ flex: 1 }}>{children}</Box>
      <Footer />
    </Box>
  );
}

// 인증 보호 라우트 컴포넌트
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = isAuthenticated();
  const location = useLocation();
  
  // 토큰 유효성 검사 및 정리
  useEffect(() => {
    validateAndCleanTokens();
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.PUBLIC.LOGIN} state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

// 임시 컴포넌트들 (나중에 실제 컴포넌트로 교체)
const UserDashboard = () => <div>UserDashboard</div>;
const NoticeList = () => <div>NoticeList</div>;
const NoticeDetail = () => <div>NoticeDetail</div>;
const FaqList = () => <div>FaqList</div>;
const FaqDetail = () => <div>FaqDetail</div>;
const QnaList = () => <div>QnaList</div>;
const QnaDetail = () => <div>QnaDetail</div>;
const OpenApiManagement = () => <div>OpenApiManagement</div>;

// 관리자 페이지 임시 컴포넌트들
const UserManagement = () => <div>UserManagement</div>;
const UserDetail = () => <div>UserDetail</div>;
const ApiClientManagement = () => <div>ApiClientManagement</div>;
const ApiClientDetail = () => <div>ApiClientDetail</div>;
const ApiRequestManagement = () => <div>ApiRequestManagement</div>;
const ApiRequestDetail = () => <div>ApiRequestDetail</div>;
const AdminNoticeList = () => <div>AdminNoticeList</div>;
const AdminNoticeCreate = () => <div>AdminNoticeCreate</div>;
const AdminNoticeDetail = () => <div>AdminNoticeDetail</div>;
const AdminNoticeEdit = () => <div>AdminNoticeEdit</div>;
const AdminFaqList = () => <div>AdminFaqList</div>;
const AdminFaqCreate = () => <div>AdminFaqCreate</div>;
const AdminFaqDetail = () => <div>AdminFaqDetail</div>;
const AdminFaqEdit = () => <div>AdminFaqEdit</div>;
const AdminQnaList = () => <div>AdminQnaList</div>;
const AdminQnaDetail = () => <div>AdminQnaDetail</div>;
const AdminQnaEdit = () => <div>AdminQnaEdit</div>;

// 관리자 보호 라우트 컴포넌트
function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = isAuthenticated();
  const location = useLocation();
  
  // 토큰 유효성 검사 및 정리
  useEffect(() => {
    validateAndCleanTokens();
  }, []);

  if (location.pathname === ROUTES.ADMIN.LOGIN) {
    return <>{children}</>;
  }
  if (!isLoggedIn) {
    return <Navigate to={ROUTES.ADMIN.LOGIN} state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <>
      <style>{`
        :root {
          --appbar-top-margin: 2vh;
        }
        @media (min-width: 900px) {
          :root {
            --appbar-top-margin: 2.5vh;
          }
        }
      `}</style>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* 공개 페이지 (로그인 불필요) */}
            <Route path={ROUTES.PUBLIC.HOME} element={<Home />} />
            <Route path="/notice" element={<NoticeList />} />
            <Route path="/notice/:id" element={<NoticeDetail />} />
            <Route path={ROUTES.PUBLIC.FAQ} element={<FaqList />} />
            <Route path="/faq/:id" element={<FaqDetail />} />
            <Route path={ROUTES.PUBLIC.QNA} element={<QnaList />} />
            <Route path="/qna/:id" element={<QnaDetail />} />
            <Route path={ROUTES.PUBLIC.LOGIN} element={<Login />} />
            <Route path={ROUTES.PUBLIC.REGISTER} element={<Register />} />

            {/* 일반 사용자 페이지 (로그인 필요) */}
            <Route path={ROUTES.USER.DASHBOARD} element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
            <Route path="/mng/openapi" element={<PrivateRoute><OpenApiManagement /></PrivateRoute>} />
            <Route path={ROUTES.USER.PROFILE} element={<PrivateRoute><UserProfile /></PrivateRoute>} />

            {/* 관리자 로그인 */}
            <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLogin />} />
            {/* /admin 또는 /admin/로 접근 시 /admin/login으로 리다이렉트 */}
            <Route path="/admin" element={<Navigate to={ROUTES.ADMIN.LOGIN} replace />} />
            <Route path="/admin/" element={<Navigate to={ROUTES.ADMIN.LOGIN} replace />} />
            {/* /admin/* 경로는 보호 */}
            <Route path="/admin/*" element={
              <AdminProtectedRoute>
                <Routes>
                  <Route path="dashbd" element={<AdminDashboard />} />
                  <Route path="profile" element={<AdminProfile />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="users/:id" element={<UserDetail />} />
                  <Route path="openapi/clients" element={<ApiClientManagement />} />
                  <Route path="openapi/clients/:id" element={<ApiClientDetail />} />
                  <Route path="openapi/requests" element={<ApiRequestManagement />} />
                  <Route path="openapi/requests/:id" element={<ApiRequestDetail />} />
                  <Route path="notices" element={<AdminNoticeList />} />
                  <Route path="notices/create" element={<AdminNoticeCreate />} />
                  <Route path="notices/:id" element={<AdminNoticeDetail />} />
                  <Route path="notices/:id/edit" element={<AdminNoticeEdit />} />
                  <Route path="faqs" element={<AdminFaqList />} />
                  <Route path="faqs/create" element={<AdminFaqCreate />} />
                  <Route path="faqs/:id" element={<AdminFaqDetail />} />
                  <Route path="faqs/:id/edit" element={<AdminFaqEdit />} />
                  <Route path="qnas" element={<AdminQnaList />} />
                  <Route path="qnas/:id" element={<AdminQnaDetail />} />
                  <Route path="qnas/:id/edit" element={<AdminQnaEdit />} />
                </Routes>
              </AdminProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<Navigate to={ROUTES.PUBLIC.HOME} replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}

export default App;
