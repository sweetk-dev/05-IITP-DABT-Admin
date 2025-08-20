import { Box } from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { loginUser } from '../../api';
import { ROUTES } from '../../routes';
import { getThemeColors } from '../../theme';
import { handleApiResponse } from '../../utils/apiResponseHandler';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = 'user' as const;
  const colors = getThemeColors(theme);
  const navigate = useNavigate();
  const location = useLocation();

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
          const targetPath = typeof fromState === 'string' 
            ? fromState 
            : (fromState?.pathname as string | undefined);
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

  return (
    <Box id="login-page" sx={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: colors.background,
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