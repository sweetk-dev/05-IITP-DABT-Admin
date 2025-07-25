// FE에서 사용하는 에러 코드 및 UI 메타데이터
import { ErrorCode, ErrorMeta, ErrorMetaMap } from '@iitp-dabt/common';

// FE용 UI 처리 메타데이터
export interface ErrorUIMeta extends ErrorMeta {
  showPopup?: boolean;
  redirectTo?: string;
  autoLogout?: boolean;
}

// FE용 UI 메타데이터 맵
export const ErrorUIMetaMap: Record<ErrorCode, ErrorUIMeta> = {
  // 기본 에러
  [ErrorCode.UNKNOWN_ERROR]: {
    ...ErrorMetaMap[ErrorCode.UNKNOWN_ERROR],
    showPopup: true
  },
  [ErrorCode.VALIDATION_ERROR]: {
    ...ErrorMetaMap[ErrorCode.VALIDATION_ERROR],
    showPopup: true
  },
  [ErrorCode.DATABASE_ERROR]: {
    ...ErrorMetaMap[ErrorCode.DATABASE_ERROR],
    showPopup: true
  },
  [ErrorCode.NETWORK_ERROR]: {
    ...ErrorMetaMap[ErrorCode.NETWORK_ERROR],
    showPopup: true
  },
  
  // 인증 관련
  [ErrorCode.UNAUTHORIZED]: {
    ...ErrorMetaMap[ErrorCode.UNAUTHORIZED],
    showPopup: true,
    redirectTo: '/login'
  },
  [ErrorCode.LOGIN_FAILED]: {
    ...ErrorMetaMap[ErrorCode.LOGIN_FAILED],
    showPopup: true
  },
  [ErrorCode.LOGOUT_FAILED]: {
    ...ErrorMetaMap[ErrorCode.LOGOUT_FAILED],
    showPopup: true
  },
  [ErrorCode.TOKEN_EXPIRED]: {
    ...ErrorMetaMap[ErrorCode.TOKEN_EXPIRED],
    showPopup: true,
    autoLogout: true,
    redirectTo: '/login'
  },
  [ErrorCode.INVALID_TOKEN]: {
    ...ErrorMetaMap[ErrorCode.INVALID_TOKEN],
    showPopup: true,
    autoLogout: true,
    redirectTo: '/login'
  },
  [ErrorCode.ACCESS_DENIED]: {
    ...ErrorMetaMap[ErrorCode.ACCESS_DENIED],
    showPopup: true,
    redirectTo: '/'
  },
  [ErrorCode.TOKEN_REQUIRED]: {
    ...ErrorMetaMap[ErrorCode.TOKEN_REQUIRED],
    showPopup: true,
    redirectTo: '/login'
  },
  [ErrorCode.TOKEN_INVALID]: {
    ...ErrorMetaMap[ErrorCode.TOKEN_INVALID],
    showPopup: true,
    autoLogout: true,
    redirectTo: '/login'
  },
  [ErrorCode.FORBIDDEN]: {
    ...ErrorMetaMap[ErrorCode.FORBIDDEN],
    showPopup: true,
    redirectTo: '/'
  },
  
  // 사용자 관련
  [ErrorCode.USER_NOT_FOUND]: {
    ...ErrorMetaMap[ErrorCode.USER_NOT_FOUND],
    showPopup: true
  },
  [ErrorCode.USER_ALREADY_EXISTS]: {
    ...ErrorMetaMap[ErrorCode.USER_ALREADY_EXISTS],
    showPopup: true
  },
  [ErrorCode.INVALID_EMAIL]: {
    ...ErrorMetaMap[ErrorCode.INVALID_EMAIL],
    showPopup: true
  },
  [ErrorCode.INVALID_PASSWORD]: {
    ...ErrorMetaMap[ErrorCode.INVALID_PASSWORD],
    showPopup: true
  },
  [ErrorCode.EMAIL_ALREADY_EXISTS]: {
    ...ErrorMetaMap[ErrorCode.EMAIL_ALREADY_EXISTS],
    showPopup: true
  },
  [ErrorCode.USER_EMAIL_INVALID_FORMAT]: {
    ...ErrorMetaMap[ErrorCode.USER_EMAIL_INVALID_FORMAT],
    showPopup: true
  },
  [ErrorCode.USER_PASSWORD_TOO_WEAK]: {
    ...ErrorMetaMap[ErrorCode.USER_PASSWORD_TOO_WEAK],
    showPopup: true
  },
  [ErrorCode.USER_EMAIL_DUPLICATE]: {
    ...ErrorMetaMap[ErrorCode.USER_EMAIL_DUPLICATE],
    showPopup: true
  },
  [ErrorCode.USER_PASSWORD_INVALID]: {
    ...ErrorMetaMap[ErrorCode.USER_PASSWORD_INVALID],
    showPopup: true
  },
  
  // FAQ 관련
  [ErrorCode.FAQ_NOT_FOUND]: {
    ...ErrorMetaMap[ErrorCode.FAQ_NOT_FOUND],
    showPopup: true
  },
  [ErrorCode.FAQ_CREATE_FAILED]: {
    ...ErrorMetaMap[ErrorCode.FAQ_CREATE_FAILED],
    showPopup: true
  },
  [ErrorCode.FAQ_UPDATE_FAILED]: {
    ...ErrorMetaMap[ErrorCode.FAQ_UPDATE_FAILED],
    showPopup: true
  },
  [ErrorCode.FAQ_DELETE_FAILED]: {
    ...ErrorMetaMap[ErrorCode.FAQ_DELETE_FAILED],
    showPopup: true
  },
  [ErrorCode.FAQ_STATS_FAILED]: {
    ...ErrorMetaMap[ErrorCode.FAQ_STATS_FAILED],
    showPopup: true
  },
  
  // QnA 관련
  [ErrorCode.QNA_NOT_FOUND]: {
    ...ErrorMetaMap[ErrorCode.QNA_NOT_FOUND],
    showPopup: true
  },
  [ErrorCode.QNA_CREATE_FAILED]: {
    ...ErrorMetaMap[ErrorCode.QNA_CREATE_FAILED],
    showPopup: true
  },
  [ErrorCode.QNA_UPDATE_FAILED]: {
    ...ErrorMetaMap[ErrorCode.QNA_UPDATE_FAILED],
    showPopup: true
  },
  [ErrorCode.QNA_DELETE_FAILED]: {
    ...ErrorMetaMap[ErrorCode.QNA_DELETE_FAILED],
    showPopup: true
  },
  [ErrorCode.QNA_ANSWER_FAILED]: {
    ...ErrorMetaMap[ErrorCode.QNA_ANSWER_FAILED],
    showPopup: true
  },
  [ErrorCode.QNA_ACCESS_DENIED]: {
    ...ErrorMetaMap[ErrorCode.QNA_ACCESS_DENIED],
    showPopup: true
  },
  
  // Admin 관련
  [ErrorCode.ADMIN_NOT_FOUND]: {
    ...ErrorMetaMap[ErrorCode.ADMIN_NOT_FOUND],
    showPopup: true
  },
  [ErrorCode.ADMIN_ALREADY_EXISTS]: {
    ...ErrorMetaMap[ErrorCode.ADMIN_ALREADY_EXISTS],
    showPopup: true
  },
  [ErrorCode.ADMIN_CREATE_FAILED]: {
    ...ErrorMetaMap[ErrorCode.ADMIN_CREATE_FAILED],
    showPopup: true
  },
  [ErrorCode.ADMIN_UPDATE_FAILED]: {
    ...ErrorMetaMap[ErrorCode.ADMIN_UPDATE_FAILED],
    showPopup: true
  },
  [ErrorCode.ADMIN_DELETE_FAILED]: {
    ...ErrorMetaMap[ErrorCode.ADMIN_DELETE_FAILED],
    showPopup: true
  },
  [ErrorCode.ADMIN_PASSWORD_CHANGE_FAILED]: {
    ...ErrorMetaMap[ErrorCode.ADMIN_PASSWORD_CHANGE_FAILED],
    showPopup: true
  },
  [ErrorCode.ADMIN_STATUS_CHANGE_FAILED]: {
    ...ErrorMetaMap[ErrorCode.ADMIN_STATUS_CHANGE_FAILED],
    showPopup: true
  },
  [ErrorCode.ADMIN_PASSWORD_INVALID]: {
    ...ErrorMetaMap[ErrorCode.ADMIN_PASSWORD_INVALID],
    showPopup: true
  },
  [ErrorCode.ADMIN_INACTIVE]: {
    ...ErrorMetaMap[ErrorCode.ADMIN_INACTIVE],
    showPopup: true,
    redirectTo: '/login'
  },
  
  // 요청 관련
  [ErrorCode.INVALID_REQUEST]: {
    ...ErrorMetaMap[ErrorCode.INVALID_REQUEST],
    showPopup: true
  },
  [ErrorCode.MISSING_REQUIRED_FIELD]: {
    ...ErrorMetaMap[ErrorCode.MISSING_REQUIRED_FIELD],
    showPopup: true
  },
  [ErrorCode.INVALID_PARAMETER]: {
    ...ErrorMetaMap[ErrorCode.INVALID_PARAMETER],
    showPopup: true
  },
  
  // 서버 관련
  [ErrorCode.INTERNAL_SERVER_ERROR]: {
    ...ErrorMetaMap[ErrorCode.INTERNAL_SERVER_ERROR],
    showPopup: true
  },
  [ErrorCode.SERVICE_UNAVAILABLE]: {
    ...ErrorMetaMap[ErrorCode.SERVICE_UNAVAILABLE],
    showPopup: true
  },
  [ErrorCode.MAINTENANCE_MODE]: {
    ...ErrorMetaMap[ErrorCode.MAINTENANCE_MODE],
    showPopup: true
  }
};

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