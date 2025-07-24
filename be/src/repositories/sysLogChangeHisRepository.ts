import { SysLogChangeHis, SysLogChangeHisCreationAttributes } from '../models/sysLogChangeHis';
import { Op } from 'sequelize';

/**
 * 변경 로그 생성
 */
export async function createChangeLog(logData: {
  actorType: string;
  actorId: number;
  actionType: string;
  targetType?: string;
  targetId?: number;
  actResult: string;
  chgSummary?: object;
  errCode?: string;
  errMsg?: string;
  ipAddr?: string;
  userAgent?: string;
  actTm?: Date;
}): Promise<{ logId: number }> {
  const log = await SysLogChangeHis.create({
    actorType: logData.actorType,
    actorId: logData.actorId,
    actionType: logData.actionType,
    targetType: logData.targetType,
    targetId: logData.targetId,
    actResult: logData.actResult,
    chgSummary: logData.chgSummary,
    errCode: logData.errCode,
    errMsg: logData.errMsg,
    ipAddr: logData.ipAddr,
    userAgent: logData.userAgent,
    actTm: logData.actTm || new Date()
  });
  return { logId: log.logId };
}

/**
 * 사용자별 변경 로그 조회
 */
export async function findChangeLogsByActor(actorType: string, actorId: number, options: {
  page?: number;
  limit?: number;
  actionType?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<{
  logs: SysLogChangeHis[];
  total: number;
}> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;

  const whereClause: any = {
    actorType,
    actorId
  };

  if (options.actionType) {
    whereClause.actionType = options.actionType;
  }

  if (options.startDate || options.endDate) {
    whereClause.actTm = {};
    if (options.startDate) {
      whereClause.actTm[Op.gte] = options.startDate;
    }
    if (options.endDate) {
      whereClause.actTm[Op.lte] = options.endDate;
    }
  }

  const { count, rows } = await SysLogChangeHis.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [['actTm', 'DESC']]
  });

  return {
    logs: rows,
    total: count
  };
}

/**
 * 대상별 변경 로그 조회
 */
export async function findChangeLogsByTarget(targetType: string, targetId: number, options: {
  page?: number;
  limit?: number;
  actionType?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<{
  logs: SysLogChangeHis[];
  total: number;
}> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;

  const whereClause: any = {
    targetType,
    targetId
  };

  if (options.actionType) {
    whereClause.actionType = options.actionType;
  }

  if (options.startDate || options.endDate) {
    whereClause.actTm = {};
    if (options.startDate) {
      whereClause.actTm[Op.gte] = options.startDate;
    }
    if (options.endDate) {
      whereClause.actTm[Op.lte] = options.endDate;
    }
  }

  const { count, rows } = await SysLogChangeHis.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [['actTm', 'DESC']]
  });

  return {
    logs: rows,
    total: count
  };
}

/**
 * 전체 변경 로그 조회 (관리자용)
 */
export async function findAllChangeLogs(options: {
  page?: number;
  limit?: number;
  actorType?: string;
  actionType?: string;
  targetType?: string;
  actResult?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<{
  logs: SysLogChangeHis[];
  total: number;
}> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;

  const whereClause: any = {};

  if (options.actorType) {
    whereClause.actorType = options.actorType;
  }

  if (options.actionType) {
    whereClause.actionType = options.actionType;
  }

  if (options.targetType) {
    whereClause.targetType = options.targetType;
  }

  if (options.actResult) {
    whereClause.actResult = options.actResult;
  }

  if (options.startDate || options.endDate) {
    whereClause.actTm = {};
    if (options.startDate) {
      whereClause.actTm[Op.gte] = options.startDate;
    }
    if (options.endDate) {
      whereClause.actTm[Op.lte] = options.endDate;
    }
  }

  const { count, rows } = await SysLogChangeHis.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [['actTm', 'DESC']]
  });

  return {
    logs: rows,
    total: count
  };
}

/**
 * 액션 타입별 통계
 */
export async function getActionTypeStatistics(startDate: Date, endDate: Date): Promise<Array<{
  actionType: string;
  count: number;
  successCount: number;
  failureCount: number;
}>> {
  const result = await SysLogChangeHis.findAll({
    attributes: [
      'actionType',
      [SysLogChangeHis.sequelize!.fn('COUNT', SysLogChangeHis.sequelize!.col('log_id')), 'count'],
      [SysLogChangeHis.sequelize!.fn('SUM', 
        SysLogChangeHis.sequelize!.literal("CASE WHEN act_result = 'S' THEN 1 ELSE 0 END")), 'successCount'],
      [SysLogChangeHis.sequelize!.fn('SUM', 
        SysLogChangeHis.sequelize!.literal("CASE WHEN act_result = 'F' THEN 1 ELSE 0 END")), 'failureCount']
    ],
    group: ['actionType'],
    where: {
      actTm: {
        [Op.between]: [startDate, endDate]
      }
    }
  });

  return result.map(item => ({
    actionType: item.actionType,
    count: parseInt(item.get('count') as string),
    successCount: parseInt(item.get('successCount') as string) || 0,
    failureCount: parseInt(item.get('failureCount') as string) || 0
  }));
}

/**
 * 사용자별 변경 활동 통계
 */
export async function getUserActivityStatistics(startDate: Date, endDate: Date): Promise<Array<{
  actorType: string;
  actorId: number;
  actionCount: number;
  lastActivity: Date;
}>> {
  const result = await SysLogChangeHis.findAll({
    attributes: [
      'actorType',
      'actorId',
      [SysLogChangeHis.sequelize!.fn('COUNT', SysLogChangeHis.sequelize!.col('log_id')), 'actionCount'],
      [SysLogChangeHis.sequelize!.fn('MAX', SysLogChangeHis.sequelize!.col('act_tm')), 'lastActivity']
    ],
    group: ['actorType', 'actorId'],
    where: {
      actTm: {
        [Op.between]: [startDate, endDate]
      }
    },
    order: [[SysLogChangeHis.sequelize!.fn('COUNT', SysLogChangeHis.sequelize!.col('log_id')), 'DESC']]
  });

  return result.map(item => ({
    actorType: item.actorType,
    actorId: item.actorId,
    actionCount: parseInt(item.get('actionCount') as string),
    lastActivity: item.get('lastActivity') as Date
  }));
} 