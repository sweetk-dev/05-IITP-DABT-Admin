import { Router } from 'express';
import { version, health, jwtConfig } from '../controllers/common/commController';
import { API_URLS } from '@iitp-dabt/common';

const router = Router();

router.get(API_URLS.COMMON.VERSION, version);
router.get(API_URLS.COMMON.HEALTH_CHECK, health);
router.get(API_URLS.COMMON.JWT_CONFIG, jwtConfig);

export default router; 