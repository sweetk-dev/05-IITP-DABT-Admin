import { Alert, AlertTitle } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

interface ErrorAlertProps {
  error?: string | null;
  onClose?: () => void;
  sx?: any;
  severity?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  children?: React.ReactNode;
}

/**
 * 공통 에러 알림 컴포넌트
 * 에러 메시지를 표시하고 닫을 수 있는 기능 제공
 */
export default function ErrorAlert({ error, onClose, sx = {}, severity = 'error', title, children }: ErrorAlertProps) {
  const theme = useTheme();
  const paletteColor = theme.palette[severity].main;
  const bg = alpha(paletteColor, 0.06);
  const border = alpha(paletteColor, 0.6);

  if (!error && !children) return null;

  return (
    <Alert 
      severity={severity}
      variant="outlined"
      sx={{
        mb: 2,
        bgcolor: bg,
        borderColor: border,
        '& .MuiAlert-icon': { color: paletteColor },
        ...sx
      }}
      onClose={onClose}
    >
      {title && <AlertTitle sx={{ fontWeight: 700 }}>{title}</AlertTitle>}
      {children ?? error}
    </Alert>
  );
} 