import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Dashboard as DashboardIcon,
  Announcement as NoticeIcon,
  People as UsersIcon,
  Key as OpenApiIcon,
  QuestionAnswer as FaqIcon,
  Chat as QnaIcon,
  Code as CodeIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { getAdminRole } from '../store/user';
import { ROUTES } from '../routes';
import { getThemeColors } from '../theme';

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  requiresSAdmin?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: '대시보드',
    path: ROUTES.ADMIN.DASHBOARD,
    icon: <DashboardIcon />
  },
  {
    id: 'notices',
    label: '공지관리',
    path: ROUTES.ADMIN.NOTICES.LIST,
    icon: <NoticeIcon />
  },
  {
    id: 'users',
    label: '사용자 관리',
    path: ROUTES.ADMIN.USERS.LIST,
    icon: <UsersIcon />
  },
  {
    id: 'openapi',
    label: 'Open API 인증 키 관리',
    path: ROUTES.ADMIN.OPENAPI.CLIENTS,
    icon: <OpenApiIcon />
  },
  {
    id: 'faq',
    label: 'FAQ 관리',
    path: ROUTES.ADMIN.FAQ.LIST,
    icon: <FaqIcon />
  },
  {
    id: 'qna',
    label: 'Q&A 관리',
    path: ROUTES.ADMIN.QNA.LIST,
    icon: <QnaIcon />
  },
  {
    id: 'code',
    label: 'code 관리',
    path: '/admin/code', // TODO: Add proper route when available
    icon: <CodeIcon />,
    requiresSAdmin: true
  },
  {
    id: 'admin-account',
    label: '어드민 계정 관리',
    path: '/admin/account', // TODO: Add proper route when available
    icon: <AdminIcon />,
    requiresSAdmin: true
  }
];

export default function AdminMenuBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminRole = getAdminRole();
  const isSAdmin = adminRole === 'S-ADMIN';
  const colors = getThemeColors('admin');

  // 현재 활성화된 메뉴 아이템 찾기
  const getActiveMenuId = () => {
    const currentPath = location.pathname;
    const activeItem = MENU_ITEMS.find(item => 
      currentPath === item.path || currentPath.startsWith(item.path + '/')
    );
    return activeItem?.id || 'dashboard';
  };

  const activeMenuId = getActiveMenuId();

  // S-ADMIN 권한이 필요한 메뉴 필터링
  const visibleMenuItems = MENU_ITEMS.filter(item => 
    !item.requiresSAdmin || isSAdmin
  );

  return (
    <Box
      id="admin-menu-bar"
      sx={{
        position: 'fixed',
        top: 'var(--appbar-height)',
        left: 0,
        right: 0,
        zIndex: 9998,
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(8px)',
        borderBottom: `2px solid ${colors.primary}40`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: { xs: '5%', md: '10%' },
          py: 1,
          gap: 1,
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: colors.primary,
            borderRadius: '2px',
          },
        }}
      >
        {visibleMenuItems.map((item) => {
          const isActive = activeMenuId === item.id;
          
          return (
            <Button
              key={item.id}
              id={`admin-menu-${item.id}`}
              variant={isActive ? 'contained' : 'text'}
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                minWidth: 'auto',
                px: 2,
                py: 1,
                borderRadius: 2,
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#fff' : colors.text,
                background: isActive ? colors.primary : 'transparent',
                border: isActive ? 'none' : `1px solid ${colors.primary}30`,
                '&:hover': {
                  background: isActive 
                    ? `${colors.primary}dd` 
                    : `${colors.primary}15`,
                  color: isActive ? '#fff' : colors.primary,
                  transform: 'translateY(-1px)',
                  boxShadow: isActive ? 2 : 1,
                },
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                textTransform: 'none',
                ...(item.requiresSAdmin && {
                  borderColor: colors.secondary,
                  '&:hover': {
                    background: `${colors.secondary}15`,
                    color: colors.secondary,
                  }
                })
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: isActive ? 600 : 500,
                  ...(item.requiresSAdmin && {
                    color: 'inherit'
                  })
                }}
              >
                {item.label}
              </Typography>
            </Button>
          );
        })}
      </Box>
    </Box>
  );
} 