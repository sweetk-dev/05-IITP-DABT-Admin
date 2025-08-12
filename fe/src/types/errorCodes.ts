// FE에서 사용하는 에러 코드 및 UI 메타데이터
import { ErrorCode, ErrorMetaMap } from '@iitp-dabt/common';
import type { ErrorMeta } from '@iitp-dabt/common';

// FE용 UI 처리 메타데이터
export interface ErrorUIMeta extends ErrorMeta {
  showPopup?: boolean;
  redirectTo?: string;
  autoLogout?: boolean;
}

// 기본 UI 메타데이터 (대부분의 에러에 적용)
const defaultUIMeta: Partial<ErrorUIMeta> = {
  showPopup: true
};

// 특별한 처리가 필요한 에러들의 UI 메타데이터
const specialUIMeta: Partial<Record<ErrorCode, Partial<ErrorUIMeta>>> = {
  // 인증 관련 - 리다이렉트 필요
  [ErrorCode.UNAUTHORIZED]: {
    showPopup: true,
    redirectTo: '/login'
  },
  [ErrorCode.TOKEN_EXPIRED]: {
    showPopup: true,
    autoLogout: true,
    redirectTo: '/login'
  },
  [ErrorCode.INVALID_TOKEN]: {
    showPopup: true,
    autoLogout: true,
    redirectTo: '/login'
  },
  [ErrorCode.ACCESS_DENIED]: {
    showPopup: true,
    redirectTo: '/'
  },
  [ErrorCode.TOKEN_REQUIRED]: {
    showPopup: true,
    redirectTo: '/login'
  },
  [ErrorCode.TOKEN_INVALID]: {
    showPopup: true,
    autoLogout: true,
    redirectTo: '/login'
  },
  [ErrorCode.FORBIDDEN]: {
    showPopup: true,
    redirectTo: '/'
  },
  [ErrorCode.ADMIN_INACTIVE]: {
    showPopup: true,
    redirectTo: '/login'
  }
};

// 사용자 친화적인 에러 메시지 매핑
export const getUserFriendlyMessage = (errorCode: ErrorCode, originalMessage?: string): string => {
  switch (errorCode) {
    case ErrorCode.DATABASE_ERROR:
      return '서버에 임시 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    
    case ErrorCode.VALIDATION_ERROR:
      return originalMessage || '입력 정보를 확인해주세요.';
    
    case ErrorCode.USER_EMAIL_DUPLICATE:
      return '이미 사용 중인 이메일입니다.';
    
    case ErrorCode.EMAIL_INVALID_FORMAT:
      return '올바른 이메일 형식으로 입력해주세요.';
    
    case ErrorCode.USER_PASSWORD_TOO_WEAK:
      return '비밀번호는 영문, 숫자, 특수문자를 포함하여 8자리 이상이어야 합니다.';
    
    case ErrorCode.USER_NOT_FOUND:
      return '사용자 정보를 찾을 수 없습니다.';
    
    case ErrorCode.LOGIN_FAILED:
      return '이메일 또는 비밀번호가 올바르지 않습니다.';
    
    case ErrorCode.UNAUTHORIZED:
      return '로그인이 필요합니다.';
    
    case ErrorCode.TOKEN_EXPIRED:
      return '로그인 세션이 만료되었습니다. 다시 로그인해주세요.';
    
    case ErrorCode.INVALID_TOKEN:
      return '유효하지 않은 로그인 정보입니다. 다시 로그인해주세요.';
    
    case ErrorCode.ACCESS_DENIED:
      return '접근 권한이 없습니다.';
    
    case ErrorCode.FORBIDDEN:
      return '해당 기능에 대한 권한이 없습니다.';
    
    default:
      return originalMessage || '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
};

// FE용 UI 메타데이터 맵 생성 함수
const createErrorUIMetaMap = (): Record<ErrorCode, ErrorUIMeta> => {
  const uiMetaMap: Record<ErrorCode, ErrorUIMeta> = {} as Record<ErrorCode, ErrorUIMeta>;
  
  // 모든 ErrorCode에 대해 UI 메타데이터 생성
  Object.values(ErrorCode).forEach(errorCode => {
    if (typeof errorCode === 'number') {
      const baseMeta = ErrorMetaMap[errorCode];
      const specialMeta = specialUIMeta[errorCode] || {};
      
      uiMetaMap[errorCode] = {
        ...baseMeta,
        ...defaultUIMeta,
        ...specialMeta
      };
    }
  });
  
  return uiMetaMap;
};

// FE용 UI 메타데이터 맵
export const ErrorUIMetaMap: Record<ErrorCode, ErrorUIMeta> = createErrorUIMetaMap();

// FE에서 사용할 에러 처리 유틸리티 함수들
export const getErrorUIMeta = (errorCode: ErrorCode): ErrorUIMeta => {
  return ErrorUIMetaMap[errorCode];
};

export const shouldShowPopup = (errorCode: ErrorCode): boolean => {
  return ErrorUIMetaMap[errorCode]?.showPopup || false;
};

export const shouldAutoLogout = (errorCode: ErrorCode): boolean => {
  return ErrorUIMetaMap[errorCode]?.autoLogout || false;
};

export const getRedirectPath = (errorCode: ErrorCode): string | undefined => {
  return ErrorUIMetaMap[errorCode]?.redirectTo;
}; 