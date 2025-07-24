import { Box } from '@mui/material';
import { FloatingLogo } from '../components/AppBarCommon';
import LoginForm from '../components/LoginForm';
import { loginUser } from '../api/user';

export default function Login() {
  // 🔽 로그인 처리 콜백
  const handleLogin = async (email: string, password: string) => {
    const res = await loginUser({ email, password });
    if (res.result === 'ok') {
      window.location.href = '/dashbd';
    } else {
      alert(res.message || '로그인에 실패했습니다.');
    }
  };

  return (
    <Box
      id="login-page"
      minHeight="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f5f5f5"
    >
      <LoginForm showRegisterButton={true} onSubmit={handleLogin} />
      <FloatingLogo id="login-logo2-floating" width={240} />
    </Box>
  );
}