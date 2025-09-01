import React, { useState, useEffect } from 'react';
import { Box, CardContent, TextField, Alert, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { ROUTES } from '../../routes';
import { SPACING } from '../../constants/spacing';
import { createAdminAccount, checkAdminEmail } from '../../api/account';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import SelectField from '../../components/common/SelectField';
import ErrorAlert from '../../components/ErrorAlert';
import { getCommonCodesByGroupId } from '../../api';
import { COMMON_CODE_GROUPS, isValidEmail } from '@iitp-dabt/common';
import { useDataFetching } from '../../hooks/useDataFetching';

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
  const [emailChecked, setEmailChecked] = useState(false);  // ✅ Email 중복체크 상태 추가
  const [checkingEmail, setCheckingEmail] = useState(false);  // ✅ Email 중복체크 중 상태

  // 공통 코드 조회 (운영자 역할)
  const { data: roleCodes, isLoading: roleLoading } = useDataFetching({ 
    fetchFunction: () => getCommonCodesByGroupId(COMMON_CODE_GROUPS.SYS_ADMIN_ROLES), 
    autoFetch: true 
  });
  
  // 역할 옵션 생성
  const [roleOptions, setRoleOptions] = useState<{ value: string; label: string }[]>([
    { value: '', label: '역할을 선택하세요' }
  ]);
  
  useEffect(() => {
    if (roleCodes?.codes) {
      const options = [
        { value: '', label: '역할을 선택하세요' },
        ...roleCodes.codes.map((code: any) => ({ 
          value: code.codeId, 
          label: code.codeNm 
        }))
      ];
      setRoleOptions(options);
    }
  }, [roleCodes]);

  // ✅ Email 중복체크 함수 추가
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
      const res = await checkAdminEmail({ loginId });
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

  // ✅ loginId 변경 시 email 중복체크 상태 초기화
  const handleLoginIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginId(e.target.value);
    setEmailChecked(false);  // Email 변경 시 중복체크 상태 초기화
  };

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
      }, (msg: string) => setError(msg));
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
            onChange={handleLoginIdChange}
            sx={{ mb: SPACING.MEDIUM }}
            required
          />
          
          {/* ✅ Email 중복체크 버튼 및 상태 표시 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: SPACING.MEDIUM }}>
            <ThemedButton
              variant="outlined"
              onClick={handleCheckEmail}
              disabled={checkingEmail || !loginId.trim()}
              sx={{ 
                minWidth: '120px',
                backgroundColor: '#f0f8ff', // 파스텔 블루
                borderColor: '#87ceeb',
                color: '#4682b4',
                '&:hover': {
                  backgroundColor: '#e6f3ff',
                  borderColor: '#5f9ea0'
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
          />
          
          <SelectField
            id="operator-status"
            value={status}
            onChange={(v) => setStatus(v as 'A' | 'I' | 'S')}
            options={statusOptions}
            label="상태"
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
