import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toolbar, Typography, Button, Box, Card, CardContent, Stack, Container, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Login from './pages/Login';
import Home from './pages/Home';
import AppBar from './components/AppBar';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';

const dummyNotices = [
  {
    title: '[2024-07-18] 장애인 데이터 API 신규 버전이 출시되었습니다.',
    content: '신규 버전 안내...'
  },
  {
    title: '[2024-07-10] 시스템 점검 안내: 7/20(토) 00:00~04:00',
    content: '점검 안내...'
  },
  {
    title: '[2024-07-01] 회원가입 시 이메일 인증이 추가되었습니다.',
    content: '이메일 인증 안내...'
  },
  {
    title: '[2024-06-20] 개인정보 처리방침이 변경되었습니다.',
    content: '개인정보 안내...'
  },
  {
    title: '[2024-06-10] 장애인 데이터 API 서비스 오픈',
    content: '서비스 오픈 안내...'
  }
];

const dummyFaqs = [
  {
    question: 'API 신청은 어떻게 하나요?',
    answer: '로그인 후 [API 관리] 메뉴에서 신청할 수 있습니다.'
  },
  {
    question: '키 발급은 얼마나 걸리나요?',
    answer: '관리자의 승인 후 즉시 발급됩니다.'
  },
  {
    question: '비밀번호를 잊어버렸어요?',
    answer: '로그인 화면에서 비밀번호 찾기를 이용해 주세요.'
  }
];

// 따뜻한 색상 팔레트
const bgMain = '#FFF7ED'; // 연한 베이지
const section1 = '#FFE5D0'; // 연한 오렌지
const section2 = '#E3F2FD'; // 연한 블루
const footerBg = '#2D3142'; // 네이비에 가까운 보라
const footerText = '#fff';

const APPBAR_HEIGHT = 64;
const FOOTER_HEIGHT = 56;

function NoticeList() {
  return (
    <Box sx={{ 
      background: bgMain, 
      py: { xs: 4, md: 8 }, 
      pt: { xs: `${APPBAR_HEIGHT + 24}px`, md: `${APPBAR_HEIGHT + 48}px` }, 
      pb: { xs: 20, md: 40 } 
    }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" mb={4}>
          공지사항 전체
        </Typography>
        <Stack spacing={2}>
          {dummyNotices.map((notice, idx) => (
            <Card key={idx} variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight="bold">{notice.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{notice.content}</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}

function Footer() {
  return (
    <Box sx={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      background: footerBg,
      color: footerText,
      zIndex: 1200,
      py: 2,
      textAlign: 'center',
    }}>
      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          © {new Date().getFullYear()} IITP 장애인 자립 생활 지원 플랫폼 API 센터. All rights reserved.
        </Typography>
        {/* 회사 로고 등 추가 공간 */}
        <Box sx={{ height: 16 }} />
      </Container>
    </Box>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  let appBarType: 'user' | 'public' | 'auth' | 'admin-login' | 'admin' = 'user';

  // 어드민 로그인 화면
  if (location.pathname === '/admin/login') {
    appBarType = 'admin-login';
  }
  // 어드민 로그인 후 (모든 /admin/* 경로, 단 /admin/login 제외)
  else if (location.pathname.startsWith('/admin')) {
    appBarType = 'admin';
  }
  // 로그인/회원가입 화면
  else if (location.pathname === '/login' || location.pathname === '/register') {
    appBarType = 'auth';
  }
  // 공개페이지(공지, FAQ, QnA 등) - 로그인 전
  else if (
    ['/','/notice','/faq','/qna'].some(p => location.pathname === p || location.pathname.startsWith(p + '/')) && !isLoggedIn
  ) {
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
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

// 임시 컴포넌트 정의
const Faq = () => <div>Faq</div>;
const UserDashboard = () => <div>UserDashboard</div>;
const OpenApiManagement = () => <div>OpenApiManagement</div>;
const UserProfile = () => <div>UserProfile</div>;
const AdminDashboard = () => <div>AdminDashboard</div>;
const UserManagement = () => <div>UserManagement</div>;
const UserDetail = () => <div>UserDetail</div>;
const ApiClientManagement = () => <div>ApiClientManagement</div>;
const ApiClientDetail = () => <div>ApiClientDetail</div>;
const ApiApplicationManagement = () => <div>ApiApplicationManagement</div>;
const ApiApplicationDetail = () => <div>ApiApplicationDetail</div>;
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
const NoticeDetail = () => <div>NoticeDetail</div>;
const FaqList = () => <div>FaqList</div>;
const FaqDetail = () => <div>FaqDetail</div>;
const QnaList = () => <div>QnaList</div>;
const QnaDetail = () => <div>QnaDetail</div>;
const ApiRequestManagement = () => <div>ApiRequestManagement</div>;
const ApiRequestDetail = () => <div>ApiRequestDetail</div>;

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const location = useLocation();
  if (location.pathname === '/admin/login') {
    return <>{children}</>;
  }
  if (!isLoggedIn) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
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
            {/* 공개 페이지 */}
            <Route path="/" element={<Home />} />
            <Route path="/notice" element={<NoticeList />} />
            <Route path="/notice/:id" element={<NoticeDetail />} />
            <Route path="/faq" element={<FaqList />} />
            <Route path="/faq/:id" element={<FaqDetail />} />
            <Route path="/qna" element={<QnaList />} />
            <Route path="/qna/:id" element={<QnaDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 일반 사용자 페이지 (로그인 필요) */}
            <Route path="/dashbd" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
            <Route path="/mng/openapi" element={<PrivateRoute><OpenApiManagement /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />

            {/* 관리자 로그인 */}
            <Route path="/admin/login" element={<AdminLogin />} />
            {/* /admin 또는 /admin/로 접근 시 /admin/login으로 리다이렉트 */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/" element={<Navigate to="/admin/login" replace />} />
            {/* /admin/* 경로는 보호 */}
            <Route path="/admin/*" element={<AdminProtectedRoute>{/* 기존 관리자 라우트들 */}
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
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
            </AdminProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<Navigate to='/' replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}

export default App;
