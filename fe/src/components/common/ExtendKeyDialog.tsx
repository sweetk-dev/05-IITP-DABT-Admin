import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Stack } from '@mui/material';
import ThemedButton from './ThemedButton';
import { useTheme, alpha } from '@mui/material/styles';

interface ExtendKeyDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (range: { startDt: string; endDt: string }) => void;
  // 초기 기간 (기존 기간)
  initialStartDt?: string;
  initialEndDt?: string;
  defaultDays?: number;
  title?: string;
}

export default function ExtendKeyDialog({ open, onClose, onConfirm, initialStartDt, initialEndDt, defaultDays = 90, title = '인증키 기간 연장' }: ExtendKeyDialogProps) {
  const muiTheme = useTheme();
  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');
  // days state removed; we compute validity from dates

  React.useEffect(() => {
    const sd = (initialStartDt && initialStartDt.substring(0,10)) || new Date().toISOString().split('T')[0];
    const baseEnd = initialEndDt ? new Date(initialEndDt) : new Date(new Date().getTime() + defaultDays * 24 * 60 * 60 * 1000);
    const ed = baseEnd.toISOString().split('T')[0];
    setStartDate(sd);
    setEndDate(ed);
  }, [defaultDays, open, initialStartDt, initialEndDt]);

  const computeDays = (s: string, e: string) => {
    try {
      const sd = new Date(s);
      const ed = new Date(e);
      const diff = Math.ceil((ed.getTime() - sd.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 0;
    } catch {
      return 0;
    }
  };

  const isValid = Boolean(startDate && endDate && computeDays(startDate, endDate) > 0);
  const isUnchanged = (startDate === (initialStartDt || '') && endDate === (initialEndDt || ''));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, minHeight: { xs: '30vh', md: '38vh' } } }}
    >
      <DialogTitle sx={{ fontWeight: 800, pb: 2, mb: 1 }}>
        {title}
        <Box sx={{ mt: 1, mb: 1.5, height: 2, background: `linear-gradient(90deg, ${alpha(muiTheme.palette.primary.main, 0.6)}, ${alpha(muiTheme.palette.primary.main, 0.2)}, ${alpha(muiTheme.palette.primary.main, 0.6)})`, borderRadius: 1 }} />
      </DialogTitle>
      <DialogContent sx={{ pt: 2, mt: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box component="label" htmlFor="extend-start-date" sx={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', mb: 0.75, color: 'text.primary' }}>
              시작일
            </Box>
            <TextField
              id="extend-start-date"
              aria-label="시작일"
              type="date"
              value={startDate}
              onChange={(e)=>{ setStartDate(e.target.value); }}
              sx={{ width: '100%' }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box component="label" htmlFor="extend-end-date" sx={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', mb: 0.75, color: 'text.primary' }}>
              종료일
            </Box>
            <TextField
              id="extend-end-date"
              aria-label="종료일"
              type="date"
              value={endDate}
              onChange={(e)=>{ setEndDate(e.target.value); }}
              sx={{ width: '100%' }}
            />
          </Box>
        </Stack>
        <Stack direction="row" spacing={1}>
          <ThemedButton variant="outlined" onClick={() => {
            const base = initialEndDt ? new Date(initialEndDt) : new Date();
            const end = new Date(base.getTime() + 90 * 24 * 60 * 60 * 1000);
            const sd = (initialStartDt && initialStartDt.substring(0,10)) || startDate || new Date().toISOString().split('T')[0];
            const ed = end.toISOString().split('T')[0];
            setStartDate(sd);
            setEndDate(ed);
          }}>90일 설정</ThemedButton>
          <ThemedButton variant="outlined" onClick={() => {
            const base = initialEndDt ? new Date(initialEndDt) : new Date();
            const end = new Date(base.getTime() + 365 * 24 * 60 * 60 * 1000);
            const sd = (initialStartDt && initialStartDt.substring(0,10)) || startDate || new Date().toISOString().split('T')[0];
            const ed = end.toISOString().split('T')[0];
            setStartDate(sd);
            setEndDate(ed);
          }}>1년 설정</ThemedButton>
        </Stack>
      </DialogContent>
      <DialogActions>
        <ThemedButton variant="text" onClick={onClose} buttonSize="cta" sx={{ minHeight: 48, px: 3 }}>
          취소
        </ThemedButton>
        <ThemedButton variant="primary" onClick={() => onConfirm({ startDt: startDate, endDt: endDate })} disabled={!isValid || isUnchanged} buttonSize="cta" sx={{ minHeight: 48, px: 3 }}>
          연장
        </ThemedButton>
      </DialogActions>
    </Dialog>
  );
}


