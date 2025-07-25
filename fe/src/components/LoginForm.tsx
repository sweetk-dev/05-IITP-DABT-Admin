import { Box, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { isValidEmail } from '@iitp-dabt/common';


type LoginFormProps = {
  onSubmit: (email: string, password: string) => void;
  showRegisterButton?: boolean;
};


export default function LoginForm({ onSubmit, showRegisterButton = true }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [pwError, setPwError] = useState('');

  const handleLogin = () => {
    let hasError = false;
    if (!isValidEmail(email)) {
      setEmailError('이메일 형식으로 입력해 주세요.');
      hasError = true;
    } else {
      setEmailError('');
    }
    if (!pw) {
      setPwError('비밀번호를 입력해 주세요.');
      hasError = true;
    } else {
      setPwError('');
    }
    if (hasError) return;
    onSubmit(email, pw);
  };

  return (
    <Box id="login-form-box" maxWidth={360} width="100%" mx="auto" p={4} boxShadow={0} borderRadius={2} bgcolor="#fff" border="1.5px solid #d0d0d0" sx={{ boxShadow: '2px 4px 12px 0 rgba(0,0,0,0.07)' }}>
      <Typography variant="h5" mb={2} align="center">로그인</Typography>
      <TextField
        id="login-email-input"
        label="이메일"
        fullWidth
        margin="normal"
        value={email}
        onChange={e => setEmail(e.target.value)}
        error={!!emailError}
        helperText={emailError}
      />
      <TextField
        id="login-password-input"
        label="비밀번호"
        type={showPw ? 'text' : 'password'}
        fullWidth
        margin="normal"
        value={pw}
        onChange={e => setPw(e.target.value)}
        error={!!pwError}
        helperText={pwError}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="비밀번호 보기/숨기기"
                onClick={() => setShowPw(v => !v)}
                edge="end"
              >
                {showPw ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button id="login-submit-btn" variant="contained" color="primary" fullWidth sx={{ mt: 2, fontWeight: 'bold', fontSize: '1.1rem', py: 1.2 }} onClick={handleLogin}>
        로그인
      </Button>
      {showRegisterButton && (
        <Button id="login-register-btn" variant="text" color="primary" fullWidth sx={{ mt: 1, fontSize: '0.95rem', opacity: 0.7 }} onClick={() => window.location.href = '/register'}>
          회원가입
        </Button>
      )}
    </Box>
  );
} 