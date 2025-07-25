import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { isAuthenticated, validateAndCleanTokens } from '../store/auth';
import { ROUTES } from '../routes';

// 인증 보호 라우트 컴포넌트
export function PrivateRoute({ children }: { children: React.ReactNode }) {
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

// 관리자 보호 라우트 컴포넌트
export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
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