import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Login from './pages/user/Login';
import Home from './pages/user/Home';
import Register from './pages/user/Register';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserProfile from './pages/user/UserProfile';
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
import { Dashboard } from './pages/user/Dashboard';
import { QnaCreate } from './pages/user/QnaCreate';
import { QnaHistory } from './pages/user/QnaHistory';
import { OpenApiManagement } from './pages/user/OpenApiManagement';
import NoticeList from './pages/user/NoticeList';
import NoticeDetail from './pages/user/NoticeDetail';
import FaqList from './pages/user/FaqList';
import QnaList from './pages/user/QnaList';
import QnaDetail from './pages/user/QnaDetail';
import ThemePreview from './pages/ThemePreview';
import Layout from './components/Layout';
import { PrivateRoute, AdminProtectedRoute } from './components/ProtectedRoute';

import { ROUTES } from './routes';

// 관리자 페이지 구현 컴포넌트들
const AdminFaqList = lazy(() => import('./pages/admin/FaqList'));
const AdminFaqCreate = lazy(() => import('./pages/admin/FaqCreate'));
const AdminQnaList = lazy(() => import('./pages/admin/QnaManage'));
const AdminNoticeList = lazy(() => import('./pages/admin/NoticeManage'));
const AdminOpenApiClients = lazy(() => import('./pages/admin/OpenApiManage'));
const AdminOpenApiRequests = lazy(() => import('./pages/admin/OpenApiRequests'));
const AdminOpenApiDetail = lazy(() => import('./pages/admin/OpenApiDetail'));
const AdminOpenApiEdit = lazy(() => import('./pages/admin/OpenApiEdit'));
const AdminNoticeCreate = lazy(() => import('./pages/admin/NoticeCreate'));
const AdminNoticeDetail = lazy(() => import('./pages/admin/NoticeDetail'));
const AdminNoticeEdit = lazy(() => import('./pages/admin/NoticeEdit'));
const AdminFaqDetail = lazy(() => import('./pages/admin/FaqDetail'));
const AdminFaqEdit = lazy(() => import('./pages/admin/FaqEdit'));
const AdminQnaDetail = lazy(() => import('./pages/admin/QnaDetail'));
const AdminQnaReply = lazy(() => import('./pages/admin/QnaReply'));
import LoadingSpinner from './components/LoadingSpinner';

// 임시 잔여 컴포넌트
const UserManagement = () => <div>UserManagement</div>;
const UserDetail = () => <div>UserDetail</div>;
const ApiRequestDetail = () => <div>ApiRequestDetail</div>;
const AdminQnaEdit = () => <div>AdminQnaEdit</div>;

function App() {
  console.log('[App] Rendering App component');
  
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
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* 공개 페이지 (로그인 불필요) */}
            <Route index element={<Home />} />
            <Route path={ROUTES.PUBLIC.THEME_PREVIEW} element={<ThemePreview />} />
            <Route path={ROUTES.PUBLIC.NOTICE} element={<NoticeList />} />
            <Route path={ROUTES.PUBLIC.NOTICE_DETAIL} element={<NoticeDetail />} />
            <Route path={ROUTES.PUBLIC.FAQ} element={<FaqList />} />
            <Route path={ROUTES.PUBLIC.QNA} element={<QnaList />} />
            <Route path={ROUTES.PUBLIC.QNA_DETAIL} element={<QnaDetail />} />
            <Route path={ROUTES.PUBLIC.LOGIN} element={<Login />} />
            <Route path={ROUTES.PUBLIC.REGISTER} element={<Register />} />

            {/* 일반 사용자 페이지 (로그인 필요) */}
            <Route path={ROUTES.USER.DASHBOARD} element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path={ROUTES.USER.QNA_CREATE} element={<PrivateRoute><QnaCreate /></PrivateRoute>} />
            <Route path={ROUTES.USER.QNA_HISTORY} element={<PrivateRoute><QnaHistory /></PrivateRoute>} />
            <Route path={ROUTES.USER.OPEN_API_MANAGEMENT} element={<PrivateRoute><OpenApiManagement /></PrivateRoute>} />
            <Route path={ROUTES.USER.PROFILE} element={<PrivateRoute><UserProfile /></PrivateRoute>} />

            {/* 관리자 로그인 */}
            <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLogin />} />
            
            {/* 관리자 페이지 (로그인 필요) */}
            <Route path="/admin" element={<Navigate to={ROUTES.ADMIN.LOGIN} replace />} />
            <Route path="/admin/" element={<Navigate to={ROUTES.ADMIN.LOGIN} replace />} />
            <Route path="/admin/*" element={
              <AdminProtectedRoute>
                <Suspense fallback={<LoadingSpinner loading={true} />}>
                  <Routes>
                    <Route path="dashbd" element={<AdminDashboard />} />
                    <Route path="profile" element={<AdminProfile />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="users/:id" element={<UserDetail />} />
                    <Route path="openapi/clients" element={<AdminOpenApiClients />} />
                    <Route path="openapi/clients/:id" element={<AdminOpenApiDetail />} />
                    <Route path="openapi/clients/:id/edit" element={<AdminOpenApiEdit />} />
                    <Route path="openapi/requests" element={<AdminOpenApiRequests />} />
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
                    <Route path="qnas/:id/reply" element={<AdminQnaReply />} />
                    {/* 관리자 경로에서 인증되지 않은 경우 로그인으로 리다이렉트 */}
                    <Route path="*" element={<Navigate to={ROUTES.ADMIN.LOGIN} replace />} />
                  </Routes>
                </Suspense>
              </AdminProtectedRoute>
            } />

            {/* 404 - 홈으로 리다이렉트 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
