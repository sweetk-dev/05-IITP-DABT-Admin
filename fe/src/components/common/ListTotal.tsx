import { Box, Typography } from '@mui/material';

interface ListTotalProps {
  total?: number;
  align?: 'left' | 'right';
}

export default function ListTotal({ total = 0, align = 'right' }: ListTotalProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: align === 'right' ? 'flex-end' : 'flex-start', mb: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        총 {Number(total || 0).toLocaleString()}건
      </Typography>
    </Box>
  );
}


