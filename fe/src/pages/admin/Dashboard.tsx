import React from 'react';
import { Box, Typography, Grid, Chip, Button, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  People as UserIcon,
  AdminPanelSettings as OperatorIcon,
  Code as CodeIcon,
  QuestionAnswer as QnaIcon,
  Help as FAQIcon,
  Announcement as NoticeIcon,
  Key as KeyIcon
} from '@mui/icons-material';
import { getAdminRole } from '../../store/user';
import {
  hasContentEditPermission,
  hasUserAccountEditPermission,
  hasAccountManagementPermission,
  hasMenuAccess,
  hasActionPermission
} from '../../utils/auth';
import { ROUTES, ROUTE_META } from '../../routes';
import { getThemeColors } from '../../theme';
import ListHeader from '../../components/common/ListHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import StatusChip from '../../components/common/StatusChip';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const adminRole = getAdminRole();

  // ROUTE_META에서 페이지 정보 동적 가져오기
  const pageMeta = (ROUTE_META as any)[ROUTES.ADMIN.DASHBOARD];
  const pageTitle = pageMeta?.title || '관리자 대시보드';
  const pageSubtitle = pageMeta?.subtitle || '시스템 전반을 관리하고 모니터링할 수 있습니다';

  const theme: 'user' | 'admin' = 'admin';
  const colors = getThemeColors(theme);

  const permissions = {
    '콘텐츠 편집': hasContentEditPermission(adminRole),
    '사용자 계정 관리': hasUserAccountEditPermission(adminRole),
    '운영자 계정 관리': hasAccountManagementPermission(adminRole),
    '시스템 설정': hasAccountManagementPermission(adminRole),
  };

  const actions = {
    'FAQ 관리': hasActionPermission(adminRole, 'create'),
    'Q&A 관리': hasActionPermission(adminRole, 'create'),
    '공지 관리': hasActionPermission(adminRole, 'create'),
    '사용자 관리': hasActionPermission(adminRole, 'user-create'),
    '운영자 관리': hasActionPermission(adminRole, 'operator-create'),
    '코드 관리': hasActionPermission(adminRole, 'code-create'),
  };

  const quickActions = [
    {
      title: '사용자 관리',
      description: '사용자 계정을 관리합니다',
      path: ROUTES.ADMIN.USERS.LIST,
      icon: <UserIcon />,
      color: 'primary' as const,
      enabled: hasMenuAccess(adminRole, 'user-management')
    },
    {
      title: '운영자 관리',
      description: '운영자 계정을 관리합니다',
      path: ROUTES.ADMIN.OPERATORS.LIST,
      icon: <OperatorIcon />,
      color: 'secondary' as const,
      enabled: hasMenuAccess(adminRole, 'operator-management')
    },
    {
      title: '코드 관리',
      description: '시스템 코드를 관리합니다',
      path: ROUTES.ADMIN.CODE.LIST,
      icon: <CodeIcon />,
      color: 'info' as const,
      enabled: hasMenuAccess(adminRole, 'code-management')
    }
  ];

  const contentManagement = [
    {
      title: 'Q&A 관리',
      description: '사용자 문의를 관리합니다',
      path: ROUTES.ADMIN.QNA.LIST,
      icon: <QnaIcon />,
      color: 'success' as const,
      enabled: hasMenuAccess(adminRole, 'qna')
    },
    {
      title: 'FAQ 관리',
      description: '자주 묻는 질문을 관리합니다',
      path: ROUTES.ADMIN.FAQ.LIST,
      icon: <FAQIcon />,
      color: 'warning' as const,
      enabled: hasMenuAccess(adminRole, 'faq')
    },
    {
      title: '공지 관리',
      description: '공지사항을 관리합니다',
      path: ROUTES.ADMIN.NOTICES.LIST,
      icon: <NoticeIcon />,
      color: 'error' as const,
      enabled: hasMenuAccess(adminRole, 'notice')
    },
    {
      title: 'OpenAPI 관리',
      description: 'API 키를 관리합니다',
      path: ROUTES.ADMIN.OPENAPI.CLIENTS,
      icon: <KeyIcon />,
      color: 'info' as const,
      enabled: hasMenuAccess(adminRole, 'openapi')
    }
  ];

  const handleQuickAction = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ p: 3 }}>
      <ThemedCard sx={{ mb: 3 }}>
        <ListHeader
          title={pageTitle}
          subtitle={pageSubtitle}
          icon={<DashboardIcon />}
        />
      </ThemedCard>

      {/* Current User Info */}
      <ThemedCard sx={{ mb: 3 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ color: colors.text, mb: 2 }}>현재 사용자 정보</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">역할:</Typography>
                <StatusChip
                  label={adminRole || '미정의'}
                  status={adminRole === 'S-ADMIN' ? 'success' : adminRole === 'ADMIN' ? 'info' : adminRole === 'EDITOR' ? 'warning' : 'default'}
                  size="small"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">현재 경로:</Typography>
                <Typography variant="body2" sx={{ color: colors.text }}>{location.pathname}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </ThemedCard>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom sx={{ color: colors.text, mb: 2 }}>빠른 액션</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action) => (
          <Grid item xs={12} sm={6} md={4} key={action.title}>
            <ThemedCard
              sx={{ height: '100%', opacity: action.enabled ? 1 : 0.6, cursor: action.enabled ? 'pointer' : 'default' }}
              onClick={() => action.enabled && handleQuickAction(action.path)}
            >
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '50%', bgcolor: `${action.color}.light`, color: `${action.color}.main`, mb: 2 }}>
                  {action.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ color: colors.text }}>{action.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{action.description}</Typography>
                <ThemedButton variant="contained" color={action.color} fullWidth disabled={!action.enabled} onClick={() => handleQuickAction(action.path)}>
                  {action.enabled ? '이동하기' : '접근 불가'}
                </ThemedButton>
              </Box>
            </ThemedCard>
          </Grid>
        ))}
      </Grid>

      {/* Content Management */}
      <Typography variant="h5" gutterBottom sx={{ color: colors.text, mb: 2 }}>콘텐츠 관리</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {contentManagement.map((content) => (
          <Grid item xs={12} sm={6} md={3} key={content.title}>
            <ThemedCard
              sx={{ height: '100%', opacity: content.enabled ? 1 : 0.6, cursor: content.enabled ? 'pointer' : 'default' }}
              onClick={() => content.enabled && handleQuickAction(content.path)}
            >
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Box sx={{ display: 'inline-flex', p: 1.5, borderRadius: '50%', bgcolor: `${content.color}.light`, color: `${content.color}.main`, mb: 1.5 }}>
                  {content.icon}
                </Box>
                <Typography variant="subtitle1" gutterBottom sx={{ color: colors.text }}>{content.title}</Typography>
                <Typography variant="caption" color="text.secondary">{content.description}</Typography>
              </Box>
            </ThemedCard>
          </Grid>
        ))}
      </Grid>

      {/* Permission Status */}
      <Typography variant="h5" gutterBottom sx={{ color: colors.text, mb: 2 }}>권한 상태</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {Object.entries(permissions).map(([permission, hasPermission]) => (
          <Grid item xs={12} sm={6} md={4} key={permission}>
            <Box sx={{
              p: 2,
              border: `1px solid ${hasPermission ? colors.success : colors.border}`,
              borderRadius: 1,
              bgcolor: hasPermission ? `${colors.success}.light` : 'background.paper'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StatusChip
                  label={permission}
                  status={hasPermission ? 'success' : 'default'}
                  size="small"
                />
                <Typography variant="caption" color="text.secondary">
                  {hasPermission ? '허용됨' : '거부됨'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Action Permissions */}
      <Typography variant="h5" gutterBottom sx={{ color: colors.text, mb: 2 }}>액션 권한</Typography>
      <Grid container spacing={2}>
        {Object.entries(actions).map(([action, hasPermission]) => (
          <Grid item xs={12} sm={6} md={4} key={action}>
            <Box sx={{
              p: 2,
              border: `1px solid ${hasPermission ? colors.primary : colors.border}`,
              borderRadius: 1,
              bgcolor: hasPermission ? `${colors.primary}.light` : 'background.paper'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StatusChip
                  label={action}
                  status={hasPermission ? 'success' : 'default'}
                  size="small"
                />
                <Typography variant="caption" color="text.secondary">
                  {hasPermission ? '허용됨' : '거부됨'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
