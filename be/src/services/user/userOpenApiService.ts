import { 
  UserOpenApiListReq, 
  UserOpenApiCreateReq, 
  UserOpenApiCreateRes, 
  UserOpenApiExtendReq
} from '@iitp-dabt/common';
import { 
  findAuthKeysByUserId,
  createAuthKey,
  deleteAuthKey,
  extendAuthKeyPeriod,
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
  static async getUserOpenApiDetail(userId: number, keyId: number): Promise<import('../models/openApiAuthKey').OpenApiAuthKeyAttributes> {
    const authKey = await findAuthKeyById(keyId);
    if (!authKey) {
      throw new Error('인증키를 찾을 수 없습니다.');
    }

    // 사용자 본인의 키인지 확인
    if (authKey.userId !== userId) {
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
      createdBy: 'BY-USER'
    });

    appLogger.info('사용자 OpenAPI 인증키 생성 성공', {
      userId: userId,
      keyId: newKey.keyId,
      keyName: keyName
    });

    return {
      keyId: newKey.keyId,
      authKey: authKey,
      message: '인증키가 성공적으로 생성되었습니다.'
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
    if (authKey.userId !== userId) {
      throw new Error('접근 권한이 없습니다.');
    }

    const success = await deleteAuthKey(keyId, 'BY-USER');
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
  static async extendUserOpenApi(userId: number, keyId: number, extensionDays: number): Promise<{ newEndDt: string; }> {

    const authKey = await findAuthKeyById(keyId);
    if (!authKey) {
      throw new Error('인증키를 찾을 수 없습니다.');
    }

    // 사용자 본인의 키인지 확인
    if (authKey.userId !== userId) {
      throw new Error('접근 권한이 없습니다.');
    }

    const success = await extendAuthKeyPeriod(keyId, extensionDays, 'BY-USER');
    if (!success) {
      throw new Error('인증키 기간 연장에 실패했습니다.');
    }

    // 새로운 종료일 계산
    const currentEndDt = authKey.endDt ? new Date(authKey.endDt) : new Date();
    const newEndDt = new Date(currentEndDt.getTime() + extensionDays * 24 * 60 * 60 * 1000);

    appLogger.info('사용자 OpenAPI 인증키 기간 연장 성공', {
      userId: userId,
      keyId: keyId,
      extensionDays: extensionDays
    });

    return { newEndDt: newEndDt.toISOString().split('T')[0] };
  }
} 