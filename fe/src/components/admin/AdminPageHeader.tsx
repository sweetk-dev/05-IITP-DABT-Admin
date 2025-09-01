import React from 'react';
import { Box, Breadcrumbs, Typography, Link } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES, ROUTE_META, ROUTE_GROUPS } from '../../routes';

interface AdminPageHeaderProps {
  id?: string;
}

export default function AdminPageHeader({ 
  id = 'admin-page-header'
}: AdminPageHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname;

  const makeCrumbs = () => {
    const crumbs: Array<{ label: string; to?: string }> = [];

    // ROUTE_GROUPS 기반 브레드크럼 생성
    const findRouteInGroups = (currentPath: string) => {
      for (const [groupKey, group] of Object.entries(ROUTE_GROUPS)) {
        // 어드민 관련 그룹만 처리
        if (!groupKey.startsWith('ADMIN')) continue;
        
        for (const route of group.routes) {
          // 정확한 매칭
          if (route.path === currentPath) {
            return { group, route, groupKey };
          }
          
          // 동적 라우트 매칭 (예: /admin/openapi/clients/:id)
          const pathPattern = route.path.replace(/:[^/]+/g, '[^/]+');
          const regex = new RegExp(`^${pathPattern}$`);
          if (regex.test(currentPath)) {
            return { group, route, groupKey };
          }
          
          // 베이스 패스 매칭 (상세 페이지용)
          if (currentPath.startsWith(route.path + '/')) {
            return { group, route, groupKey, isDetail: true };
          }
        }
      }
      return null;
    };

    const routeInfo = findRouteInGroups(path);
    
    if (routeInfo) {
      const { route, isDetail } = routeInfo;
      
      // 메인 페이지명 (예: "공지사항 관리", "FAQ 관리")
      if (isDetail) {
        crumbs.push({ label: route.title, to: route.path });
        
        // 상세 페이지 구분
        if (path.endsWith('/edit')) {
          crumbs.push({ label: '수정' });
        } else if (path.endsWith('/reply')) {
          crumbs.push({ label: '답변' });
        } else if (path.endsWith('/create')) {
          crumbs.push({ label: '생성' });
        } else {
          crumbs.push({ label: '상세' });
        }
      } else {
        // 목록 페이지는 페이지명만 표시
        crumbs.push({ label: route.title });
      }
      
      return crumbs;
    }

    // 대시보드 특별 처리
    if (path === ROUTES.ADMIN.DASHBOARD) {
      crumbs.push({ label: '대시보드' });
      return crumbs;
    }

    // 프로필 특별 처리
    if (path.startsWith(ROUTES.ADMIN.PROFILE)) {
      crumbs.push({ label: '관리자 프로필' });
      return crumbs;
    }

    // 알 수 없는 경로 (fallback)
    crumbs.push({ label: '알 수 없는 페이지' });
    return crumbs;
  };

  const crumbs = makeCrumbs();
  const title = crumbs[crumbs.length - 1]?.label || '관리자';

  return (
    <>
      {/* 브레드크럼 영역 - 상세/편집 페이지에서만 표시 (경로가 2개 이상일 때) */}
      {crumbs.length > 1 && (
        <Box id={id} sx={{ 
          px: 2, 
          py: 0.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          mb: 0.5
        }}>
          <Breadcrumbs 
            aria-label="breadcrumb" 
            separator={<Typography sx={{ color: 'secondary.dark', mx: 1, fontWeight: 600 }}>/</Typography>}
            sx={{ 
              '& .MuiBreadcrumbs-separator': {
                color: 'secondary.dark',
                mx: 1
              }
            }}
          >
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;
              
              if (isLast || !crumb.to) {
                return (
                  <Typography 
                    key={index} 
                    color="secondary.dark" 
                    sx={{ 
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      lineHeight: 1.4
                    }}
                  >
                    {crumb.label}
                  </Typography>
                );
              }
              
              return (
                <Link
                  key={index}
                  color="secondary.main"
                  onClick={() => navigate(crumb.to!)}
                  sx={{ 
                    cursor: 'pointer', 
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    lineHeight: 1.4,
                    '&:hover': { 
                      textDecoration: 'underline',
                      color: 'secondary.dark'
                    }
                  }}
                >
                  {crumb.label}
                </Link>
              );
            })}
          </Breadcrumbs>
        </Box>
      )}
    </>
  );
}