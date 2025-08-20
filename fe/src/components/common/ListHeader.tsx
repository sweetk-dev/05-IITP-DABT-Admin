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
  showTotalInHeader?: boolean; // default true
}

export default function ListHeader({ title, onBack, searchPlaceholder, searchValue, onSearchChange, filters = [], totalCount, showTotalInHeader = true }: ListHeaderProps) {
  const theme = useTheme();
  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 1, bgcolor: 'background.default', mb: 2, borderBottom: `1px solid ${theme.palette.divider}`, height: { xs: 64, md: 72 } }}>
      <Box sx={{ position: 'relative', height: '100%' }}>
        {/* 좌측: 뒤로가기 */}
        {onBack && (
          <Box sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}>
            <ThemedButton variant="outlined" startIcon={<ArrowBack />} onClick={onBack}>뒤로</ThemedButton>
          </Box>
        )}

        {/* 중앙: 타이틀 */}
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6" fontWeight={800} align="center" sx={{ fontSize: { xs: 20, md: 24 }, lineHeight: 1.2 }}>
            {title}
            {showTotalInHeader && typeof totalCount === 'number' && (
              <Chip label={`총 ${totalCount.toLocaleString()}건`} size="small" color="default" sx={{ ml: 1 }} />
            )}
          </Typography>
        </Box>

        {/* 우측: 필터/검색 (오른쪽 정렬 + 아래 기준 정렬 느낌) */}
        <Box sx={{ position: 'absolute', right: 0, bottom: 6 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" justifyContent="flex-end">
            {filters.map(f => (
              <TextField
                key={f.label}
                select
                SelectProps={{ native: true }}
                size="small"
                label={f.label}
                value={f.value}
                onChange={e => f.onChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 160, '& .MuiInputLabel-root': { fontSize: 12 }, '& select': { paddingRight: '24px' } }}
              >
                <option value="">전체</option>
                {f.options.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </TextField>
            ))}
            {onSearchChange && (
              <TextField size="small" placeholder={searchPlaceholder || '검색'} value={searchValue} onChange={e => onSearchChange(e.target.value)} />
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}


