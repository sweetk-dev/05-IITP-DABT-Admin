import { Typography } from '@mui/material';
import { themeStyles } from '../../theme';
import type { ThemeType } from '../../theme';

interface PageTitleProps {
  title: string;
  theme: ThemeType;
}

export default function PageTitle({ title, theme }: PageTitleProps) {
  return (
    <Typography 
      variant="h4" 
      component="h1" 
      gutterBottom 
      sx={themeStyles.pageTitle(theme)}
    >
      {title}
    </Typography>
  );
} 