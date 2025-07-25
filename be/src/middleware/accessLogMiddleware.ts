import { Request, Response, NextFunction } from 'express';
import { accessLogger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

interface RequestWithUser extends Request {
  user?: {
    userId: number;
    userType: 'U' | 'A';
  };
  requestId?: string;
}

export const accessLogMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const requestId = uuidv4();
  
  // Request ID를 request 객체에 추가
  req.requestId = requestId;

  // 응답 데이터를 가로채기
  const originalSend = res.send;
  res.send = function(data) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // REQ-RES를 하나의 로그로 통합
    const accessLogData = {
      requestId,
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.userId || 'anonymous',
      userType: req.user?.userType || 'anonymous',
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      success: res.statusCode < 400
    };

    // 통합된 Access Log 기록 (1줄)
    accessLogger.info('API_ACCESS', accessLogData);

    // 원래 send 함수 호출
    return originalSend.call(this, data);
  };

  next();
}; 