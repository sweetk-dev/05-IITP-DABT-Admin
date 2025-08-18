import { Box, CardContent, Typography, Alert, Stack } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { useDataFetching } from '../../hooks/useDataFetching';
import { deleteAdminOpenApi, getAdminOpenApiDetail } from '../../api';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import StatusChip from '../../components/common/StatusChip';

export default function AdminOpenApiDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const keyId = Number(id);

  const { data, isLoading, isEmpty, isError } = useDataFetching({ fetchFunction: ()=> getAdminOpenApiDetail(keyId), dependencies: [keyId], autoFetch: !!keyId });
  const item = (data as any)?.authKey || (data as any);

  const handleBack = () => navigate(ROUTES.ADMIN.OPENAPI.CLIENTS);
  const handleEdit = () => navigate(ROUTES.ADMIN.OPENAPI.CLIENTS + '/' + keyId + '/edit');
  const handleDelete = async () => { const res = await deleteAdminOpenApi(keyId); handleApiResponse(res, ()=>navigate(ROUTES.ADMIN.OPENAPI.CLIENTS)); };

  return (
    <Box id="admin-openapi-detail-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader id="admin-openapi-detail-header" title="OpenAPI 상세" onBack={handleBack} actionsRight={<>
        <ThemedButton variant="outlined" onClick={handleEdit} buttonSize="cta">기간연장/수정</ThemedButton>
        <ThemedButton variant="outlined" onClick={handleDelete} buttonSize="cta">삭제</ThemedButton>
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
                <StatusChip kind={item.activeYn === 'Y' ? 'active' : 'inactive'} />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>생성일: {item.createdAt}</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{item.keyDesc}</Typography>
            </>
          )}
        </CardContent>
      </ThemedCard>
    </Box>
  );
}


