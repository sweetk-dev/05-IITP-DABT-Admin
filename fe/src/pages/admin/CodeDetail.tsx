import { Box, CardContent, Typography, Chip, Stack, Grid } from '@mui/material';
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
import { formatYmdHm } from '../../utils/date';
import { getAdminRole } from '../../store/user';
import { hasAccountManagementPermission } from '../../utils/auth';
import { getCommonCodeByIdDetail } from '../../api';
import type { CommonCodeByIdDetailRes } from '@iitp-dabt/common';

export default function CodeDetail() {
  const navigate = useNavigate();
  const { grpId, codeId } = useParams<{ grpId: string; codeId: string }>();
  const adminRole = getAdminRole();
  const canManage = hasAccountManagementPermission(adminRole);

  // 실제 API 호출
  const { data, isLoading, isEmpty, isError, error } = useDataFetching({
    fetchFunction: () => getCommonCodeByIdDetail(grpId!, codeId!),
    dependencies: [grpId, codeId],
    autoFetch: !!(grpId && codeId)
  });

  const code = (data as CommonCodeByIdDetailRes)?.code;

  const handleEdit = () => navigate(`/admin/code/${grpId}/${codeId}/edit`);
  const handleDelete = async () => {
    // 실제로는 API 호출
    console.log('코드 삭제:', codeId);
    navigate('/admin/code');
  };

  const getGroupLabel = (groupId: string) => {
    const groupLabels: { [key: string]: string } = {
      'USER_STATUS': '사용자 상태',
      'ADMIN_ROLE': '관리자 역할',
      'QNA_TYPE': 'Q&A 타입',
      'NOTICE_TYPE': '공지 타입',
      'FAQ_TYPE': 'FAQ 타입'
    };
    return groupLabels[groupId] || groupId;
  };

  const getCodeTypeLabel = (codeType: string) => {
    const typeLabels: { [key: string]: string } = {
      'B': '기본',
      'A': '관리자',
      'S': '시스템'
    };
    return typeLabels[codeType] || codeType;
  };

  return (
    <Box id="admin-code-detail-page" sx={{ p: SPACING.LARGE }}>
      <AdminPageHeader />
      
      <PageHeader 
        id="admin-code-detail-header" 
        title="코드 상세" 
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
          ) : isEmpty || !code ? (
            <Typography variant="body2" color="text.secondary">코드 정보가 없습니다.</Typography>
          ) : (
            <>
              {/* 기본 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>기본 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">그룹 ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {code.grpId} 
                    <Chip 
                      label={getGroupLabel(code.grpId)} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">코드 ID</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{code.codeId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">코드명</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{code.codeNm}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">코드 타입</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {code.codeType} 
                    <Chip 
                      label={getCodeTypeLabel(code.codeType)} 
                      size="small" 
                      color="secondary" 
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">코드 레벨</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{code.codeLvl || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">정렬순서</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{code.sortOrder || '-'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">설명</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{code.codeDes || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">사용여부</Typography>
                  <StatusChip 
                    kind={code.useYn === 'Y' ? 'success' : 'default'} 
                    label={code.useYn === 'Y' ? '사용' : '미사용'}
                    sx={{ mb: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">메모</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{code.memo || '-'}</Typography>
                </Grid>
              </Grid>

              {/* 계층 정보 */}
              {(code.parentGrpId || code.parentCodeId) && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>계층 정보</Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {code.parentGrpId && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">부모 그룹 ID</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>{code.parentGrpId}</Typography>
                      </Grid>
                    )}
                    {code.parentCodeId && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">부모 코드 ID</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>{code.parentCodeId}</Typography>
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
                    {code.createdAt ? formatYmdHm(code.createdAt) : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">생성자</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{code.createdBy || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">수정일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {code.updatedAt ? formatYmdHm(code.updatedAt) : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">수정자</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{code.updatedBy || '-'}</Typography>
                </Grid>
                {code.deletedAt && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">삭제일</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>{formatYmdHm(code.deletedAt)}</Typography>
                  </Grid>
                )}
                {code.deletedBy && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">삭제자</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>{code.deletedBy}</Typography>
                  </Grid>
                )}
              </Grid>
            </>
          )}
        </CardContent>
      </ThemedCard>
    </Box>
  );
}
