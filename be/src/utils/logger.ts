import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');

// App Log (비즈니스 로직, 에러, 이벤트)
const appLogTransport = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d',
  zippedArchive: false,
  level: process.env.LOG_LEVEL || 'info',
});

// Access Log (API 접근)
const accessLogTransport = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: 'access-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d',
  zippedArchive: false,
  level: 'info',
});

// Error Log (에러만 별도)
const errorLogTransport = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d',
  zippedArchive: false,
  level: 'error',
});

const appLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
      const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
      return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}${stack ? `\n${stack}` : ''}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    appLogTransport,
    errorLogTransport, // 에러 레벨 로그는 error 파일에도 저장
  ],
});

const accessLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    accessLogTransport,
  ],
});

// 사용 예시:
// appLogger.info(`[userService.ts:register] 회원가입 성공: userId=123`);
// appLogger.error(`[userController.ts:checkEmail] 에러 발생`, err);
// accessLogger는 accessLogMiddleware에서 자동으로 사용

export { appLogger, accessLogger }; 