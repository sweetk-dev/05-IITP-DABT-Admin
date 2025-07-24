import { Box } from '@mui/material';
import LoginForm from '../components/LoginForm';
import { FloatingLogo } from '../components/AppBarCommon';

export default function AdminLogin() {
  const handleAdminLogin = (email: string, password: string) => {
    // TODO: 관리자 로그인 로직 구현
    console.log('Admin login:', email, password);
  };

  return (
    <Box id="admin-login-page" minHeight="80vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f5f5">
      <LoginForm showRegisterButton={false} onSubmit={handleAdminLogin} />
      <FloatingLogo id="admin-login-logo2-floating" width={240} />
    </Box>
  );
} 