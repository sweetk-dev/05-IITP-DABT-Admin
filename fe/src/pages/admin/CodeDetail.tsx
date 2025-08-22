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

// 임시 코드 상세 데이터 (실제로는 API에서 가져옴)
const mockCodeDetail = {
  id: 1,
  groupId: 'USER_STATUS',
  codeId: 'ACTIVE',
  codeNm: '활성',
  description: '사용자 계정이 활성 상태임을 나타냅니다',
  sortOrder: 1,
  useYn: 'Y',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  createdBy: 'system',
  updatedBy: 'admin001',
  relatedCodes: [
    { id: 2, codeId: 'INACTIVE', codeNm: '비활성', description: '사용자 계정이 비활성 상태임을 나타냅니다', sortOrder: 2, useYn: 'Y' },
    { id: 3, codeId: 'SUSPENDED', codeNm: '정지', description: '사용자 계정이 정지된 상태임을 나타냅니다', sortOrder: 3, useYn: 'Y' }
  ],
  usageCount: 156,
  lastUsedAt: '2024-01-15T10:30:00Z'
};

export default function CodeDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const codeId = Number(id);
  const adminRole = getAdminRole();
  const canManage = hasAccountManagementPermission(adminRole);

  // 임시 데이터 페칭 (실제로는 API 호출)
  const { data, isLoading, isEmpty, isError } = useDataFetching({
    fetchFunction: () => Promise.resolve({ code: mockCodeDetail }),
    dependencies: [codeId],
    autoFetch: !!codeId
  });

  const code = (data as any)?.code || (data as any);

  const handleEdit = () => navigate(`/admin/code/${codeId}/edit`);
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

  return (
    <Box id="admin-code-detail-page" sx={{ p: SPACING.LARGE }}>
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

      <ThemedCard>
        <CardContent>
          {isLoading ? (
            <Typography variant="body2">불러오는 중...</Typography>
          ) : isError ? (
            <Alert severity="error">코드 상세를 불러오는 중 오류가 발생했습니다.</Alert>
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
                    {code.groupId} 
                    <Chip 
                      label={getGroupLabel(code.groupId)} 
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
                  <Typography variant="subtitle2" color="text.secondary">정렬순서</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{code.sortOrder}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">설명</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{code.description}</Typography>
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
                  <Typography variant="subtitle2" color="text.secondary">사용 횟수</Typography>
                  <Chip 
                    label={code.usageCount} 
                    size="small" 
                    color="info"
                    sx={{ mb: 1 }}
                  />
                </Grid>
              </Grid>

              {/* 관리 정보 */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>관리 정보</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">생성일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formatYmdHm(code.createdAt)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">생성자</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{code.createdBy}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">수정일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formatYmdHm(code.updatedAt)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">수정자</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{code.updatedBy}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">마지막 사용일</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formatYmdHm(code.lastUsedAt)}</Typography>
                </Grid>
              </Grid>

              {/* 관련 코드 */}
              {code.relatedCodes && code.relatedCodes.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>동일 그룹의 다른 코드</Typography>
                  <Stack spacing={1}>
                    {code.relatedCodes.map((relatedCode: any) => (
                      <Box key={relatedCode.id} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={3}>
                            <Typography variant="subtitle2" color="text.secondary">코드 ID</Typography>
                            <Typography variant="body2">{relatedCode.codeId}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="subtitle2" color="text.secondary">코드명</Typography>
                            <Typography variant="body2">{relatedCode.codeNm}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="subtitle2" color="text.secondary">정렬순서</Typography>
                            <Typography variant="body2">{relatedCode.sortOrder}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="subtitle2" color="text.secondary">사용여부</Typography>
                            <StatusChip 
                              kind={relatedCode.useYn === 'Y' ? 'success' : 'default'} 
                              label={relatedCode.useYn === 'Y' ? '사용' : '미사용'}
                              size="small"
                            />
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
