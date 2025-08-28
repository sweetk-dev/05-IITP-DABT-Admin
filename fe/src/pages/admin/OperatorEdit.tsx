import React, { useState, useEffect } from 'react';
import { Box, CardContent, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import ErrorAlert from '../../components/ErrorAlert';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { getAdminAccountDetail, updateAdminAccount } from '../../api/account';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import { useDataFetching } from '../../hooks/useDataFetching';
import type { AdminAccountUpdateReq } from '@iitp-dabt/common';

export default function OperatorEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const operatorId = Number(id);

  const { data, error: fetchError } = useDataFetching({
    fetchFunction: () => getAdminAccountDetail(operatorId),
    dependencies: [operatorId],
    autoFetch: !!operatorId
  });

  const operator = (data as any)?.admin;

  const [name, setName] = useState('');
  const [role, setRole] = useState<'S' | 'A'>('A');
  const [affiliation, setAffiliation] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'A' | 'I' | 'S'>('A');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (operator) {
      setName(operator.name || '');
      setRole(operator.role || 'A');
      setAffiliation(operator.affiliation || '');
      setDescription(operator.description || '');
      setNote(operator.note || '');
      setStatus(operator.status || 'A');
    }
  }, [operator]);

  const handleBack = () => navigate(`/admin/operators/${operatorId}`);
  
  const handleSubmit = async () => {
    // 유효성 검사
    if (!name.trim()) {
      setError('이름을 입력해 주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updateData: AdminAccountUpdateReq = {
        name,
        role,
        affiliation: affiliation || undefined,
        description: description || undefined,
        note: note || undefined,
        status
      };

      const res = await updateAdminAccount(operatorId, updateData);

      handleApiResponse(res, () => {
        navigate(`/admin/operators/${operatorId}`);
      }, (msg) => setError(msg));
    } catch (error) {
      setError('운영자 계정 수정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box id="admin-operator-edit-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader 
        id="admin-operator-edit-header" 
        title="운영자 계정 수정" 
        onBack={() => navigate(`/admin/operators/${operatorId}`)} 
      />
      
      {/* 에러 알림 */}
      {(error || fetchError) && (
        <ErrorAlert 
          error={error || fetchError} 
          onClose={() => setError(null)} 
        />
      )}
      
      <ThemedCard>
        <CardContent>
          <TextField
            id="operator-name"
            fullWidth
            label="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: SPACING.MEDIUM }}
            required
            helperText="운영자의 실명을 입력해주세요"
          />
          
          <FormControl fullWidth sx={{ mb: SPACING.MEDIUM }}>
            <InputLabel id="operator-role-label">역할</InputLabel>
            <Select
              labelId="operator-role-label"
              id="operator-role"
              value={role}
              label="역할"
              onChange={(e) => setRole(e.target.value as 'S' | 'A')}
            >
              <MenuItem value="S">슈퍼관리자</MenuItem>
              <MenuItem value="A">일반관리자</MenuItem>
            </Select>
            <FormHelperText>운영자의 권한 레벨을 설정합니다</FormHelperText>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: SPACING.MEDIUM }}>
            <InputLabel id="operator-status-label">상태</InputLabel>
            <Select
              labelId="operator-status-label"
              id="operator-status"
              value={status}
              label="상태"
              onChange={(e) => setStatus(e.target.value as 'A' | 'I' | 'S')}
            >
              <MenuItem value="A">활성</MenuItem>
              <MenuItem value="I">비활성</MenuItem>
              <MenuItem value="S">정지</MenuItem>
            </Select>
            <FormHelperText>계정의 사용 가능 여부를 설정합니다</FormHelperText>
          </FormControl>
          
          <TextField
            id="operator-affiliation"
            fullWidth
            label="소속"
            value={affiliation}
            onChange={(e) => setAffiliation(e.target.value)}
            sx={{ mb: SPACING.MEDIUM }}
            helperText="운영자의 소속 부서나 팀을 입력해주세요"
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
            helperText="운영자에 대한 상세 설명을 입력해주세요"
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
            helperText="관리자용 메모를 입력해주세요"
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: SPACING.LARGE }}>
            <ThemedButton 
              variant="outlined" 
              onClick={() => navigate(`/admin/operators/${operatorId}`)} 
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
              저장
            </ThemedButton>
          </Box>
        </CardContent>
      </ThemedCard>
    </Box>
  );
}
