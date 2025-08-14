import { Box, Pagination as MuiPagination } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstButton?: boolean;
  showLastButton?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstButton = true,
  showLastButton = true
}: PaginationProps) {
  const muiTheme = useTheme();

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
    </Box>
  );
} 