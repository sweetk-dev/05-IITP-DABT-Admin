import { useState } from 'react';
import { Box, CardContent, TextField, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { extendAdminOpenApi, getAdminOpenApiDetail, updateAdminOpenApi } from '../../api';
import { useDataFetching } from '../../hooks/useDataFetching';
import { handleApiResponse } from '../../utils/apiResponseHandler';

export default function AdminOpenApiEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const keyId = Number(id);

  const { data } = useDataFetching({ fetchFunction: ()=> getAdminOpenApiDetail(keyId), dependencies: [keyId], autoFetch: !!keyId });
  const detail = (data as any)?.authKey || (data as any) || {};

  const [keyName, setKeyName] = useState(detail.keyName || '');
  const [keyDesc, setKeyDesc] = useState(detail.keyDesc || '');
  const [extensionDays, setExtensionDays] = useState(90);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => navigate(ROUTES.ADMIN.OPENAPI.CLIENTS + '/' + keyId);
  const handleSave = async () => {
    setLoading(true); setError(null);
    const res = await updateAdminOpenApi(keyId, { keyName, keyDesc } as any);
    handleApiResponse(res, ()=>navigate(ROUTES.ADMIN.OPENAPI.CLIENTS + '/' + keyId), (msg)=>setError(msg));
    setLoading(false);
  };
  const handleExtend = async () => {
    setLoading(true); setError(null);
    const res = await extendAdminOpenApi(keyId, { extensionDays } as any);
    handleApiResponse(res, ()=>navigate(ROUTES.ADMIN.OPENAPI.CLIENTS + '/' + keyId), (msg)=>setError(msg));
    setLoading(false);
  };

  return (
    <Box id="admin-openapi-edit-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader id="admin-openapi-edit-header" title="OpenAPI 기간연장/수정" onBack={handleBack} />
      <ThemedCard>
        <CardContent>
          {error && (<Alert severity="error" sx={{ mb: SPACING.MEDIUM }} onClose={()=>setError(null)}>{error}</Alert>)}
          <TextField id="key-name" fullWidth label="이름" value={keyName} onChange={(e)=>setKeyName(e.target.value)} sx={{ mb: SPACING.MEDIUM }} />
          <TextField id="key-desc" fullWidth label="설명" value={keyDesc} onChange={(e)=>setKeyDesc(e.target.value)} sx={{ mb: SPACING.MEDIUM }} />
          <TextField id="extension-days" fullWidth type="number" label="연장 일수" value={extensionDays} onChange={(e)=>setExtensionDays(Number(e.target.value))} sx={{ mb: SPACING.MEDIUM }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <ThemedButton variant="outlined" onClick={handleBack} buttonSize="cta">취소</ThemedButton>
            <ThemedButton variant="outlined" onClick={handleExtend} disabled={loading} buttonSize="cta">기간연장</ThemedButton>
            <ThemedButton variant="primary" onClick={handleSave} disabled={loading} buttonSize="cta">저장</ThemedButton>
          </Box>
        </CardContent>
      </ThemedCard>
    </Box>
  );
}


