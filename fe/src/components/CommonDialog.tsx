import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { ReactNode } from 'react';

interface CommonDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  id?: string;
}

export default function CommonDialog({ open, onClose, title, children, actions, id }: CommonDialogProps) {
  return (
    <Dialog id={id || 'common-dialog'} open={open} onClose={onClose} maxWidth="xs" fullWidth>
      {title && (
        <DialogTitle id="common-dialog-title">
          {title}
          <IconButton
            id="common-dialog-close-btn"
            aria-label="close"
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent id="common-dialog-content">{children}</DialogContent>
      {actions && <DialogActions id="common-dialog-actions">{actions}</DialogActions>}
    </Dialog>
  );
} 