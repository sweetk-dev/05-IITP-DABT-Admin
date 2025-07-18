import { Box } from '@mui/material';
import LoginForm from '../components/LoginForm';
import { FloatingLogo } from '../components/AppBarCommon';

export default function AdminLogin() {
  return (
    <Box id="admin-login-page" minHeight="80vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f5f5">
      <LoginForm showRegisterButton={false} />
      <FloatingLogo id="admin-login-logo2-floating" width={240} />
    </Box>
  );
} 