import { OpenApiAuthKey, OpenApiAuthKeyCreationAttributes } from '../models/openApiAuthKey';
import { Op, literal, Transaction } from 'sequelize';
// [추가 2026-10] 키 삭제 시 여러 UPDATE 를 하나의 트랜잭션으로 묶기 위해 Sequelize 인스턴스를 사용한다.
import sequelize from '../models';

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
    order: [['created_at', 'DESC']]
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
    },
    order: [['created_at', 'DESC']]
  });
}

/**
 * 인증 키 정보 업데이트
 */
export async function updateAuthKey(keyId: number, updateData: {
  // [추가 2026-10] 관리자 수정 화면(OpenApiEdit)은 keyName/keyDesc 를 함께 보낸다.
  //  관리자 서비스(adminOpenApiService.updateOpenApi)가 이 함수를 쓰는데, 기존에는 두 필드를
  //  받지 않아 이름/설명 수정이 성공 응답과 함께 조용히 버려졌다. 선택 필드로 추가한다.
  keyName?: string;
  keyDesc?: string;
  startDt?: Date;
  endDt?: Date;
  activeYn?: string;
  keyRejectReason?: string;
  updatedBy: string;
}): Promise<boolean> {
  const updateFields: any = {
    updatedBy: updateData.updatedBy
  };

  if (updateData.keyName !== undefined) {
    updateFields.keyName = updateData.keyName;
  }

  if (updateData.keyDesc !== undefined) {
    updateFields.keyDesc = updateData.keyDesc;
  }

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
 *
 * [수정 2026-10] 삭제 시 deleted_at / active_yn 을 함께 기록한다.
 *  - 문제: 기존에는 del_yn='Y', deleted_by 만 기록하고 deleted_at 은 NULL, active_yn 은 'Y' 그대로 두었다.
 *    이 모델은 paranoid(논리 삭제) 모델이라 Sequelize 와 외부 Open API 서버(Java)는
 *    "deleted_at IS NULL" 을 '살아 있는 키'의 기준으로 삼는다. 그 결과 사용자/관리자가 삭제한 키가
 *    외부 Open API 인증에서는 계속 유효하게 남을 수 있었다(사용자 화면: DELETE /api/user/openapi/keys/:keyId,
 *    관리자 화면: 단건/다건 삭제 모두 이 경로).
 *  - 조치: 한 트랜잭션 안에서
 *      ① del_yn='Y', active_yn='N', deleted_by=삭제 주체 를 명시적 UPDATE 로 기록하고
 *      ② deleted_at=현재시각 을 Sequelize paranoid 표준 경로인 destroy() 로 기록한다.
 *    어느 쪽이 실패하든 함께 롤백되므로 "del_yn 만 Y" 같은 반쪽 상태가 남지 않는다.
 *  - deleted_at 을 ①의 UPDATE 값에 직접 넣지 않는 이유:
 *    모델 옵션이 deletedAt: 'deleted_at' 이라 Sequelize 내부 속성명이 'deletedAt' 이 아니라 'deleted_at' 이다.
 *    update({ deletedAt: ... }) 로 넘기면 모델 속성 목록에 없는 키로 보고 조용히 버린다
 *    (sequelize 6.37 lib/model.js update() 의 fields 교집합 처리). 그래서 destroy() 를 쓴다.
 *  - 관리자 목록/통계·사용자 목록은 기존과 같이 del_yn='N' 으로 거르므로 삭제된 키의 노출 범위는 변하지 않는다.
 *  - 반환값: 실제로 삭제 처리된 키가 있으면 true (이미 삭제됐거나 없는 키면 false — 기존과 동일).
 */
export async function deleteAuthKey(keyId: number, deletedBy: string): Promise<boolean> {
  return sequelize.transaction(async (transaction) => {
    // ① 삭제 표시 + 비활성화 + 삭제 주체 기록 (아직 삭제되지 않은 키만 대상)
    const [affectedRows] = await OpenApiAuthKey.update({
      delYn: 'Y',
      activeYn: 'N',
      deletedBy
    }, {
      where: {
        keyId,
        delYn: 'N'
      },
      transaction
    });

    if (affectedRows === 0) {
      return false;
    }

    // ② paranoid 논리 삭제: deleted_at = 현재시각 (Sequelize 가 deleted_at IS NULL 인 행만 갱신)
    await OpenApiAuthKey.destroy({
      where: { keyId },
      transaction
    });

    return true;
  });
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
  const order = options.order || [['created_at', 'DESC']];

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


/**
 * OpenAPI 인증 키 다중 삭제 (관리자용)
 *
 * [수정 2026-10] 단건 삭제(deleteAuthKey)와 같은 이유로 del_yn 외에 active_yn='N', deleted_at 도 기록한다.
 *  - ① UPDATE: del_yn='Y', active_yn='N', deleted_by (아직 삭제되지 않은 키만)
 *  - ② destroy(): 요청 ID 중 del_yn='Y' 인 키에 deleted_at 기록 (paranoid 라 deleted_at IS NULL 인 행만 갱신)
 *    → 과거 버그로 del_yn='Y' 인데 deleted_at 이 비어 있던 키가 요청 ID 에 섞여 있으면 그 키도 함께 정리된다.
 *  - 반환값은 기존과 같이 ①에서 새로 삭제 처리된 건수(0 이면 서비스가 NOT_FOUND 처리).
 */
export async function deleteApiAKeyList(apiIds: number[], deletedBy: string): Promise<number> {
  return sequelize.transaction(async (transaction) => {
    const [affectedRows] = await OpenApiAuthKey.update(
      { delYn: 'Y', activeYn: 'N', deletedBy },
      {
        where: {
          keyId: {
            [Op.in]: apiIds
          },
          delYn: 'N'
        },
        transaction
      }
    );

    if (affectedRows > 0) {
      await OpenApiAuthKey.destroy({
        where: {
          keyId: {
            [Op.in]: apiIds
          },
          delYn: 'Y'
        },
        transaction
      });
    }

    return affectedRows;
  });
}


/**
 * 사용자(들)의 활성 인증 키 일괄 비활성화
 *
 * [추가 2026-10] 관리자가 Open API 사용자를 비활성(I)/정지(S)로 바꾸거나 삭제할 때,
 *  그 사용자의 키가 active_yn='Y' 로 남아 외부 Open API 인증에 계속 쓰이지 않도록 active_yn='N' 으로 내린다.
 *  - 호출 측(userAccountService)의 사용자 UPDATE 와 같은 트랜잭션으로 묶을 수 있도록 transaction 을 받는다.
 *  - 키 자체를 삭제하지는 않는다(del_yn/deleted_at 유지). 사용자를 다시 활성(A)으로 돌려도
 *    키는 자동으로 다시 켜지지 않으며, 관리자가 키 수정 화면에서 개별적으로 활성화해야 한다.
 *  - active_at 은 건드리지 않으므로 통계상 '비활성'으로 집계된다(대기와 구분).
 * @returns 비활성화된 키 개수
 */
export async function deactivateAuthKeysByUserIds(
  userIds: number[],
  updatedBy: string,
  transaction?: Transaction
): Promise<number> {
  if (!userIds || userIds.length === 0) {
    return 0;
  }

  const [affectedRows] = await OpenApiAuthKey.update(
    { activeYn: 'N', updatedBy },
    {
      where: {
        userId: { [Op.in]: userIds },
        delYn: 'N',
        activeYn: 'Y'
      },
      transaction
    }
  );
  return affectedRows;
}
