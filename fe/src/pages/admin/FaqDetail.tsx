import { Box, CardContent, Typography, Alert, Chip } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { COMMON_CODE_GROUPS } from '@iitp-dabt/common'; 
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { useDataFetching } from '../../hooks/useDataFetching';
import { deleteAdminFaq, getAdminFaqDetail, getCommonCodesByGroupId } from '../../api';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import { formatYmdHm } from '../../utils/date';

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

  // load type codes for label
  const { data: faqTypeCodes } = useDataFetching({ fetchFunction: () => getCommonCodesByGroupId(COMMON_CODE_GROUPS.FAQ_TYPE), autoFetch: true });
  const faqTypeOptions = [{ value: '', label: '전체' }, ...((faqTypeCodes as any)?.codes || []).map((c: any) => ({ value: c.codeId, label: c.codeNm }))];
  const faqTypeLabel = faq ? (faqTypeOptions.find(o=>o.value===faq.faqType)?.label || faq.faqType) : '';

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
          <ThemedButton variant="dangerSoft" onClick={handleDelete} buttonSize="cta">삭제</ThemedButton>
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{faq.question}</Typography>
                <Chip size="small" label={faqTypeLabel} color="primary" />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>{formatYmdHm(faq.createdAt)}</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{faq.answer}</Typography>
            </>
          )}
        </CardContent>
      </ThemedCard>
    </Box>
  );
}


