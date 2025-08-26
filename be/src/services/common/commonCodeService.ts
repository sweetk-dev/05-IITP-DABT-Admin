import { 
  findCommonCodesByGroupId, 
  findCommonCodeById, 
  findCommonCodesByType,
  findCommonCodesByParent,
  createCommonCode as createCommonCodeRepo,
  updateCommonCode,
  deleteCommonCode,
  getCommonCodeStats
} from '../../repositories/sysCommonCodeRepository';
import { SysCommonCode, SysCommonCodeAttributes } from '../../models/sysCommonCode';
import { appLogger } from '../../utils/logger';
import { COMMON_CODE_GROUPS, CODE_SYS_WORK_TYPES } from '@iitp-dabt/common';

/**
 * 그룹 ID로 공통 코드 목록 조회
 */
export async function getCommonCodesByGroupId(grpId: string): Promise<SysCommonCode[]> {
  try {
    const codes = await findCommonCodesByGroupId(grpId);
    appLogger.info(`Retrieved ${codes.length} common codes for group: ${grpId}`);
    return codes;
  } catch (error) {
    appLogger.error(`Error retrieving common codes for group ${grpId}:`, error);
    throw error;
  }
}

/**
 * 그룹 ID와 코드 ID로 특정 공통 코드 조회
 */
export async function getCommonCodeById(grpId: string, codeId: string): Promise<SysCommonCode | null> {
  try {
    const code = await findCommonCodeById(grpId, codeId);
    if (code) {
      appLogger.info(`Retrieved common code: ${grpId}/${codeId}`);
    } else {
      appLogger.warn(`Common code not found: ${grpId}/${codeId}`);
    }
    return code;
  } catch (error) {
    appLogger.error(`Error retrieving common code ${grpId}/${codeId}:`, error);
    throw error;
  }
}

/**
 * 코드 타입별로 공통 코드 목록 조회
 */
export async function getCommonCodesByType(codeType: 'B' | 'A' | 'S'): Promise<SysCommonCode[]> {
  try {
    const codes = await findCommonCodesByType(codeType);
    appLogger.info(`Retrieved ${codes.length} common codes for type: ${codeType}`);
    return codes;
  } catch (error) {
    appLogger.error(`Error retrieving common codes for type ${codeType}:`, error);
    throw error;
  }
}

/**
 * 계층형 구조의 공통 코드 조회 (parent_code_id 기준)
 */
export async function getCommonCodesByParent(grpId: string, parentCodeId?: string): Promise<SysCommonCode[]> {
  try {
    const codes = await findCommonCodesByParent(grpId, parentCodeId);
    appLogger.info(`Retrieved ${codes.length} common codes for group ${grpId} with parent ${parentCodeId || 'root'}`);
    return codes;
  } catch (error) {
    appLogger.error(`Error retrieving common codes for group ${grpId} with parent ${parentCodeId}:`, error);
    throw error;
  }
}

/**
 * 공통 코드 생성
 */
export async function createCommonCode(codeData: SysCommonCodeAttributes, createdBy?: string): Promise<SysCommonCode> {
  try {
    const newCode = await createCommonCodeRepo({
      ...codeData,
      createdBy: createdBy || CODE_SYS_WORK_TYPES.MANUAL
    });
    appLogger.info(`Created common code: ${codeData.grpId}/${codeData.codeId}`);
    return newCode;
  } catch (error) {
    appLogger.error(`Error creating common code ${codeData.grpId}/${codeData.codeId}:`, error);
    throw error;
  }
}

/**
 * 공통 코드 수정
 */
export async function updateCommonCodeById(grpId: string, codeId: string, updateData: Partial<SysCommonCodeAttributes>, updatedBy?: string): Promise<number> {
  try {
    const affectedCount = await updateCommonCode(grpId, codeId, {
      ...updateData,
      updatedBy: updatedBy || CODE_SYS_WORK_TYPES.MANUAL
    });
    appLogger.info(`Updated common code: ${grpId}/${codeId}, affected rows: ${affectedCount}`);
    return affectedCount;
  } catch (error) {
    appLogger.error(`Error updating common code ${grpId}/${codeId}:`, error);
    throw error;
  }
}

/**
 * 공통 코드 삭제
 */
export async function deleteCommonCodeById(grpId: string, codeId: string, deletedBy?: string): Promise<number> {
  try {
    const affectedCount = await deleteCommonCode(grpId, codeId, deletedBy || CODE_SYS_WORK_TYPES.MANUAL);
    appLogger.info(`Deleted common code: ${grpId}/${codeId}, affected rows: ${affectedCount}`);
    return affectedCount;
  } catch (error) {
    appLogger.error(`Error deleting common code ${grpId}/${codeId}:`, error);
    throw error;
  }
}


/**
 * 관리자 역할 코드 이름 조회
 */
export async function getAdminRoleCodeName(roleCodeId: string): Promise<string> {
  try {
    const code = await findCommonCodeById(COMMON_CODE_GROUPS.SYS_ADMIN_ROLES, roleCodeId);
    return code ? code.codeNm : '관리자';
  } catch (error) {
    appLogger.error(`Error retrieving admin role name for ${roleCodeId}:`, error);
    return '관리자';
  }
} 