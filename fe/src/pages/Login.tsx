import { Box, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FloatingLogo } from '../components/AppBarCommon';
import { isValidEmail } from 'packages/common/validation';
import { loginUser } from '../api/user';
import { saveTokens } from '../store/auth';

export default function Login() {
  return (
    <Box id="login-page" minHeight="80vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f5f5">
      <LoginForm showRegisterButton={true} />
      <FloatingLogo id="login-logo2-floating" width={240} />
    </Box>
  );
}

function LoginForm({ showRegisterButton = true }: { showRegisterButton?: boolean }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!isValidEmail(email)) {
      setError('이메일 형식으로 입력해 주세요.');
      return;
    }
    const res = await loginUser({ email, password: pw });
    if (res.result === 'ok') {
      saveTokens(res.accessToken!, res.refreshToken!);
      window.location.href = '/dashbd';
    } else {
      setError(res.message || '로그인에 실패했습니다.');
    }
  };
} 