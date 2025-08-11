import { Response, Request } from 'express';
import { ErrorCode, ErrorMeta, ErrorMetaMap } from '@iitp-dabt/common';
import { appLogger } from './logger';

interface RequestWithId extends Request {
  requestId?: string;
  user?: {
    userId: number;
    userType: 'U' | 'A';
  };
}

/**
 * 에러 응답 전송
 * @param res Express Response 객체
 * @param errorCode 에러 코드
 * @param customMessage 커스텀 메시지 (선택사항)
 * @param details 추가 상세 정보 (선택사항)
 * @param skipLogging 로깅 건너뛰기 (선택사항, 기본값: false)
 */
export const sendError = (
  res: Response, 
  errorCode: ErrorCode, 
  customMessage?: string,
  details?: any,
  skipLogging: boolean = false
) => {
  const errorMeta: ErrorMeta = ErrorMetaMap[errorCode];
  const req = res.req as unknown as RequestWithId;
  
  // 로그 기록 (skipLogging이 true가 아닌 경우에만)
  if (!skipLogging) {
    appLogger.error(`[${errorCode}] ${customMessage || errorMeta.message}`, {
      requestId: req.requestId,
      errorCode,
      statusCode: errorMeta.statusCode,
      customMessage,
      details,
      url: req.url,
      method: req.method,
      userAgent: req.headers['user-agent'] as string
    });
  }

  // 응답 전송
  res.status(errorMeta.statusCode).json({
    success: false,
    errorCode,
    errorMessage: customMessage || errorMeta.message,
    ...(details && { details })
  });
};

/**
 * 성공 응답 전송 (ApiResponse<T> 구조)
 * @param res Express Response 객체
 * @param data 응답 데이터
 * @param message 성공 메시지 (선택사항)
 * @param event 비즈니스 이벤트명 (선택사항)
 * @param eventData 이벤트 데이터 (선택사항)
 * @param isListResponse 리스트 응답 여부 (빈 데이터 처리용, 기본값: false)
 */
export const sendSuccess = (
  res: Response, 
  data: any, 
  message?: string,
  event?: string,
  eventData?: any,
  isListResponse: boolean = false
) => {
  const req = res.req as unknown as RequestWithId;
  
  // 비즈니스 이벤트 로깅
  if (event) {
    appLogger.info(`Business Event: ${event}`, {
      requestId: req.requestId,
      event,
      eventData,
      url: req.url,
      method: req.method,
      userId: req.user?.userId,
      userType: req.user?.userType
    });
  }

  // 빈 데이터 처리 로직
  const isEmpty = data === null || data === undefined || 
                 (Array.isArray(data) && data.length === 0) ||
                 (typeof data === 'object' && Object.keys(data).length === 0);

  if (isEmpty) {
    // 리스트 응답이거나 명시적으로 빈 배열을 보내야 하는 경우
    if (isListResponse || (Array.isArray(data) && data.length === 0)) {
      // 200 OK + 빈 배열 또는 빈 객체
      res.status(200).json({
        success: true,
        data: Array.isArray(data) ? [] : {},
        ...(message && { message })
      });
    } else {
      // 204 No Content (단건 조회에서 데이터가 없는 경우)
      res.status(204).json({
        success: true,
        ...(message && { message })
      });
    }
  } else {
    // 정상 데이터 응답
    res.status(200).json({
      success: true,
      data,
      ...(message && { message })
    });
  }
};

/**
 * 유효성 검증 에러 전송
 * @param res Express Response 객체
 * @param field 필드명
 * @param message 커스텀 메시지
 */
export const sendValidationError = (res: Response, field: string, message: string) => {
  sendError(
    res, 
    ErrorCode.VALIDATION_ERROR, 
    `${field}: ${message}`
  );
};

/**
 * 데이터베이스 에러 전송
 * @param res Express Response 객체
 * @param operation 작업명 (예: '조회', '생성', '수정', '삭제')
 * @param entity 엔티티명 (예: '사용자', 'FAQ', 'QnA')
 */
export const sendDatabaseError = (res: Response, operation: string, entity: string) => {
  sendError(
    res, 
    ErrorCode.DATABASE_ERROR, 
    `${entity} ${operation} 중 데이터베이스 오류가 발생했습니다.`
  );
}; 