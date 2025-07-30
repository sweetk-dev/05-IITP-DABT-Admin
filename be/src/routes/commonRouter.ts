import { Router } from 'express';
import { version, health, jwtConfig } from '../controllers/common/commController';
import { routerMiddleware } from '../middleware';
import { API_URLS } from '@iitp-dabt/common';

const router = Router();

// 공개 API (로그만)
router.get(API_URLS.COMMON.VERSION, ...routerMiddleware.public, version);
router.get(API_URLS.COMMON.HEALTH_CHECK, ...routerMiddleware.public, health);
router.get(API_URLS.COMMON.JWT_CONFIG, ...routerMiddleware.public, jwtConfig);

export default router; 