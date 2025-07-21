import { Router } from 'express';
import { checkEmail, register, login, profile } from '../controllers/user/userController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.post('/email/check', checkEmail);
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateJWT, profile);

export default router; 