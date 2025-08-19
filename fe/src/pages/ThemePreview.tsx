import { useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Container, Stack, Typography, Divider, ToggleButtonGroup, ToggleButton, Paper } from '@mui/material';
import StatusChip from '../components/common/StatusChip';
import ThemedButton from '../components/common/ThemedButton';
import ThemedCard from '../components/common/ThemedCard';
import PageHeader from '../components/common/PageHeader';
import SelectField from '../components/common/SelectField';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import { createAppTheme } from '../theme/mui';
import CommonDialog from '../components/CommonDialog';
import ErrorAlert from '../components/ErrorAlert';
import { HomeIconButton, DashboardIconButton } from '../components/AppBarCommon';
import { AccountCircle } from '@mui/icons-material';

type RoleType = 'user' | 'admin';
type DensityType = 'default' | 'compact70' | 'compact60';

interface VariantDef {
  key: string;
  label: string;
  palette?: {
    primary: string;
    secondary?: string;
    backgroundDefault?: string;
    backgroundPaper?: string;
    textPrimary?: string;
    textSecondary?: string;
  };
}

const USER_VARIANTS: VariantDef[] = [
  { key: 'current', label: 'Current' },
  {
    key: 'recommended',
    label: 'Recommended',
    palette: {
      primary: '#0B5FFF',
      secondary: '#00B8D9',
      backgroundDefault: '#F5F7FB',
      backgroundPaper: '#FFFFFF',
      textPrimary: '#0F172A',
      textSecondary: '#475569'
    }
  },
  {
    key: 'proposed-a',
    label: 'Proposed A',
    palette: {
      primary: '#0B5FFF',
      secondary: '#00B8D9',
      backgroundDefault: '#F7FAFC',
      backgroundPaper: '#FFFFFF',
      textPrimary: '#0F172A',
      textSecondary: '#475569'
    }
  },
  {
    key: 'proposed-b',
    label: 'Proposed B',
    palette: {
      primary: '#2563EB',
      secondary: '#14B8A6',
      backgroundDefault: '#F8FAFC',
      backgroundPaper: '#FFFFFF',
      textPrimary: '#0F172A',
      textSecondary: '#475569'
    }
  }
];

const ADMIN_VARIANTS: VariantDef[] = [
  { key: 'current', label: 'Current' },
  {
    key: 'recommended',
    label: 'Recommended',
    palette: {
      primary: '#1E3A8A',
      secondary: '#3B82F6',
      backgroundDefault: '#F3F4F6',
      backgroundPaper: '#FFFFFF',
      textPrimary: '#111827',
      textSecondary: '#6B7280'
    }
  },
  {
    key: 'proposed-a',
    label: 'Proposed A',
    palette: {
      primary: '#1E3A8A',
      secondary: '#3B82F6',
      backgroundDefault: '#F3F4F6',
      backgroundPaper: '#FFFFFF',
      textPrimary: '#111827',
      textSecondary: '#6B7280'
    }
  },
  {
    key: 'proposed-b',
    label: 'Proposed B',
    palette: {
      primary: '#0F3D7E',
      secondary: '#2563EB',
      backgroundDefault: '#EEF2F6',
      backgroundPaper: '#FFFFFF',
      textPrimary: '#0B1220',
      textSecondary: '#606B85'
    }
  }
];

function buildVariantOverrides(role: RoleType, variantKey: string) {
  const variants = role === 'admin' ? ADMIN_VARIANTS : USER_VARIANTS;
  const selected = variants.find(v => v.key === variantKey);
  if (!selected || !selected.palette) {
    return {};
  }
  const p = selected.palette;
  return {
    palette: {
      primary: { main: p.primary },
      ...(p.secondary ? { secondary: { main: p.secondary } } : {}),
      background: {
        ...(p.backgroundDefault ? { default: p.backgroundDefault } : {}),
        ...(p.backgroundPaper ? { paper: p.backgroundPaper } : {})
      },
      text: {
        ...(p.textPrimary ? { primary: p.textPrimary } : {}),
        ...(p.textSecondary ? { secondary: p.textSecondary } : {})
      }
    }
  };
}

export default function ThemePreview() {
  const [role, setRole] = useState<RoleType>('user');
  const [userVariant, setUserVariant] = useState<string>('recommended');
  const [adminVariant, setAdminVariant] = useState<string>('recommended');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [inlineWarning, setInlineWarning] = useState<string | null>(null);

  const [fontVariant, setFontVariant] = useState<'default' | 'noto'>('noto');
  const [navState, setNavState] = useState<'public' | 'auth'>('auth');
  const [density, setDensity] = useState<DensityType>('compact70');
  const activeVariantKey = role === 'admin' ? adminVariant : userVariant;

  const theme = useMemo(() => {
    const base = createAppTheme(role, density);
    const variantOverrides = buildVariantOverrides(role, activeVariantKey);
    const themed = createTheme(base, variantOverrides);
    if (fontVariant === 'noto') {
      return createTheme(themed, {
        typography: {
          fontFamily: "'Noto Sans KR','Pretendard Variable',system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
        }
      });
    }
    return themed;
  }, [role, activeVariantKey, fontVariant, density]);

  // Density metrics preview
  const defaultDensityTheme = useMemo(() => createAppTheme(role, 'default'), [role]);
  const compactDensityTheme = useMemo(() => createAppTheme(role, 'compact70'), [role]);
  const compact60DensityTheme = useMemo(() => createAppTheme(role, 'compact60'), [role]);

  const getHtmlFontSize = (t: any) => (t.typography?.htmlFontSize ? Number(t.typography.htmlFontSize) : 16);
  const getSpacingPx = (t: any) => {
    const v = t.spacing ? t.spacing(1) : 8;
    const n = typeof v === 'string' ? parseFloat(v) : Number(v);
    return Number.isFinite(n) ? n : 8;
  };
  const getToolbarMinH = (t: any) => {
    const override = (t.components?.MuiToolbar?.styleOverrides?.root?.minHeight) ?? undefined;
    const mixin = t.mixins?.toolbar?.minHeight ?? undefined;
    return override ?? mixin ?? 64;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box id="theme-preview-root" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container id="theme-preview-container" maxWidth={false} sx={{ py: 4, maxWidth: '100%' }}>
          <ThemedCard id="theme-preview-appbar-actions" sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>AppBar Right Actions</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
              {role === 'admin' ? (
                <>
                  <HomeIconButton to="/admin/dashbd" />
                  <DashboardIconButton to="/admin/dashbd" />
                  <ThemedButton variant="text" startIcon={<AccountCircle />} sx={{ ml: 1 }}>Admin Profile</ThemedButton>
                  <ThemedButton variant="text" sx={{ ml: 1 }}>Logout</ThemedButton>
                </>
              ) : navState === 'auth' ? (
                <>
                  <HomeIconButton to="/" />
                  <DashboardIconButton to="/dashbd" />
                  <ThemedButton variant="text" startIcon={<AccountCircle />} sx={{ ml: 1 }}>Profile</ThemedButton>
                  <ThemedButton variant="text" sx={{ ml: 1 }}>Logout</ThemedButton>
                </>
              ) : (
                <>
                  <ThemedButton variant="primary" sx={{ ml: 1 }}>로그인</ThemedButton>
                  <ThemedButton variant="outlined" sx={{ ml: 1 }}>회원가입</ThemedButton>
                </>
              )}
            </Box>
          </ThemedCard>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h5" fontWeight={700}>Theme Preview</Typography>
            <Stack direction="row" spacing={1}>
              <ToggleButtonGroup value={role} exclusive onChange={(_, v) => v && setRole(v)} size="small">
                <ToggleButton value="user">User</ToggleButton>
                <ToggleButton value="admin">Admin</ToggleButton>
              </ToggleButtonGroup>
              <ToggleButtonGroup value={density} exclusive onChange={(_, v) => v && setDensity(v)} size="small">
                <ToggleButton value="default">Density: Default (html 16, space 8, tb 74)</ToggleButton>
                <ToggleButton value="compact70">Density: Compact70 (html 14, space 6, tb 64)</ToggleButton>
                <ToggleButton value="compact60">Density: Compact60 (html 12, space 5, tb 56)</ToggleButton>
              </ToggleButtonGroup>
              <ToggleButtonGroup value={fontVariant} exclusive onChange={(_, v) => v && setFontVariant(v)} size="small">
                <ToggleButton value="default">Pretendard</ToggleButton>
                <ToggleButton value="noto">Noto Sans KR</ToggleButton>
              </ToggleButtonGroup>
              {role === 'user' && (
                <ToggleButtonGroup value={navState} exclusive onChange={(_, v) => v && setNavState(v)} size="small">
                  <ToggleButton value="public">Public</ToggleButton>
                  <ToggleButton value="auth">Authenticated</ToggleButton>
                </ToggleButtonGroup>
              )}
            </Stack>
          </Stack>

          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Density Metrics</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>Default</Typography>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body2">html: {getHtmlFontSize(defaultDensityTheme)}px</Typography>
                  <Typography variant="body2">space: {getSpacingPx(defaultDensityTheme)}px</Typography>
                  <Typography variant="body2">toolbar: {getToolbarMinH(defaultDensityTheme)}px</Typography>
                </Stack>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>Compact70</Typography>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body2">html: {getHtmlFontSize(compactDensityTheme)}px</Typography>
                  <Typography variant="body2">space: {getSpacingPx(compactDensityTheme)}px</Typography>
                  <Typography variant="body2">toolbar: {getToolbarMinH(compactDensityTheme)}px</Typography>
                </Stack>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>Compact60</Typography>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body2">html: {getHtmlFontSize(compact60DensityTheme)}px</Typography>
                  <Typography variant="body2">space: {getSpacingPx(compact60DensityTheme)}px</Typography>
                  <Typography variant="body2">toolbar: {getToolbarMinH(compact60DensityTheme)}px</Typography>
                </Stack>
              </Box>
            </Stack>
          </Paper>

          <Stack id="theme-preview-variants" direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
            {(role === 'user' ? USER_VARIANTS : ADMIN_VARIANTS).map(v => (
              <Paper key={v.key} variant="outlined" sx={{ p: 2, flex: 1, borderColor: v.key === activeVariantKey ? 'primary.main' : 'divider' }}>
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle1" fontWeight={700}>{v.label}</Typography>
                    <ThemedButton variant={v.key === activeVariantKey ? 'primary' : 'outlined'} onClick={() => (role === 'user' ? setUserVariant(v.key) : setAdminVariant(v.key))}>
                      Select
                    </ThemedButton>
                  </Stack>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Box sx={{ width: 18, height: 18, bgcolor: v.palette?.primary || 'primary.main', borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }} />
                    <Typography variant="caption">primary</Typography>
                    <Box sx={{ width: 18, height: 18, bgcolor: v.palette?.secondary || 'secondary.main', borderRadius: 0.5, border: '1px solid', borderColor: 'divider', ml: 1 }} />
                    <Typography variant="caption">secondary</Typography>
                  </Box>
                  {/* Background & Text sample to visualize subtle differences */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1 }}>
                    <Box sx={{ p: 1, bgcolor: v.palette?.backgroundDefault || 'background.default', border: '1px dashed', borderColor: 'divider' }}>
                      <Typography variant="caption" sx={{ color: v.palette?.textSecondary || 'text.secondary' }}>bg.default</Typography>
                    </Box>
                    <Box sx={{ p: 1, bgcolor: v.palette?.backgroundPaper || 'background.paper', border: '1px dashed', borderColor: 'divider' }}>
                      <Typography variant="caption" sx={{ color: v.palette?.textSecondary || 'text.secondary' }}>bg.paper</Typography>
                    </Box>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <PageHeader title={role === 'admin' ? 'Admin Sample Page' : 'User Sample Page'} />

          <Stack id="theme-preview-sample-row-1" direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
            <ThemedCard sx={{ p: 2, flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Buttons</Typography>
              <Stack direction="row" spacing={1}>
                <ThemedButton variant="primary">Primary</ThemedButton>
                <ThemedButton variant="outlined">Outlined</ThemedButton>
                <ThemedButton variant="text">Text</ThemedButton>
              </Stack>
            </ThemedCard>

            <ThemedCard sx={{ p: 2, flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Form</Typography>
              <SelectField
                label="Category"
                value={'a'}
                onChange={() => {}}
                options={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]}
              />
            </ThemedCard>
          </Stack>

          <Stack id="theme-preview-sample-row-2" direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <ThemedCard sx={{ p: 2, flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Pagination</Typography>
              <Pagination currentPage={2} totalPages={10} onPageChange={() => {}} />
            </ThemedCard>

            <ThemedCard sx={{ p: 2, flex: 1, position: 'relative' }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Empty State</Typography>
              <EmptyState message="표시할 데이터가 없습니다." />
            </ThemedCard>

            <ThemedCard sx={{ p: 2, flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Status Chips (QnA)</Typography>
              <Stack direction="row" spacing={1}>
                <StatusChip kind="answered" />
                <StatusChip kind="pending" />
                <StatusChip kind="private" />
              </Stack>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1, mt: 2 }}>Status Chips (API)</Typography>
              <Stack direction="row" spacing={1}>
                <StatusChip kind="pending" />
                <StatusChip kind="active" />
                <StatusChip kind="expired" />
              </Stack>
            </ThemedCard>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <PageHeader title="Alerts & Dialogs" />

          <ThemedCard id="theme-preview-alerts-card" sx={{ p: 2, mb: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
              <ThemedButton variant="primary" onClick={() => setInlineError('에러가 발생했습니다. 다시 시도해 주세요.')}>Show Error Alert</ThemedButton>
              <ThemedButton variant="outlined" onClick={() => setInlineWarning('주의가 필요한 상황입니다.')}>Show Warning Alert</ThemedButton>
              <ThemedButton variant="text" onClick={() => setShowConfirm(true)}>Open Confirm Dialog</ThemedButton>
              <ThemedButton variant="text" onClick={() => setShowErrorDialog(true)}>Open Error Dialog</ThemedButton>
            </Stack>
            <ErrorAlert error={inlineError} onClose={() => setInlineError(null)} title="에러" />
            {inlineWarning && (
              <ErrorAlert severity="warning" title="경고" onClose={() => setInlineWarning(null)}>
                {inlineWarning}
              </ErrorAlert>
            )}
          </ThemedCard>

          <CommonDialog
            open={showConfirm}
            title="확인"
            message="이 작업을 진행하시겠습니까?"
            onClose={() => setShowConfirm(false)}
            onConfirm={() => setShowConfirm(false)}
            showCancel
            confirmText="진행"
            cancelText="취소"
            theme={role}
          />

          <CommonDialog
            open={showErrorDialog}
            title="오류"
            message="처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
            onClose={() => setShowErrorDialog(false)}
            confirmText="확인"
            theme={role}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}


