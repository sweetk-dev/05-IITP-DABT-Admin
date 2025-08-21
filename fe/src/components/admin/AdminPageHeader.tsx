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

    // 2) 리스트/상세 구조 공통 처리 유틸
    const addListDetail = (listPath: string, listLabel: string) => {
      if (path === listPath) {
        crumbs.push({ label: listLabel });
        return true;
      }
      if (path.startsWith(listPath + '/')) {
        crumbs.push({ label: listLabel, to: listPath });
        const suffix = path.slice(listPath.length + 1);
        let detailLabel = '상세';
        if (suffix.endsWith('/edit')) detailLabel = '편집';
        else if (suffix.endsWith('/reply')) detailLabel = '답변';
        crumbs.push({ label: detailLabel });
        return true;
      }
      return false;
    };

    // 섹션별 매핑
    if (addListDetail(ROUTES.ADMIN.FAQ.LIST, 'FAQ 관리')) return crumbs;
    if (addListDetail(ROUTES.ADMIN.QNA.LIST, 'Q&A 관리')) return crumbs;
    if (addListDetail(ROUTES.ADMIN.USERS.LIST, '사용자 관리')) return crumbs;
    if (addListDetail(ROUTES.ADMIN.OPENAPI.CLIENTS, 'OpenAPI 클라이언트 관리')) return crumbs;
    if (addListDetail(ROUTES.ADMIN.NOTICES.LIST, '공지사항 관리')) return crumbs;
    if (addListDetail(ROUTES.ADMIN.OPERATORS.LIST, '운영자 관리')) return crumbs;
    if (addListDetail(ROUTES.ADMIN.CODE.LIST, '코드 관리')) return crumbs;

    // 3) 메타 기반(그 외)
    const metaTitle = (ROUTE_META as any)[path]?.title as string | undefined;
    if (metaTitle) {
      crumbs.push({ label: metaTitle });
      return crumbs;
    }

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


