import React, { useState } from 'react';
import { Box, CardContent, TextField, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { createUserAccount } from '../../api/account';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import SelectField from '../../components/common/SelectField';
import ErrorAlert from '../../components/ErrorAlert';

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

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginId)) {
      setError('올바른 이메일 형식을 입력해주세요.');
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

  return (
    <Box id="admin-user-create-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader id="admin-user-create-header" title="사용자 계정 등록" onBack={handleBack} />
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
            onChange={(e) => setLoginId(e.target.value)}
            sx={{ mb: SPACING.MEDIUM }}
            required
            helperText="이메일 형식으로 입력해주세요"
          />
          
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
            sx={{ mb: SPACING.MEDIUM }}
            required
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
