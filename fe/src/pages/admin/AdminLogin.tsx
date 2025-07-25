import { Box } from '@mui/material';
import { useState } from 'react';
import LoginForm from '../../components/LoginForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { FloatingLogo } from '../../components/AppBarCommon';
import { loginAdmin } from '../../api';
import { ROUTES } from '../../routes';

// 공통 스타일 정의 (사용자 로그인과 동일)
const LOGIN_PAGE_STYLES = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: '#f5f5f5',
    position: 'relative',
  },
  formContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: 400,
  },
} as const;

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = async (loginId: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await loginAdmin({ loginId, password });
      
      if (res.success) {
        // 관리자 로그인 성공 시 관리자 대시보드로 이동
        window.location.href = ROUTES.ADMIN.DASHBOARD;
      } else {
        // 로그인 실패 시 에러 메시지 표시
        setError(res.errorMessage || '관리자 로그인에 실패했습니다.');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError('관리자 로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box id="admin-login-page" sx={LOGIN_PAGE_STYLES.container}>
      <Box sx={LOGIN_PAGE_STYLES.formContainer}>
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
      
      <FloatingLogo id="admin-login-logo2-floating" width={240} />
    </Box>
  );
} 