import { Box, CardContent, Typography, Alert, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { useDataFetching } from '../../hooks/useDataFetching';
import { deleteAdminOpenApi, getAdminOpenApiDetail, extendAdminOpenApi } from '../../api';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import { formatYmdHm } from '../../utils/date';
import StatusChip from '../../components/common/StatusChip';
import { getOpenApiKeyStatus } from '../../utils/openApiStatus';
import ExtendKeyDialog from '../../components/common/ExtendKeyDialog';
import CommonToast from '../../components/CommonToast';
import { getUserInfo } from '../../store/user';

export default function AdminOpenApiDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const keyId = Number(id);

  const { data, isLoading, isEmpty, isError, refetch } = useDataFetching({ fetchFunction: ()=> getAdminOpenApiDetail(keyId), dependencies: [keyId], autoFetch: !!keyId });
  const item = (data as any)?.authKey || (data as any);

  const handleBack = () => navigate(ROUTES.ADMIN.OPENAPI.CLIENTS);
  const [extendOpen, setExtendOpen] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity?: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const handleEdit = () => navigate(ROUTES.ADMIN.OPENAPI.CLIENTS + '/' + keyId + '/edit');

  return (
    <Box id="admin-openapi-detail-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader id="admin-openapi-detail-header" title="OpenAPI 상세" onBack={handleBack} actionsRight={<>
        <ThemedButton variant="outlined" onClick={()=>setExtendOpen(true)} buttonSize="cta">기간연장</ThemedButton>
        <ThemedButton variant="outlined" onClick={handleEdit} buttonSize="cta">수정</ThemedButton>
        <ThemedButton variant="dangerSoft" onClick={async ()=>{ const res = await deleteAdminOpenApi(keyId); handleApiResponse(res as any, ()=>{ setToast({ open: true, message: '인증키가 삭제되었습니다.', 'severity': 'success' }); setTimeout(()=>navigate(ROUTES.ADMIN.OPENAPI.CLIENTS), 800); }); }} buttonSize="cta">삭제</ThemedButton>
      </>} />
      <ThemedCard>
        <CardContent>
          {isLoading ? (
            <Typography variant="body2">불러오는 중...</Typography>
          ) : isError ? (
            <Alert severity="error">상세를 불러오는 중 오류가 발생했습니다.</Alert>
          ) : isEmpty || !item ? (
            <Typography variant="body2" color="text.secondary">데이터가 없습니다.</Typography>
          ) : (
            <>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={700}>{item.keyName || `Key ${item.keyId}`}</Typography>
                <StatusChip kind={getOpenApiKeyStatus(item)} />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>생성일: {formatYmdHm(item.createdAt)}</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{item.keyDesc}</Typography>
            </>
          )}
        </CardContent>
      </ThemedCard>
      <ExtendKeyDialog 
        open={extendOpen}
        onClose={()=>setExtendOpen(false)}
        initialStartDt={item?.startDt}
        initialEndDt={item?.endDt}
        onConfirm={async ({ startDt, endDt })=>{
          const actor = getUserInfo();
          const updatedBy = actor ? `A:${actor.userId}` : 'A:unknown';
          const res = await extendAdminOpenApi(keyId, { startDt, endDt, updatedBy });
          handleApiResponse(res as any, async ()=>{
            setExtendOpen(false);
            setToast({ open: true, message: '인증키 기간이 연장되었습니다.', severity: 'success' });
            await refetch();
          });
        }}
      />
      <CommonToast open={!!toast?.open} message={toast?.message || ''} severity={toast?.severity} onClose={()=>setToast(null)} />
    </Box>
  );
}


