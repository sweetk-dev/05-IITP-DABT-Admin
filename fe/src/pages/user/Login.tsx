import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { loginUser } from '../../api';
import { ROUTES } from '../../routes';
import { isUserAuthenticated } from '../../store/auth';
// import { getThemeColors } from '../../theme';
import { handleApiResponse } from '../../utils/apiResponseHandler';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  // const theme = 'user' as const;
  const navigate = useNavigate();
  const location = useLocation();

  // 로그인된 사용자 체크 및 리다이렉트
  useEffect(() => {
    if (isUserAuthenticated()) {
      setIsRedirecting(true);
      // 이전 페이지(from)가 있으면 해당 페이지로, 없으면 홈으로
      const fromState = (location.state as any)?.from;
      let targetPath = typeof fromState === 'string' 
        ? fromState 
        : (fromState?.pathname as string | undefined);
      
      // 세션에 저장된 returnTo 우선 복구
      try {
        const saved = sessionStorage.getItem('returnTo');
        if (saved) {
          targetPath = saved;
          sessionStorage.removeItem('returnTo');
        }
      } catch {}
      
      navigate(targetPath || ROUTES.PUBLIC.HOME, { replace: true });
    }
  }, [navigate, location.state]);

  // 🔽 로그인 처리 콜백
  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await loginUser({ email, password });
      
      // handleApiResponse를 사용하여 에러 코드별 자동 처리
      handleApiResponse(res, 
        () => {
          // 로그인 성공 시 이전 페이지(from)로 이동. 문자열 또는 Location 객체 모두 지원
          const fromState = (location.state as any)?.from;
          let targetPath = typeof fromState === 'string' 
            ? fromState 
            : (fromState?.pathname as string | undefined);
          // 세션에 저장된 returnTo 우선 복구
          try {
            const saved = sessionStorage.getItem('returnTo');
            if (saved) {
              targetPath = saved;
              sessionStorage.removeItem('returnTo');
            }
          } catch {}
          navigate(targetPath || ROUTES.USER.DASHBOARD, { replace: true });
        },
        (errorMessage) => {
          setError(errorMessage);
        }
      );
    } catch (err) {
      console.error('Login error:', err);
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 이미 로그인된 사용자는 리다이렉트 중이므로 로딩 표시
  if (isRedirecting) {
    return (
      <Box id="login-page" sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        position: 'relative',
      }}>
        <LoadingSpinner loading={true} />
      </Box>
    );
  }

  return (
    <Box id="login-page" sx={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'background.default',
      position: 'relative',
    }}>
      <Box sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 400,
      }}>
        <ErrorAlert 
          error={error}
          onClose={() => setError(null)}
        />
        
        <LoginForm 
          showRegisterButton={true} 
          onSubmit={handleLogin}
          loading={loading}
        />
        
        <LoadingSpinner loading={loading} />
      </Box>
      
    </Box>
  );
}