import React, { useMemo, useState, useEffect } from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Tooltip, Divider, IconButton } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Key as OpenApiIcon,
  Chat as QnaIcon,
  QuestionAnswer as FaqIcon,
  Announcement as NoticeIcon,
  People as UsersIcon,
  AdminPanelSettings as AdminIcon,
  Code as CodeIcon,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ROUTES } from '../../routes';
import { hasMenuAccess } from '../../utils/auth';

interface SideNavProps {
  open: boolean;
  onToggle?: () => void;
  adminRole: string | null;
}

interface SideNavItem {
  id: string;
  key: string;
  label: string;
  to: string;
  icon: React.ReactNode;
}

export default function SideNav({ open, adminRole }: SideNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  const items: SideNavItem[] = useMemo(() => [
    { id: 'sidenav-dashboard', key: 'dashboard', label: '대시보드', to: ROUTES.ADMIN.DASHBOARD, icon: <DashboardIcon /> },
    { id: 'sidenav-openapi', key: 'openapi', label: 'Open API 인증 키관리', to: ROUTES.ADMIN.OPENAPI.CLIENTS, icon: <OpenApiIcon /> },
    { id: 'sidenav-qna', key: 'qna', label: 'Q&A 관리', to: ROUTES.ADMIN.QNA.LIST, icon: <QnaIcon /> },
    { id: 'sidenav-faq', key: 'faq', label: 'FAQ 관리', to: ROUTES.ADMIN.FAQ.LIST, icon: <FaqIcon /> },
    { id: 'sidenav-notice', key: 'notice', label: '공지 관리', to: ROUTES.ADMIN.NOTICES.LIST, icon: <NoticeIcon /> },
    { id: 'sidenav-users', key: 'user-management', label: '사용자 관리', to: ROUTES.ADMIN.USERS.LIST, icon: <UsersIcon /> },
    { id: 'sidenav-operators', key: 'operator-management', label: '운영자 관리', to: ROUTES.ADMIN.OPERATORS.LIST, icon: <AdminIcon /> },
    { id: 'sidenav-codes', key: 'code-management', label: '코드 관리', to: ROUTES.ADMIN.CODE.LIST, icon: <CodeIcon /> },
  ], []);

  // 권한에 따른 메뉴 필터링
  const visibleItems = items.filter(item => hasMenuAccess(adminRole, item.key));

  const isActive = (to: string) => location.pathname === to || location.pathname.startsWith(to + '/');

  // 브라우저 크기에 따른 자동 접기 + 수동 접기/펼치기
  const autoCollapsed = useMediaQuery(theme.breakpoints.down('lg'));
  const [collapsed, setCollapsed] = useState<boolean>(autoCollapsed);
  
  // open prop과 collapsed 상태를 통합하여 실제 표시 여부 결정
  const isCollapsed = !open || collapsed;
  const widthPx = isCollapsed ? 80 : 260;

  // 수동 토글 핸들러
  const handleManualToggle = () => {
    setCollapsed(v => !v);
  };

  // 자동 접기 상태가 변경될 때 collapsed 상태 동기화
  useEffect(() => {
    setCollapsed(autoCollapsed);
  }, [autoCollapsed]);

  return (
    <Box
      id="admin-sidenav"
      component="aside"
      sx={{
        position: 'sticky',
        top: 'var(--header-height-px, 64px)',
        height: 'calc(100dvh - var(--header-height-px, 64px))',
        width: `${widthPx}px`,
        minWidth: `${widthPx}px`,
        borderRight: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        zIndex: 1100,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      {/* 접기/펼치기 토글 버튼 */}
      <Box sx={{ display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-end', alignItems: 'center', px: 1, py: 0.5 }}>
        <IconButton 
          id="sidenav-toggle" 
          size="small" 
          onClick={handleManualToggle} 
          aria-label={isCollapsed ? 'expand side navigation' : 'collapse side navigation'}
        >
          {isCollapsed ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
        </IconButton>
      </Box>

      {/* 메인 메뉴 (상위 6개) */}
      <List sx={{ py: 1 }}>
        {visibleItems.slice(0, 6).map(item => {
          const active = isActive(item.to);
          const content = (
            <ListItemButton
              id={item.id}
              selected={active}
              onClick={() => navigate(item.to)}
              sx={{
                borderRadius: 2,
                mx: 1.5,
                my: 1,
                py: isCollapsed ? 2 : 1.5,
                minHeight: isCollapsed ? 64 : 48,
                flexDirection: isCollapsed ? 'column' : 'row',
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                  '& .MuiListItemText-root': {
                    color: 'primary.contrastText',
                  }
                },
                '&:hover': {
                  bgcolor: active ? 'primary.light' : 'action.hover',
                }
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: isCollapsed ? 'auto' : 40, 
                justifyContent: 'center',
                mb: isCollapsed ? 0.5 : 0,
                '& svg': {
                  fontSize: isCollapsed ? '1.5rem' : '1.25rem'
                }
              }}>
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: active ? 600 : 500
                  }}
                />
              )}
              {isCollapsed && (
                <Box sx={{ 
                  fontSize: '0.7rem', 
                  fontWeight: active ? 600 : 500,
                  textAlign: 'center',
                  lineHeight: 1.2,
                  mt: 0.5
                }}>
                  {item.label}
                </Box>
              )}
            </ListItemButton>
          );
          return (
            <Tooltip key={item.id} title={!isCollapsed ? '' : item.label} placement="right" enterDelay={600}>
              {content}
            </Tooltip>
          );
        })}
      </List>

      {/* 구분선 */}
      <Divider sx={{ mx: 1 }} />

      {/* 시스템 메뉴 (나머지) */}
      <List sx={{ py: 1 }}>
        {visibleItems.slice(6).map(item => {
          const active = isActive(item.to);
          const content = (
            <ListItemButton
              id={item.id}
              selected={active}
              onClick={() => navigate(item.to)}
              sx={{
                borderRadius: 2,
                mx: 1.5,
                my: 1,
                py: isCollapsed ? 2 : 1.5,
                minHeight: isCollapsed ? 64 : 48,
                flexDirection: isCollapsed ? 'column' : 'row',
                '&.Mui-selected': {
                  bgcolor: 'secondary.light',
                  color: 'secondary.contrastText',
                  borderLeft: `4px solid ${theme.palette.secondary.main}`,
                  '& .MuiListItemIcon-root': {
                    color: 'secondary.contrastText',
                  },
                  '& .MuiListItemText-root': {
                    color: 'secondary.contrastText',
                  }
                },
                '&:hover': {
                  bgcolor: active ? 'secondary.light' : 'action.hover',
                }
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: isCollapsed ? 'auto' : 40, 
                justifyContent: 'center',
                mb: isCollapsed ? 0.5 : 0,
                '& svg': {
                  fontSize: isCollapsed ? '1.5rem' : '1.25rem'
                }
              }}>
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: active ? 600 : 500
                  }}
                />
              )}
              {isCollapsed && (
                <Box sx={{ 
                  fontSize: '0.7rem', 
                  fontWeight: active ? 600 : 500,
                  textAlign: 'center',
                  lineHeight: 1.2,
                  mt: 0.5
                }}>
                  {item.label}
                </Box>
              )}
            </ListItemButton>
          );
          return (
            <Tooltip key={item.id} title={!isCollapsed ? '' : item.label} placement="right" enterDelay={600}>
              {content}
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );
}


