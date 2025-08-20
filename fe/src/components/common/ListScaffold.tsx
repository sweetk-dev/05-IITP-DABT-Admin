import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import ThemedCard from './ThemedCard';
import LoadingSpinner from '../LoadingSpinner';
import EmptyState from './EmptyState';
import Pagination from './Pagination';
import ListHeader from './ListHeader';
import ListTotal from './ListTotal';

type FilterOption = { value: string; label: string };

export interface ListScaffoldProps {
  title: string;
  onBack?: () => void;
  actionsRight?: ReactNode;

  search?: { value: string; onChange: (v: string) => void; placeholder?: string };
  filters?: Array<{ label: string; value: string; options: FilterOption[]; onChange: (v: string) => void }>;

  total?: number;

  loading?: boolean;
  errorText?: string;
  emptyText?: string;

  children: ReactNode;
  preContent?: ReactNode;

  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
    pageSize?: number;
    onPageSizeChange?: (s: number) => void;
  };

  // whether to wrap body in a card. default: true
  wrapInCard?: boolean;
}

export default function ListScaffold({
  title,
  onBack,
  actionsRight,
  search,
  filters = [],
  total,
  loading,
  errorText,
  emptyText,
  children,
  preContent,
  pagination,
  wrapInCard = true,
}: ListScaffoldProps) {
  const showPagination = !!pagination && (pagination.totalPages || 0) > 0;

  return (
    <>
      <ListHeader
        title={title}
        onBack={onBack}
        searchPlaceholder={search?.placeholder}
        searchValue={search?.value}
        onSearchChange={search?.onChange}
        filters={filters}
        totalCount={total}
        showTotalInHeader={false}
      />

      {actionsRight && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          {actionsRight}
        </Box>
      )}

      {preContent}

      <ListTotal total={total} />

      {wrapInCard ? (
        <ThemedCard sx={{ boxShadow: 0 }}>
          {loading ? (
            <Box sx={{ position: 'relative', minHeight: 400 }}>
              <LoadingSpinner loading={true} />
            </Box>
          ) : errorText ? (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="error.main">{errorText}</Typography>
            </Box>
          ) : emptyText ? (
            <EmptyState message={emptyText} />
          ) : (
            children
          )}

          {showPagination && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                currentPage={pagination!.page}
                totalPages={pagination!.totalPages}
                onPageChange={pagination!.onPageChange}
                pageSize={pagination!.pageSize}
                onPageSizeChange={pagination!.onPageSizeChange}
              />
            </Box>
          )}
        </ThemedCard>
      ) : (
        <>
          {loading ? (
            <Box sx={{ position: 'relative', minHeight: 400 }}>
              <LoadingSpinner loading={true} />
            </Box>
          ) : errorText ? (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="error.main">{errorText}</Typography>
            </Box>
          ) : emptyText ? (
            <EmptyState message={emptyText} />
          ) : (
            children
          )}

          {showPagination && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                currentPage={pagination!.page}
                totalPages={pagination!.totalPages}
                onPageChange={pagination!.onPageChange}
                pageSize={pagination!.pageSize}
                onPageSizeChange={pagination!.onPageSizeChange}
              />
            </Box>
          )}
        </>
      )}
    </>
  );
}


