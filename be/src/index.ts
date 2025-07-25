import './models';
import express from 'express';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import commonRoutes from './routes/commonRoutes';
import userAuthRoutes from './routes/userAuthRoutes';
import adminAuthRoutes from './routes/adminAuthRoutes';
import userFaqRoutes from './routes/userFaqRoutes';
import adminFaqRoutes from './routes/adminFaqRoutes';
import userQnaRoutes from './routes/userQnaRoutes';
import adminQnaRoutes from './routes/adminQnaRoutes';
import { authMiddleware } from './middleware/authMiddleware';
import { accessLogMiddleware } from './middleware/accessLogMiddleware';
import { appLogger } from './utils/logger';

const app = express();

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 자동화된 Access Log 미들웨어 (Morgan 대신 사용)
app.use(accessLogMiddleware);

// 라우터 설정
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/common', commonRoutes);
app.use('/api/auth/user', userAuthRoutes);
app.use('/api/auth/admin', adminAuthRoutes);
app.use('/api/user/faq', userFaqRoutes);
app.use('/api/admin/faq', adminFaqRoutes);
app.use('/api/user/qna', userQnaRoutes);
app.use('/api/admin/qna', adminQnaRoutes);

app.listen(30000, () => appLogger.info('Server started'));

export default app;
