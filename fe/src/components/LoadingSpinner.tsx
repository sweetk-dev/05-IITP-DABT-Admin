import { Box, CircularProgress } from '@mui/material';

interface LoadingSpinnerProps {
  /** 로딩 상태 */
  loading: boolean;
  /** 스피너 크기 (기본값: 40) */
  size?: number;
  /** 배경색 투명도 (기본값: 0.8) */
  backgroundOpacity?: number;
  /** 컨테이너 스타일 */
  containerSx?: any;
  /** 스피너 색상 */
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';
}

/**
 * 공통 로딩 스피너 컴포넌트
 * 로딩 중일 때 반투명 배경과 함께 스피너를 표시
 */
export default function LoadingSpinner({ 
  loading, 
  size = 40, 
  backgroundOpacity = 0.8,
  containerSx = {},
  color = 'primary'
}: LoadingSpinnerProps) {
  if (!loading) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
        borderRadius: 2,
        zIndex: 1,
        ...containerSx,
      }}
    >
      <CircularProgress size={size} color={color} />
    </Box>
  );
} 