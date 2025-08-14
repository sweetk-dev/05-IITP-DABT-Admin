import { Box, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ 
  message = '데이터가 없습니다.', 
  icon 
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
        minHeight: 200
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
          fontWeight: 500
        }}
      >
        {message}
      </Typography>
    </Box>
  );
} 