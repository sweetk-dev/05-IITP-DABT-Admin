import { Router } from 'express';
import { register, login, profile } from '../controllers/user/userController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateJWT, profile);

export default router; 