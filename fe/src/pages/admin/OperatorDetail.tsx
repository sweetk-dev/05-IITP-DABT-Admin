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
import { hasAccountManagementPermission } from '../../utils/auth';

// 임시 운영자 상세 데이터 (실제로는 API에서 가져옴)
const mockOperatorDetail = {
  id: 1,
  loginId: 'admin001',
  name: '시스템 관리자',
  email: 'admin@example.com',
  phone: '010-1234-5678',
  role: 'S-ADMIN',
  status: 'ACTIVE',
  lastLoginAt: '2024-01-15T10:30:00Z',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  permissions: [
    '사용자 관리',
    '운영자 관리', 
    '코드 관리',
    'Q&A 관리',
    'FAQ 관리',
    '공지 관리',
    'Open API 관리'
  ],
  loginHistory: [
    { id: 1, loginAt: '2024-01-15T10:30:00Z', ip: '192.168.1.100', userAgent: 'Chrome/120.0.0.0' },
    { id: 2, loginAt: '2024-01-14T15:45:00Z', ip: '192.168.1.100', userAgent: 'Chrome/120.0.0.0' },
    { id: 3, loginAt: '2024-01-13T09:20:00Z', ip: '192.168.1.100', userAgent: 'Chrome/120.0.0.0' }
  ]
};

export default function OperatorDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const operatorId = Number(id);
  const adminRole = getAdminRole();
  const canManage = hasAccountManagementPermission(adminRole);

  // 임시 데이터 페칭 (실제로는 API 호출)
  const { data, isLoading, isEmpty, isError } = useDataFetching({
    fetchFunction: () => Promise.resolve({ operator: mockOperatorDetail }),
    dependencies: [operatorId],
    autoFetch: !!operatorId
  });

  const operator = (data as any)?.operator || (data as any);

  const handleEdit = () => navigate(`/admin/operators/${operatorId}/edit`);
  const handleDelete = async () => {
    // 실제로는 API 호출
    console.log('운영자 삭제:', operatorId);
    navigate('/admin/operators');
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'S-ADMIN': return 'error';
      case 'ADMIN': return 'warning';
      case 'EDITOR': return 'info';
      case 'VIEWER': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box id="admin-operator-detail-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader 
        id="admin-operator-detail-header" 
        title="운영자 상세" 
        actionsRight={
          canManage ? (
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
            <Alert severity="error">운영자 상세를 불러오는 중 오류가 발생했습니다.</Alert>
          ) : isEmpty || !operator ? (
            <Typography variant="body2" color="text.secondary">운영자 정보가 없습니다.</Typography>
          ) : (
            <>
              {/* 기본 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>기본 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">로그인 ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{operator.loginId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">이름</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{operator.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">이메일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{operator.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">전화번호</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{operator.phone || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">역할</Typography>
                  <StatusChip 
                    kind={getRoleColor(operator.role) as any} 
                    label={operator.role}
                    sx={{ mb: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">상태</Typography>
                  <StatusChip 
                    kind={getStatusColor(operator.status) as any} 
                    label={getStatusLabel(operator.status)}
                    sx={{ mb: 1 }}
                  />
                </Grid>
              </Grid>

              {/* 계정 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>계정 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">생성일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formatYmdHm(operator.createdAt)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">최근 로그인</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formatYmdHm(operator.lastLoginAt)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">마지막 수정일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formatYmdHm(operator.updatedAt)}</Typography>
                </Grid>
              </Grid>

              {/* 권한 정보 */}
              {operator.permissions && operator.permissions.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>권한 정보</Typography>
                  <Box sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {operator.permissions.map((permission: string, index: number) => (
                        <Chip 
                          key={index}
                          label={permission} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                </>
              )}

              {/* 로그인 이력 */}
              {operator.loginHistory && operator.loginHistory.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>최근 로그인 이력</Typography>
                  <Stack spacing={1}>
                    {operator.loginHistory.map((login: any) => (
                      <Box key={login.id} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2" color="text.secondary">로그인 시간</Typography>
                            <Typography variant="body2">{formatYmdHm(login.loginAt)}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2" color="text.secondary">IP 주소</Typography>
                            <Typography variant="body2">{login.ip}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2" color="text.secondary">브라우저</Typography>
                            <Typography variant="body2">{login.userAgent}</Typography>
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
