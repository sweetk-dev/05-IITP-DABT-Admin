import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { loginAdmin } from '../../api';
import { ROUTES } from '../../routes';
import { isAdminAuthenticated } from '../../store/auth';
import { clearLoginInfoByType } from '../../store/user';
import { useTheme } from '@mui/material/styles';
import { handleApiResponse } from '../../utils/apiResponseHandler';

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const muiTheme = useTheme();
  const colors = {
    background: muiTheme.palette.background.default,
  } as const;
  const navigate = useNavigate();

  // 로그인된 관리자 체크 및 리다이렉트
  useEffect(() => {
    if (isAdminAuthenticated()) {
      setIsRedirecting(true);
      // 세션에 저장된 returnTo가 있으면 해당 페이지로, 없으면 관리자 대시보드로
      let targetPath: string = ROUTES.ADMIN.DASHBOARD;
      try {
        const saved = sessionStorage.getItem('returnTo');
        if (saved) {
          targetPath = saved;
          sessionStorage.removeItem('returnTo');
        }
      } catch {}
      
      navigate(targetPath, { replace: true });
    }
  }, [navigate]);

  const handleAdminLogin = async (loginId: string, password: string) => {
    setLoading(true);
    setError(null);

    // Admin 로그인 시 기존 User 정보 정리 (Admin 우선권 확보)
    clearLoginInfoByType('U');

    try {
      const res = await loginAdmin({ loginId, password });
      
      // handleApiResponse를 사용하여 에러 코드별 자동 처리
      handleApiResponse(res, 
        () => {
          // 관리자 로그인 성공 시 이전 위치 복구 후 대시보드
          try {
            const saved = sessionStorage.getItem('returnTo');
            if (saved) {
              sessionStorage.removeItem('returnTo');
              window.location.href = saved;
              return;
            }
          } catch {}
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

  // 이미 로그인된 관리자는 리다이렉트 중이므로 로딩 표시
  if (isRedirecting) {
    return (
      <Box id="admin-login-page" sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: colors.background,
        position: 'relative',
      }}>
        <LoadingSpinner loading={true} />
      </Box>
    );
  }

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