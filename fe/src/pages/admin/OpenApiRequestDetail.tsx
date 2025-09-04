import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  CardContent, 
  Typography, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  TextField, 
  Button, 
  Stack,
  Divider,
  Grid,
  Chip
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ErrorAlert from '../../components/ErrorAlert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { SPACING } from '../../constants/spacing';
import { useDataFetching } from '../../hooks/useDataFetching';
import { getAdminOpenApiDetail, updateAdminOpenApi } from '../../api';
import { formatYmdHm } from '../../utils/date';
import { getOpenApiKeyStatus } from '../../utils/openApiStatus';
import { ROUTES } from '../../routes';
import type { AdminOpenApiUpdateReq } from '@iitp-dabt/common';

export default function AdminOpenApiRequestDetail() {
  const { keyId } = useParams<{ keyId: string }>();
  const navigate = useNavigate();
  
  const [activeYn, setActiveYn] = useState<string>('Y');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API 요청 상세 조회
  const { 
    data: openApiDetail, 
    isLoading, 
    isError, 
    // refetch 
  } = useDataFetching({
    fetchFunction: () => getAdminOpenApiDetail(Number(keyId)),
    dependencies: [keyId],
    autoFetch: true
  });

  // 에러 처리
  useEffect(() => {
    if (isError) {
      setError('OpenAPI 요청 상세 정보를 불러오는 중 오류가 발생했습니다.');
    }
  }, [isError]);

  // 승인/거절 처리
  const handleSubmit = async () => {
    if (!keyId) return;

    // 거절인 경우 거절 사유 필수
    if (activeYn === 'N' && !rejectReason.trim()) {
      setError('거절 사유를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updateData: AdminOpenApiUpdateReq = {
        activeYn,
        rejectReason: activeYn === 'N' ? rejectReason : undefined,
        updatedBy: 'ADMIN' // TODO: 실제 관리자 ID로 변경
      };

      await updateAdminOpenApi(Number(keyId), updateData);
      
      // 성공 시 목록으로 이동
      navigate(ROUTES.ADMIN.OPENAPI.REQUESTS);
    } catch (error) {
      console.error('OpenAPI 요청 처리 중 오류:', error);
      setError('OpenAPI 요청 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 뒤로 가기 제거 (브레드크럼 사용)
  // const handleBack = () => {
  //   navigate(ROUTES.ADMIN.OPENAPI.REQUESTS);
  // };

  if (!keyId) {
    return <ErrorAlert error="잘못된 요청입니다." />;
  }

  const openApi = openApiDetail?.authKey;

  return (
    <Box id="admin-openapi-request-detail-page">
      <AdminPageHeader />
      
      {/* 에러 알림 */}
      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}
      
      <Box sx={{ p: SPACING.LARGE }}>
        {/* 뒤로 가기 버튼 */}
        {/* <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>뒤로가기</Button> */}

        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          API 요청 처리
        </Typography>

        {isLoading ? (
          <LoadingSpinner loading={true} />
        ) : openApi ? (
          <Grid container spacing={3}>
            {/* 기본 정보 */}
            <Grid item xs={12} md={6}>
              <ThemedCard>
                <CardContent>
                  <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    기본 정보
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        키 ID
                      </Typography>
                      <Typography variant="body1">
                        {openApi.keyId}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        키 이름
                      </Typography>
                      <Typography variant="body1">
                        {openApi.keyName}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        사용 목적
                      </Typography>
                      <Typography variant="body1">
                        {openApi.keyDesc || '-'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        사용자 ID
                      </Typography>
                      <Typography variant="body1">
                        {openApi.userId}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        신청일
                      </Typography>
                      <Typography variant="body1">
                        {formatYmdHm(openApi.createdAt)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        현재 상태
                      </Typography>
                      <Chip 
                        label={getOpenApiKeyStatus(openApi)} 
                        color="warning" 
                        size="small"
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </ThemedCard>
            </Grid>

            {/* 승인/거절 처리 */}
            <Grid item xs={12} md={6}>
              <ThemedCard>
                <CardContent>
                  <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    요청 처리
                  </Typography>
                  
                  <Stack spacing={3}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">처리 결과</FormLabel>
                      <RadioGroup
                        value={activeYn}
                        onChange={(e) => setActiveYn(e.target.value)}
                      >
                        <FormControlLabel 
                          value="Y" 
                          control={<Radio />} 
                          label="승인" 
                        />
                        <FormControlLabel 
                          value="N" 
                          control={<Radio />} 
                          label="거절" 
                        />
                      </RadioGroup>
                    </FormControl>

                    {activeYn === 'N' && (
                      <TextField
                        label="거절 사유"
                        multiline
                        rows={4}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="거절 사유를 입력해주세요"
                        fullWidth
                        required
                        error={activeYn === 'N' && !rejectReason.trim()}
                        helperText={activeYn === 'N' && !rejectReason.trim() ? '거절 사유를 입력해주세요' : ''}
                      />
                    )}

                    <Divider />

                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CheckIcon />}
                        onClick={handleSubmit}
                        disabled={isSubmitting || (activeYn === 'N' && !rejectReason.trim())}
                        fullWidth
                      >
                        {isSubmitting ? '처리 중...' : '처리 완료'}
                      </Button>
                      
                      {/* <Button variant="outlined" onClick={handleBack} disabled={isSubmitting} fullWidth>취소</Button> */}
                    </Stack>
                  </Stack>
                </CardContent>
              </ThemedCard>
            </Grid>
          </Grid>
        ) : (
          <ErrorAlert error="OpenAPI 요청 정보를 찾을 수 없습니다." />
        )}
      </Box>
    </Box>
  );
}
