import { Router } from 'express';
import { checkEmail, register, login, profile, refresh } from '../controllers/user/userController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.post('/email/check', checkEmail);
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/profile', authenticateJWT, profile);

export default router; 