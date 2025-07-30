import { Box, Pagination as MuiPagination } from '@mui/material';
import { getThemeColors } from '../../theme';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  theme?: 'user' | 'admin';
  showFirstButton?: boolean;
  showLastButton?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  theme = 'user',
  showFirstButton = true,
  showLastButton = true
}: PaginationProps) {
  const colors = getThemeColors(theme);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 3,
        px: 2
      }}
    >
      <MuiPagination
        page={currentPage}
        count={totalPages}
        onChange={(_, page) => onPageChange(page)}
        showFirstButton={showFirstButton}
        showLastButton={showLastButton}
        size="large"
        sx={{
          '& .MuiPaginationItem-root': {
            color: colors.textSecondary,
            borderColor: colors.border,
            '&:hover': {
              backgroundColor: `${colors.primary}15`,
              borderColor: colors.primary
            }
          },
          '& .MuiPaginationItem-root.Mui-selected': {
            backgroundColor: colors.primary,
            color: colors.text,
            borderColor: colors.primary,
            '&:hover': {
              backgroundColor: colors.primary,
              opacity: 0.9
            }
          }
        }}
      />
    </Box>
  );
} 