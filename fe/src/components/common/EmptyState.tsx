import { Box, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { getThemeColors } from '../../theme';

interface EmptyStateProps {
  message?: string;
  theme?: 'user' | 'admin';
  icon?: React.ReactNode;
}

export default function EmptyState({ 
  message = '데이터가 없습니다.', 
  theme = 'user',
  icon 
}: EmptyStateProps) {
  const colors = getThemeColors(theme);

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
        <InfoOutlined
          sx={{
            fontSize: 48,
            color: colors.textSecondary,
            mb: 2,
            opacity: 0.6
          }}
        />
      )}
      <Typography
        variant="body1"
        sx={{
          color: colors.textSecondary,
          opacity: 0.8,
          fontWeight: 500
        }}
      >
        {message}
      </Typography>
    </Box>
  );
} 