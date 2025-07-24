import { SysLogUserAccess, SysLogUserAccessCreationAttributes } from '../models/sysLogUserAccess';
import { Op } from 'sequelize';

/**
 * 로그 생성
 */
export async function createLog(logData: {
  userId: number;
  userType: string;
  logType: string;
  actResult: string;
  errCode?: string;
  errMsg?: string;
  ipAddr?: string;
  userAgent?: string;
  accessTm?: Date;
}): Promise<{ logId: number }> {
  const log = await SysLogUserAccess.create({
    userId: logData.userId,
    userType: logData.userType,
    logType: logData.logType,
    actResult: logData.actResult,
    errCode: logData.errCode,
    errMsg: logData.errMsg,
    ipAddr: logData.ipAddr,
    userAgent: logData.userAgent,
    accessTm: logData.accessTm || new Date()
  });
  return { logId: log.logId };
}

/**
 * 사용자별 로그 목록 조회
 */
export async function findLogsByUser(userId: number, options: {
  page?: number;
  limit?: number;
  userType?: string;
  logType?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<{
  logs: SysLogUserAccess[];
  total: number;
}> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;

  const whereClause: any = {
    userId
  };

  if (options.userType) {
    whereClause.userType = options.userType;
  }

  if (options.logType) {
    whereClause.logType = options.logType;
  }

  if (options.startDate || options.endDate) {
    whereClause.accessTm = {};
    if (options.startDate) {
      whereClause.accessTm[Op.gte] = options.startDate;
    }
    if (options.endDate) {
      whereClause.accessTm[Op.lte] = options.endDate;
    }
  }

  const { count, rows } = await SysLogUserAccess.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [['accessTm', 'DESC']]
  });

  return {
    logs: rows,
    total: count
  };
}

/**
 * 전체 로그 목록 조회 (관리자용)
 */
export async function findAllLogs(options: {
  page?: number;
  limit?: number;
  userType?: string;
  logType?: string;
  actResult?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<{
  logs: SysLogUserAccess[];
  total: number;
}> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;

  const whereClause: any = {};

  if (options.userType) {
    whereClause.userType = options.userType;
  }

  if (options.logType) {
    whereClause.logType = options.logType;
  }

  if (options.actResult) {
    whereClause.actResult = options.actResult;
  }

  if (options.startDate || options.endDate) {
    whereClause.accessTm = {};
    if (options.startDate) {
      whereClause.accessTm[Op.gte] = options.startDate;
    }
    if (options.endDate) {
      whereClause.accessTm[Op.lte] = options.endDate;
    }
  }

  const { count, rows } = await SysLogUserAccess.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [['accessTm', 'DESC']]
  });

  return {
    logs: rows,
    total: count
  };
}

/**
 * 로그인 성공/실패 통계
 */
export async function getLoginStatistics(startDate: Date, endDate: Date): Promise<{
  totalAttempts: number;
  successCount: number;
  failureCount: number;
  successRate: number;
}> {
  const totalAttempts = await SysLogUserAccess.count({
    where: {
      logType: 'LOGIN',
      accessTm: {
        [Op.between]: [startDate, endDate]
      }
    }
  });

  const successCount = await SysLogUserAccess.count({
    where: {
      logType: 'LOGIN',
      actResult: 'S',
      accessTm: {
        [Op.between]: [startDate, endDate]
      }
    }
  });

  const failureCount = totalAttempts - successCount;
  const successRate = totalAttempts > 0 ? (successCount / totalAttempts) * 100 : 0;

  return {
    totalAttempts,
    successCount,
    failureCount,
    successRate
  };
}

/**
 * 사용자별 로그인 시도 횟수
 */
export async function getLoginAttemptsByUser(userId: number, startDate: Date, endDate: Date): Promise<{
  totalAttempts: number;
  successCount: number;
  failureCount: number;
}> {
  const totalAttempts = await SysLogUserAccess.count({
    where: {
      userId,
      logType: 'LOGIN',
      accessTm: {
        [Op.between]: [startDate, endDate]
      }
    }
  });

  const successCount = await SysLogUserAccess.count({
    where: {
      userId,
      logType: 'LOGIN',
      actResult: 'S',
      accessTm: {
        [Op.between]: [startDate, endDate]
      }
    }
  });

  const failureCount = totalAttempts - successCount;

  return {
    totalAttempts,
    successCount,
    failureCount
  };
}

/**
 * IP 주소별 로그인 시도 횟수
 */
export async function getLoginAttemptsByIp(ipAddr: string, startDate: Date, endDate: Date): Promise<number> {
  return SysLogUserAccess.count({
    where: {
      ipAddr,
      logType: 'LOGIN',
      accessTm: {
        [Op.between]: [startDate, endDate]
      }
    }
  });
} 