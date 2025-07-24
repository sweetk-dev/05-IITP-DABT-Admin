import { OpenApiAuthKey, OpenApiAuthKeyCreationAttributes } from '../models/openApiAuthKey';
import { Op } from 'sequelize';

/**
 * 인증 키로 조회
 */
export async function findAuthKeyByKey(authKey: string): Promise<OpenApiAuthKey | null> {
  return OpenApiAuthKey.findOne({ 
    where: { 
      authKey,
      delYn: 'N',
      activeYn: 'Y'
    } 
  });
}

/**
 * 사용자 ID로 활성 인증 키 조회
 */
export async function findActiveAuthKeysByUserId(userId: number): Promise<OpenApiAuthKey[]> {
  return OpenApiAuthKey.findAll({ 
    where: { 
      userId,
      delYn: 'N',
      activeYn: 'Y',
      startDt: { [Op.lte]: new Date() },
      endDt: { [Op.gte]: new Date() }
    },
    order: [['createdAt', 'DESC']]
  });
}

/**
 * 인증 키 생성
 */
export async function createAuthKey(authKeyData: {
  userId: number;
  authKey: string;
  startDt: Date;
  endDt: Date;
  createdBy: string;
}): Promise<{ id: number }> {
  const authKey = await OpenApiAuthKey.create({
    userId: authKeyData.userId,
    authKey: authKeyData.authKey,
    startDt: authKeyData.startDt,
    endDt: authKeyData.endDt,
    activeYn: 'Y',
    delYn: 'N',
    createdBy: authKeyData.createdBy
  });
  return { id: authKey.id };
}

/**
 * 인증 키 활성화
 */
export async function activateAuthKey(id: number): Promise<boolean> {
  const [affectedRows] = await OpenApiAuthKey.update({
    activeYn: 'Y',
    activeAt: new Date()
  }, {
    where: { 
      id,
      delYn: 'N'
    }
  });
  return affectedRows > 0;
}

/**
 * 인증 키 비활성화
 */
export async function deactivateAuthKey(id: number): Promise<boolean> {
  const [affectedRows] = await OpenApiAuthKey.update({
    activeYn: 'N'
  }, {
    where: { 
      id,
      delYn: 'N'
    }
  });
  return affectedRows > 0;
}

/**
 * 최근 접근 시간 업데이트
 */
export async function updateLatestAccessTime(id: number): Promise<boolean> {
  const [affectedRows] = await OpenApiAuthKey.update({
    latestAccAt: new Date()
  }, {
    where: { 
      id,
      delYn: 'N'
    }
  });
  return affectedRows > 0;
}

/**
 * 사용자별 인증 키 목록 조회
 */
export async function findAuthKeysByUserId(userId: number, options: {
  page?: number;
  limit?: number;
  includeInactive?: boolean;
}): Promise<{
  authKeys: OpenApiAuthKey[];
  total: number;
}> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;

  const whereClause: any = {
    userId,
    delYn: 'N'
  };

  if (!options.includeInactive) {
    whereClause.activeYn = 'Y';
  }

  const { count, rows } = await OpenApiAuthKey.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });

  return {
    authKeys: rows,
    total: count
  };
}

/**
 * 만료된 인증 키 조회
 */
export async function findExpiredAuthKeys(): Promise<OpenApiAuthKey[]> {
  return OpenApiAuthKey.findAll({ 
    where: { 
      delYn: 'N',
      activeYn: 'Y',
      endDt: { [Op.lt]: new Date() }
    }
  });
}

/**
 * 인증 키 정보 업데이트
 */
export async function updateAuthKey(id: number, updateData: {
  startDt?: Date;
  endDt?: Date;
  updatedBy: string;
}): Promise<boolean> {
  const [affectedRows] = await OpenApiAuthKey.update({
    startDt: updateData.startDt,
    endDt: updateData.endDt,
    updatedBy: updateData.updatedBy
  }, {
    where: { 
      id,
      delYn: 'N'
    }
  });
  return affectedRows > 0;
}

/**
 * 인증 키 논리 삭제
 */
export async function deleteAuthKey(id: number, deletedBy: string): Promise<boolean> {
  const [affectedRows] = await OpenApiAuthKey.update({
    delYn: 'Y',
    deletedBy
  }, {
    where: { 
      id,
      delYn: 'N'
    }
  });
  return affectedRows > 0;
}

/**
 * 유효한 인증 키인지 확인
 */
export async function isValidAuthKey(authKey: string): Promise<boolean> {
  const key = await OpenApiAuthKey.findOne({ 
    where: { 
      authKey,
      delYn: 'N',
      activeYn: 'Y',
      startDt: { [Op.lte]: new Date() },
      endDt: { [Op.gte]: new Date() }
    } 
  });
  return !!key;
}

/**
 * 인증 키 통계 조회
 */
export async function getAuthKeyStats(userId: number): Promise<{
  total: number;
  active: number;
  expired: number;
}> {
  const [total, active, expired] = await Promise.all([
    OpenApiAuthKey.count({ where: { userId, delYn: 'N' } }),
    OpenApiAuthKey.count({ 
      where: { 
        userId, 
        delYn: 'N', 
        activeYn: 'Y',
        startDt: { [Op.lte]: new Date() },
        endDt: { [Op.gte]: new Date() }
      } 
    }),
    OpenApiAuthKey.count({ 
      where: { 
        userId, 
        delYn: 'N', 
        activeYn: 'Y',
        endDt: { [Op.lt]: new Date() }
      } 
    })
  ]);

  return { total, active, expired };
} 