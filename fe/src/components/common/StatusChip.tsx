import { Chip } from '@mui/material';

type StatusKind =
  | 'answered'
  | 'pending'
  | 'active'
  | 'inactive'
  | 'warning'
  | 'default';

interface StatusChipProps {
  id?: string;
  kind: StatusKind;
  label?: string;
  size?: 'small' | 'medium';
}

export default function StatusChip({ id, kind, label, size = 'small' }: StatusChipProps) {
  const getProps = () => {
    switch (kind) {
      case 'answered':
        return { color: 'success' as const, text: label || '답변완료' };
      case 'pending':
        return { color: 'warning' as const, text: label || '답변대기' };
      case 'active':
        return { color: 'success' as const, text: label || '활성' };
      case 'inactive':
        return { color: 'default' as const, text: label || '비활성' };
      case 'warning':
        return { color: 'warning' as const, text: label || '주의' };
      default:
        return { color: 'default' as const, text: label || '상태' };
    }
  };
  const p = getProps();
  return <Chip id={id} size={size} label={p.text} color={p.color} />;
}


