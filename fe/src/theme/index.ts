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
    primary: '#90CAF9', // Home intro-section 색상 - 따뜻하고 아늑 (원래 배경색)
    secondary: '#f3e5d0', // 따뜻한 베이지 (홈화면 3구역 배경색)
    background: '#FFF7ED', // 매우 연한 베이지
    paper: '#FFFFFF', // 흰색
    text: '#0461a0', // 진한 파랑 - 메인 텍스트 (새로운 글자색)
    textSecondary: '#2D3142', // 짙은 회색 - 본문/컨텐츠용
    border: '#E5E7EB', // 연한 회색 테두리
    avatar: '#90CAF9', // 원래 배경색과 동일
    chip: '#90CAF9', // 원래 배경색과 동일
    success: '#10B981', // 초록색
    error: '#EF4444', // 빨간색
    warning: '#F59E0B', // 주황색
    info: '#3B82F6' // 파란색
  },
  admin: {
    primary: '#1E3A8A', // 짙은 네이비
    secondary: '#3B82F6', // 밝은 파랑
    background: '#f1f5f9', // 연한 회색 배경
    paper: '#ffffff', // 흰색 카드 배경
    text: '#1F2937', // 짙은 회색 - 메인 텍스트
    textSecondary: '#6B7280', // 중간 회색 - 보조 텍스트
    border: '#e5e7eb', // 연한 회색 테두리
    avatar: '#1E3A8A', // 짙은 네이비 아바타
    chip: '#1E3A8A', // 짙은 네이비 칩
    success: '#059669',
    error: '#dc2626',
    warning: '#d97706',
    info: '#0891b2'
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
    color: '#f8f9fa', // 연한 회색 - 눈에 편함
    fontWeight: 'bold',
    textShadow: '0 0 1px rgba(0,0,0,0.3)',
    '&:hover': {
      bgcolor: THEME_COLORS[theme].primary,
      opacity: 0.9,
    },
    '&:disabled': {
      bgcolor: '#ccc',
      color: '#666',
      textShadow: 'none',
    }
  }),

  // 아웃라인 버튼 스타일
  outlinedButton: (theme: ThemeType) => ({
    borderColor: THEME_COLORS[theme].primary,
    color: THEME_COLORS[theme].primary,
    fontWeight: 'bold',
    opacity: 0.9,
    textShadow: '0 0 1px rgba(0,0,0,0.5)',
    '&:hover': {
      borderColor: THEME_COLORS[theme].primary,
      color: THEME_COLORS[theme].primary,
      opacity: 1,
      textShadow: '0 0 1px rgba(0,0,0,0.7)',
    }
  }),

  // 텍스트 버튼 스타일 (로그인 화면으로, 회원가입 등)
  textButton: (theme: ThemeType) => ({
    color: THEME_COLORS[theme].primary,
    fontWeight: 'bold',
    opacity: 0.9,
    textShadow: '0 0 1px rgba(0,0,0,0.5)',
    '&:hover': {
      bgcolor: 'transparent',
      color: THEME_COLORS[theme].primary,
      opacity: 1,
      textShadow: '0 0 1px rgba(0,0,0,0.7)',
    }
  }),

  // 부드러운 텍스트 버튼 스타일 (기존 회원가입 화면과 유사)
  softTextButton: (theme: ThemeType) => ({
    color: THEME_COLORS[theme].primary, // 테마 색상 통일
    fontWeight: 'normal',
    opacity: 0.8,
    '&:hover': {
      bgcolor: 'transparent',
      color: THEME_COLORS[theme].primary, // Hover 시에도 같은 색상
      opacity: 1,
    }
  }),

  // 페이지 컨테이너 스타일
  pageContainer: (theme: ThemeType) => ({
    backgroundColor: THEME_COLORS[theme].background,
    borderTop: `1px solid ${THEME_COLORS[theme].border}`
  })
}; 