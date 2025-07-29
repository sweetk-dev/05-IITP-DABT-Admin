import { Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
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
  theme = 'user',
}: CommonDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        {showCancel && (
          <ThemedButton 
            theme={theme}
            variant="text" 
            onClick={onClose}
          >
            {cancelText}
          </ThemedButton>
        )}
        <ThemedButton 
          theme={theme}
          variant="primary" 
          onClick={onConfirm || onClose}
          autoFocus
        >
          {confirmText}
        </ThemedButton>
      </DialogActions>
    </Dialog>
  );
} 