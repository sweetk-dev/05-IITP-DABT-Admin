import React, { useState } from 'react';
import { Box, CardContent, TextField, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { createAdminAccount, checkAdminEmail } from '../../api/account';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import SelectField from '../../components/common/SelectField';
import ErrorAlert from '../../components/ErrorAlert';

export default function OperatorCreate() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'A' | 'I' | 'S'>('A');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleOptions = [
    { value: '', label: '역할을 선택하세요' },
    { value: 'S', label: '슈퍼관리자' },
    { value: 'A', label: '일반관리자' }
  ];

  const statusOptions = [
    { value: 'A', label: '활성' },
    { value: 'I', label: '비활성' },
    { value: 'S', label: '정지' }
  ];

  const handleBack = () => navigate(ROUTES.ADMIN.OPERATORS.LIST);
  
  const handleSubmit = async () => {
    // 유효성 검사
    if (!loginId || !password || !confirmPassword || !name || !role) {
      setError('로그인 ID, 비밀번호, 비밀번호 확인, 이름, 역할은 필수입니다.');
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

    setLoading(true);
    setError(null);

    try {
      const res = await createAdminAccount({
        loginId,
        password,
        name,
        role,
        affiliation: affiliation || undefined,
        description: description || undefined,
        note: note || undefined,
        status
      });

      handleApiResponse(res, () => {
        navigate(ROUTES.ADMIN.OPERATORS.LIST);
      }, (msg) => setError(msg));
    } catch (error) {
      setError('운영자 계정 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box id="admin-operator-create-page" sx={{ p: SPACING.LARGE }}>
      <AdminPageHeader />
      
      <PageHeader 
        id="admin-operator-create-header" 
        title="운영자 계정 등록" 
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
            id="operator-login-id"
            fullWidth
            label="로그인 ID"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            sx={{ mb: SPACING.MEDIUM }}
            required
          />
          
          <TextField
            id="operator-password"
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
            id="operator-confirm-password"
            fullWidth
            label="비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: SPACING.MEDIUM }}
            required
          />
          
          <TextField
            id="operator-name"
            fullWidth
            label="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: SPACING.MEDIUM }}
            required
          />
          
          <SelectField
            id="operator-role"
            value={role}
            onChange={(v) => setRole(v)}
            options={roleOptions}
            label="역할"
            sx={{ mb: SPACING.MEDIUM }}
            required
          />
          
          <SelectField
            id="operator-status"
            value={status}
            onChange={(v) => setStatus(v as 'A' | 'I' | 'S')}
            options={statusOptions}
            label="상태"
            sx={{ mb: SPACING.MEDIUM }}
            required
          />
          
          <TextField
            id="operator-affiliation"
            fullWidth
            label="소속"
            value={affiliation}
            onChange={(e) => setAffiliation(e.target.value)}
            sx={{ mb: SPACING.MEDIUM }}
          />
          
          <TextField
            id="operator-description"
            fullWidth
            label="설명"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={3}
            sx={{ mb: SPACING.MEDIUM }}
          />
          
          <TextField
            id="operator-note"
            fullWidth
            label="비고"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            multiline
            minRows={2}
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
