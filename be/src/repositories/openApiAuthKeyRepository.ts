import { OpenApiAuthKey, OpenApiAuthKeyCreationAttributes } from '../models/openApiAuthKey';
import { Op, literal } from 'sequelize';

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
 * @param userId 사용자 ID
 * @param includeUnlimited 기간이 설정되지 않은 키도 포함할지 여부 (관리자용)
 */
export async function findActiveAuthKeysByUserId(userId: number, includeUnlimited: boolean = false): Promise<OpenApiAuthKey[]> {
  const currDate = new Date();
  
  const whereClause: any = {
    userId,
    delYn: 'N',
    activeYn: 'Y'
  };

  if (includeUnlimited) {
    // 관리자용: 기간이 설정되지 않은 키도 포함
    whereClause[Op.or] = [
      {
        startDt: { [Op.lte]: currDate },
        endDt: { [Op.gte]: currDate }
      },
      {
        startDt: { [Op.is]: null },
        endDt: { [Op.is]: null }
      }
    ];
  } else {
    // 사용자용: 기간이 설정된 활성 키만
    whereClause.startDt = { [Op.lte]: currDate };
    whereClause.endDt = { [Op.gte]: currDate };
  }
  
  return OpenApiAuthKey.findAll({ 
    where: whereClause,
    order: [['createdAt', 'DESC']]
  });
}

/**
 * 인증 키 생성
 */
//TODO: 임시로 자동 허가 (activeYn=Y,activeAt), 추후 관리자 승인 로직 추가 필요
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
    activeAt: new Date(),
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
  pendingOnly?: boolean;
  activeYn?: string;
  searchKeyword?: string;
}): Promise<{
  authKeys: OpenApiAuthKey[];
  total: number;
}> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;

  const whereClause: any = {
    delYn: 'N'
  };

  // userId가 0이 아닌 경우에만 userId 조건 추가 (0은 모든 사용자를 의미)
  if (userId !== 0) {
    whereClause.userId = userId;
  }

  // pendingOnly가 true인 경우 pending 상태만 조회
  if (options.pendingOnly) {
    whereClause.activeYn = 'N';
    whereClause.activeAt = { [Op.is]: null };
  } else if (options.activeYn) {
    // activeYn이 명시적으로 설정된 경우
    if (options.activeYn === 'Y') {
      whereClause.activeYn = 'Y';
    } else if (options.activeYn === 'N') {
      whereClause.activeYn = 'N';
    }
    // activeYn이 '' (전체)인 경우는 조건 추가하지 않음
  } else if (!options.includeInactive) {
    // pendingOnly가 false이고 activeYn이 설정되지 않았고 includeInactive가 false인 경우 활성 상태만
    whereClause.activeYn = 'Y';
  }
  // pendingOnly가 false이고 activeYn이 ''이거나 includeInactive가 true인 경우 모든 상태 포함

  // 검색 조건 추가
  if (options.searchKeyword) {
    whereClause[Op.or] = [
      { keyName: { [Op.like]: `%${options.searchKeyword}%` } },
      { keyDesc: { [Op.like]: `%${options.searchKeyword}%` } }
    ];
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
  activeYn?: string;
  keyRejectReason?: string;
  updatedBy: string;
}): Promise<boolean> {
  const updateFields: any = {
    updatedBy: updateData.updatedBy
  };

  if (updateData.startDt !== undefined) {
    updateFields.startDt = updateData.startDt;
  }

  if (updateData.endDt !== undefined) {
    updateFields.endDt = updateData.endDt;
  }

  if (updateData.activeYn !== undefined) {
    updateFields.activeYn = updateData.activeYn;
    
    // activeYn이 'Y'로 설정되면 거절 사유 초기화 및 활성화 시간 설정
    if (updateData.activeYn === 'Y') {
      updateFields.keyRejectReason = null;
      updateFields.activeAt = new Date();
    }
  }

  if (updateData.keyRejectReason !== undefined) {
    updateFields.keyRejectReason = updateData.keyRejectReason;
  }

  const [affectedRows] = await OpenApiAuthKey.update(updateFields, {
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
 * @param authKey 인증 키
 * @param includeUnlimited 기간이 설정되지 않은 키도 포함할지 여부 (관리자용)
 */
export async function isValidAuthKey(authKey: string, includeUnlimited: boolean = false): Promise<boolean> {
  const currDate = new Date();
  
  const whereClause: any = {
    authKey,
    delYn: 'N',
    activeYn: 'Y'
  };

  if (includeUnlimited) {
    // 관리자용: 기간이 설정되지 않은 키도 포함
    whereClause[Op.or] = [
      {
        startDt: { [Op.lte]: currDate },
        endDt: { [Op.gte]: currDate }
      },
      {
        startDt: { [Op.is]: null },
        endDt: { [Op.is]: null }
      }
    ];
  } else {
    // 사용자용: 기간이 설정된 활성 키만
    whereClause.startDt = { [Op.lte]: currDate };
    whereClause.endDt = { [Op.gte]: currDate };
  }
  
  const key = await OpenApiAuthKey.findOne({ where: whereClause });
  return !!key;
}

/**
 * 인증 키 통계 조회
 * @param userId 사용자 ID (0일 경우 모든 사용자 대상)
 * @param includeUnlimited 기간이 설정되지 않은 키도 포함할지 여부 (관리자용)
 */
export async function getAuthKeyStats(userId: number, includeUnlimited: boolean = false): Promise<{
  total: number;
  active: number;
  expired: number;
  inactive: number;
  pending: number;   //허가 대기 중 count
}> {
  const currDate = new Date();
  
  // userId가 0일 경우 모든 사용자 대상, 그렇지 않으면 특정 사용자 대상
  const whereClause = userId === 0 ? { delYn: 'N' } : { userId, delYn: 'N' };
  
  // SQL Injection 방지를 위해 Sequelize의 안전한 방법 사용
  // includeUnlimited가 true일 때만 기간이 설정되지 않은 키를 포함하도록 조건 분리
  let activeCase = `
        SUM(CASE 
          WHEN active_yn = 'Y' AND start_dt IS NOT NULL AND end_dt IS NOT NULL 
               AND start_dt <= :currDate AND end_dt >= :currDate THEN 1
          ELSE 0 
        END)
      `;
  
  if (includeUnlimited) {
    activeCase = `
        SUM(CASE 
          WHEN active_yn = 'Y' AND start_dt IS NOT NULL AND end_dt IS NOT NULL 
               AND start_dt <= :currDate AND end_dt >= :currDate THEN 1
          WHEN active_yn = 'Y' AND start_dt IS NULL AND end_dt IS NULL THEN 1
          ELSE 0 
        END)
      `;
  }

  const result = await OpenApiAuthKey.findOne({
    where: whereClause,
    attributes: [
      [literal(`COUNT(*)`), 'total'],
      [literal(activeCase), 'active'],
      [literal(`
        SUM(CASE 
          WHEN active_yn = 'Y' AND end_dt IS NOT NULL AND end_dt < :currDate THEN 1
          ELSE 0 
        END)
      `), 'expired'],
      [literal(`
        SUM(CASE 
          WHEN active_yn = 'N' AND active_at IS NOT NULL THEN 1
          ELSE 0 
        END)
      `), 'inactive'],
      [literal(`
        SUM(CASE 
          WHEN active_yn = 'N' AND active_at IS NULL THEN 1
          ELSE 0 
        END)
      `), 'pending']
    ],
    replacements: {
      currDate: currDate.toISOString().split('T')[0]
    },
    raw: true
  });

  return {
    total: Number((result as any)?.total || 0),
    active: Number((result as any)?.active || 0),
    expired: Number((result as any)?.expired || 0),
    inactive: Number((result as any)?.inactive || 0),
    pending: Number((result as any)?.pending || 0)
  };
}

/**
 * 인증 키 기간 연장
 */
// deprecated: extensionDays-based extend removed

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
 * @param userId 사용자 ID
 * @param includeUnlimited 기간이 설정되지 않은 키도 포함할지 여부 (관리자용)
 */
export async function countActiveAuthKeysByUserId(userId: number, includeUnlimited: boolean = false): Promise<number> {
  const currDate = new Date();
  
  const whereClause: any = {
    userId,
    delYn: 'N',
    activeYn: 'Y'
  };

  if (includeUnlimited) {
    whereClause[Op.or] = [
      {
        startDt: { [Op.lte]: currDate },
        endDt: { [Op.gte]: currDate }
      },
      {
        startDt: { [Op.is]: null },
        endDt: { [Op.is]: null }
      }
    ];
  } else {
    whereClause.startDt = { [Op.lte]: currDate };
    whereClause.endDt = { [Op.gte]: currDate };
  }
  
  return OpenApiAuthKey.count({ where: whereClause });
}

// ===== Admin Service 호출을 위한 별칭 함수들 =====

/**
 * OpenAPI 인증 키 목록 조회 (관리자용)
 */
export async function findOpenApiAuthKeys(options: {
  where?: any;
  limit?: number;
  offset?: number;
  order?: any[];
}): Promise<{
  openApis: OpenApiAuthKey[];
  total: number;
  page: number;
  limit: number;
}> {
  const limit = options.limit || 10;
  const offset = options.offset || 0;
  const order = options.order || [['createdAt', 'DESC']];

  const { count, rows } = await OpenApiAuthKey.findAndCountAll({
    where: options.where || {},
    limit,
    offset,
    order
  });

  return {
    openApis: rows,
    total: count,
    page: Math.floor(offset / limit) + 1,
    limit
  };
}

/**
 * OpenAPI 인증 키 상세 조회 (관리자용)
 */
export async function findOpenApiAuthKeyById(apiId: number): Promise<OpenApiAuthKey | null> {
  return findAuthKeyById(apiId);
}

/**
 * OpenAPI 인증 키 생성 (관리자용)
 */
export async function createOpenApiAuthKey(authKeyData: {
  userId: number;
  keyName: string;
  keyDesc?: string;
  extensionDays: number;
  createdBy: string;
}): Promise<{ apiId: number }> {
  const { userId, keyName, keyDesc, extensionDays, createdBy } = authKeyData;
  
  // 기본 기간 설정 (현재 시간부터 extensionDays 후까지)
  const startDt = new Date();
  const endDt = new Date(startDt.getTime() + extensionDays * 24 * 60 * 60 * 1000);
  
  // 임시 인증키 생성 (실제로는 generateAuthKey 함수 사용)
  const authKey = `API_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const result = await createAuthKey({
    userId,
    authKey,
    keyName,
    keyDesc: keyDesc || '',
    startDt,
    endDt,
    createdBy
  });
  
  return { apiId: result.keyId };
}

/**
 * OpenAPI 인증 키 수정 (관리자용)
 */
export async function updateOpenApiAuthKey(apiId: number, updateData: {
  keyName?: string;
  keyDesc?: string;
  extensionDays?: number;
  status?: string;
  updatedBy: string;
}): Promise<OpenApiAuthKey | null> {
  const authKey = await findAuthKeyById(apiId);
  if (!authKey) {
    return null;
  }

  const updateFields: any = {
    updatedBy: updateData.updatedBy
  };

  if (updateData.keyName) {
    updateFields.keyName = updateData.keyName;
  }

  if (updateData.keyDesc !== undefined) {
    updateFields.keyDesc = updateData.keyDesc;
  }

  if (updateData.status) {
    updateFields.activeYn = updateData.status === 'ACTIVE' ? 'Y' : 'N';
  }

  if (updateData.extensionDays) {
    const currentEndDt = authKey.endDt ? new Date(authKey.endDt) : new Date();
    const newEndDt = new Date(currentEndDt.getTime() + updateData.extensionDays * 24 * 60 * 60 * 1000);
    updateFields.endDt = newEndDt;
  }

  const [affectedCount] = await OpenApiAuthKey.update(updateFields, {
    where: { keyId: apiId }
  });

  if (affectedCount > 0) {
    return findAuthKeyById(apiId);
  }
  return null;
}

/**
 * OpenAPI 인증 키 삭제 (관리자용)
 */
export async function deleteOpenApiAuthKey(apiId: number, deletedBy: string): Promise<OpenApiAuthKey | null> {
  const authKey = await findAuthKeyById(apiId);
  if (!authKey) {
    return null;
  }

  const success = await deleteAuthKey(apiId, deletedBy);
  if (success) {
    return findAuthKeyById(apiId);
  }
  return null;
} 