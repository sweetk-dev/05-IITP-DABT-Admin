import { useState, useEffect } from 'react';
import { Box, CardContent, TextField, Alert, Stack, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { extendAdminOpenApi, getAdminOpenApiDetail, updateAdminOpenApi } from '../../api';
import { useDataFetching } from '../../hooks/useDataFetching';
import StatusChip from '../../components/common/StatusChip';
import { getOpenApiKeyStatus } from '../../utils/openApiStatus';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import CommonToast from '../../components/CommonToast';

export default function AdminOpenApiEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const keyId = Number(id);

  const { data } = useDataFetching({ fetchFunction: ()=> getAdminOpenApiDetail(keyId), dependencies: [keyId], autoFetch: !!keyId });
  const detail = (data as any)?.authKey || (data as any) || {};

  const [keyName, setKeyName] = useState(detail.keyName || '');
  const [keyDesc, setKeyDesc] = useState(detail.keyDesc || '');
  const [startDt, setStartDt] = useState<string>('');
  const [endDt, setEndDt] = useState<string>('');
  useEffect(() => {
    if (detail?.startDt) setStartDt(detail.startDt);
    if (detail?.endDt) setEndDt(detail.endDt);
  }, [detail?.startDt, detail?.endDt]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity?: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  const handleBack = () => navigate(ROUTES.ADMIN.OPENAPI.CLIENTS + '/' + keyId);
  const handleSave = async () => {
    setLoading(true); setError(null);
    const res = await updateAdminOpenApi(keyId, { keyName, keyDesc } as any);
    handleApiResponse(res, ()=>{ setToast({ open: true, message: '저장되었습니다.', severity: 'success' }); navigate(ROUTES.ADMIN.OPENAPI.CLIENTS + '/' + keyId); }, (msg)=>setError(msg));
    setLoading(false);
  };
  const handleExtend = async () => {
    setLoading(true); setError(null);
    const actorRaw = window.localStorage.getItem('userInfo');
    const actor = actorRaw ? JSON.parse(actorRaw) : null;
    const updatedBy = actor ? `A:${actor.userId}` : 'A:unknown';
    const res = await extendAdminOpenApi(keyId, { startDt, endDt, updatedBy } as any);
    handleApiResponse(res, ()=>{ setToast({ open: true, message: '인증키 기간이 연장되었습니다.', severity: 'success' }); navigate(ROUTES.ADMIN.OPENAPI.CLIENTS + '/' + keyId); }, (msg)=>setError(msg));
    setLoading(false);
  };

  return (
    <Box id="admin-openapi-edit-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader id="admin-openapi-edit-header" title="OpenAPI 기간연장/수정" onBack={handleBack} />
      <ThemedCard>
        <CardContent>
          {detail?.keyId && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: SPACING.MEDIUM }}>
              <Typography variant="h6" fontWeight={700}>{detail.keyName || `Key ${detail.keyId}`}</Typography>
              <StatusChip kind={getOpenApiKeyStatus(detail)} />
            </Stack>
          )}
          {error && (<Alert severity="error" sx={{ mb: SPACING.MEDIUM }} onClose={()=>setError(null)}>{error}</Alert>)}
          <TextField id="key-name" fullWidth label="이름" value={keyName} onChange={(e)=>setKeyName(e.target.value)} sx={{ mb: SPACING.MEDIUM }} />
          <TextField id="key-desc" fullWidth label="설명" value={keyDesc} onChange={(e)=>setKeyDesc(e.target.value)} sx={{ mb: SPACING.MEDIUM }} />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: SPACING.MEDIUM }}>
            <TextField id="extend-start" fullWidth type="date" label="시작일" value={startDt} onChange={(e)=>setStartDt(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField id="extend-end" fullWidth type="date" label="종료일" value={endDt} onChange={(e)=>setEndDt(e.target.value)} InputLabelProps={{ shrink: true }} />
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <ThemedButton variant="outlined" onClick={handleBack} buttonSize="cta">취소</ThemedButton>
            <ThemedButton variant="outlined" onClick={handleExtend} disabled={loading} buttonSize="cta">기간연장</ThemedButton>
            <ThemedButton variant="primary" onClick={handleSave} disabled={loading} buttonSize="cta">저장</ThemedButton>
          </Box>
        </CardContent>
      </ThemedCard>
      <CommonToast open={!!toast?.open} message={toast?.message || ''} severity={toast?.severity} onClose={()=>setToast(null)} />
    </Box>
  );
}


