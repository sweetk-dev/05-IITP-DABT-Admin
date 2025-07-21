import { Router } from 'express';
import { version, health } from '../controllers/common/commController';


const router = Router();

router.get('/version', version);
router.get('/health', health);

export default router; 