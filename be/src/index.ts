import express from 'express';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import commonRoutes from './routes/commonRoutes';

const app = express();
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/common', commonRoutes);

app.listen(30000, () => console.log('Server started'));
