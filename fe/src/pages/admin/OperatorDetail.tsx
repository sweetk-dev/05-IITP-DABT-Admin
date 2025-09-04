import { Box, CardContent, Typography, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import StatusChip from '../../components/common/StatusChip';
import ErrorAlert from '../../components/ErrorAlert';
import { SPACING } from '../../constants/spacing';
//import { ROUTES } from '../../routes';
import { useDataFetching } from '../../hooks/useDataFetching';
import { formatYmdHm } from '../../utils/date';
import { getAdminRole } from '../../store/user';
import { hasAccountManagementPermission } from '../../utils/auth';
import { getAdminAccountDetail } from '../../api/account';
import { getCommonCodesByGroupId } from '../../api';
import { COMMON_CODE_GROUPS } from '@iitp-dabt/common';
import type { AdminAccountDetailRes } from '@iitp-dabt/common';

export default function OperatorDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const operatorId = Number(id);
  const adminRole = getAdminRole();
  const canManage = hasAccountManagementPermission(adminRole);

  // 공통 코드 조회 (운영자 역할)
  const { data: roleCodes } = useDataFetching({ 
    fetchFunction: () => getCommonCodesByGroupId(COMMON_CODE_GROUPS.SYS_ADMIN_ROLES), 
    autoFetch: true 
  });

  // 실제 API 호출
  const { data, isLoading, isEmpty, isError, status } = useDataFetching({
    fetchFunction: () => getAdminAccountDetail(operatorId),
    dependencies: [operatorId],
    autoFetch: !!operatorId
  });

  const error = isError && status === 'error' ? (data as any)?.error : undefined;

  const operator = (data as AdminAccountDetailRes)?.admin;

  const handleEdit = () => navigate(`/admin/operators/${operatorId}/edit`);
  const handleDelete = async () => {
    // 실제로는 API 호출
    console.log('운영자 삭제:', operatorId);
    navigate('/admin/operators');
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

  const getRoleLabel = (role: string) => {
    if (roleCodes?.codes) {
      const roleCode = roleCodes.codes.find((code: any) => code.codeId === role);
      return roleCode ? roleCode.codeNm : role;
    }
    return role;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'S': return 'error';
      case 'A': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box id="admin-operator-detail-page" sx={{ p: SPACING.LARGE }}>
      <AdminPageHeader />
      
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
          ) : isEmpty || !operator ? (
            <Typography variant="body2" color="text.secondary">운영자 정보가 없습니다.</Typography>
          ) : (
            <>
              {/* 기본 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>기본 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">운영자 ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{operator.adminId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">로그인 ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{operator.loginId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">이름</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{operator.name}</Typography>
                </Grid>
                                 <Grid item xs={12} sm={6}>
                   <Typography variant="subtitle2" color="text.secondary">역할</Typography>
                   <StatusChip 
                     kind={getRoleColor(operator.role) as any} 
                     label={getRoleLabel(operator.role)}
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
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">소속</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{operator.affiliation || '-'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">설명</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{operator.description || '-'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">비고</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{operator.note || '-'}</Typography>
                </Grid>
              </Grid>

              {/* 계정 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>계정 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">생성일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {operator.createdAt ? formatYmdHm(operator.createdAt) : '-'}
                  </Typography>
                </Grid>
                                 <Grid item xs={12} sm={6}>
                   <Typography variant="subtitle2" color="text.secondary">최근 로그인</Typography>
                   <Typography variant="body1" sx={{ mb: 1 }}>
                     {operator.lastLoginAt ? formatYmdHm(operator.lastLoginAt) : '-'}
                   </Typography>
                 </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">마지막 수정일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {operator.updatedAt ? formatYmdHm(operator.updatedAt) : '-'}
                  </Typography>
                </Grid>
                                 {/* 로그인 시도 횟수는 API에 없으므로 제거 */}
              </Grid>

              {/* 관리 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>관리 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">생성자</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{operator.createdBy || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">수정자</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{operator.updatedBy || '-'}</Typography>
                </Grid>
                {operator.deletedAt && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">삭제일</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>{formatYmdHm(operator.deletedAt)}</Typography>
                  </Grid>
                )}
                {operator.deletedBy && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">삭제자</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>{operator.deletedBy}</Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">삭제 여부</Typography>
                  <StatusChip 
                    kind={operator.delYn === 'N' ? 'success' : 'error'} 
                    label={operator.delYn === 'N' ? '활성' : '삭제됨'}
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
