import { Box, CardContent, Typography, Chip, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { COMMON_CODE_GROUPS } from '@iitp-dabt/common'; 
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import StatusChip from '../../components/common/StatusChip';
import ErrorAlert from '../../components/ErrorAlert';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { useDataFetching } from '../../hooks/useDataFetching';
import { deleteAdminFaq, getAdminFaqDetail, getCommonCodesByGroupId } from '../../api';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import { formatYmdHm } from '../../utils/date';
import type { AdminFaqDetailRes } from '@iitp-dabt/common';

export default function AdminFaqDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const faqId = Number(id);

  const { data, isLoading, isEmpty, isError, error } = useDataFetching({
    fetchFunction: () => getAdminFaqDetail(faqId),
    dependencies: [faqId],
    autoFetch: !!faqId
  });

  const faq = (data as AdminFaqDetailRes)?.faq;

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
      <AdminPageHeader />
      
      <PageHeader 
        id="admin-faq-detail-header" 
        title="FAQ 상세" 
        actionsRight={
          <>
            <ThemedButton variant="outlined" onClick={handleEdit} buttonSize="cta">수정</ThemedButton>
            <ThemedButton variant="dangerSoft" onClick={handleDelete} buttonSize="cta">삭제</ThemedButton>
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
          ) : isEmpty || !faq ? (
            <Typography variant="body2" color="text.secondary">데이터가 없습니다.</Typography>
          ) : (
            <>
              {/* 기본 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>기본 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">FAQ ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{faq.faqId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">FAQ 유형</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>{faq.faqType}</Typography>
                    <Chip size="small" label={faqTypeLabel} color="primary" />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">정렬순서</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{faq.sortOrder || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">사용여부</Typography>
                  <StatusChip 
                    kind={faq.useYn === 'Y' ? 'success' : 'default'} 
                    label={faq.useYn === 'Y' ? '사용' : '미사용'}
                    sx={{ mb: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">질문</Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>{faq.question}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">답변</Typography>
                  <Typography variant="body1" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>{faq.answer}</Typography>
                </Grid>
              </Grid>

              {/* 관리 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>관리 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">생성일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {faq.createdAt ? formatYmdHm(faq.createdAt) : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">생성자</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{faq.createdBy || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">수정일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {faq.updatedAt ? formatYmdHm(faq.updatedAt) : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">수정자</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{faq.updatedBy || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">사용 여부</Typography>
                  <StatusChip 
                    kind={faq.useYn === 'Y' ? 'success' : 'error'} 
                    label={faq.useYn === 'Y' ? '활성' : '비활성'}
                    sx={{ mb: 1 }}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </CardContent>
      </ThemedCard>
    </Box>
  );
}


