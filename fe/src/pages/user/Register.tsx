import { useState } from 'react';
import { Box, TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { isValidEmail } from '@iitp-dabt/common';
import type { UserRegisterReq } from '@iitp-dabt/common';
import { useTheme } from '@mui/material/styles';
import { checkEmail, registerUser } from '../../api/user';
import CommonDialog from '../../components/CommonDialog';
import { ROUTES } from '../../routes';
import { getThemeColors } from '../../theme';
import ThemedButton from '../../components/common/ThemedButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { usePasswordValidation } from '../../hooks/usePasswordValidation';
import { useInputWithTrim } from '../../hooks/useInputWithTrim';
import { PAGE_SPACING } from '../../constants/spacing';

export default function Register() {
  const theme = useTheme();
  const userTheme = 'user' as const;
  const colors = getThemeColors(userTheme);
  
  // trim 처리가 적용된 입력 필드들
  const nameInput = useInputWithTrim('');
  const emailInput = useInputWithTrim('');
  const affiliationInput = useInputWithTrim('');
  
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailCheckMsg, setEmailCheckMsg] = useState('');
  const [emailCheckColor, setEmailCheckColor] = useState<'success' | 'error' | ''>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState('');
  const [dialogOnConfirm, setDialogOnConfirm] = useState<(() => void) | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);

  // 비밀번호 검증 Hook 사용
  const passwordValidation = usePasswordValidation();

  const handleEmailCheck = async () => {
    const trimmedEmail = emailInput.getTrimmedValue();
    if (!trimmedEmail) {
      setEmailError('이메일을 입력해 주세요.');
      setDialogMsg('이메일을 입력해 주세요.');
      setDialogOpen(true);
      return;
    }

    // 이메일 형식 검증
    if (!isValidEmail(trimmedEmail)) {
      setEmailError('이메일 형식으로 입력해 주세요.');
      setEmailCheckMsg('');
      setEmailCheckColor('');
      setEmailChecked(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await checkEmail(trimmedEmail);
      if (res.success && res.data?.isAvailable) {
        setEmailCheckMsg('사용 가능한 이메일입니다.');
        setEmailCheckColor('success');
        setEmailChecked(true);
        setEmailError('');
      } else {
        setEmailCheckMsg(res.errorMessage || '이미 사용 중인 이메일입니다.');
        setEmailCheckColor('error');
        setEmailChecked(false);
        setEmailError(res.errorMessage || '이미 사용 중인 이메일입니다.');
      }
    } catch (error) {
      setEmailCheckMsg('이메일 확인 중 오류가 발생했습니다.');
      setEmailCheckColor('error');
      setEmailChecked(false);
      setEmailError('이메일 확인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    const trimmedName = nameInput.getTrimmedValue();
    const trimmedEmail = emailInput.getTrimmedValue();
    const trimmedAffiliation = affiliationInput.getTrimmedValue();
    
    let hasError = false;
    if (!trimmedName) {
      setNameError('이름을 입력해 주세요.');
      hasError = true;
    } else {
      setNameError('');
    }
    if (!isValidEmail(trimmedEmail)) {
      setEmailError('이메일 형식으로 입력해 주세요.');
      setEmailCheckMsg('');
      setEmailCheckColor('');
      hasError = true;
    } else if (!emailChecked) {
      setEmailError('이메일 중복 확인을 해주세요.');
      setEmailCheckMsg('');
      setEmailCheckColor('');
      hasError = true;
    } else {
      setEmailError('');
    }
    if (!passwordValidation.password) {
      hasError = true;
    } else if (passwordValidation.passwordError) {
      hasError = true;
    }
    if (!passwordValidation.confirmPassword) {
      hasError = true;
    } else if (passwordValidation.confirmPasswordError) {
      hasError = true;
    }
    if (hasError) return;
    
    setIsLoading(true);
    try {
      // 실제 회원가입 API 연동
      const registerData: UserRegisterReq = { 
        email: trimmedEmail, 
        password: passwordValidation.password, 
        name: trimmedName, 
        affiliation: trimmedAffiliation 
      };
      const res = await registerUser(registerData);
      if (res.success) {
        setSuccess(true);
        setDialogMsg('회원가입이 완료되었습니다! 로그인 화면으로 이동합니다.');
        setDialogOnConfirm(() => () => {
          setDialogOpen(false);
          window.location.href = ROUTES.PUBLIC.LOGIN;
        });
        setDialogOpen(true);
      } else {
        setDialogMsg(res.errorMessage || '회원가입에 실패했습니다.');
        setDialogOnConfirm(undefined);
        setDialogOpen(true);
      }
    } catch (error) {
      setDialogMsg('회원가입 중 오류가 발생했습니다.');
      setDialogOnConfirm(undefined);
      setDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box id="register-page" sx={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: colors.background
    }}>
      <Box id="register-form-box" sx={{
        maxWidth: 400,
        width: '100%',
        mx: 'auto',
        p: 4,
        borderRadius: 3,
        bgcolor: colors.paper,
        border: `1px solid ${colors.border}`,
        boxShadow: `0 4px 12px ${colors.primary}15`,
        position: 'relative'
      }}>
        <LoadingSpinner 
          loading={isLoading} 
          size={50}
          backgroundOpacity={0.7}
          color="primary"
        />
        <Typography variant="h5" mb={PAGE_SPACING.REGISTER.TITLE_BOTTOM} align="center" sx={{ color: colors.text, fontWeight: 600 }}>
          회원가입
        </Typography>
        <TextField
          id="register-name-input"
          label="이름"
          fullWidth
          margin="none"
          value={nameInput.value}
          onChange={(e) => nameInput.onChange(e.target.value)}
          error={!!nameError}
          helperText={nameError}
          sx={{ mb: PAGE_SPACING.REGISTER.FIELD_BOTTOM }}
        />
        <Box display="flex" alignItems="flex-end" gap={1} sx={{ mb: PAGE_SPACING.REGISTER.FIELD_BOTTOM }}>
          <Box sx={{ flex: 1, height: 56 }}>
            <TextField
              id="register-email-input"
              label={<span>이메일 <span style={{color: theme.palette.error.main}}>*</span></span>}
              type="email"
              fullWidth
              margin="none"
              value={emailInput.value}
              onChange={(e) => emailInput.onChange(e.target.value)}
              error={!!emailError}
              helperText=""
              sx={{
                height: 56,
                '& .MuiFormHelperText-root': {
                  display: 'none'
                },
                '& .MuiInputBase-root': {
                  height: 56
                },
                '& .MuiFormLabel-root': {
                  transform: 'translate(14px, 16px) scale(1)',
                  '&.Mui-focused': {
                    transform: 'translate(14px, -9px) scale(0.75)'
                  },
                  '&.MuiFormLabel-filled': {
                    transform: 'translate(14px, -9px) scale(0.75)'
                  }
                },
                '& .MuiOutlinedInput-root': {
                  height: 56,
                  '& fieldset': {
                    borderColor: emailError ? theme.palette.error.main : undefined
                  },
                  '&:hover fieldset': {
                    borderColor: emailError ? theme.palette.error.main : undefined
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: emailError ? theme.palette.error.main : theme.palette.primary.main
                  }
                }
              }}
            />
          </Box>
          <ThemedButton
            id="register-email-check-btn"
            
            variant="outlined"
            sx={{ 
              height: 56, 
              whiteSpace: 'nowrap'
            }}
            onClick={handleEmailCheck}
            disabled={isLoading}
          >
            중복확인
          </ThemedButton>
        </Box>
        {/* 에러 메시지를 별도 영역에 표시 */}
        {emailError && (
          <Box sx={{ mb: PAGE_SPACING.REGISTER.FIELD_BOTTOM }}>
            <Typography 
              fontSize={12} 
              color="error.main"
              sx={{ ml: 1 }}
            >
              {emailError}
            </Typography>
          </Box>
        )}
        {emailCheckMsg && emailCheckColor === 'success' && (
          <Typography 
            mb={PAGE_SPACING.REGISTER.SUCCESS_MESSAGE_BOTTOM} 
            ml={1} 
            fontSize={14} 
            fontWeight="bold"
            color="success.main"
            sx={{ 
              padding: '4px 0'
            }}
          >
            {emailCheckMsg}
          </Typography>
        )}
        <TextField
          id="register-password-input"
          label={<span>비밀번호 <span style={{color: theme.palette.error.main}}>*</span></span>}
          type={showPw ? 'text' : 'password'}
          fullWidth
          margin="none"
          value={passwordValidation.password}
          onChange={(e) => passwordValidation.setPassword(e.target.value)}
          error={!!passwordValidation.passwordError}
          placeholder="영문자, 숫자, 특수문자 포함 8자리 이상"
          helperText={passwordValidation.passwordError}
          sx={{ mb: PAGE_SPACING.REGISTER.FIELD_BOTTOM }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="비밀번호 보기/숨기기"
                  onClick={() => setShowPw(!showPw)}
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
          label={<span>비밀번호 확인 <span style={{color: theme.palette.error.main}}>*</span></span>}
          type={showPw2 ? 'text' : 'password'}
          fullWidth
          margin="none"
          value={passwordValidation.confirmPassword}
          onChange={(e) => passwordValidation.setConfirmPassword(e.target.value)}
          error={!!passwordValidation.confirmPasswordError}
          helperText={passwordValidation.confirmPasswordError}
          sx={{ mb: PAGE_SPACING.REGISTER.FIELD_BOTTOM }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="비밀번호 확인 보기/숨기기"
                  onClick={() => setShowPw2(!showPw2)}
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
          margin="none"
          value={affiliationInput.value}
          onChange={(e) => affiliationInput.onChange(e.target.value)}
          sx={{ mb: PAGE_SPACING.REGISTER.FIELD_BOTTOM }}
        />
        {success && <Typography color="primary" align="center" mt={2}>회원가입이 완료되었습니다! 로그인 화면으로 이동합니다.</Typography>}
        <ThemedButton 
          id="register-submit-btn" 
          
          variant="primary"
          fullWidth 
          sx={{ 
            mt: 2, 
            fontSize: '1.1rem', 
            py: 1.2
          }} 
          onClick={handleRegister}
          disabled={isLoading || !emailChecked || !!passwordValidation.passwordError || !!passwordValidation.confirmPasswordError}
        >
          {isLoading ? '회원가입 중...' : !emailChecked ? '이메일 중복 확인 필요' : '회원가입'}
        </ThemedButton>
        <ThemedButton 
          id="register-login-btn" 
          
          variant="softText"
          fullWidth 
          sx={{ 
            mt: 1, 
            fontSize: '0.95rem'
          }} 
          onClick={() => window.location.href = ROUTES.PUBLIC.LOGIN}
        >
          로그인 화면으로
        </ThemedButton>
      </Box>
      <CommonDialog
        open={dialogOpen}
        message={dialogMsg}
        onClose={() => setDialogOpen(false)}
        onConfirm={dialogOnConfirm}
      />
    </Box>
  );
} 