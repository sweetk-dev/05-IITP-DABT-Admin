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
      [Op.or]: [
        {
          startDt: { [Op.lte]: new Date() },
          endDt: { [Op.gte]: new Date() }
        },
        {
          startDt: null,
          endDt: null
        }
      ]
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
  keyName: string;
  keyDesc: string;
  startDt?: Date;
  endDt?: Date;
  createdBy: string;
}): Promise<{ keyId: number }> {
  const authKey = await OpenApiAuthKey.create({
    userId: authKeyData.userId,
    authKey: authKeyData.authKey,
    keyName: authKeyData.keyName,
    keyDesc: authKeyData.keyDesc,
    startDt: authKeyData.startDt,
    endDt: authKeyData.endDt,
    activeYn: 'Y',
    delYn: 'N',
    createdBy: authKeyData.createdBy
  });
  return { keyId: authKey.keyId };
}

/**
 * 인증 키 활성화
 */
export async function activateAuthKey(keyId: number): Promise<boolean> {
  const [affectedRows] = await OpenApiAuthKey.update({
    activeYn: 'Y',
    activeAt: new Date()
  }, {
    where: { 
      keyId,
      delYn: 'N'
    }
  });
  return affectedRows > 0;
}

/**
 * 인증 키 비활성화
 */
export async function deactivateAuthKey(keyId: number): Promise<boolean> {
  const [affectedRows] = await OpenApiAuthKey.update({
    activeYn: 'N'
  }, {
    where: { 
      keyId,
      delYn: 'N'
    }
  });
  return affectedRows > 0;
}

/**
 * 최근 접근 시간 업데이트
 */
export async function updateLatestAccessTime(keyId: number): Promise<boolean> {
  const [affectedRows] = await OpenApiAuthKey.update({
    latestAccAt: new Date()
  }, {
    where: { 
      keyId,
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
export async function updateAuthKey(keyId: number, updateData: {
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
      keyId,
      delYn: 'N'
    }
  });
  return affectedRows > 0;
}

/**
 * 인증 키 논리 삭제
 */
export async function deleteAuthKey(keyId: number, deletedBy: string): Promise<boolean> {
  const [affectedRows] = await OpenApiAuthKey.update({
    delYn: 'Y',
    deletedBy
  }, {
    where: { 
      keyId,
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
      [Op.or]: [
        {
          startDt: { [Op.lte]: new Date() },
          endDt: { [Op.gte]: new Date() }
        },
        {
          startDt: null,
          endDt: null
        }
      ]
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
        [Op.or]: [
          {
            startDt: { [Op.lte]: new Date() },
            endDt: { [Op.gte]: new Date() }
          },
          {
            startDt: null,
            endDt: null
          }
        ]
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

/**
 * 인증 키 기간 연장
 */
export async function extendAuthKeyPeriod(keyId: number, extensionDays: number, updatedBy: string): Promise<boolean> {
  const authKey = await OpenApiAuthKey.findOne({
    where: { 
      keyId,
      delYn: 'N'
    }
  });

  if (!authKey) {
    return false;
  }

  const currentEndDt = authKey.endDt ? new Date(authKey.endDt) : new Date();
  const newEndDt = new Date(currentEndDt.getTime() + extensionDays * 24 * 60 * 60 * 1000);

  const [affectedRows] = await OpenApiAuthKey.update({
    endDt: newEndDt,
    updatedBy
  }, {
    where: { 
      keyId,
      delYn: 'N'
    }
  });

  return affectedRows > 0;
}

/**
 * 인증 키 상세 정보 조회
 */
export async function findAuthKeyById(keyId: number): Promise<OpenApiAuthKey | null> {
  return OpenApiAuthKey.findOne({
    where: { 
      keyId,
      delYn: 'N'
    }
  });
}

/**
 * 사용자별 활성 인증 키 개수 조회
 */
export async function countActiveAuthKeysByUserId(userId: number): Promise<number> {
  return OpenApiAuthKey.count({
    where: { 
      userId,
      delYn: 'N',
      activeYn: 'Y',
      [Op.or]: [
        {
          startDt: { [Op.lte]: new Date() },
          endDt: { [Op.gte]: new Date() }
        },
        {
          startDt: null,
          endDt: null
        }
      ]
    }
  });
} 