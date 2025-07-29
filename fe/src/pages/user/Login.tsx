import { Box } from '@mui/material';
import { useState } from 'react';
import LoginForm from '../../components/LoginForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { loginUser } from '../../api';
import { ROUTES } from '../../routes';
import { getThemeColors } from '../../theme';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = 'user' as const;
  const colors = getThemeColors(theme);

  // 🔽 로그인 처리 콜백
  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await loginUser({ email, password });
      
      if (res.success) {
        // 로그인 성공 시 대시보드로 이동
        window.location.href = ROUTES.USER.DASHBOARD;
      } else {
        // 로그인 실패 시 에러 메시지 표시
        setError(res.errorMessage || '로그인에 실패했습니다.');
      }
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