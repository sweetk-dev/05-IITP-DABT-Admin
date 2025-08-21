import { Box, CardContent, Typography, Alert, Chip, Stack } from '@mui/material';
import QnaTypeChip from '../../components/common/QnaTypeChip';
import StatusChip from '../../components/common/StatusChip';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { useDataFetching } from '../../hooks/useDataFetching';
import { deleteAdminQna, getAdminQnaDetail } from '../../api';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import { formatYmdHm } from '../../utils/date';

export default function AdminQnaDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const qnaId = Number(id);

  const { data, isLoading, isEmpty, isError } = useDataFetching({ fetchFunction: ()=> getAdminQnaDetail(qnaId), dependencies: [qnaId], autoFetch: !!qnaId });
  const qna = (data as any)?.qna || (data as any);

  const handleBack = () => navigate(ROUTES.ADMIN.QNA.LIST);
  const handleEdit = () => navigate(ROUTES.ADMIN.QNA.REPLY.replace(':id', String(qnaId)));
  const handleDelete = async () => { const res = await deleteAdminQna(qnaId); handleApiResponse(res, ()=>navigate(ROUTES.ADMIN.QNA.LIST)); };

  return (
    <Box id="admin-qna-detail-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader id="admin-qna-detail-header" title="Q&A 상세" onBack={handleBack} actionsRight={<>
        <ThemedButton variant="outlined" onClick={handleEdit} buttonSize="cta">답변/수정</ThemedButton>
        <ThemedButton variant="dangerSoft" onClick={handleDelete} buttonSize="cta">삭제</ThemedButton>
      </>} />
      <ThemedCard>
        <CardContent>
          {isLoading ? (
            <Typography variant="body2">불러오는 중...</Typography>
          ) : isError ? (
            <Alert severity="error">상세를 불러오는 중 오류가 발생했습니다.</Alert>
          ) : isEmpty || !qna ? (
            <Typography variant="body2" color="text.secondary">데이터가 없습니다.</Typography>
          ) : (
            <>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                {/* 순서: 유형 → 상태 → 비공개 */}
                <QnaTypeChip typeId={qna.qnaType} />
                <Chip size="small" label={qna.answeredYn === 'Y' ? '답변완료' : '답변대기'} color={qna.answeredYn === 'Y' ? 'success' : 'warning'} />
                {qna.secretYn === 'Y' && (<StatusChip kind="private" />)}
                <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>{formatYmdHm(qna.postedAt)}</Typography>
              </Stack>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{qna.title}</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: SPACING.MEDIUM }}>{qna.content}</Typography>
              {qna.answeredYn === 'Y' && qna.answerContent && (
                <>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>답변</Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{qna.answerContent}</Typography>
                </>
              )}
            </>
          )}
        </CardContent>
      </ThemedCard>
    </Box>
  );
}


