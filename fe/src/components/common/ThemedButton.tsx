import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { themeStyles } from '../../theme';
import type { ThemeType } from '../../theme';

interface ThemedButtonProps extends Omit<ButtonProps, 'variant'> {
  theme: ThemeType;
  variant?: 'primary' | 'outlined' | 'secondary';
  children: React.ReactNode;
}

export default function ThemedButton({ 
  theme, 
  variant = 'primary', 
  children, 
  sx, 
  ...props 
}: ThemedButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return themeStyles.primaryButton(theme);
      case 'outlined':
        return themeStyles.outlinedButton(theme);
      case 'secondary':
        return {
          bgcolor: themeStyles.outlinedButton(theme).borderColor,
          color: 'white',
          '&:hover': {
            bgcolor: themeStyles.outlinedButton(theme).borderColor,
            opacity: 0.9
          }
        };
      default:
        return themeStyles.primaryButton(theme);
    }
  };

  return (
    <Button
      variant={variant === 'outlined' ? 'outlined' : 'contained'}
      sx={{
        ...getButtonStyle(),
        ...sx
      }}
      {...props}
    >
      {children}
    </Button>
  );
} 