import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Grid, 
  Typography, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  Chip,
  Alert
} from '@mui/material';
import { 
  QuestionAnswer as QnaIcon, 
  Key as KeyIcon,
  Add as AddIcon,
  History as HistoryIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { 
  getUserQnaList, 
  getUserOpenApiList
} from '../../api';
// 타입은 API 응답에서 추론하도록 any 사용
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { ROUTES } from '../../routes';
import { PAGINATION } from '../../constants/pagination';
import { SPACING } from '../../constants/spacing';
import PageTitle from '../../components/common/PageTitle';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { getThemeColors } from '../../theme';
import { useDataFetching } from '../../hooks/useDataFetching';

interface DashboardProps {
  id?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ id = 'user-dashboard' }) => {
  const navigate = useNavigate();
  
  // 테마 설정 (사용자 페이지는 'user' 테마)
  const theme: 'user' | 'admin' = 'user';
  const colors = getThemeColors(theme);

  // QnA 데이터 페칭 (대시보드용 제한된 수량)
  const {
    data: qnaList,
    isLoading: qnaLoading,
    isError: qnaError,
    // refetch: refetchQna
  } = useDataFetching({
    fetchFunction: () => getUserQnaList({
      page: 1,
      limit: PAGINATION.HOME_PAGE_SIZE // 5개로 제한
    }),
    autoFetch: true
  });

  // OpenAPI 데이터 페칭 (대시보드용 제한된 수량)  
  const {
    data: openApiList,
    isLoading: openApiLoading,
    isError: openApiError,
    // refetch: refetchOpenApi
  } = useDataFetching({
    fetchFunction: () => getUserOpenApiList({
      page: 1,
      limit: 3 // 3개로 제한
    }),
    autoFetch: true
  });

  const loading = qnaLoading || openApiLoading;
  const error = qnaError || openApiError;



  const handleCreateQna = () => {
    navigate(ROUTES.USER.QNA_CREATE);
  };

  const handleQnaHistory = () => {
    navigate(ROUTES.USER.QNA_HISTORY);
  };

  const handleOpenApiManagement = () => {
    navigate(ROUTES.USER.OPEN_API_MANAGEMENT);
  };

  if (loading) {
    return <LoadingSpinner loading={true} />;
  }

  return (
    <Box id={id} sx={{ p: SPACING.LARGE }}>
      <Box sx={{ mb: SPACING.TITLE_BOTTOM }}>
        <PageTitle title="대시보드" />
      </Box>

      {error && (
        <Box sx={{ mb: SPACING.ERROR_ALERT_BOTTOM }}>
          <ErrorAlert error={error.toString()} />
        </Box>
      )}

      <Grid container spacing={SPACING.LARGE}>
        {/* 내 QnA 섹션 */}
        <Grid item xs={12} md={6}>
          <ThemedCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: SPACING.MEDIUM }}>
                <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center', color: colors.text }}>
                  <QnaIcon sx={{ mr: 1, color: colors.primary }} />
                  내 QnA
                </Typography>
                <Box>
                  <ThemedButton
                    id="create-qna-btn"
                    
                    variant="primary"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleCreateQna}
                    sx={{ mr: 1 }}
                  >
                    문의하기
                  </ThemedButton>
                  <ThemedButton
                    id="qna-history-btn"
                    
                    variant="outlined"
                    size="small"
                    startIcon={<HistoryIcon />}
                    onClick={handleQnaHistory}
                  >
                    내 문의 내역
                  </ThemedButton>
                </Box>
              </Box>

              {qnaList?.items && qnaList.items.length > 0 ? (
                <List>
                  {qnaList.items.slice(0, PAGINATION.HOME_PAGE_SIZE).map((qna: any) => (
                    <ListItem key={qna.qnaId} divider>
                      <ListItemText
                        primary={qna.title}
                        secondary={`${qna.createdAt} • ${qna.status === 'answered' ? '답변완료' : '답변대기'}`}
                      />
                      <Chip
                        label={qna.status === 'answered' ? '답변완료' : '답변대기'}
                        color={qna.status === 'answered' ? 'success' : 'warning'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  현재 답변 대기 중인 문의가 없습니다.
                </Alert>
              )}
            </CardContent>
          </ThemedCard>
        </Grid>

        {/* API 인증키 관리 섹션 */}
        <Grid item xs={12} md={6}>
          <ThemedCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: SPACING.MEDIUM }}>
                <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center', color: colors.text }}>
                  <KeyIcon sx={{ mr: 1, color: colors.primary }} />
                  API 인증키 관리
                </Typography>
                <ThemedButton
                  id="openapi-management-btn"
                  
                  variant="outlined"
                  size="small"
                  startIcon={<SettingsIcon />}
                  onClick={handleOpenApiManagement}
                >
                  인증키 관리
                </ThemedButton>
              </Box>

              {openApiList?.authKeys && openApiList.authKeys.length > 0 ? (
                <List>
                  {openApiList.authKeys.slice(0, 3).map((authKey: any) => (
                    <ListItem key={authKey.keyId} divider>
                      <ListItemText
                        primary={`API Key: ${authKey.authKey.substring(0, 8)}...`}
                        secondary={`유효기간: ${authKey.startDt} ~ ${authKey.endDt}`}
                      />
                      <Chip
                        label={authKey.activeYn === 'Y' ? '활성' : '비활성'}
                        color={authKey.activeYn === 'Y' ? 'success' : 'default'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  발행된 인증키가 없습니다.
                </Alert>
              )}
            </CardContent>
          </ThemedCard>
        </Grid>
      </Grid>
    </Box>
  );
}; 