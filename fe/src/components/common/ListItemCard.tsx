import { Box } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

interface ListItemCardProps {
  id?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export default function ListItemCard({ id, onClick, children }: ListItemCardProps) {
  const theme = useTheme();
  return (
    <Box id={id} onClick={onClick} sx={{
      p: 2,
      borderRadius: 2,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s ease-in-out',
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: 'background.paper',
      '&:hover': onClick ? { backgroundColor: alpha(theme.palette.primary.main, 0.06), borderColor: theme.palette.primary.main, transform: 'translateY(-1px)', boxShadow: 2 } : undefined
    }}>
      {children}
    </Box>
  );
}


