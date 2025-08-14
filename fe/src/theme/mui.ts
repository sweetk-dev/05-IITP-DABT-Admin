import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

export type AppThemeType = 'user' | 'admin';
export type AppThemeDensity = 'default' | 'compact70' | 'compact60';

const common: ThemeOptions = {
  shape: { borderRadius: 10 },
  spacing: 8,
  typography: {
    fontFamily: "'Noto Sans KR','Pretendard Variable',system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { lineHeight: 1.65 },
    body2: { lineHeight: 1.6 },
    caption: { fontSize: 13, lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body': {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility'
        },
        body: {
          fontFeatureSettings: '"tnum" 1, "lnum" 1',
          fontVariantNumeric: 'tabular-nums'
        }
      }
    },
    MuiButton: {
      defaultProps: { size: 'medium' },
      styleOverrides: { root: { borderRadius: 10 } }
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 12 } }
    },
    MuiAppBar: {
      defaultProps: { color: 'default', elevation: 0 }
    },
    MuiToolbar: {
      styleOverrides: { root: { minHeight: 74 } }
    }
  }
};

// Density preset for approximately 70% zoom feel at 100%
const densityCompact70: ThemeOptions = {
  spacing: 6,
  typography: {
    htmlFontSize: 14
  },
  components: {
    MuiToolbar: {
      styleOverrides: { root: { minHeight: 64 } }
    },
    MuiButton: { defaultProps: { size: 'small' } },
    MuiTextField: { defaultProps: { size: 'small' } },
    MuiSelect: { defaultProps: { size: 'small' } },
    MuiTableCell: { styleOverrides: { root: { paddingTop: 6, paddingBottom: 6 } } }
  }
};

// Density preset approximating ~60% zoom feel at 100%
const densityCompact60: ThemeOptions = {
  spacing: 4.5,
  typography: {
    htmlFontSize: 12
  },
  components: {
    MuiToolbar: {
      styleOverrides: { root: { minHeight: 56 } }
    },
    MuiButton: { defaultProps: { size: 'small' }, styleOverrides: { root: { paddingLeft: 10, paddingRight: 10 } } },
    MuiTextField: { defaultProps: { size: 'small' } },
    MuiSelect: { defaultProps: { size: 'small' } },
    MuiTableCell: { styleOverrides: { root: { paddingTop: 4, paddingBottom: 4, paddingLeft: 10, paddingRight: 10 } } }
  }
};

const userTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: { main: '#0B5FFF' },
    secondary: { main: '#00B8D9' },
    success: { main: '#12B76A' },
    warning: { main: '#F79009' },
    error: { main: '#D92D20' },
    info: { main: '#26A7FF' },
    background: { default: '#F5F7FB', paper: '#FFFFFF' },
    text: { primary: '#0F172A', secondary: '#475569' }
  }
};

const adminTheme: ThemeOptions = {
  spacing: 6,
  shape: { borderRadius: 8 },
  palette: {
    mode: 'light',
    primary: { main: '#1E3A8A' },
    secondary: { main: '#3B82F6' },
    success: { main: '#059669' },
    warning: { main: '#D97706' },
    error: { main: '#DC2626' },
    info: { main: '#0EA5B2' },
    background: { default: '#F1F5F9', paper: '#FFFFFF' },
    text: { primary: '#111827', secondary: '#6B7280' }
  },
  components: {
    MuiButton: { defaultProps: { size: 'small' } },
    MuiTextField: { defaultProps: { size: 'small' } },
    MuiSelect: { defaultProps: { size: 'small' } },
    MuiTableCell: { styleOverrides: { root: { paddingTop: 6, paddingBottom: 6 } } }
  }
};

export function createAppTheme(type: AppThemeType, density: AppThemeDensity = 'default') {
  const densityPreset = density === 'compact70' ? densityCompact70
    : density === 'compact60' ? densityCompact60
    : {};
  return createTheme({
    ...common,
    ...(type === 'admin' ? adminTheme : userTheme),
    ...densityPreset
  });
}


