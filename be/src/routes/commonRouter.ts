import { Router } from 'express';
import { version, health, jwtConfig } from '../controllers/common/commController';

const router = Router();

router.get('/version', version);
router.get('/health', health);
router.get('/jwt-config', jwtConfig);

export default router; 