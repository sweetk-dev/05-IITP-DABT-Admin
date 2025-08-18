import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface PageTitleProps {
  title: string;
  theme?: 'user' | 'admin'; // accept and ignore legacy prop
}

export default function PageTitle({ title }: PageTitleProps) {
  const muiTheme = useTheme();
  return (
    <Typography 
      variant="h4" 
      component="h1" 
      gutterBottom 
      sx={{
        color: muiTheme.palette.primary.main,
        fontWeight: 600,
        textAlign: 'center',
        pb: 2,
        mb: 4,
        borderBottom: `2px solid ${muiTheme.palette.primary.main}20`
      }}
    >
      {title}
    </Typography>
  );
} 