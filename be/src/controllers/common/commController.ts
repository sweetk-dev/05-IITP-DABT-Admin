import { Request, Response } from 'express';
import { ErrorCode, COMMON_API_MAPPING, API_URLS, CommonHealthRes, CommonVersionRes, CommonJwtConfigRes } from '@iitp-dabt/common';
import { sendSuccess, sendError, sendValidationError, sendDatabaseError } from '../../utils/errorHandler';
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
    try {
        const apiKey = `GET ${API_URLS.COMMON.VERSION}`;
        const mapping = COMMON_API_MAPPING[apiKey];
        appLogger.info(`API 호출: ${mapping?.description || '버전 정보 조회'}`, {
          requestType: mapping?.req,
          responseType: mapping?.res
        });
        
        const buildInfoPath = path.join(process.cwd(), 'build-info.json');
        if (fs.existsSync(buildInfoPath)) {
            const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf-8'));
            const result: CommonVersionRes = buildInfo;
            sendSuccess(res, result, undefined, 'VERSION_INFO_RETRIEVED');
        } else {
            const result: CommonVersionRes = { error: 'Build info not found' };
            sendSuccess(res, result, undefined, 'VERSION_INFO_NOT_FOUND');
        }
    } catch (error) {
        appLogger.error('Error in version:', error);
        if (error instanceof Error) {
            const errorMsg = error.message;
            if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
                return sendValidationError(res, 'general', errorMsg);
            }
            if (errorMsg.includes('database') || errorMsg.includes('connection')) {
                return sendDatabaseError(res, '조회', '버전 정보');
            }
        }
        sendError(res, ErrorCode.UNKNOWN_ERROR);
    }
};

/**
 * 헬스 체크
 * API: GET /api/common/health
 * 매핑: COMMON_API_MAPPING[`GET ${API_URLS.COMMON.HEALTH_CHECK}`]
 */
export const health = async (req: Request, res: Response) => {
    try {
        const apiKey = `GET ${API_URLS.COMMON.HEALTH_CHECK}`;
        const mapping = COMMON_API_MAPPING[apiKey];
        appLogger.info(`API 호출: ${mapping?.description || '헬스 체크'}`, {
          requestType: mapping?.req,
          responseType: mapping?.res
        });
        
        // CommonHealthRes 타입에 맞는 응답 생성
        const result: CommonHealthRes = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        };
        
        sendSuccess(res, result, undefined, 'HEALTH_CHECK_OK');
    } catch (error) {
        appLogger.error('Error in health:', error);
        if (error instanceof Error) {
            const errorMsg = error.message;
            if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
                return sendValidationError(res, 'general', errorMsg);
            }
            if (errorMsg.includes('database') || errorMsg.includes('connection')) {
                return sendDatabaseError(res, '조회', '헬스 체크');
            }
        }
        sendError(res, ErrorCode.UNKNOWN_ERROR);
    }
};

/**
 * JWT 설정 정보 제공 (FE에서 접근 가능)
 * API: GET /api/common/jwt-config
 * 매핑: COMMON_API_MAPPING[`GET ${API_URLS.COMMON.JWT_CONFIG}`]
 */
export const jwtConfig = async (req: Request, res: Response) => {
    try {
        const apiKey = `GET ${API_URLS.COMMON.JWT_CONFIG}`;
        const mapping = COMMON_API_MAPPING[apiKey];
        appLogger.info(`API 호출: ${mapping?.description || 'JWT 설정 정보 조회'}`, {
          requestType: mapping?.req,
          responseType: mapping?.res
        });
        // CommonJwtConfigRes 타입에 맞는 응답 생성
        const result: CommonJwtConfigRes = {
            accessTokenExpiresIn: JWT_CONFIG.accessTokenExpiresIn,
            refreshTokenExpiresIn: JWT_CONFIG.refreshTokenExpiresIn,
            issuer: JWT_CONFIG.issuer
        };
        sendSuccess(res, result, undefined, 'JWT_CONFIG_RETRIEVED');
    } catch (error) {
        appLogger.error('Error in jwtConfig:', error);
        if (error instanceof Error) {
            const errorMsg = error.message;
            if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
                return sendValidationError(res, 'general', errorMsg);
            }
            if (errorMsg.includes('database') || errorMsg.includes('connection')) {
                return sendDatabaseError(res, '조회', 'JWT 설정');
            }
        }
        sendError(res, ErrorCode.UNKNOWN_ERROR);
    }
};