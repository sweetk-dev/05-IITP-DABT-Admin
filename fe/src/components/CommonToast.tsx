import { Snackbar, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface CommonToastProps {
  open: boolean;
  message: string;
  severity?: ToastSeverity;
  onClose: () => void;
  autoHideDuration?: number;
}

export default function CommonToast({
  open,
  message,
  severity = 'info',
  onClose,
  autoHideDuration = 3500
}: CommonToastProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={autoHideDuration}
      anchorOrigin={isMobile ? { vertical: 'bottom', horizontal: 'center' } : { vertical: 'bottom', horizontal: 'right' }}
      sx={{
        zIndex: (theme) => theme.zIndex.snackbar + 10,
        bottom: isMobile ? 16 : 24,
        right: isMobile ? 'auto' : 24,
        left: isMobile ? '50%' : 'auto',
        transform: isMobile ? 'translateX(-50%)' : 'none',
        '& .MuiPaper-root': { minWidth: isMobile ? 'auto' : 320 }
      }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}


