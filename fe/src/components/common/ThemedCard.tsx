import { Paper } from '@mui/material';
import type { PaperProps } from '@mui/material';
import { themeStyles } from '../../theme';
import type { ThemeType } from '../../theme';

interface ThemedCardProps extends PaperProps {
  theme: ThemeType;
  children: React.ReactNode;
}

export default function ThemedCard({ 
  theme, 
  children, 
  sx, 
  ...props 
}: ThemedCardProps) {
  return (
    <Paper
      sx={{
        ...themeStyles.card(theme),
        ...sx
      }}
      {...props}
    >
      {children}
    </Paper>
  );
} 