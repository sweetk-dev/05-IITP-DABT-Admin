import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Login from './pages/user/Login';
import Home from './pages/user/Home';
import Register from './pages/user/Register';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserProfile from './pages/user/UserProfile';
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
import Dashboard from './pages/user/Dashboard';
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
import OpenApiAbout from './pages/public/OpenApiAbout';
import Terms from './pages/public/Terms';
import Privacy from './pages/public/Privacy';

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

// 새로 추가된 Admin 페이지들
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const OperatorManagement = lazy(() => import('./pages/admin/OperatorManagement'));
const CodeManagement = lazy(() => import('./pages/admin/CodeManagement'));

import LoadingSpinner from './components/LoadingSpinner';

// 임시 잔여 컴포넌트
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
            <Route path={ROUTES.PUBLIC.ABOUT} element={<OpenApiAbout />} />
            <Route path={ROUTES.PUBLIC.TERMS} element={<Terms />} />
            <Route path={ROUTES.PUBLIC.PRIVACY} element={<Privacy />} />

            {/* 일반 사용자 페이지 (로그인 필요) */}
            <Route path={ROUTES.USER.DASHBOARD} element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path={ROUTES.USER.QNA_CREATE} element={<PrivateRoute><QnaCreate /></PrivateRoute>} />
            <Route path={ROUTES.USER.QNA_HISTORY} element={<PrivateRoute><QnaHistory /></PrivateRoute>} />
            <Route path={ROUTES.USER.OPEN_API_MANAGEMENT} element={<PrivateRoute><OpenApiManagement /></PrivateRoute>} />
            <Route path={ROUTES.USER.PROFILE} element={<PrivateRoute><UserProfile /></PrivateRoute>} />

            {/* 관리자 로그인 */}
            <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLogin />} />
            
            {/* Admin 페이지들 - Layout 사용하면서 독립적 동작 */}
            <Route path="/admin" element={<Navigate to={ROUTES.ADMIN.LOGIN} replace />} />
            <Route path="/admin/" element={<Navigate to={ROUTES.ADMIN.LOGIN} replace />} />
            
            {/* Admin Dashboard */}
            <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
            <Route path={ROUTES.ADMIN.PROFILE} element={<AdminProtectedRoute><AdminProfile /></AdminProtectedRoute>} />
            
            {/* 사용자 관리 */}
            <Route path={ROUTES.ADMIN.USERS.LIST} element={<AdminProtectedRoute><UserManagement /></AdminProtectedRoute>} />
            <Route path={ROUTES.ADMIN.USERS.DETAIL} element={<AdminProtectedRoute><UserDetail /></AdminProtectedRoute>} />
            
            {/* 운영자 관리 */}
            <Route path="/admin/operators" element={<AdminProtectedRoute><OperatorManagement /></AdminProtectedRoute>} />
            <Route path="/admin/operators/:id" element={<AdminProtectedRoute><div>OperatorDetail</div></AdminProtectedRoute>} />
            
            {/* 코드 관리 */}
            <Route path="/admin/code" element={<AdminProtectedRoute><CodeManagement /></AdminProtectedRoute>} />
            
            {/* 기존 관리자 페이지들 */}
            <Route path={ROUTES.ADMIN.OPENAPI.CLIENTS} element={<AdminProtectedRoute><Suspense fallback={<LoadingSpinner loading={true} />}><AdminOpenApiClients /></Suspense></AdminProtectedRoute>} />
            <Route path={ROUTES.ADMIN.OPENAPI.CLIENT_DETAIL} element={<AdminProtectedRoute><Suspense fallback={<LoadingSpinner loading={true} />}><AdminOpenApiDetail /></Suspense></AdminProtectedRoute>} />
            <Route path={ROUTES.ADMIN.OPENAPI.CLIENT_EDIT} element={<AdminProtectedRoute><Suspense fallback={<LoadingSpinner loading={true} />}><AdminOpenApiEdit /></Suspense></AdminProtectedRoute>} />
            <Route path={ROUTES.ADMIN.OPENAPI.REQUESTS} element={<AdminProtectedRoute><Suspense fallback={<LoadingSpinner loading={true} />}><AdminOpenApiRequests /></Suspense></AdminProtectedRoute>} />
            <Route path={ROUTES.ADMIN.OPENAPI.REQUEST_DETAIL} element={<AdminProtectedRoute><ApiRequestDetail /></AdminProtectedRoute>} />
            <Route path={ROUTES.ADMIN.NOTICES.LIST} element={<AdminProtectedRoute><Suspense fallback={<LoadingSpinner loading={true} />}><AdminNoticeList /></Suspense></AdminProtectedRoute>} />
            <Route path={ROUTES.ADMIN.NOTICES.CREATE} element={<AdminProtectedRoute><Suspense fallback={<LoadingSpinner loading={true} />}><AdminNoticeCreate /></Suspense></AdminProtectedRoute>} />
            <Route path={ROUTES.ADMIN.NOTICES.DETAIL} element={<AdminProtectedRoute><Suspense fallback={<LoadingSpinner loading={true} />}><AdminNoticeDetail /></Suspense></AdminProtectedRoute>} />
            <Route path={ROUTES.ADMIN.NOTICES.EDIT} element={<AdminProtectedRoute><Suspense fallback={<LoadingSpinner loading={true} />}><AdminNoticeEdit /></Suspense></AdminProtectedRoute>} />
            <Route path={ROUTES.ADMIN.FAQ.LIST} element={<AdminProtectedRoute><Suspense fallback={<LoadingSpinner loading={true} />}><AdminFaqList /></Suspense></AdminProtectedRoute>} />
            <Route path={ROUTES.ADMIN.FAQ.CREATE} element={<AdminProtectedRoute><Suspense fallback={<LoadingSpinner loading={true} />}><AdminFaqCreate /></Suspense></AdminProtectedRoute>} />
            <Route path={ROUTES.ADMIN.FAQ.DETAIL} element={<AdminProtectedRoute><Suspense fallback={<LoadingSpinner loading={true} />}><AdminFaqDetail /></Suspense></AdminProtectedRoute>} />
            <Route path={ROUTES.ADMIN.FAQ.EDIT} element={<AdminProtectedRoute><Suspense fallback={<LoadingSpinner loading={true} />}><AdminFaqEdit /></Suspense></AdminProtectedRoute>} />
            <Route path={ROUTES.ADMIN.QNA.LIST} element={<AdminProtectedRoute><Suspense fallback={<LoadingSpinner loading={true} />}><AdminQnaList /></Suspense></AdminProtectedRoute>} />
            <Route path={ROUTES.ADMIN.QNA.DETAIL} element={<AdminProtectedRoute><Suspense fallback={<LoadingSpinner loading={true} />}><AdminQnaDetail /></Suspense></AdminProtectedRoute>} />
            <Route path="/admin/qnas/:id/edit" element={<AdminProtectedRoute><AdminQnaEdit /></AdminProtectedRoute>} />
            <Route path={ROUTES.ADMIN.QNA.REPLY} element={<AdminProtectedRoute><Suspense fallback={<LoadingSpinner loading={true} />}><AdminQnaReply /></Suspense></AdminProtectedRoute>} />

            {/* 404 - 홈으로 리다이렉트 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
