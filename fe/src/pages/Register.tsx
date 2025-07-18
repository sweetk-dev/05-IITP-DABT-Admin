import { Box, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FloatingLogo } from '../components/AppBarCommon';
import { isValidEmail } from '../utils/validation';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [pwError, setPwError] = useState('');
  const [pw2Error, setPw2Error] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailCheckMsg, setEmailCheckMsg] = useState('');
  const [emailCheckColor, setEmailCheckColor] = useState<'success' | 'error' | ''>('');

  const handleEmailCheck = () => {
    if (!isValidEmail(email)) {
      setEmailCheckMsg('이메일 형식으로 입력해 주세요.');
      setEmailCheckColor('error');
      return;
    }
    // 임시: test@example.com만 중복, 나머지는 사용 가능
    if (email === 'test@example.com') {
      setEmailCheckMsg('이미 사용 중인 이메일입니다.');
      setEmailCheckColor('error');
    } else {
      setEmailCheckMsg('사용 가능한 이메일입니다.');
      setEmailCheckColor('success');
    }
  };

  const handleRegister = () => {
    let hasError = false;
    if (!name) {
      setNameError('이름을 입력해 주세요.');
      hasError = true;
    } else {
      setNameError('');
    }
    if (!isValidEmail(email)) {
      setEmailError('이메일 형식으로 입력해 주세요.');
      hasError = true;
    } else {
      setEmailError('');
    }
    if (!pw) {
      setPwError('비밀번호를 입력해 주세요.');
      hasError = true;
    } else if (pw.length < 6) {
      setPwError('비밀번호는 6자 이상이어야 합니다.');
      hasError = true;
    } else {
      setPwError('');
    }
    if (!pw2) {
      setPw2Error('비밀번호 확인을 입력해 주세요.');
      hasError = true;
    } else if (pw !== pw2) {
      setPw2Error('비밀번호가 일치하지 않습니다.');
      hasError = true;
    } else {
      setPw2Error('');
    }
    if (hasError) return;
    // TODO: 실제 회원가입 API 연동
    setSuccess(true);
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  };

  return (
    <Box id="register-page" minHeight="80vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f5f5">
      <Box id="register-form-box" maxWidth={400} width="100%" mx="auto" p={4} boxShadow={0} borderRadius={2} bgcolor="#fff" border="1.5px solid #d0d0d0" sx={{ boxShadow: '2px 4px 12px 0 rgba(0,0,0,0.07)' }}>
        <Typography variant="h5" mb={2} align="center">회원가입</Typography>
        <TextField
          id="register-name-input"
          label="이름"
          fullWidth
          margin="normal"
          value={name}
          onChange={e => setName(e.target.value)}
          error={!!nameError}
          helperText={nameError}
        />
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            id="register-email-input"
            label="이메일"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
          />
          <Button
            id="register-email-check-btn"
            variant="outlined"
            color="primary"
            sx={{ height: 56, mt: '8px', whiteSpace: 'nowrap' }}
            onClick={handleEmailCheck}
          >
            중복확인
          </Button>
        </Box>
        {emailCheckMsg && (
          <Typography mt={1} mb={-1} ml={1} fontSize={14} color={emailCheckColor === 'success' ? 'success.main' : 'error.main'}>
            {emailCheckMsg}
          </Typography>
        )}
        <TextField
          id="register-password-input"
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
        <TextField
          id="register-password2-input"
          label="비밀번호 확인"
          type={showPw2 ? 'text' : 'password'}
          fullWidth
          margin="normal"
          value={pw2}
          onChange={e => setPw2(e.target.value)}
          error={!!pw2Error}
          helperText={pw2Error}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="비밀번호 보기/숨기기"
                  onClick={() => setShowPw2(v => !v)}
                  edge="end"
                >
                  {showPw2 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="register-affiliation-input"
          label="소속"
          placeholder="회사/기관/학교/단체 등 (선택)"
          fullWidth
          margin="normal"
          value={affiliation}
          onChange={e => setAffiliation(e.target.value)}
        />
        {success && <Typography color="primary" align="center" mt={2}>회원가입이 완료되었습니다! 로그인 화면으로 이동합니다.</Typography>}
        <Button id="register-submit-btn" variant="contained" color="primary" fullWidth sx={{ mt: 2, fontWeight: 'bold', fontSize: '1.1rem', py: 1.2 }} onClick={handleRegister}>
          회원가입
        </Button>
        <Button id="register-login-btn" variant="text" color="primary" fullWidth sx={{ mt: 1, fontSize: '0.95rem', opacity: 0.7 }} onClick={() => window.location.href = '/login'}>
          로그인 화면으로
        </Button>
      </Box>
      <FloatingLogo id="register-logo2-floating" width={240} />
    </Box>
  );
} 