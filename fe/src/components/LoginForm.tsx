import { Box, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { isValidEmail } from '@iitp-dabt/common';
import { ROUTES } from '../routes';
import { getThemeColors } from '../theme';

type LoginFormProps = {
  onSubmit: (emailOrLoginId: string, password: string) => void;
  showRegisterButton?: boolean;
  loading?: boolean;
  isAdmin?: boolean;
};

export default function LoginForm({ 
  onSubmit, 
  showRegisterButton = true, 
  loading = false,
  isAdmin = false 
}: LoginFormProps) {
  const [emailOrLoginId, setEmailOrLoginId] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [emailOrLoginIdError, setEmailOrLoginIdError] = useState('');
  const [pwError, setPwError] = useState('');

  const theme = isAdmin ? 'admin' : 'user';
  const colors = getThemeColors(theme);

  // 공통 스타일 정의
  const LOGIN_FORM_STYLES = {
    container: {
      maxWidth: 360,
      width: '100%',
      mx: 'auto',
      p: 4,
      borderRadius: 2,
      bgcolor: 'transparent',
      border: 'none',
      boxShadow: 'none',
    },
    title: {
      mb: 2,
      textAlign: 'center',
      color: colors.text,
    },
    submitButton: {
      mt: 2,
      fontWeight: 'bold',
      fontSize: '1.1rem',
      py: 1.2,
      bgcolor: colors.primary,
      color: colors.text,
      textShadow: '0 0 1px rgba(0,0,0,0.3)',
      '&:hover': {
        bgcolor: colors.primary,
        opacity: 0.9,
      },
      '&:disabled': {
        bgcolor: '#ccc',
        color: '#666',
        textShadow: 'none',
      },
    },
    registerButton: {
      mt: 1,
      fontSize: '0.95rem',
      color: colors.primary,
      fontWeight: 'bold',
      '&:hover': {
        bgcolor: 'transparent',
        color: colors.primary,
        opacity: 0.8,
      },
    },
  } as const;

  const handleLogin = () => {
    if (loading) return; // 로딩 중에는 중복 요청 방지
    
    let hasError = false;
    
    // 이메일 또는 로그인 ID 검증
    if (isAdmin) {
      // 관리자: 로그인 ID 검증
      if (!emailOrLoginId.trim()) {
        setEmailOrLoginIdError('로그인 ID를 입력해 주세요.');
        hasError = true;
      } else {
        setEmailOrLoginIdError('');
      }
    } else {
      // 일반 사용자: 이메일 검증
      if (!isValidEmail(emailOrLoginId)) {
        setEmailOrLoginIdError('이메일 형식으로 입력해 주세요.');
        hasError = true;
      } else {
        setEmailOrLoginIdError('');
      }
    }
    
    // 비밀번호 검증
    if (!pw) {
      setPwError('비밀번호를 입력해 주세요.');
      hasError = true;
    } else {
      setPwError('');
    }
    
    if (hasError) return;
    onSubmit(emailOrLoginId.trim(), pw);
  };

  // 엔터 키 처리
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleLogin();
    }
  };

  return (
    <Box id="login-form-box" sx={LOGIN_FORM_STYLES.container}>
      <Typography variant="h5" sx={LOGIN_FORM_STYLES.title}>
        {isAdmin ? '관리자 로그인' : '로그인'}
      </Typography>
      
      <TextField
        id={isAdmin ? "admin-login-id-input" : "login-email-input"}
        label={isAdmin ? "로그인 ID" : "이메일"}
        fullWidth
        margin="normal"
        value={emailOrLoginId}
        onChange={e => setEmailOrLoginId(e.target.value)}
        onKeyPress={handleKeyPress}
        error={!!emailOrLoginIdError}
        helperText={emailOrLoginIdError}
        disabled={loading}
      />
      
      <TextField
        id={isAdmin ? "admin-login-password-input" : "login-password-input"}
        label="비밀번호"
        type={showPw ? 'text' : 'password'}
        fullWidth
        margin="normal"
        value={pw}
        onChange={e => setPw(e.target.value)}
        onKeyPress={handleKeyPress}
        error={!!pwError}
        helperText={pwError}
        disabled={loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="비밀번호 보기/숨기기"
                onClick={() => setShowPw(v => !v)}
                edge="end"
                disabled={loading}
              >
                {showPw ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      <Button 
        id={isAdmin ? "admin-login-submit-btn" : "login-submit-btn"}
        variant="contained" 
        fullWidth 
        sx={LOGIN_FORM_STYLES.submitButton}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? '로그인 중...' : (isAdmin ? '관리자 로그인' : '로그인')}
      </Button>
      
      {showRegisterButton && !isAdmin && (
        <Button 
          id="login-register-btn" 
          variant="text" 
          fullWidth 
          sx={LOGIN_FORM_STYLES.registerButton}
          onClick={() => window.location.href = ROUTES.PUBLIC.REGISTER}
          disabled={loading}
        >
          회원가입
        </Button>
      )}
    </Box>
  );
} 