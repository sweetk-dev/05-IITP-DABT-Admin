import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface ThemedButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'outlined' | 'secondary' | 'text' | 'softText';
  children: React.ReactNode;
  // Accept and ignore legacy theme prop to avoid TS errors at call-sites
  theme?: 'user' | 'admin';
  // Prominent size for key actions like 저장/취소/확인/등록
  buttonSize?: 'default' | 'cta';
}

export default function ThemedButton({ 
  variant = 'primary', 
  children, 
  sx, 
  buttonSize = 'default',
  ...props 
}: ThemedButtonProps) {
  const muiTheme = useTheme();
  const palette = muiTheme.palette;
  // Strip any accidentally passed `theme` prop to avoid overriding MUI theme context
  const { theme: _ignoredTheme, ...restProps } = (props as any) || {};
  
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          bgcolor: palette.primary.main,
          color: muiTheme.palette.getContrastText(palette.primary.main),
          fontWeight: 'bold'
        };
      case 'outlined':
        return {
          borderColor: palette.primary.main,
          color: palette.primary.main,
          fontWeight: 'bold'
        };
      case 'secondary':
        return {
          bgcolor: palette.secondary.main,
          color: muiTheme.palette.getContrastText(palette.secondary.main)
        };
      case 'text':
        return { color: palette.primary.main, fontWeight: 'bold' };
      case 'softText':
        return { color: palette.primary.main, opacity: 0.9 };
      default:
        return { bgcolor: palette.primary.main, color: muiTheme.palette.getContrastText(palette.primary.main) };
    }
  };

  const getSizeStyle = () => {
    if (buttonSize === 'cta') {
      return {
        fontSize: '1rem',
        px: 2.5,
        py: 1.5,
        minHeight: 44,
        borderRadius: 2,
      } as const;
    }
    return {} as const;
  };

  return (
    <Button
      variant={variant === 'outlined' ? 'outlined' : variant === 'text' || variant === 'softText' ? 'text' : 'contained'}
      sx={{
        ...getButtonStyle(),
        ...getSizeStyle(),
        ...sx
      }}
      {...restProps}
    >
      {children}
    </Button>
  );
} 