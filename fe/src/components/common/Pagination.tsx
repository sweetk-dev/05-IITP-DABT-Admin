import { Box, Pagination as MuiPagination, Select, MenuItem, Typography, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  showFirstButton?: boolean;
  showLastButton?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  pageSizeOptions = [10, 20, 50],
  onPageSizeChange,
  showFirstButton = true,
  showLastButton = true
}: PaginationProps) {
  const muiTheme = useTheme();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between" sx={{ py: 2, px: 2 }}>
      <Box />
      <MuiPagination
        page={currentPage}
        count={totalPages}
        onChange={(_, page) => onPageChange(page)}
        showFirstButton={showFirstButton}
        showLastButton={showLastButton}
        size="large"
        sx={{
          '& .MuiPaginationItem-root': {
            color: muiTheme.palette.text.secondary,
            borderColor: muiTheme.palette.divider,
            '&:hover': {
              backgroundColor: muiTheme.palette.action.hover,
              borderColor: muiTheme.palette.primary.main
            }
          },
          '& .MuiPaginationItem-root.Mui-selected': {
            backgroundColor: muiTheme.palette.primary.main,
            color: muiTheme.palette.getContrastText(muiTheme.palette.primary.main),
            borderColor: muiTheme.palette.primary.main,
            '&:hover': {
              backgroundColor: muiTheme.palette.primary.main,
              opacity: 0.9
            }
          }
        }}
      />
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>페이지 크기</Typography>
        <Select size="small" value={pageSize ?? pageSizeOptions[0]} onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}>
          {pageSizeOptions.map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </Select>
      </Stack>
    </Stack>
  );
} 