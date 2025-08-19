import { 
  UserOpenApiListReq, 
  UserOpenApiCreateReq, 
  UserOpenApiCreateRes, 
  UserOpenApiExtendReq
} from '@iitp-dabt/common';
import type { OpenApiAuthKeyAttributes } from '../../models/openApiAuthKey';
import { 
  findAuthKeysByUserId,
  createAuthKey,
  deleteAuthKey,
  updateAuthKey,
  findAuthKeyById
} from '../../repositories/openApiAuthKeyRepository';
import { appLogger } from '../../utils/logger';
import { generateAuthKey } from '../../utils/authKeyGenerator';

export class UserOpenApiService {
  /**
   * 사용자 OpenAPI 인증키 목록 조회
   */
  static async getUserOpenApiList(userId: number, params: UserOpenApiListReq): Promise<{ authKeys: any[]; total: number; }> {

    const result = await findAuthKeysByUserId(userId, {
      page: 1,
      limit: 100,
      includeInactive: false
    });

    return {
      authKeys: result.authKeys,
      total: result.total
    };
  }

  /**
   * 사용자 OpenAPI 인증키 상세 조회
   */
  static async getUserOpenApiDetail(userId: number, keyId: number): Promise<OpenApiAuthKeyAttributes> {
    const authKey = await findAuthKeyById(keyId);
    if (!authKey) {
      throw new Error('인증키를 찾을 수 없습니다.');
    }

    // 사용자 본인의 키인지 확인
    if (Number(authKey.userId) !== Number(userId)) {
      throw new Error('접근 권한이 없습니다.');
    }

    return authKey;
  }

  /**
   * 사용자 OpenAPI 인증키 생성
   */
  static async createUserOpenApi(userId: number, createData: UserOpenApiCreateReq): Promise<UserOpenApiCreateRes> {
    const { keyName, keyDesc, startDt, endDt } = createData;

    // 인증키 생성
    const authKey = generateAuthKey();
    
    const newKey = await createAuthKey({
      userId: userId,
      authKey: authKey,
      keyName: keyName,
      keyDesc: keyDesc,
      startDt: startDt ? new Date(startDt) : undefined,
      endDt: endDt ? new Date(endDt) : undefined,
      createdBy: `U:${userId}`
    });

    appLogger.info('사용자 OpenAPI 인증키 생성 성공', {
      userId: userId,
      keyId: newKey.keyId,
      keyName: keyName
    });

    return {
      keyId: newKey.keyId,
      authKey: authKey
    };
  }

  /**
   * 사용자 OpenAPI 인증키 삭제
   */
  static async deleteUserOpenApi(userId: number, keyId: number): Promise<boolean> {
    const authKey = await findAuthKeyById(keyId);
    if (!authKey) {
      throw new Error('인증키를 찾을 수 없습니다.');
    }

    // 사용자 본인의 키인지 확인
    if (Number(authKey.userId) !== Number(userId)) {
      appLogger.warn('OpenAPI 키 삭제 - 소유자 불일치', { keyId, keyOwnerId: authKey.userId, actorUserId: userId });
      throw new Error('접근 권한이 없습니다.');
    }

    const success = await deleteAuthKey(keyId, `U:${userId}`);
    if (!success) {
      throw new Error('인증키 삭제에 실패했습니다.');
    }

    appLogger.info('사용자 OpenAPI 인증키 삭제 성공', {
      userId: userId,
      keyId: keyId
    });

    return true;
  }

  /**
   * 사용자 OpenAPI 인증키 기간 연장
   */
  static async extendUserOpenApi(userId: number, keyId: number, range: { startDt: string; endDt: string }): Promise<{ newStartDt?: string; newEndDt: string; }> {

    const authKey = await findAuthKeyById(keyId);
    if (!authKey) {
      throw new Error('인증키를 찾을 수 없습니다.');
    }

    // 사용자 본인의 키인지 확인 (타입 강제 일치)
    const keyOwnerId = Number(authKey.userId);
    const actorUserId = Number(userId);
    if (keyOwnerId !== actorUserId) {
      appLogger.warn('OpenAPI 키 소유자 불일치', { keyId, keyOwnerId, actorUserId });
      throw new Error('접근 권한이 없습니다.');
    }

    const success = await updateAuthKey(keyId, { startDt: new Date(range.startDt), endDt: new Date(range.endDt), updatedBy: `U:${userId}` });
    if (!success) {
      throw new Error('인증키 기간 연장에 실패했습니다.');
    }

    const newStartDt = range.startDt ? new Date(range.startDt) : undefined;
    const newEndDt = new Date(range.endDt);

    appLogger.info('사용자 OpenAPI 인증키 기간 연장 성공', {
      userId: userId,
      keyId: keyId,
      startDt: newStartDt?.toISOString(),
      endDt: newEndDt.toISOString()
    });

    return { newStartDt: newStartDt ? newStartDt.toISOString().split('T')[0] : undefined, newEndDt: newEndDt.toISOString().split('T')[0] };
  }
} 