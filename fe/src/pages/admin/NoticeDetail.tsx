import { Box, CardContent, Typography, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { useDataFetching } from '../../hooks/useDataFetching';
import { deleteAdminNotice, getAdminNoticeDetail } from '../../api';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import { formatYmdHm } from '../../utils/date';

export default function AdminNoticeDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const noticeId = Number(id);

  const { data, isLoading, isEmpty, isError } = useDataFetching({
    fetchFunction: () => getAdminNoticeDetail(noticeId),
    dependencies: [noticeId],
    autoFetch: !!noticeId
  });

  const notice = (data as any)?.notice || (data as any);

  const handleBack = () => navigate(ROUTES.ADMIN.NOTICES.LIST);
  const handleEdit = () => navigate(ROUTES.ADMIN.NOTICES.EDIT.replace(':id', String(noticeId)));
  const handleDelete = async () => {
    const res = await deleteAdminNotice(noticeId);
    handleApiResponse(res, () => navigate(ROUTES.ADMIN.NOTICES.LIST));
  };

  return (
    <Box id="admin-notice-detail-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader id="admin-notice-detail-header" title="공지 상세" onBack={handleBack} actionsRight={
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
          ) : isEmpty || !notice ? (
            <Typography variant="body2" color="text.secondary">데이터가 없습니다.</Typography>
          ) : (
            <>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{notice.title}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>{formatYmdHm(notice.postedAt)}</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{notice.content}</Typography>
            </>
          )}
        </CardContent>
      </ThemedCard>
    </Box>
  );
}


