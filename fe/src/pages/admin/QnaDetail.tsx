import { Box, CardContent, Typography, Chip, Grid } from '@mui/material';
import QnaTypeChip from '../../components/common/QnaTypeChip';
import StatusChip from '../../components/common/StatusChip';
import ErrorAlert from '../../components/ErrorAlert';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { useDataFetching } from '../../hooks/useDataFetching';
import { deleteAdminQna, getAdminQnaDetail } from '../../api';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import { formatYmdHm } from '../../utils/date';
import type { AdminQnaDetailRes } from '@iitp-dabt/common';

export default function AdminQnaDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const qnaId = Number(id);

  const { data, isLoading, isEmpty, isError, status } = useDataFetching({ 
    fetchFunction: ()=> getAdminQnaDetail(qnaId), 
    dependencies: [qnaId], 
    autoFetch: !!qnaId 
  });

  const error = isError && status === 'error' ? (data as any)?.error : undefined;
  
  const qna = (data as AdminQnaDetailRes)?.qna;

  const handleEdit = () => navigate(ROUTES.ADMIN.QNA.REPLY.replace(':id', String(qnaId)));
  const handleDelete = async () => { const res = await deleteAdminQna(qnaId); handleApiResponse(res, ()=>navigate(ROUTES.ADMIN.QNA.LIST)); };

  return (
    <Box id="admin-qna-detail-page" sx={{ p: SPACING.LARGE }}>
      <AdminPageHeader />
      
      <PageHeader 
        id="admin-qna-detail-header" 
        title="Q&A 상세" 
        actionsRight={
          <>
            <ThemedButton variant="outlined" onClick={handleEdit} buttonSize="cta">답변/수정</ThemedButton>
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
          ) : isEmpty || !qna ? (
            <Typography variant="body2" color="text.secondary">데이터가 없습니다.</Typography>
          ) : (
            <>
              {/* 기본 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>기본 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Q&A ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{qna.qnaId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">사용자 ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{qna.userId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Q&A 유형</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>{qna.qnaType}</Typography>
                    <QnaTypeChip typeId={qna.qnaType} />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">답변 상태</Typography>
                  <Chip 
                    size="small" 
                    label={qna.answeredYn === 'Y' ? '답변완료' : '답변대기'} 
                    color={qna.answeredYn === 'Y' ? 'success' : 'warning'} 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">비공개 여부</Typography>
                  {qna.secretYn === 'Y' ? (
                    <StatusChip kind="private" />
                  ) : (
                    <Typography variant="body1" sx={{ mb: 1 }}>공개</Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">제목</Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>{qna.title}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">내용</Typography>
                  <Typography variant="body1" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>{qna.content}</Typography>
                </Grid>
              </Grid>

              {/* 답변 정보 */}
              {qna.answeredYn === 'Y' && qna.answerContent && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>답변 정보</Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">답변자</Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>{qna.answeredBy || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">답변일</Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {qna.answeredAt ? formatYmdHm(qna.answeredAt) : '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">답변 내용</Typography>
                      <Typography variant="body1" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>{qna.answerContent}</Typography>
                    </Grid>
                  </Grid>
                </>
              )}

              {/* 관리 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>관리 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">등록일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {qna.createdAt ? formatYmdHm(qna.createdAt) : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">등록자</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{qna.createdBy || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">수정일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {qna.updatedAt ? formatYmdHm(qna.updatedAt) : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">수정자</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{qna.updatedBy || '-'}</Typography>
                </Grid>
                {qna.deletedAt && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">삭제일</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>{formatYmdHm(qna.deletedAt)}</Typography>
                  </Grid>
                )}
                {qna.deletedBy && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">삭제자</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>{qna.deletedBy}</Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">답변 상태</Typography>
                  <StatusChip 
                    kind={qna.answeredYn === 'Y' ? 'success' : 'warning'} 
                    label={qna.answeredYn === 'Y' ? '답변완료' : '답변대기'}
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


