import 'dotenv/config';
import './models';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter';
import adminRouter from './routes/adminRouter';
import commonRouter from './routes/commonRouter';
import authRouter from './routes/authRouter';
import { authMiddleware } from './middleware/authMiddleware';
import { accessLogMiddleware } from './middleware/accessLogMiddleware';
import { appLogger } from './utils/logger';
import { API_URLS } from '@iitp-dabt/common';

const app = express();

// CORS 설정
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 자동화된 Access Log 미들웨어 (Morgan 대신 사용)
app.use(accessLogMiddleware);

// 라우터 설정 - API_URLS BASE 경로 사용
app.use(API_URLS.AUTH.BASE, authRouter);      // '/api/auth'
app.use(API_URLS.USER.BASE, userRouter);      // '/api/user'
app.use(API_URLS.ADMIN.BASE, adminRouter);    // '/api/admin'
app.use(API_URLS.COMMON.BASE, commonRouter);  // '/api/common'

app.listen(30000, () => appLogger.info('Server started'));

export default app;
