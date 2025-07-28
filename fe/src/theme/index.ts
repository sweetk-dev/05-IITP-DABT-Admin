/**
 * 공통 테마 시스템
 * User와 Admin 사이트의 테마 색상을 중앙에서 관리
 */

export type ThemeType = 'user' | 'admin';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  paper: string;
  text: string;
  textSecondary: string;
  border: string;
  avatar: string;
  chip: string;
  success: string;
  error: string;
  warning: string;
  info: string;
}

export const THEME_COLORS: Record<ThemeType, ThemeColors> = {
  user: {
    primary: '#90CAF9', // Home intro-section 색상 - 따뜻하고 아늑
    secondary: '#FFE0B2', // 따뜻한 베이지
    background: '#FFF7ED', // 매우 연한 베이지
    paper: '#FFFFFF', // 흰색
    text: '#2D3142', // 짙은 회색
    textSecondary: '#6B7280', // 중간 회색
    border: '#E5E7EB', // 연한 회색 테두리
    avatar: '#90CAF9',
    chip: '#90CAF9',
    success: '#10B981', // 초록색
    error: '#EF4444', // 빨간색
    warning: '#F59E0B', // 주황색
    info: '#3B82F6' // 파란색
  },
  admin: {
    primary: '#1E3A8A', // 짙은 네이비 - 엄격하고 전문적
    secondary: '#3B82F6', // 파란색
    background: '#F8FAFC', // 매우 연한 회색
    paper: '#FFFFFF', // 흰색
    text: '#1F2937', // 짙은 회색 텍스트
    textSecondary: '#6B7280', // 중간 회색
    border: '#E5E7EB', // 연한 회색 테두리
    avatar: '#1E3A8A',
    chip: '#1E3A8A',
    success: '#059669', // 짙은 초록색
    error: '#DC2626', // 짙은 빨간색
    warning: '#D97706', // 짙은 주황색
    info: '#2563EB' // 짙은 파란색
  }
};

/**
 * 테마 색상 가져오기
 */
export const getThemeColors = (theme: ThemeType): ThemeColors => {
  return THEME_COLORS[theme];
};

/**
 * 테마별 스타일 유틸리티
 */
export const themeStyles = {
  // 페이지 타이틀 스타일
  pageTitle: (theme: ThemeType) => ({
    color: THEME_COLORS[theme].primary,
    fontWeight: 600,
    textAlign: 'center' as const,
    pb: 2,
    mb: 4,
    borderBottom: `2px solid ${THEME_COLORS[theme].primary}20`
  }),

  // 카드 스타일
  card: (theme: ThemeType) => ({
    backgroundColor: THEME_COLORS[theme].paper,
    boxShadow: `0 4px 12px ${THEME_COLORS[theme].primary}15`,
    borderRadius: 3,
    border: `1px solid ${THEME_COLORS[theme].border}`
  }),

  // 아바타 스타일
  avatar: (theme: ThemeType) => ({
    bgcolor: THEME_COLORS[theme].avatar,
    boxShadow: `0 4px 12px ${THEME_COLORS[theme].primary}30`,
    border: `3px solid ${THEME_COLORS[theme].primary}20`
  }),

  // 칩 스타일
  chip: (theme: ThemeType) => ({
    bgcolor: THEME_COLORS[theme].chip,
    color: 'white',
    fontWeight: 600,
    boxShadow: `0 2px 8px ${THEME_COLORS[theme].chip}40`
  }),

  // 기본 버튼 스타일
  primaryButton: (theme: ThemeType) => ({
    bgcolor: THEME_COLORS[theme].primary,
    '&:hover': {
      bgcolor: THEME_COLORS[theme].primary,
      opacity: 0.9
    }
  }),

  // 아웃라인 버튼 스타일
  outlinedButton: (theme: ThemeType) => ({
    borderColor: THEME_COLORS[theme].primary,
    color: THEME_COLORS[theme].primary,
    '&:hover': {
      borderColor: THEME_COLORS[theme].primary,
      bgcolor: `${THEME_COLORS[theme].primary}10`
    }
  }),

  // 페이지 컨테이너 스타일
  pageContainer: (theme: ThemeType) => ({
    backgroundColor: THEME_COLORS[theme].background,
    borderTop: `1px solid ${THEME_COLORS[theme].border}`
  })
}; 