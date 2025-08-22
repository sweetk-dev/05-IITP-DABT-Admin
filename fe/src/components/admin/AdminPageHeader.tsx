import React from 'react';
import { Box, Breadcrumbs, Typography, Link } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES, ROUTE_META } from '../../routes';

interface AdminPageHeaderProps {
  id?: string;
  actionsRight?: React.ReactNode;
}

export default function AdminPageHeader({ id = 'admin-page-header', actionsRight }: AdminPageHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname;

  const makeCrumbs = () => {
    const crumbs: Array<{ label: string; to?: string }> = [];

    // 1) 단일 페이지 (프로필 등)
    if (path.startsWith(ROUTES.ADMIN.PROFILE)) {
      crumbs.push({ label: '관리자 프로필' });
      return crumbs;
    }

    // 2) ROUTE_META 기반 동적 처리
    const getMetaInfo = (currentPath: string) => {
      // 정확한 경로 매칭 시도
      let meta = (ROUTE_META as any)[currentPath];
      
      // 정확한 매칭이 없으면 패턴 매칭 시도
      if (!meta) {
        // 동적 라우트 패턴 매칭 (예: /admin/users/:id → /admin/users)
        const basePath = currentPath.replace(/\/[^\/]+$/, ''); // 마지막 세그먼트 제거
        meta = (ROUTE_META as any)[basePath];
        
        if (meta) {
          // 상세/편집/답변 페이지 구분
          if (currentPath.endsWith('/edit')) {
            return { ...meta, title: `${meta.title} 편집` };
          } else if (currentPath.endsWith('/reply')) {
            return { ...meta, title: `${meta.title} 답변` };
          } else if (currentPath.includes('/')) {
            return { ...meta, title: `${meta.title} 상세` };
          }
        }
      }
      
      return meta;
    };

    // 현재 경로의 메타 정보 가져오기
    const currentMeta = getMetaInfo(path);
    
    if (currentMeta) {
      // 리스트 페이지인 경우
      if (path === currentMeta.path || path === currentMeta.listPath) {
        crumbs.push({ label: currentMeta.title });
        return crumbs;
      }
      
      // 상세/편집/답변 페이지인 경우
      const basePath = path.replace(/\/[^\/]+$/, '');
      const baseMeta = getMetaInfo(basePath);
      
      if (baseMeta) {
        crumbs.push({ label: baseMeta.title, to: basePath });
        
        // 상세 페이지 구분
        if (path.endsWith('/edit')) {
          crumbs.push({ label: '편집' });
        } else if (path.endsWith('/reply')) {
          crumbs.push({ label: '답변' });
        } else if (path.includes('/')) {
          crumbs.push({ label: '상세' });
        }
        return crumbs;
      }
    }

    // 3) 대시보드
    if (path === ROUTES.ADMIN.DASHBOARD) {
      crumbs.push({ label: '대시보드' });
      return crumbs;
    }

    // 4) 알 수 없는 경로
    crumbs.push({ label: '알 수 없는 페이지' });
    return crumbs;
  };

  const crumbs = makeCrumbs();
  const title = crumbs[crumbs.length - 1]?.label || '관리자';

  return (
    <Box id={id} sx={{
      position: 'sticky',
      top: 'calc(var(--header-height-px, 64px))',
      zIndex: 1000,
      bgcolor: 'background.default',
      borderBottom: theme => `1px solid ${theme.palette.divider}`,
    }}>
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 1 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 0.5 }}>
          {crumbs.map((c, idx) => {
            const isLast = idx === crumbs.length - 1;
            if (isLast || !c.to) return (
              <Typography key={idx} color="text.primary" fontWeight={700}>{c.label}</Typography>
            );
            return (
              <Link key={idx} underline="hover" color="inherit" onClick={() => navigate(c.to!)} sx={{ cursor: 'pointer' }}>
                {c.label}
              </Link>
            );
          })}
        </Breadcrumbs>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={800}>{title}</Typography>
          <Box id="admin-page-actions" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {actionsRight}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}


