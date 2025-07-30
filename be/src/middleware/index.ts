import { Request, Response, NextFunction } from 'express';
import { accessLogMiddleware } from './accessLogMiddleware';
import { trimMiddleware } from './trimMiddleware';
import { authMiddleware, adminAuthMiddleware } from './authMiddleware';
import { accessLogger } from '../utils/logger';

/**
 * 미들웨어 체인 최적화를 위한 통합 미들웨어
 * 성능 향상을 위해 불필요한 미들웨어 호출을 방지
 */

// 기본 미들웨어 체인 (로그 + trim)
export const baseMiddlewareChain = [accessLogMiddleware, trimMiddleware];

// 인증이 필요한 미들웨어 체인
export const authMiddlewareChain = [...baseMiddlewareChain, authMiddleware];

// 관리자 전용 미들웨어 체인
export const adminMiddlewareChain = [...baseMiddlewareChain, adminAuthMiddleware];

/**
 * 조건부 미들웨어 적용을 위한 헬퍼 함수
 * @param condition 미들웨어 적용 조건
 * @param middleware 적용할 미들웨어
 */
export const conditionalMiddleware = (condition: (req: Request) => boolean, middleware: (req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (condition(req)) {
      return middleware(req, res, next);
    }
    next();
  };
};

/**
 * 성능 최적화된 미들웨어 체인 생성
 * @param middlewares 적용할 미들웨어 배열
 * @param options 옵션 설정
 */
export const createOptimizedMiddlewareChain = (
  middlewares: ((req: Request, res: Response, next: NextFunction) => void)[],
  options: {
    skipLogging?: boolean;
    skipTrim?: boolean;
    skipAuth?: boolean;
  } = {}
) => {
  const chain: ((req: Request, res: Response, next: NextFunction) => void)[] = [];

  // 로깅 미들웨어 (조건부)
  if (!options.skipLogging) {
    chain.push(accessLogMiddleware);
  }

  // Trim 미들웨어 (조건부)
  if (!options.skipTrim) {
    chain.push(trimMiddleware);
  }

  // 인증 미들웨어 (조건부)
  if (!options.skipAuth) {
    chain.push(authMiddleware);
  }

  // 추가 미들웨어들
  chain.push(...middlewares);

  return chain;
};

/**
 * 라우터별 미들웨어 설정을 위한 헬퍼
 */
export const routerMiddleware = {
  // 공개 API (로그만)
  public: [accessLogMiddleware],
  
  // 사용자 API (로그 + trim + 인증)
  user: [accessLogMiddleware, trimMiddleware, authMiddleware],
  
  // 관리자 API (로그 + trim + 관리자 인증)
  admin: [accessLogMiddleware, trimMiddleware, adminAuthMiddleware],
  
  // 인증 없이 데이터만 처리 (로그 + trim)
  dataOnly: [accessLogMiddleware, trimMiddleware]
};

/**
 * 미들웨어 성능 모니터링을 위한 래퍼
 */
export const withPerformanceMonitoring = (middleware: (req: Request, res: Response, next: NextFunction) => void, name: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    
    middleware(req, res, (err?: any) => {
      const duration = Date.now() - start;
      
      // 성능 임계값 초과 시 경고 로그
      if (duration > 100) { // 100ms 이상 걸리는 경우
        accessLogger.warn(`Slow middleware execution: ${name} took ${duration}ms`, {
          url: req.originalUrl,
          method: req.method,
          duration
        });
      }
      
      next(err);
    });
  };
}; 