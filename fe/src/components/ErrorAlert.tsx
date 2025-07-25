import { Alert } from '@mui/material';

interface ErrorAlertProps {
  /** 에러 메시지 */
  error: string | null;
  /** 에러 메시지 닫기 콜백 */
  onClose: () => void;
  /** Alert 컴포넌트 스타일 */
  sx?: any;
}

/**
 * 공통 에러 알림 컴포넌트
 * 에러 메시지를 표시하고 닫을 수 있는 기능 제공
 */
export default function ErrorAlert({ error, onClose, sx = {} }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <Alert 
      severity="error" 
      sx={{ mb: 2, ...sx }}
      onClose={onClose}
    >
      {error}
    </Alert>
  );
} 