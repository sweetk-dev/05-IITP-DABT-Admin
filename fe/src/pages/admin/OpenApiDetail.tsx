import { Box, CardContent, Typography, Stack, Grid } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import StatusChip from '../../components/common/StatusChip';
import ErrorAlert from '../../components/ErrorAlert';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { useDataFetching } from '../../hooks/useDataFetching';
import { deleteAdminOpenApi, getAdminOpenApiDetail, extendAdminOpenApi } from '../../api';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import { formatYmdHm } from '../../utils/date';
import { getOpenApiKeyStatus } from '../../utils/openApiStatus';
import ExtendKeyDialog from '../../components/common/ExtendKeyDialog';
import CommonToast from '../../components/CommonToast';
import { getUserInfo } from '../../store/user';
import type { AdminOpenApiDetailRes } from '@iitp-dabt/common';

export default function AdminOpenApiDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const keyId = Number(id);

  const { data, isLoading, isEmpty, isError, error, refetch } = useDataFetching({ 
    fetchFunction: ()=> getAdminOpenApiDetail(keyId), 
    dependencies: [keyId], 
    autoFetch: !!keyId 
  });
  
  const item = (data as AdminOpenApiDetailRes)?.authKey;

  const handleBack = () => navigate(ROUTES.ADMIN.OPENAPI.CLIENTS);
  const [extendOpen, setExtendOpen] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity?: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const handleEdit = () => navigate(ROUTES.ADMIN.OPENAPI.CLIENTS + '/' + keyId + '/edit');

  return (
    <Box id="admin-openapi-detail-page" sx={{ p: SPACING.LARGE }}>
      <AdminPageHeader />
      
      <PageHeader 
        id="admin-openapi-detail-header" 
        title="OpenAPI 상세" 
        actionsRight={
          <>
            <ThemedButton variant="outlined" onClick={()=>setExtendOpen(true)} buttonSize="cta">기간연장</ThemedButton>
            <ThemedButton variant="outlined" onClick={handleEdit} buttonSize="cta">수정</ThemedButton>
            <ThemedButton variant="dangerSoft" onClick={async ()=>{ const res = await deleteAdminOpenApi(keyId); handleApiResponse(res as any, ()=>{ setToast({ open: true, message: '인증키가 삭제되었습니다.', 'severity': 'success' }); setTimeout(()=>navigate(ROUTES.ADMIN.OPENAPI.CLIENTS), 800); }); }} buttonSize="cta">삭제</ThemedButton>
          </>
        } 
      />

      {/* 에러 알림 */}
      {error && (
        <ErrorAlert 
          error={error} 
          onClose={() => {}} 
        />
      )}

      <ThemedCard>
        <CardContent>
          {isLoading ? (
            <Typography variant="body2">불러오는 중...</Typography>
          ) : isEmpty || !item ? (
            <Typography variant="body2" color="text.secondary">데이터가 없습니다.</Typography>
          ) : (
            <>
              {/* 기본 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>기본 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">인증키 ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{item.keyId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">상태</Typography>
                  <StatusChip kind={getOpenApiKeyStatus(item)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">활성 여부</Typography>
                  <StatusChip 
                    kind={item.activeYn === 'Y' ? 'success' : 'default'} 
                    label={item.activeYn === 'Y' ? '활성' : '비활성'}
                    sx={{ mb: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">사용자 ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{item.userId}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">키 이름</Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>{item.keyName || `Key ${item.keyId}`}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">키 설명</Typography>
                  <Typography variant="body1" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>{item.keyDesc || '-'}</Typography>
                </Grid>
              </Grid>

              {/* 기간 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>기간 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">시작일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {item.startDt ? formatYmdHm(item.startDt) : '무제한'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">종료일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {item.endDt ? formatYmdHm(item.endDt) : '무제한'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">활성화일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {item.activeAt ? formatYmdHm(item.activeAt) : '-'}
                  </Typography>
                </Grid>
              </Grid>

              {/* 관리 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>관리 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">생성일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {item.createdAt ? formatYmdHm(item.createdAt) : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">생성자</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{item.createdBy || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">수정일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {item.updatedAt ? formatYmdHm(item.updatedAt) : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">수정자</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{item.updatedBy || '-'}</Typography>
                </Grid>
                {item.deletedAt && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">삭제일</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>{formatYmdHm(item.deletedAt)}</Typography>
                  </Grid>
                )}
                {item.deletedBy && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">삭제자</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>{item.deletedBy}</Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">삭제 여부</Typography>
                  <StatusChip 
                    kind={item.delYn === 'N' ? 'success' : 'error'} 
                    label={item.delYn === 'N' ? '활성' : '삭제됨'}
                    sx={{ mb: 1 }}
                  />
                </Grid>
              </Grid>
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


