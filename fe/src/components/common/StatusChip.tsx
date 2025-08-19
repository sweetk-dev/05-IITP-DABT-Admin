import { Chip, Box } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

type StatusKind =
  | 'answered'
  | 'pending'
  | 'private'
  | 'active'
  | 'inactive'
  | 'expired'
  | 'warning'
  | 'default';

interface StatusChipProps {
  id?: string;
  kind: StatusKind;
  label?: string;
  size?: 'small' | 'medium';
}

export default function StatusChip({ id, kind, label, size = 'small' }: StatusChipProps) {
  const theme = useTheme();
  const getProps = () => {
    switch (kind) {
      case 'answered': {
        // 더 진한 회색 배경 + 대비되는 텍스트 색상
        const bg = theme.palette.grey[500];
        const fg = theme.palette.getContrastText(bg as any);
        return { color: undefined, text: label || '완료', sx: { bgcolor: bg, color: fg } } as const;
      }
      case 'private': {
        // 비공개: 텍스트 없이 자물쇠 아이콘만 표시
        const bg = alpha(theme.palette.info.main, 0.15);
        const fg = theme.palette.info.dark;
        return {
          color: undefined,
          text: '',
          sx: {
            bgcolor: bg,
            color: fg,
            border: '1px solid',
            borderColor: theme.palette.info.main,
            px: 0.5,
            '& .MuiChip-label': { display: 'none' }
          },
          icon: <LockOutlinedIcon fontSize="small" />
        } as const;
      }
      case 'pending': {
        // 대비 강화: 연한 배경(메인색 15% 투명) + 진한 텍스트 + 보더
        const bg = alpha(theme.palette.warning.main, 0.15);
        const fg = theme.palette.warning.dark;
        return { color: undefined, text: label || '대기', sx: { bgcolor: bg, color: fg, border: '1px solid', borderColor: theme.palette.warning.main } } as const;
      }
      case 'active':
        return { color: 'success' as const, text: label || '활성' };
      case 'inactive':
        return { color: 'default' as const, text: label || '비활성' };
      case 'expired': {
        // QnA의 완료 칩과 동일한 톤으로 정렬 (짙은 회색 배경 + 대비 텍스트)
        const bg = theme.palette.grey[500];
        const fg = theme.palette.getContrastText(bg as any);
        return { color: undefined, text: label || '만료', sx: { bgcolor: bg, color: fg } } as const;
      }
      case 'warning':
        return { color: 'warning' as const, text: label || '주의' };
      default:
        return { color: 'default' as const, text: label || '상태' };
    }
  };
  if (kind === 'private') {
    // 아이콘만, Chip과 시각적 높이/정렬 맞춤
    return (
      <Box component="span" sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 24,
        verticalAlign: 'middle',
        mt: '1px',
      }}>
        <LockOutlinedIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
      </Box>
    );
  }
  const p = getProps() as any;
  return <Chip id={id} size={size} label={p.text} color={p.color} icon={p.icon} sx={{ fontWeight: 700, ...(p.sx || {}) }} />;
}


