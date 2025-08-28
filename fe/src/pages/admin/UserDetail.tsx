import { Box, CardContent, Typography, Chip, Stack, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import StatusChip from '../../components/common/StatusChip';
import ErrorAlert from '../../components/ErrorAlert';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { useDataFetching } from '../../hooks/useDataFetching';
import { formatYmdHm } from '../../utils/date';
import { getAdminRole } from '../../store/user';
import { hasUserAccountEditPermission } from '../../utils/auth';
import { getUserAccountDetail } from '../../api/account';
import type { UserAccountDetailRes } from '@iitp-dabt/common';

export default function UserDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const adminRole = getAdminRole();
  const canEdit = hasUserAccountEditPermission(adminRole);

  // 실제 API 호출
  const { data, isLoading, isEmpty, isError, error } = useDataFetching({
    fetchFunction: () => getUserAccountDetail(userId),
    dependencies: [userId],
    autoFetch: !!userId
  });

  const user = (data as UserAccountDetailRes)?.user;

  const handleEdit = () => navigate(`/admin/users/${userId}/edit`);
  const handleDelete = async () => {
    // 실제로는 API 호출
    console.log('사용자 삭제:', userId);
    navigate('/admin/users');
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'A': return '활성';
      case 'I': return '비활성';
      case 'S': return '정지';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'A': return 'success';
      case 'I': return 'warning';
      case 'S': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box id="admin-user-detail-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader 
        id="admin-user-detail-header" 
        title="사용자 상세" 
        onBack={() => navigate('/admin/users')}
        actionsRight={
          canEdit ? (
            <>
              <ThemedButton variant="outlined" onClick={handleEdit} buttonSize="cta">수정</ThemedButton>
              <ThemedButton variant="dangerSoft" onClick={handleDelete} buttonSize="cta">삭제</ThemedButton>
            </>
          ) : undefined
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
          ) : isEmpty || !user ? (
            <Typography variant="body2" color="text.secondary">사용자 정보가 없습니다.</Typography>
          ) : (
            <>
              {/* 기본 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>기본 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">사용자 ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{user.userId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">로그인 ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{user.loginId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">이름</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{user.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">상태</Typography>
                  <StatusChip 
                    kind={getStatusColor(user.status) as any} 
                    label={getStatusLabel(user.status)}
                    sx={{ mb: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">소속</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{user.affiliation || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">비고</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{user.note || '-'}</Typography>
                </Grid>
              </Grid>

              {/* 계정 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>계정 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">가입일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {user.createdAt ? formatYmdHm(user.createdAt) : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">최근 로그인</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {user.latestLoginAt ? formatYmdHm(user.latestLoginAt) : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">마지막 수정일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {user.updatedAt ? formatYmdHm(user.updatedAt) : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">API 키 수</Typography>
                  <Chip 
                    label={user.keyCount || 0} 
                    size="small" 
                    color="primary"
                    sx={{ mb: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">최근 API 키 생성일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {user.latestKeyCreatedAt ? formatYmdHm(user.latestKeyCreatedAt) : '-'}
                  </Typography>
                </Grid>
              </Grid>

              {/* 관리 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>관리 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">생성자</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{user.createdBy || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">수정자</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{user.updatedBy || '-'}</Typography>
                </Grid>
                {user.deletedAt && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">삭제일</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>{formatYmdHm(user.deletedAt)}</Typography>
                  </Grid>
                )}
                {user.deletedBy && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">삭제자</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>{user.deletedBy}</Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">삭제 여부</Typography>
                  <StatusChip 
                    kind={user.delYn === 'N' ? 'success' : 'error'} 
                    label={user.delYn === 'N' ? '활성' : '삭제됨'}
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
