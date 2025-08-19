import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Stack } from '@mui/material';
import ThemedButton from './ThemedButton';
import { useTheme, alpha } from '@mui/material/styles';

interface ExtendKeyDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (days: number) => void;
  defaultDays?: number;
  title?: string;
}

export default function ExtendKeyDialog({ open, onClose, onConfirm, defaultDays = 90, title = '인증키 기간 연장' }: ExtendKeyDialogProps) {
  const muiTheme = useTheme();
  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');
  const [days, setDays] = React.useState<number>(defaultDays);

  React.useEffect(() => {
    const today = new Date();
    const end = new Date(today.getTime() + defaultDays * 24 * 60 * 60 * 1000);
    const sd = today.toISOString().split('T')[0];
    const ed = end.toISOString().split('T')[0];
    setStartDate(sd);
    setEndDate(ed);
    setDays(defaultDays);
  }, [defaultDays, open]);

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
              onChange={(e)=>{ setStartDate(e.target.value); setDays(computeDays(e.target.value, endDate)); }}
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
              onChange={(e)=>{ setEndDate(e.target.value); setDays(computeDays(startDate, e.target.value)); }}
              sx={{ width: '100%' }}
            />
          </Box>
        </Stack>
        <Stack direction="row" spacing={1}>
          <ThemedButton variant="outlined" onClick={() => {
            const today = new Date();
            const end = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
            const sd = today.toISOString().split('T')[0];
            const ed = end.toISOString().split('T')[0];
            setStartDate(sd);
            setEndDate(ed);
            setDays(90);
          }}>90일 설정</ThemedButton>
          <ThemedButton variant="outlined" onClick={() => {
            const today = new Date();
            const end = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000);
            const sd = today.toISOString().split('T')[0];
            const ed = end.toISOString().split('T')[0];
            setStartDate(sd);
            setEndDate(ed);
            setDays(365);
          }}>1년 설정</ThemedButton>
        </Stack>
      </DialogContent>
      <DialogActions>
        <ThemedButton variant="text" onClick={onClose} buttonSize="cta" sx={{ minHeight: 48, px: 3 }}>
          취소
        </ThemedButton>
        <ThemedButton variant="primary" onClick={() => onConfirm(days)} disabled={!isValid} buttonSize="cta" sx={{ minHeight: 48, px: 3 }}>
          연장
        </ThemedButton>
      </DialogActions>
    </Dialog>
  );
}


