import { Box, CardContent, Typography, Chip, Grid } from '@mui/material';
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
import { deleteAdminNotice, getAdminNoticeDetail } from '../../api';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import { formatYmdHm } from '../../utils/date';
import { getNoticeTypeLabel, getNoticeTypeColor } from '../../constants/noticeTypes';  // ✅ 공통 상수 import
import type { AdminNoticeDetailRes } from '@iitp-dabt/common';

export default function AdminNoticeDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const noticeId = Number(id);

  const { data, isLoading, isEmpty, isError, error } = useDataFetching({
    fetchFunction: () => getAdminNoticeDetail(noticeId),
    dependencies: [noticeId],
    autoFetch: !!noticeId
  });

  const notice = (data as AdminNoticeDetailRes)?.notice;

  const handleBack = () => navigate(ROUTES.ADMIN.NOTICES.LIST);
  const handleEdit = () => navigate(ROUTES.ADMIN.NOTICES.EDIT.replace(':id', String(noticeId)));
  const handleDelete = async () => {
    const res = await deleteAdminNotice(noticeId);
    handleApiResponse(res, () => navigate(ROUTES.ADMIN.NOTICES.LIST));
  };

  return (
    <Box id="admin-notice-detail-page" sx={{ p: SPACING.LARGE }}>
      <AdminPageHeader />
      
      <PageHeader 
        id="admin-notice-detail-header" 
        title="공지 상세" 
        actionsRight={
          <>
            <ThemedButton variant="outlined" onClick={handleEdit} buttonSize="cta">수정</ThemedButton>
            <ThemedButton variant="outlined" onClick={handleDelete} buttonSize="cta">삭제</ThemedButton>
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
          ) : isEmpty || !notice ? (
            <Typography variant="body2" color="text.secondary">데이터가 없습니다.</Typography>
          ) : (
            <>
              {/* 기본 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>기본 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">공지 ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{notice.noticeId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">공지 유형</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>{notice.noticeType}</Typography>
                    <Chip 
                      size="small" 
                      label={getNoticeTypeLabel(notice.noticeType)} 
                      color={getNoticeTypeColor(notice.noticeType) as any} 
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">상단 고정</Typography>
                  <StatusChip 
                    kind={notice.pinnedYn === 'Y' ? 'warning' : 'default'} 
                    label={notice.pinnedYn === 'Y' ? '고정' : '일반'}
                    sx={{ mb: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">공개 여부</Typography>
                  <StatusChip 
                    kind={notice.publicYn === 'Y' ? 'success' : 'default'} 
                    label={notice.publicYn === 'Y' ? '공개' : '비공개'}
                    sx={{ mb: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">제목</Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>{notice.title}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">내용</Typography>
                  <Typography variant="body1" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>{notice.content}</Typography>
                </Grid>
              </Grid>

              {/* 기간 정보 */}
              {(notice.startDt || notice.endDt) && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>기간 정보</Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {notice.startDt && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">시작일</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>{formatYmdHm(notice.startDt)}</Typography>
                      </Grid>
                    )}
                    {notice.endDt && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">종료일</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>{formatYmdHm(notice.endDt)}</Typography>
                      </Grid>
                    )}
                  </Grid>
                </>
              )}

              {/* 관리 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>관리 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">생성일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {notice.createdAt ? formatYmdHm(notice.createdAt) : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">생성자</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{notice.createdBy || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">수정일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {notice.updatedAt ? formatYmdHm(notice.updatedAt) : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">수정자</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{notice.updatedBy || '-'}</Typography>
                </Grid>
                {notice.deletedAt && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">삭제일</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>{formatYmdHm(notice.deletedAt)}</Typography>
                  </Grid>
                )}
                {notice.deletedBy && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">삭제자</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>{notice.deletedBy}</Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">삭제 여부</Typography>
                  <StatusChip 
                    kind={notice.delYn === 'N' ? 'success' : 'error'} 
                    label={notice.delYn === 'N' ? '활성' : '삭제됨'}
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


