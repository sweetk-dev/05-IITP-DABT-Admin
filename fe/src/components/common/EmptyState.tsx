import { Box, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
  minHeight?: number; // 컨텐츠 영역 최소 높이 (기본값 상향)
}

export default function EmptyState({ 
  message = '데이터가 없습니다.', 
  icon,
  minHeight = 600
}: EmptyStateProps) {
  const muiTheme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 4,
        textAlign: 'center',
        minHeight
      }}
    >
      {icon || (
        <InfoOutlined sx={{ fontSize: 48, color: muiTheme.palette.text.secondary, mb: 2, opacity: 0.6 }} />
      )}
      <Typography
        variant="body1"
        sx={{
          color: muiTheme.palette.text.secondary,
          opacity: 0.8,
          fontWeight: 600,
          fontSize: { xs: 18, md: 20 }
        }}
      >
        {message}
      </Typography>
    </Box>
  );
} 