import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

interface ThemedButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'outlined' | 'secondary' | 'text' | 'softText' | 'danger' | 'dangerOutlined' | 'dangerSoft';
  children: React.ReactNode;
  // Accept and ignore legacy theme prop to avoid TS errors at call-sites
  theme?: 'user' | 'admin';
  // Prominent size for key actions like 저장/취소/확인/등록
  buttonSize?: 'default' | 'cta';
  // Allow anchor/Link props to pass through safely
  target?: string;
  rel?: string;
  to?: string;
  href?: string;
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
          fontWeight: 'bold',
          transition: 'background-color 120ms ease'
        };
      case 'outlined':
        return {
          borderColor: palette.primary.main,
          color: palette.primary.main,
          fontWeight: 'bold',
          transition: 'background-color 120ms ease'
        };
      case 'secondary':
        return {
          bgcolor: palette.secondary.main,
          color: muiTheme.palette.getContrastText(palette.secondary.main),
          transition: 'background-color 120ms ease'
        };
      case 'danger':
        return {
          bgcolor: palette.error.main,
          color: muiTheme.palette.getContrastText(palette.error.main),
          fontWeight: 'bold',
          transition: 'background-color 120ms ease',
          '&:hover': { bgcolor: palette.error.dark },
          '&:active': { bgcolor: alpha(palette.error.dark, 0.95) }
        };
      case 'dangerOutlined':
        return {
          borderColor: palette.error.main,
          color: palette.error.main,
          fontWeight: 'bold',
          transition: 'background-color 120ms ease',
          '&:hover': { bgcolor: alpha(palette.error.main, 0.08) },
          '&:active': { bgcolor: alpha(palette.error.main, 0.1) }
        };
      case 'dangerSoft':
        return {
          bgcolor: alpha(palette.error.main, 0.22),
          color: palette.error.main,
          fontWeight: 700,
          border: `1px solid ${alpha(palette.error.main, 0.24)}`,
          transition: 'background-color 120ms ease, border-color 120ms ease',
          '&:hover': {
            bgcolor: alpha(palette.error.main, 0.28),
            borderColor: alpha(palette.error.main, 0.3)
          },
          '&:active': {
            bgcolor: alpha(palette.error.main, 0.32),
            borderColor: alpha(palette.error.main, 0.36)
          },
          '&:focus-visible': {
            outline: `2px solid ${alpha(palette.error.main, 0.35)}`,
            outlineOffset: 2
          }
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
      variant={
        variant === 'outlined' || variant === 'dangerOutlined' ? 'outlined'
        : variant === 'text' || variant === 'softText' ? 'text'
        : 'contained'
      }
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