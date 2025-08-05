import { Request, Response } from 'express';
import { COMMON_API_MAPPING, API_URLS, CommonHealthRes, CommonVersionRes, CommonJwtConfigRes } from '@iitp-dabt/common';
import fs from 'fs';
import path from 'path';
import { JWT_CONFIG } from '../../utils/jwt';
import { appLogger } from '../../utils/logger';

/**
 * 버전 정보 조회
 * API: GET /api/common/version
 * 매핑: COMMON_API_MAPPING[`GET ${API_URLS.COMMON.VERSION}`]
 */
export const version = async (req: Request, res: Response) => {
    const apiKey = `GET ${API_URLS.COMMON.VERSION}`;
    const mapping = COMMON_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || '버전 정보 조회'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });
    
    const buildInfoPath = path.join(process.cwd(), 'build-info.json');
    if (fs.existsSync(buildInfoPath)) {
        const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf-8'));
        res.status(200).json(buildInfo);
    } else {
        res.status(404).json({ error: 'Build info not found' });
    }
};

/**
 * 헬스 체크
 * API: GET /api/common/health
 * 매핑: COMMON_API_MAPPING[`GET ${API_URLS.COMMON.HEALTH_CHECK}`]
 */
export const health = async (req: Request, res: Response) => {
    const apiKey = `GET ${API_URLS.COMMON.HEALTH_CHECK}`;
    const mapping = COMMON_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || '헬스 체크'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });
    
    // CommonHealthRes 타입에 맞는 응답 생성
    const response: CommonHealthRes = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    };
    
    res.status(200).json(response);
};

/**
 * JWT 설정 정보 제공 (FE에서 접근 가능)
 * API: GET /api/common/jwt-config
 * 매핑: COMMON_API_MAPPING[`GET ${API_URLS.COMMON.JWT_CONFIG}`]
 */
export const jwtConfig = async (req: Request, res: Response) => {
    const apiKey = `GET ${API_URLS.COMMON.JWT_CONFIG}`;
    const mapping = COMMON_API_MAPPING[apiKey];
    appLogger.info(`API 호출: ${mapping?.description || 'JWT 설정 정보 조회'}`, {
      requestType: mapping?.req,
      responseType: mapping?.res
    });
    // CommonJwtConfigRes 타입에 맞는 응답 생성
    const response: CommonJwtConfigRes = {
        accessTokenExpiresIn: JWT_CONFIG.accessTokenExpiresIn,
        refreshTokenExpiresIn: JWT_CONFIG.refreshTokenExpiresIn,
        issuer: JWT_CONFIG.issuer
    };
    res.status(200).json(response);
};