import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

type Severity = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  severity: Severity;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, severity?: Severity, durationMs?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Toast[]>([]);
  const [current, setCurrent] = useState<Toast | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const processQueue = useCallback(() => {
    if (current || queue.length === 0) return;
    const [next, ...rest] = queue;
    setCurrent(next);
    setQueue(rest);
  }, [current, queue]);

  const showToast = useCallback((message: string, severity: Severity = 'info', durationMs: number = 3500) => {
    setQueue(prev => [...prev, { id: Date.now() + Math.random(), message, severity, duration: durationMs }]);
  }, []);

  React.useEffect(() => { processQueue(); }, [processQueue]);

  const handleClose = useCallback(() => {
    setCurrent(null);
    // allow next toast to render on next tick
    setTimeout(processQueue, 0);
  }, [processQueue]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={!!current}
        onClose={handleClose}
        autoHideDuration={current?.duration ?? 3500}
        anchorOrigin={isMobile ? { vertical: 'bottom', horizontal: 'center' } : { vertical: 'bottom', horizontal: 'right' }}
        sx={{ zIndex: (t)=> t.zIndex.snackbar + 10, bottom: isMobile ? 16 : 24, right: isMobile ? 'auto' : 24, left: isMobile ? '50%' : 'auto', transform: isMobile ? 'translateX(-50%)' : 'none' }}
      >
        <Alert onClose={handleClose} severity={(current?.severity ?? 'info') as any} variant="filled" sx={{ width: '100%' }}>
          {current?.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}


