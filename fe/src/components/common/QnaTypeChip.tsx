import { Chip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { COMMON_CODE_GROUPS } from '@iitp-dabt/common';
import { useCommonCode } from '../../hooks/useCommonCode';

interface QnaTypeChipProps {
  id?: string;
  typeId: string;
  size?: 'small' | 'medium';
  label?: string;
}

export default function QnaTypeChip({ id, typeId, size = 'small', label: labelProp }: QnaTypeChipProps) {
  const theme = useTheme();
  const { getCodeNameById } = useCommonCode();
  // Do not auto-fetch here to avoid N fetches across many chips.
  // Expect caller to preload codes and/or pass label explicitly.
  const label = labelProp || getCodeNameById(COMMON_CODE_GROUPS.QNA_TYPE, typeId) || typeId;

  // Target ~70% perceived saturation: deepen background and border while keeping text readable
  const bg = alpha(theme.palette.secondary.main, 0.30);
  const border = alpha(theme.palette.secondary.main, 0.70);
  const fg = theme.palette.secondary.dark;

  return (
    <Chip
      id={id}
      size={size}
      label={label}
      sx={{
        fontWeight: 700,
        bgcolor: bg,
        color: fg,
        border: '1px solid',
        borderColor: border,
      }}
    />
  );
}


