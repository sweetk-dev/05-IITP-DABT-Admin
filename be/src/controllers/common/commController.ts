import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

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