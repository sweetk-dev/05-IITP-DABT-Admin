import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export interface CommonDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  showCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
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
}: CommonDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        {showCancel && (
          <Button onClick={onClose} color="inherit">
            {cancelText}
          </Button>
        )}
        <Button onClick={onConfirm || onClose} color="primary" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 