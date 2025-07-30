import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 환경 변수 로드 (가장 먼저 실행)
dotenv.config();

import { API_URLS } from '@iitp-dabt/common';
import authRouter from './routes/authRouter';
import adminRouter from './routes/adminRouter';
import userRouter from './routes/userRouter';
import commonRouter from './routes/commonRouter';
import commonCodeRouter from './routes/commonCodeRoutes';
import { accessLogMiddleware } from './middleware/accessLogMiddleware';
import { trimMiddleware } from './middleware/trimMiddleware';
import { appLogger } from './utils/logger';
import sequelize from './models';

const app = express();

// CORS 설정 - localhost는 무조건 허용
const corsOrigins = [
  'http://localhost:5173',  // Vite dev server (기본)
  'http://localhost:3000',  // React dev server
  'http://localhost:4173',  // Vite preview
  'http://127.0.0.1:5173',  // Vite dev server (IP)
  'http://127.0.0.1:3000',  // React dev server (IP)
  'http://127.0.0.1:4173'   // Vite preview (IP)
];

// 환경 변수에서 추가 CORS origins가 있으면 병합
if (process.env.CORS_ORIGINS) {
  const envOrigins = process.env.CORS_ORIGINS.split(',').map(origin => origin.trim());
  corsOrigins.push(...envOrigins);
}

app.use(cors({ origin: corsOrigins, credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] }));

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 자동화된 Access Log 미들웨어 (Morgan 대신 사용)
app.use(accessLogMiddleware);

// 자동 trim 처리 미들웨어 (비밀번호 필드 제외)
app.use(trimMiddleware);

// 라우터 설정 - API_URLS BASE 경로 사용
app.use(API_URLS.AUTH.BASE, authRouter);      // '/api/auth'
app.use(API_URLS.USER.BASE, userRouter);      // '/api/user'
app.use(API_URLS.ADMIN.BASE, adminRouter);    // '/api/admin'
app.use(API_URLS.COMMON.BASE, commonRouter);  // '/api/common'
app.use(API_URLS.COMMON_CODE.BASE, commonCodeRouter);

// 서버 시작 전 데이터베이스 연결 확인
async function startServer() {
  try {
    // 데이터베이스 연결 테스트
    await sequelize.authenticate();
    appLogger.info('Database connection established successfully');
    
    // 서버 시작
    app.listen(30000, () => appLogger.info('Server started'));
    
  } catch (error) {
    appLogger.error('Database connection failed:', error);
    process.exit(1);
  }
}

startServer();

export default app;
