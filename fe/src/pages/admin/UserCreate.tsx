import React, { useState } from 'react';
import { Box, CardContent, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { createUserAccount, checkUserEmail } from '../../api/account';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import SelectField from '../../components/common/SelectField';
import ErrorAlert from '../../components/ErrorAlert';
import { isValidEmail } from '@iitp-dabt/common';

export default function UserCreate() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'A' | 'I' | 'S'>('A');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailChecked, setEmailChecked] = useState(false); // 이메일 중복체크 상태
  const [checkingEmail, setCheckingEmail] = useState(false); // 이메일 중복체크 중 상태

  const statusOptions = [
    { value: 'A', label: '활성' },
    { value: 'I', label: '비활성' },
    { value: 'S', label: '정지' }
  ];

  const handleBack = () => navigate(ROUTES.ADMIN.USERS.LIST);
  
  const handleSubmit = async () => {
    // 유효성 검사
    if (!loginId || !password || !confirmPassword || !name) {
      setError('로그인 ID(이메일), 비밀번호, 비밀번호 확인, 이름은 필수입니다.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    // 이메일 형식 검사 (공통함수 사용)
    if (!isValidEmail(loginId)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    // ✅ Email 중복체크 검증 추가
    if (!emailChecked) {
      setError('이메일 중복체크를 먼저 완료해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await createUserAccount({
        loginId,
        password,
        name,
        affiliation: affiliation || undefined,
        note: note || undefined,
        status
      });

      handleApiResponse(res, () => {
        navigate(ROUTES.ADMIN.USERS.LIST);
      }, (msg) => setError(msg));
    } catch (error) {
      setError('사용자 계정 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginId(e.target.value);
    setEmailChecked(false); // 입력값이 변경되면 중복체크 상태 초기화
  };

  const handleCheckEmail = async () => {
    if (!loginId.trim()) {
      setError('이메일을 입력해 주세요.');
      return;
    }

    // 이메일 형식 검증 (공통함수 사용)
    if (!isValidEmail(loginId)) {
      setError('이메일 형식으로 입력해 주세요.');
      setEmailChecked(false);
      return;
    }

    setCheckingEmail(true);
    setError(null);

    try {
      const res = await checkUserEmail({ email: loginId });
      if (res.success && res.data?.available) {
        setEmailChecked(true);
        setError(null);
      } else {
        setError(res.errorMessage || '이미 사용 중인 이메일입니다.');
        setEmailChecked(false);
      }
    } catch (error) {
      setError('이메일 중복체크 중 오류가 발생했습니다.');
      setEmailChecked(false);
    } finally {
      setCheckingEmail(false);
    }
  };

  return (
    <Box id="admin-user-create-page" sx={{ p: SPACING.LARGE }}>
      <AdminPageHeader />
      
      <PageHeader 
        id="admin-user-create-header" 
        title="사용자 계정 등록" 
      />
      <ThemedCard>
        <CardContent>
          {error && (
            <ErrorAlert 
              error={error} 
              onClose={() => setError(null)} 
            />
          )}
          
          <TextField
            id="user-login-id"
            fullWidth
            label="로그인 ID (이메일)"
            type="email"
            value={loginId}
            onChange={handleLoginIdChange}
            sx={{ mb: SPACING.MEDIUM }}
            required
            helperText="이메일 형식으로 입력해주세요"
          />
          
          {/* ✅ Email 중복체크 버튼 및 상태 표시 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: SPACING.MEDIUM }}>
            <ThemedButton
              variant="outlined"
              onClick={handleCheckEmail}
              disabled={checkingEmail || !loginId.trim()}
              sx={{ 
                minWidth: '120px',
                backgroundColor: '#fff0f5', // 파스텔 핑크
                borderColor: '#ffb6c1',
                color: '#c71585',
                '&:hover': {
                  backgroundColor: '#ffe6f0',
                  borderColor: '#ff69b4'
                },
                '&:disabled': {
                  backgroundColor: '#f5f5f5',
                  borderColor: '#d3d3d3',
                  color: '#a9a9a9'
                }
              }}
            >
              {checkingEmail ? '확인 중...' : '이메일 중복체크'}
            </ThemedButton>
            {emailChecked && (
              <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'medium' }}>
                ✅ 사용 가능한 이메일입니다
              </Typography>
            )}
            {!emailChecked && loginId.trim() && (
              <Typography variant="body2" color="text.secondary">
                이메일 중복체크를 완료해주세요
              </Typography>
            )}
          </Box>
          
          <TextField
            id="user-password"
            fullWidth
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: SPACING.MEDIUM }}
            required
            helperText="8자 이상 입력해주세요"
          />
          
          <TextField
            id="user-confirm-password"
            fullWidth
            label="비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: SPACING.MEDIUM }}
            required
          />
          
          <TextField
            id="user-name"
            fullWidth
            label="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: SPACING.MEDIUM }}
            required
          />
          
          <SelectField
            id="user-status"
            value={status}
            onChange={(v) => setStatus(v as 'A' | 'I' | 'S')}
            options={statusOptions}
            label="상태"
          />
          
          <TextField
            id="user-affiliation"
            fullWidth
            label="소속"
            value={affiliation}
            onChange={(e) => setAffiliation(e.target.value)}
            sx={{ mb: SPACING.MEDIUM }}
          />
          
          <TextField
            id="user-note"
            fullWidth
            label="비고"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            multiline
            minRows={3}
            sx={{ mb: SPACING.MEDIUM }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: SPACING.LARGE }}>
            <ThemedButton 
              variant="outlined" 
              onClick={handleBack} 
              buttonSize="cta"
            >
              취소
            </ThemedButton>
            <ThemedButton 
              variant="primary" 
              buttonSize="cta" 
              onClick={handleSubmit} 
              disabled={loading}
            >
              등록
            </ThemedButton>
          </Box>
        </CardContent>
      </ThemedCard>
    </Box>
  );
}
