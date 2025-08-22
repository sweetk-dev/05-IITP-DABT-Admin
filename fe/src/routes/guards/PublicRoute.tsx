import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { validateAndCleanTokens, isUserAuthenticated, isAdminAuthenticated } from '../../store/auth';
import { ROUTES } from '../index';
import LoadingSpinner from '../../components/LoadingSpinner';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  allowAuthenticatedUsers?: boolean;
}

/**
 * 공개 페이지 라우트 컴포넌트
 * 로그인된 사용자의 접근을 제어하고 적절한 페이지로 리다이렉트
 */
export function PublicRoute({ 
  children, 
  redirectTo,
  allowAuthenticatedUsers = false 
}: PublicRouteProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [targetPath, setTargetPath] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    // 토큰 유효성 검사 및 정리
    validateAndCleanTokens();
    
    // 인증 상태 확인
    const isUserLoggedIn = isUserAuthenticated();
    const isAdminLoggedIn = isAdminAuthenticated();
    
    if (isUserLoggedIn || isAdminLoggedIn) {
      if (allowAuthenticatedUsers) {
        // 인증된 사용자도 접근 허용
        setIsChecking(false);
        return;
      }
      
      // 인증된 사용자는 리다이렉트
      setShouldRedirect(true);
      
      if (redirectTo) {
        // 명시적으로 지정된 리다이렉트 경로
        setTargetPath(redirectTo);
      } else if (isAdminLoggedIn) {
        // 관리자는 관리자 대시보드로
        setTargetPath(ROUTES.ADMIN.DASHBOARD);
      } else {
        // 일반 사용자는 홈페이지로
        setTargetPath(ROUTES.PUBLIC.HOME);
      }
    }
    
    setIsChecking(false);
  }, [redirectTo, allowAuthenticatedUsers]);

  // 인증 상태 확인 중
  if (isChecking) {
    return <LoadingSpinner loading={true} />;
  }

  // 리다이렉트 필요
  if (shouldRedirect && targetPath) {
    return <Navigate to={targetPath} state={{ from: location }} replace />;
  }

  // 정상 접근 허용
  return <>{children}</>;
}

/**
 * 로그인 페이지 전용 라우트 컴포넌트
 * 로그인된 사용자는 적절한 대시보드로 리다이렉트
 */
export function LoginRoute({ children }: { children: React.ReactNode }) {
  return (
    <PublicRoute redirectTo={ROUTES.PUBLIC.HOME}>
      {children}
    </PublicRoute>
  );
}

/**
 * 관리자 로그인 페이지 전용 라우트 컴포넌트
 * 로그인된 관리자는 관리자 대시보드로 리다이렉트
 */
export function AdminLoginRoute({ children }: { children: React.ReactNode }) {
  return (
    <PublicRoute redirectTo={ROUTES.ADMIN.DASHBOARD}>
      {children}
    </PublicRoute>
  );
}

/**
 * 회원가입 페이지 전용 라우트 컴포넌트
 * 로그인된 사용자는 홈페이지로 리다이렉트
 */
export function RegisterRoute({ children }: { children: React.ReactNode }) {
  return (
    <PublicRoute redirectTo={ROUTES.PUBLIC.HOME}>
      {children}
    </PublicRoute>
  );
}
