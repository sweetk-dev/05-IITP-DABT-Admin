import { Box, CardContent, Typography, Alert, Chip, Stack, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import StatusChip from '../../components/common/StatusChip';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { useDataFetching } from '../../hooks/useDataFetching';
import { formatYmdHm } from '../../utils/date';
import { getAdminRole } from '../../store/user';
import { hasUserAccountEditPermission } from '../../utils/auth';

// 임시 사용자 상세 데이터 (실제로는 API에서 가져옴)
const mockUserDetail = {
  id: 1,
  name: '홍길동',
  email: 'hong@example.com',
  phone: '010-1234-5678',
  status: 'ACTIVE',
  lastLoginAt: '2024-01-15T10:30:00Z',
  openApiKeyCount: 2,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  openApiKeys: [
    { id: 1, name: '개발용 API 키', key: 'dev_1234567890abcdef', status: 'ACTIVE', createdAt: '2024-01-01T00:00:00Z' },
    { id: 2, name: '운영용 API 키', key: 'prod_0987654321fedcba', status: 'ACTIVE', createdAt: '2024-01-10T00:00:00Z' }
  ]
};

export default function UserDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const adminRole = getAdminRole();
  const canEdit = hasUserAccountEditPermission(adminRole);

  // 임시 데이터 페칭 (실제로는 API 호출)
  const { data, isLoading, isEmpty, isError } = useDataFetching({
    fetchFunction: () => Promise.resolve({ user: mockUserDetail }),
    dependencies: [userId],
    autoFetch: !!userId
  });

  const user = (data as any)?.user || (data as any);

  const handleEdit = () => navigate(`/admin/users/${userId}/edit`);
  const handleDelete = async () => {
    // 실제로는 API 호출
    console.log('사용자 삭제:', userId);
    navigate('/admin/users');
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '활성';
      case 'INACTIVE': return '비활성';
      case 'SUSPENDED': return '정지';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'warning';
      case 'SUSPENDED': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box id="admin-user-detail-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader 
        id="admin-user-detail-header" 
        title="사용자 상세" 
        actionsRight={
          canEdit ? (
            <>
              <ThemedButton variant="outlined" onClick={handleEdit} buttonSize="cta">수정</ThemedButton>
              <ThemedButton variant="dangerSoft" onClick={handleDelete} buttonSize="cta">삭제</ThemedButton>
            </>
          ) : undefined
        } 
      />

      <ThemedCard>
        <CardContent>
          {isLoading ? (
            <Typography variant="body2">불러오는 중...</Typography>
          ) : isError ? (
            <Alert severity="error">사용자 상세를 불러오는 중 오류가 발생했습니다.</Alert>
          ) : isEmpty || !user ? (
            <Typography variant="body2" color="text.secondary">사용자 정보가 없습니다.</Typography>
          ) : (
            <>
              {/* 기본 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>기본 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">이름</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{user.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">이메일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{user.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">전화번호</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{user.phone || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">상태</Typography>
                  <StatusChip 
                    kind={getStatusColor(user.status) as any} 
                    label={getStatusLabel(user.status)}
                    sx={{ mb: 1 }}
                  />
                </Grid>
              </Grid>

              {/* 계정 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>계정 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">가입일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formatYmdHm(user.createdAt)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">최근 로그인</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formatYmdHm(user.lastLoginAt)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">마지막 수정일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formatYmdHm(user.updatedAt)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">API 키 수</Typography>
                  <Chip 
                    label={user.openApiKeyCount} 
                    size="small" 
                    color="primary"
                    sx={{ mb: 1 }}
                  />
                </Grid>
              </Grid>

              {/* API 키 정보 */}
              {user.openApiKeys && user.openApiKeys.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>API 키 정보</Typography>
                  <Stack spacing={1}>
                    {user.openApiKeys.map((key: any) => (
                      <Box key={key.id} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2" color="text.secondary">키 이름</Typography>
                            <Typography variant="body2">{key.name}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2" color="text.secondary">상태</Typography>
                            <StatusChip 
                              kind={key.status === 'ACTIVE' ? 'success' : 'default'} 
                              label={key.status === 'ACTIVE' ? '활성' : '비활성'}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2" color="text.secondary">생성일</Typography>
                            <Typography variant="body2">{formatYmdHm(key.createdAt)}</Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Stack>
                </>
              )}
            </>
          )}
        </CardContent>
      </ThemedCard>
    </Box>
  );
}
