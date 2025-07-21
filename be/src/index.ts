import './models';
import express from 'express';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import commonRoutes from './routes/commonRoutes';
import { appLogger, accessLogger } from './utils/logger';
import morgan from 'morgan';

const app = express();
app.use(express.json());

app.use(morgan('combined', { stream: { write: (msg: string) => accessLogger.info(msg.trim()) } }));

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/common', commonRoutes);

app.listen(30000, () => appLogger.info('Server started'));
