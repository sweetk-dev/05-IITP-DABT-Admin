import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  QuestionAnswer as QnaIcon,
  Help as FaqIcon,
  Announcement as NoticeIcon,
  Key as ApiIcon,
  History as HistoryIcon,
  Add as AddIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { ROUTES, ROUTE_META } from '../../routes';
import { getThemeColors } from '../../theme';
import ListHeader from '../../components/common/ListHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import StatusChip from '../../components/common/StatusChip';

export default function UserDashboard() {
  const navigate = useNavigate();

  // ROUTE_META에서 페이지 정보 동적 가져오기
  const pageMeta = (ROUTE_META as any)[ROUTES.USER.DASHBOARD];
  const pageTitle = pageMeta?.title || '사용자 대시보드';
  const pageSubtitle = pageMeta?.subtitle || 'OpenAPI 서비스를 이용할 수 있는 사용자 대시보드입니다';

  const theme: 'user' | 'admin' = 'user';
  const colors = getThemeColors(theme);

  const quickActions = [
    {
      title: 'Q&A 작성',
      description: '새로운 질문을 작성합니다',
      icon: <AddIcon />,
      color: 'primary' as const,
      path: ROUTES.USER.QNA_CREATE,
      action: () => navigate(ROUTES.USER.QNA_CREATE)
    },
    {
      title: 'Q&A 목록',
      description: '질문과 답변을 확인합니다',
      icon: <QnaIcon />,
      color: 'success' as const,
      path: ROUTES.USER.QNA_LIST,
      action: () => navigate(ROUTES.USER.QNA_LIST)
    },
    {
      title: 'Q&A 이력',
      description: '내가 작성한 질문들을 확인합니다',
      icon: <HistoryIcon />,
      color: 'info' as const,
      path: ROUTES.USER.QNA_HISTORY,
      action: () => navigate(ROUTES.USER.QNA_HISTORY)
    },
    {
      title: 'FAQ 보기',
      description: '자주 묻는 질문을 확인합니다',
      icon: <FaqIcon />,
      color: 'warning' as const,
      path: ROUTES.USER.FAQ_LIST,
      action: () => navigate(ROUTES.USER.FAQ_LIST)
    },
    {
      title: 'OpenAPI 관리',
      description: 'API 키를 관리합니다',
      icon: <ApiIcon />,
      color: 'secondary' as const,
      path: ROUTES.USER.OPEN_API_MANAGEMENT,
      action: () => navigate(ROUTES.USER.OPEN_API_MANAGEMENT)
    }
  ];

  const recentActivities = [
    {
      type: 'Q&A',
      title: 'OpenAPI 사용법에 대한 질문',
      status: '답변완료',
      date: '2024-01-15',
      color: 'success' as const
    },
    {
      type: 'API',
      title: '새로운 API 키 생성',
      status: '완료',
      date: '2024-01-14',
      color: 'primary' as const
    },
    {
      type: 'Q&A',
      title: '데이터 형식 문의',
      status: '답변대기',
      date: '2024-01-13',
      color: 'warning' as const
    }
  ];

  const stats = [
    {
      label: '총 Q&A 수',
      value: '12',
      color: 'primary' as const,
      icon: <QnaIcon />
    },
    {
      label: '답변완료',
      value: '8',
      color: 'success' as const,
      icon: <QnaIcon />
    },
    {
      label: '답변대기',
      value: '4',
      color: 'warning' as const,
      icon: <QnaIcon />
    },
    {
      label: '활성 API 키',
      value: '3',
      color: 'info' as const,
      icon: <ApiIcon />
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <ThemedCard sx={{ mb: 3 }}>
        <ListHeader
          title={pageTitle}
          icon={<DashboardIcon />}
        />
      </ThemedCard>

      {/* 통계 정보 */}
      <Typography variant="h5" gutterBottom sx={{ color: colors.text, mb: 2 }}>통계 정보</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <ThemedCard>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '50%', bgcolor: `${stat.color}.light`, color: `${stat.color}.main`, mb: 2 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" sx={{ color: colors.text, mb: 1, fontWeight: 'bold' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </ThemedCard>
          </Grid>
        ))}
      </Grid>

      {/* 빠른 액션 */}
      <Typography variant="h5" gutterBottom sx={{ color: colors.text, mb: 2 }}>빠른 액션</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ThemedCard
              sx={{ height: '100%', cursor: 'pointer' }}
              onClick={action.action}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '50%', bgcolor: `${action.color}.light`, color: `${action.color}.main`, mb: 2 }}>
                  {action.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ color: colors.text }}>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {action.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <ThemedButton
                  variant="primary"
                  color={action.color}
                  onClick={action.action}
                  startIcon={action.title.includes('작성') || action.title.includes('생성') ? <AddIcon /> : <ViewIcon />}
                >
                  {action.title.includes('작성') || action.title.includes('생성') ? '시작하기' : '보기'}
                </ThemedButton>
              </CardActions>
            </ThemedCard>
          </Grid>
        ))}
      </Grid>

      {/* 최근 활동 */}
      <Typography variant="h5" gutterBottom sx={{ color: colors.text, mb: 2 }}>최근 활동</Typography>
      <Grid container spacing={3}>
        {recentActivities.map((activity, index) => (
          <Grid item xs={12} md={4} key={index}>
            <ThemedCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Chip
                    label={activity.type}
                    size="small"
                    color={activity.color}
                    variant="outlined"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {activity.date}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ color: colors.text, mb: 1 }}>
                  {activity.title}
                </Typography>
                <StatusChip
                  label={activity.status}
                  kind={activity.color}
                  size="small"
                />
              </CardContent>
            </ThemedCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 