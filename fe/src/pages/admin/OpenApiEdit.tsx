import { useState, useEffect } from 'react';
import { Box, CardContent, TextField, Stack, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import StatusChip from '../../components/common/StatusChip';
import ErrorAlert from '../../components/ErrorAlert';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { extendAdminOpenApi, getAdminOpenApiDetail, updateAdminOpenApi } from '../../api';
import { useDataFetching } from '../../hooks/useDataFetching';
import { getOpenApiKeyStatus } from '../../utils/openApiStatus';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import CommonToast from '../../components/CommonToast';
import { getUserInfo } from '../../store/user';
import type { AdminOpenApiUpdateReq, AdminOpenApiExtendReq } from '@iitp-dabt/common';

export default function AdminOpenApiEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const keyId = Number(id);

  const { data, isError, status } = useDataFetching({ 
    fetchFunction: ()=> getAdminOpenApiDetail(keyId), 
    dependencies: [keyId], 
    autoFetch: !!keyId 
  });

  const fetchError = isError && status === 'error' ? (data as any)?.error : undefined;
  
  const detail = (data as any)?.authKey || (data as any) || {};

  const [keyName, setKeyName] = useState('');
  const [keyDesc, setKeyDesc] = useState('');
  const [startDt, setStartDt] = useState<string>('');
  const [endDt, setEndDt] = useState<string>('');
  const [activeYn, setActiveYn] = useState<'Y' | 'N'>('Y');
  
  useEffect(() => {
    if (detail) {
      setKeyName(detail.keyName || '');
      setKeyDesc(detail.keyDesc || '');
      setStartDt(detail.startDt ? detail.startDt.split('T')[0] : '');
      setEndDt(detail.endDt ? detail.endDt.split('T')[0] : '');
      setActiveYn(detail.activeYn || 'Y');
    }
  }, [detail]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity?: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  const handleSave = async () => {
    if (!keyName.trim()) {
      setError('키 이름을 입력해주세요.');
      return;
    }
    
    setLoading(true); 
    setError(null);
    
    const updateData: AdminOpenApiUpdateReq = { 
      keyName, 
      keyDesc,
      activeYn,
      updatedBy: 'admin' // TODO: 실제 관리자 정보로 교체
    };
    
    const res = await updateAdminOpenApi(keyId, updateData);
    handleApiResponse(res, ()=>{ 
      setToast({ open: true, message: '저장되었습니다.', severity: 'success' }); 
      navigate(ROUTES.ADMIN.OPENAPI.CLIENTS + '/' + keyId); 
    }, (msg)=>setError(msg));
    setLoading(false);
  };
  
  const handleExtend = async () => {
    if (!startDt || !endDt) {
      setError('시작일과 종료일을 모두 입력해주세요.');
      return;
    }
    
    if (new Date(startDt) > new Date(endDt)) {
      setError('시작일은 종료일보다 이전이어야 합니다.');
      return;
    }
    
    setLoading(true); 
    setError(null);
    
    const actor = getUserInfo();
    const updatedBy = actor ? `A:${actor.userId}` : 'A:unknown';
    
    const extendData: AdminOpenApiExtendReq = { 
      startDt, 
      endDt, 
      updatedBy 
    };
    
    const res = await extendAdminOpenApi(keyId, extendData);
    handleApiResponse(res, ()=>{ 
      setToast({ open: true, message: '인증키 기간이 연장되었습니다.', severity: 'success' }); 
      navigate(ROUTES.ADMIN.OPENAPI.CLIENTS + '/' + keyId); 
    }, (msg)=>setError(msg));
    setLoading(false);
  };

  return (
    <Box id="admin-openapi-edit-page" sx={{ p: SPACING.LARGE }}>
      <AdminPageHeader />
      
      <PageHeader 
        id="admin-openapi-edit-header" 
        title="OpenAPI 기간연장/수정" 
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
          {detail?.keyId && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: SPACING.MEDIUM }}>
              <Typography variant="h6" fontWeight={700}>{detail.keyName || `Key ${detail.keyId}`}</Typography>
              <StatusChip kind={getOpenApiKeyStatus(detail)} />
            </Stack>
          )}
          
          <TextField 
            id="key-name" 
            fullWidth 
            label="이름" 
            value={keyName} 
            onChange={(e)=>setKeyName(e.target.value)} 
            sx={{ mb: SPACING.MEDIUM }} 
            required
            helperText="인증키의 식별을 위한 이름을 입력해주세요"
          />
          
          <TextField 
            id="key-desc" 
            fullWidth 
            label="설명" 
            value={keyDesc} 
            onChange={(e)=>setKeyDesc(e.target.value)} 
            multiline
            minRows={3}
            sx={{ mb: SPACING.MEDIUM }} 
            helperText="인증키에 대한 상세 설명을 입력해주세요"
          />
          
          <FormControl fullWidth sx={{ mb: SPACING.MEDIUM }}>
            <InputLabel id="active-yn-label">활성 여부</InputLabel>
            <Select
              labelId="active-yn-label"
              id="active-yn"
              value={activeYn}
              label="활성 여부"
              onChange={(e) => setActiveYn(e.target.value as 'Y' | 'N')}
            >
              <MenuItem value="Y">활성</MenuItem>
              <MenuItem value="N">비활성</MenuItem>
            </Select>
            <FormHelperText>인증키의 사용 가능 여부를 설정합니다</FormHelperText>
          </FormControl>
          
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>기간 설정</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: SPACING.MEDIUM }}>
            <TextField 
              id="extend-start" 
              fullWidth 
              type="date" 
              label="시작일" 
              value={startDt} 
              onChange={(e)=>setStartDt(e.target.value)} 
              InputLabelProps={{ shrink: true }} 
              helperText="인증키 사용 시작일"
            />
            <TextField 
              id="extend-end" 
              fullWidth 
              type="date" 
              label="종료일" 
              value={endDt} 
              onChange={(e)=>setEndDt(e.target.value)} 
              InputLabelProps={{ shrink: true }} 
              helperText="인증키 사용 종료일"
            />
          </Stack>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <ThemedButton variant="outlined" onClick={() => navigate(ROUTES.ADMIN.OPENAPI.CLIENTS + '/' + keyId)} buttonSize="cta">취소</ThemedButton>
            <ThemedButton variant="outlined" onClick={handleExtend} disabled={loading} buttonSize="cta">기간연장</ThemedButton>
            <ThemedButton variant="primary" onClick={handleSave} disabled={loading} buttonSize="cta">저장</ThemedButton>
          </Box>
        </CardContent>
      </ThemedCard>
      <CommonToast open={!!toast?.open} message={toast?.message || ''} severity={toast?.severity} onClose={()=>setToast(null)} />
    </Box>
  );
}


