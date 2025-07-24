import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { JWT_CONFIG } from '../../utils/jwt';

export const version = async (req: Request, res: Response) => {
    const buildInfoPath = path.join(process.cwd(), 'build-info.json');
    if (fs.existsSync(buildInfoPath)) {
        const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf-8'));
        res.status(200).json(buildInfo);
    } else {
        res.status(404).json({ error: 'Build info not found' });
    }
};

export const health = async (req: Request, res: Response) => {
    const status = "UP";
    const timestamp = Date.now();;

    const response = {
        status,
        timestamp
    }
    res.status(501).json(response);
};

/**
 * JWT 설정 정보 제공 (FE에서 접근 가능)
 */
export const jwtConfig = async (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        data: JWT_CONFIG,
        errorCode: 0,
    });
};