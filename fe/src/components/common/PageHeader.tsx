import React from 'react';
import { Box, Breadcrumbs, Link as MuiLink, Tabs, Tab, Typography } from '@mui/material';
import ListHeader from './ListHeader';

export interface PageHeaderBreadcrumb {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface PageHeaderTab {
  label: string;
  value: string;
}

interface PageHeaderProps {
  id?: string;
  title: string;
  onBack?: () => void;
  subtitle?: string;
  breadcrumbs?: PageHeaderBreadcrumb[];
  actionsRight?: React.ReactNode;
  tabs?: PageHeaderTab[];
  currentTab?: string;
  onTabChange?: (value: string) => void;
  totalCount?: number;
  search?: { value: string; placeholder?: string; onChange: (v: string) => void };
  filters?: Array<{ label: string; value: string; options: Array<{ label: string; value: string }>; onChange: (v: string) => void }>;
  sticky?: boolean;
  dense?: boolean;
  sx?: any;
}

export default function PageHeader({
  id,
  title,
  onBack,
  subtitle,
  breadcrumbs,
  actionsRight,
  tabs,
  currentTab,
  onTabChange,
  totalCount,
  search,
  filters,
  sticky = true,
  dense = false,
  sx,
}: PageHeaderProps) {
  const header = (
    <ListHeader
      title={title}
      onBack={onBack}
      totalCount={totalCount}
      searchPlaceholder={search?.placeholder}
      searchValue={search?.value}
      onSearchChange={search ? (v: string) => search.onChange(v) : undefined}
      filters={filters}
    />
  );

  const hasTopRow = Boolean(breadcrumbs && breadcrumbs.length);
  const hasBottomRow = Boolean(subtitle || actionsRight || (tabs && tabs.length));

  return (
    <Box id={id || 'page-header-root'} sx={{ position: sticky ? 'sticky' : 'relative', top: 0, zIndex: 1, bgcolor: 'background.default', mb: 2, ...sx }}>
      {hasTopRow && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: dense ? 0.5 : 1 }}>
          <Breadcrumbs aria-label="breadcrumb">
            {breadcrumbs!.map((bc, idx) => (
              <MuiLink
                key={`${bc.label}-${idx}`}
                component={bc.href || bc.onClick ? 'button' : 'span'}
                color="inherit"
                underline={bc.href ? 'hover' : 'none'}
                onClick={bc.onClick}
              >
                {bc.label}
              </MuiLink>
            ))}
          </Breadcrumbs>
        </Box>
      )}

      {header}

      {hasBottomRow && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: dense ? 0.5 : 1 }}>
          <Box sx={{ minHeight: 0 }}>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {actionsRight && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {actionsRight}
            </Box>
          )}
        </Box>
      )}

      {tabs && tabs.length > 0 && (
        <Tabs
          value={currentTab}
          onChange={(_, v) => onTabChange && onTabChange(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {tabs.map(t => (
            <Tab key={t.value} label={t.label} value={t.value} />
          ))}
        </Tabs>
      )}
    </Box>
  );
}


