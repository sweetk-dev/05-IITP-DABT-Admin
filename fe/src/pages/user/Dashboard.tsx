import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Chip,
  Alert,
  CircularProgress
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
  getUserOpenApiList,
  type UserQnaListRes,
  type UserOpenApiListRes
} from '../../api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorAlert } from '../../components/ErrorAlert';
import { ROUTES } from '../../routes';
import PageTitle from '../../components/common/PageTitle';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { getThemeColors } from '../../theme';

interface DashboardProps {
  id?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ id = 'user-dashboard' }) => {
  const navigate = useNavigate();
  const [qnaList, setQnaList] = useState<UserQnaListRes | null>(null);
  const [openApiList, setOpenApiList] = useState<UserOpenApiListRes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 테마 설정 (사용자 페이지는 'user' 테마)
  const theme: 'user' | 'admin' = 'user';
  const colors = getThemeColors(theme);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 병렬로 데이터 로드
      const [qnaResponse, openApiResponse] = await Promise.all([
        getUserQnaList({}),
        getUserOpenApiList({})
      ]);

      if (qnaResponse.success) {
        setQnaList(qnaResponse.data!);
      }

      if (openApiResponse.success) {
        setOpenApiList(openApiResponse.data!);
      }
    } catch (err) {
      setError('대시보드 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
    return <LoadingSpinner />;
  }

  return (
    <Box id={id} sx={{ p: 3 }}>
      <PageTitle title="대시보드" theme={theme} />

      {error && <ErrorAlert message={error} />}

      <Grid container spacing={3}>
        {/* 내 QnA 섹션 */}
        <Grid item xs={12} md={6}>
          <ThemedCard theme={theme}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center', color: colors.text }}>
                  <QnaIcon sx={{ mr: 1, color: colors.primary }} />
                  내 QnA
                </Typography>
                <Box>
                  <ThemedButton
                    id="create-qna-btn"
                    theme={theme}
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
                    theme={theme}
                    variant="outlined"
                    size="small"
                    startIcon={<HistoryIcon />}
                    onClick={handleQnaHistory}
                  >
                    내 문의 내역
                  </ThemedButton>
                </Box>
              </Box>

              {qnaList?.qnas && qnaList.qnas.length > 0 ? (
                <List>
                  {qnaList.qnas.slice(0, 5).map((qna) => (
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
          </Card>
        </Grid>

        {/* API 인증키 관리 섹션 */}
        <Grid item xs={12} md={6}>
          <ThemedCard theme={theme}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center', color: colors.text }}>
                  <KeyIcon sx={{ mr: 1, color: colors.primary }} />
                  API 인증키 관리
                </Typography>
                <ThemedButton
                  id="openapi-management-btn"
                  theme={theme}
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
                  {openApiList.authKeys.slice(0, 3).map((authKey) => (
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
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 