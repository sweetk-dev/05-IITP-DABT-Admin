import { Box, Typography, TextField, Stack, Chip } from '@mui/material';
import ThemedButton from './ThemedButton';
import { ArrowBack } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface FilterOption { value: string; label: string; }

interface ListHeaderProps {
  title: string;
  onBack?: () => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  filters?: Array<{ label: string; value: string; options: FilterOption[]; onChange: (v: string) => void }>;
  totalCount?: number;
}

export default function ListHeader({ title, onBack, searchPlaceholder, searchValue, onSearchChange, filters = [], totalCount }: ListHeaderProps) {
  const theme = useTheme();
  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 1, bgcolor: 'background.default', pt: 1, pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center">
          {onBack && (
            <ThemedButton variant="outlined" startIcon={<ArrowBack />} onClick={onBack}>뒤로</ThemedButton>
          )}
          <Typography variant="h6" fontWeight={700}>{title}</Typography>
          {typeof totalCount === 'number' && <Chip label={`총 ${totalCount.toLocaleString()}건`} size="small" color="default" />}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          {filters.map(f => (
            <TextField key={f.label} select SelectProps={{ native: true }} size="small" label={f.label} value={f.value} onChange={e => f.onChange(e.target.value)}>
              <option value="">전체</option>
              {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </TextField>
          ))}
          {onSearchChange && (
            <TextField size="small" placeholder={searchPlaceholder || '검색'} value={searchValue} onChange={e => onSearchChange(e.target.value)} />
          )}
        </Stack>
      </Stack>
    </Box>
  );
}


