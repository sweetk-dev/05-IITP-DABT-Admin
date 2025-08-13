import { Request, Response, NextFunction, RequestHandler } from 'express';
import { accessLogger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export const accessLogMiddleware: RequestHandler<any> = (req, res, next) => {
  const startTime = Date.now();
  const requestId = uuidv4();
  
  // Request ID를 request 객체에 추가
  req.requestId = requestId;

  // 응답 데이터를 가로채기
  const originalSend = res.send;
  res.send = function(data) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // 성능 최적화: 불필요한 객체 생성 제거, 직접 로그 메시지 생성
    accessLogger.info(`${req.method} - ${req.originalUrl} , ${res.statusCode}, ${res.statusCode < 400}, ${requestId}, ${responseTime}ms`);

    // 원래 send 함수 호출
    return originalSend.call(this, data);
  };

  next();
}; 