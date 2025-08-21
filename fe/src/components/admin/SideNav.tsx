import React, { useMemo, useState } from 'react';
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
import { getAdminRole } from '../../store/user';

interface SideNavItem {
  id: string;
  label: string;
  to: string;
  icon: React.ReactNode;
  requiresSAdmin?: boolean;
}

export default function SideNav() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const adminRole = getAdminRole();
  const isSAdmin = useMemo(() => adminRole === 'S-ADMIN', [adminRole]);

  const items: SideNavItem[] = useMemo(() => [
    { id: 'sidenav-dashboard', label: '대시보드', to: ROUTES.ADMIN.DASHBOARD, icon: <DashboardIcon /> },
    { id: 'sidenav-openapi', label: 'Open API 인증 키관리', to: ROUTES.ADMIN.OPENAPI.CLIENTS, icon: <OpenApiIcon /> },
    { id: 'sidenav-qna', label: 'Q&A 관리', to: ROUTES.ADMIN.QNA.LIST, icon: <QnaIcon /> },
    { id: 'sidenav-faq', label: 'FAQ 관리', to: ROUTES.ADMIN.FAQ.LIST, icon: <FaqIcon /> },
    { id: 'sidenav-notice', label: '공지 관리', to: ROUTES.ADMIN.NOTICES.LIST, icon: <NoticeIcon /> },
    { id: 'sidenav-users', label: '사용자 관리', to: ROUTES.ADMIN.USERS.LIST, icon: <UsersIcon /> },
    // 시스템 영역 (S-Admin 전용)
    { id: 'sidenav-operators', label: '운영자 관리', to: ROUTES.ADMIN.OPERATORS.LIST, icon: <AdminIcon />, requiresSAdmin: true },
    { id: 'sidenav-codes', label: '코드 관리', to: ROUTES.ADMIN.CODE.LIST, icon: <CodeIcon />, requiresSAdmin: true },
  ], []);

  const visibleItems = items.filter(it => !it.requiresSAdmin || isSAdmin);

  const isActive = (to: string) => location.pathname === to || location.pathname.startsWith(to + '/');

  const autoCollapsed = useMediaQuery('(max-width:1279px)');
  const [collapsed, setCollapsed] = useState<boolean>(autoCollapsed);
  const widthPx = collapsed ? 72 : 240;

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
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end', alignItems: 'center', px: 1, py: 0.5 }}>
        <IconButton id="sidenav-toggle" size="small" onClick={() => setCollapsed(v => !v)} aria-label={collapsed ? 'expand side navigation' : 'collapse side navigation'}>
          {collapsed ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
        </IconButton>
      </Box>
      <List dense sx={{ py: 1 }}>
        {visibleItems.slice(0, 6).map(item => {
          const active = isActive(item.to);
          const content = (
            <ListItemButton
              id={item.id}
              selected={active}
              onClick={() => navigate(item.to)}
              sx={{
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                '&.Mui-selected': {
                  bgcolor: theme.palette.action.selected,
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, justifyContent: 'center' }}>{item.icon}</ListItemIcon>
              {!collapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
          );
          return (
            <Tooltip key={item.id} title={item.label} placement="right" enterDelay={600}>
              {content}
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ mx: 1 }} />

      <List dense sx={{ py: 1 }}>
        {visibleItems.slice(6).map(item => {
          const active = isActive(item.to);
          const content = (
            <ListItemButton
              id={item.id}
              selected={active}
              onClick={() => navigate(item.to)}
              sx={{
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                '&.Mui-selected': {
                  bgcolor: theme.palette.action.selected,
                  borderLeft: `4px solid ${theme.palette.secondary.main}`,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, justifyContent: 'center' }}>{item.icon}</ListItemIcon>
              {!collapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
          );
          return (
            <Tooltip key={item.id} title={item.label} placement="right" enterDelay={600}>
              {content}
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );
}


