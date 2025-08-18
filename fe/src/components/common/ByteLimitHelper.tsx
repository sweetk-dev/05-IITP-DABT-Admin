import { Box, Typography } from '@mui/material';

interface ByteLimitHelperProps {
  id?: string;
  currentBytes: number;
  maxBytes: number;
  warnRatio?: number; // e.g., 0.9
}

export default function ByteLimitHelper({ id, currentBytes, maxBytes, warnRatio = 0.9 }: ByteLimitHelperProps) {
  const isOver = currentBytes > maxBytes;
  const isWarn = !isOver && currentBytes >= Math.floor(maxBytes * warnRatio);
  const color = isOver ? 'error.main' : isWarn ? 'warning.main' : 'text.secondary';

  return (
    <Box id={id || 'byte-limit-helper'} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
      <Typography variant="caption" sx={{ color }}>
        {currentBytes} / {maxBytes} bytes
      </Typography>
    </Box>
  );
}


