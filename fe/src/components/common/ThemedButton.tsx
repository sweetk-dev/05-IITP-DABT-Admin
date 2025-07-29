import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { themeStyles, getThemeColors } from '../../theme';
import type { ThemeType } from '../../theme';

interface ThemedButtonProps extends Omit<ButtonProps, 'variant'> {
  theme: ThemeType;
  variant?: 'primary' | 'outlined' | 'secondary' | 'text' | 'softText';
  children: React.ReactNode;
}

export default function ThemedButton({ 
  theme, 
  variant = 'primary', 
  children, 
  sx, 
  ...props 
}: ThemedButtonProps) {
  const colors = getThemeColors(theme);
  
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          ...themeStyles.primaryButton(theme),
          color: theme === 'user' ? colors.text : '#f8f9fa' // User 테마는 #0461a0, Admin은 흰색
        };
      case 'outlined':
        return {
          ...themeStyles.outlinedButton(theme),
          color: colors.text // 모든 테마에서 colors.text 사용
        };
      case 'secondary':
        return {
          bgcolor: themeStyles.outlinedButton(theme).borderColor,
          color: 'white',
          '&:hover': {
            bgcolor: themeStyles.outlinedButton(theme).borderColor,
            opacity: 0.9
          }
        };
      case 'text':
        return {
          ...themeStyles.textButton(theme),
          color: colors.text // 모든 테마에서 colors.text 사용
        };
      case 'softText':
        return {
          ...themeStyles.softTextButton(theme),
          color: colors.text // 모든 테마에서 colors.text 사용
        };
      default:
        return {
          ...themeStyles.primaryButton(theme),
          color: theme === 'user' ? colors.text : '#f8f9fa' // User 테마는 #0461a0, Admin은 흰색
        };
    }
  };

  return (
    <Button
      variant={variant === 'outlined' ? 'outlined' : variant === 'text' || variant === 'softText' ? 'text' : 'contained'}
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