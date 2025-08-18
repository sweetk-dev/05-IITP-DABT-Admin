import { Box, CardContent, Typography, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { useDataFetching } from '../../hooks/useDataFetching';
import { deleteAdminFaq, getAdminFaqDetail } from '../../api';
import { handleApiResponse } from '../../utils/apiResponseHandler';

export default function AdminFaqDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const faqId = Number(id);

  const { data, isLoading, isEmpty, isError } = useDataFetching({
    fetchFunction: () => getAdminFaqDetail(faqId),
    dependencies: [faqId],
    autoFetch: !!faqId
  });

  const faq = (data as any)?.faq || (data as any);

  const handleBack = () => navigate(ROUTES.ADMIN.FAQ.LIST);
  const handleEdit = () => navigate(ROUTES.ADMIN.FAQ.EDIT.replace(':id', String(faqId)));
  const handleDelete = async () => {
    const res = await deleteAdminFaq(faqId);
    handleApiResponse(res, () => navigate(ROUTES.ADMIN.FAQ.LIST));
  };

  return (
    <Box id="admin-faq-detail-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader id="admin-faq-detail-header" title="FAQ 상세" onBack={handleBack} actionsRight={
        <>
          <ThemedButton variant="outlined" onClick={handleEdit} buttonSize="cta">수정</ThemedButton>
          <ThemedButton variant="outlined" onClick={handleDelete} buttonSize="cta">삭제</ThemedButton>
        </>
      } />

      <ThemedCard>
        <CardContent>
          {isLoading ? (
            <Typography variant="body2">불러오는 중...</Typography>
          ) : isError ? (
            <Alert severity="error">상세를 불러오는 중 오류가 발생했습니다.</Alert>
          ) : isEmpty || !faq ? (
            <Typography variant="body2" color="text.secondary">데이터가 없습니다.</Typography>
          ) : (
            <>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{faq.title}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>{faq.createdAt}</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{faq.content}</Typography>
            </>
          )}
        </CardContent>
      </ThemedCard>
    </Box>
  );
}


