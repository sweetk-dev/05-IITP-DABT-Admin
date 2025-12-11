import { Box, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { isValidEmail } from '@iitp-dabt/common';
import { ROUTES } from '../routes';
import { getThemeColors } from '../theme';
import ThemedButton from './common/ThemedButton';
import LoadingSpinner from './LoadingSpinner';
import { useInputWithTrim } from '../hooks/useInputWithTrim';

type LoginFormProps = {
  onSubmit: (emailOrLoginId: string, password: string) => void;
  showRegisterButton?: boolean;
  loading?: boolean;
  isAdmin?: boolean;
  defaultEmail?: string;
  defaultPassword?: string;
};

export default function LoginForm({ 
  onSubmit, 
  showRegisterButton = true, 
  loading = false,
  isAdmin = false,
  defaultEmail = '',
  defaultPassword = ''
}: LoginFormProps) {
  // trim 처리가 적용된 입력 필드들
  const emailOrLoginIdInput = useInputWithTrim(defaultEmail);
  const [pw, setPw] = useState(defaultPassword);
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
  } as const;

  const handleLogin = () => {
    if (loading) return; // 로딩 중에는 중복 요청 방지
    
    let hasError = false;
    
    // 이메일 또는 로그인 ID 검증
    if (isAdmin) {
      // 관리자: 로그인 ID 검증
      if (!emailOrLoginIdInput.getTrimmedValue()) {
        setEmailOrLoginIdError('로그인 ID를 입력해 주세요.');
        hasError = true;
      } else {
        setEmailOrLoginIdError('');
      }
    } else {
      // 일반 사용자: 이메일 검증
      if (!isValidEmail(emailOrLoginIdInput.getTrimmedValue())) {
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
    onSubmit(emailOrLoginIdInput.getTrimmedValue(), pw);
  };

  // 엔터 키 처리
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleLogin();
    }
  };

  return (
    <Box id="login-form-box" sx={{
      ...LOGIN_FORM_STYLES.container,
      position: 'relative'
    }}>
      <LoadingSpinner 
        loading={loading} 
        size={50}
        backgroundOpacity={0.7}
        color="primary"
      />
      <Typography variant="h5" sx={LOGIN_FORM_STYLES.title}>
        {isAdmin ? '관리자 로그인' : '로그인'}
      </Typography>
      
      <TextField
        id={isAdmin ? "admin-login-id-input" : "login-email-input"}
        label={isAdmin ? "로그인 ID" : "이메일"}
        fullWidth
        margin="normal"
        value={emailOrLoginIdInput.value}
        onChange={(e) => emailOrLoginIdInput.onChange(e.target.value)}
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
      
      <ThemedButton 
        id={isAdmin ? "admin-login-submit-btn" : "login-submit-btn"}
        
        variant="primary"
        fullWidth 
        sx={{
          mt: 2,
          fontSize: '1.1rem',
          py: 1.2
        }}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? '로그인 중...' : (isAdmin ? '관리자 로그인' : '로그인')}
      </ThemedButton>
      
      {showRegisterButton && !isAdmin && (
        <ThemedButton 
          id="login-register-btn" 
          
          variant="text"
          fullWidth 
          sx={{
            mt: 1,
            fontSize: '0.95rem'
          }}
          onClick={() => window.location.href = ROUTES.PUBLIC.REGISTER}
          disabled={loading}
        >
          회원가입
        </ThemedButton>
      )}
    </Box>
  );
} 