import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import ThemedButton from './common/ThemedButton';

export interface CommonDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  showCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
  theme?: 'user' | 'admin';
}

export default function CommonDialog({
  open,
  title,
  message,
  onClose,
  onConfirm,
  showCancel = false,
  confirmText = '확인',
  cancelText = '취소',
  // theme is accepted for legacy compatibility but not used
}: CommonDialogProps) {
  const muiTheme = useTheme();
  const primary = muiTheme.palette.primary.main;
  const line = `linear-gradient(90deg, ${alpha(primary, 0.6)}, ${alpha(primary, 0.2)}, ${alpha(primary, 0.6)})`;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
      {title && (
        <DialogTitle sx={{ fontWeight: 800, pb: 1.5 }}>
          {title}
          <Box sx={{ mt: 1, height: 2, background: line, borderRadius: 1 }} />
        </DialogTitle>
      )}
      <DialogContent sx={{ pt: 2 }}>
        <Typography sx={{ color: 'text.secondary' }}>{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        {showCancel && (
          <ThemedButton 
            variant="text" 
            onClick={onClose}
            buttonSize="cta"
          >
            {cancelText}
          </ThemedButton>
        )}
        <ThemedButton 
          variant="primary" 
          onClick={onConfirm || onClose}
          autoFocus
          buttonSize="cta"
        >
          {confirmText}
        </ThemedButton>
      </DialogActions>
    </Dialog>
  );
} 