import { Paper } from '@mui/material';
import type { PaperProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface ThemedCardProps extends PaperProps {
  children: React.ReactNode;
}

export default function ThemedCard({ 
  children, 
  sx, 
  ...props 
}: ThemedCardProps) {
  const muiTheme = useTheme();
  const { theme: _ignoredTheme, ...restProps } = (props as any) || {};
  return (
    <Paper
      sx={{
        backgroundColor: muiTheme.palette.background.paper,
        border: `1px solid ${muiTheme.palette.divider}`,
        boxShadow: muiTheme.shadows[1],
        borderRadius: 3,
        ...sx
      }}
      {...restProps}
    >
      {children}
    </Paper>
  );
} 