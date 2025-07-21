import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');

const appLogTransport = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d',
  zippedArchive: false,
  level: process.env.LOG_LEVEL || 'info',
});

const accessLogTransport = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: 'access-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d',
  zippedArchive: false,
  level: 'info',
});

const appLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) =>
      `[${timestamp}] [${level.toUpperCase()}] ${message}${stack ? `\n${stack}` : ''}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    appLogTransport,
  ],
});

const accessLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, message }) =>
      `[${timestamp}] ${message}`
    )
  ),
  transports: [
    accessLogTransport,
  ],
});

// 사용 예시:
// appLogger.info(`[userService.ts:register] 회원가입 성공: userId=123`);
// appLogger.error(`[userController.ts:checkEmail] 에러 발생`, err);
// accessLogger는 morgan에서만 사용

export { appLogger, accessLogger }; 