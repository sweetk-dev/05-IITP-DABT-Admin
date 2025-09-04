import { useState, useEffect } from 'react';
import { Box, CardContent, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import ErrorAlert from '../../components/ErrorAlert';
import { SPACING } from '../../constants/spacing';
//import { ROUTES } from '../../routes';
import { getUserAccountDetail, updateUserAccount } from '../../api/account';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import { useDataFetching } from '../../hooks/useDataFetching';
import type { UserAccountUpdateReq } from '@iitp-dabt/common';

export default function UserEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);

  const { data, isError, status: fetchStatus } = useDataFetching({
    fetchFunction: () => getUserAccountDetail(userId),
    dependencies: [userId],
    autoFetch: !!userId
  });

  const fetchError = isError && fetchStatus === 'error' ? (data as any)?.error : undefined;

  const user = (data as any)?.user;

  const [name, setName] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'A' | 'I' | 'S'>('A');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAffiliation(user.affiliation || '');
      setNote(user.note || '');
      setStatus(user.status || 'A');
    }
  }, [user]);

  //const handleBack = () => navigate(`/admin/users/${userId}`);
  
  const handleSubmit = async () => {
    // 유효성 검사
    if (!name.trim()) {
      setError('이름을 입력해 주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updateData: UserAccountUpdateReq = {
        name,
        affiliation: affiliation || undefined,
        note: note || undefined,
        status
      };

      const res = await updateUserAccount(userId, updateData);

      handleApiResponse(res, () => {
        navigate(`/admin/users/${userId}`);
      }, (msg) => setError(msg));
    } catch (error) {
      setError('사용자 계정 수정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box id="admin-user-edit-page" sx={{ p: SPACING.LARGE }}>
      <AdminPageHeader />
      
      <PageHeader 
        id="admin-user-edit-header" 
        title="사용자 계정 수정" 
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
            id="user-name"
            fullWidth
            label="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: SPACING.MEDIUM }}
            required
            helperText="사용자의 실명을 입력해주세요"
          />
          
          <FormControl fullWidth sx={{ mb: SPACING.MEDIUM }}>
            <InputLabel id="user-status-label">상태</InputLabel>
            <Select
              labelId="user-status-label"
              id="user-status"
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
            id="user-affiliation"
            fullWidth
            label="소속"
            value={affiliation}
            onChange={(e) => setAffiliation(e.target.value)}
            sx={{ mb: SPACING.MEDIUM }}
            helperText="사용자의 소속 부서나 팀을 입력해주세요"
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
            helperText="관리자용 메모를 입력해주세요"
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: SPACING.LARGE }}>
            <ThemedButton 
              variant="outlined" 
              onClick={() => navigate(`/admin/users/${userId}`)} 
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
