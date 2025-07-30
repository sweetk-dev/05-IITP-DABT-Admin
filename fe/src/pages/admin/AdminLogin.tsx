import { Box } from '@mui/material';
import { useState } from 'react';
import LoginForm from '../../components/LoginForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { loginAdmin } from '../../api';
import { ROUTES } from '../../routes';
import { getThemeColors } from '../../theme';
import { handleApiResponse } from '../../utils/apiResponseHandler';

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = 'admin' as const;
  const colors = getThemeColors(theme);

  const handleAdminLogin = async (loginId: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await loginAdmin({ loginId, password });
      
      // handleApiResponse를 사용하여 에러 코드별 자동 처리
      handleApiResponse(res, 
        (data) => {
          // 관리자 로그인 성공 시 관리자 대시보드로 이동
          window.location.href = ROUTES.ADMIN.DASHBOARD;
        },
        (errorMessage) => {
          setError(errorMessage);
        }
      );
    } catch (err) {
      console.error('Admin login error:', err);
      setError('관리자 로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box id="admin-login-page" sx={{
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
          onSubmit={handleAdminLogin}
          loading={loading}
          isAdmin={true}
        />
        
        <LoadingSpinner loading={loading} />
      </Box>
      
    </Box>
  );
} 