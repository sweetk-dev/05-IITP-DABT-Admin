import {  commonCodeRepository } from '../../repositories/sysCommonCodeRepository';
import { SysCommonCode, SysCommonCodeAttributes } from '../../models/sysCommonCode';
import { appLogger } from '../../utils/logger';
import { COMMON_CODE_GROUPS, CODE_SYS_WORK_TYPES } from '@iitp-dabt/common';
import { ErrorCode, } from '@iitp-dabt/common';
import { ResourceError, BusinessError } from '../../utils/customErrors';
import e from 'express';


export interface CodeGroupData  {
  grpId: string;
  grpNm: string;
  codeType?: 'B' | 'A' | 'S';  // ✅ 선택적 필드로 변경
  codeCount: number;
  createdAt?: string;
  updatedAt?: string;
}


export const commonCodeService = {
  /**
   * 그룹 ID로 공통 코드 목록 조회fe
   */
  async getCodesByGroupId(grpId: string): Promise<SysCommonCode[]> {
    try {
      const codes = await commonCodeRepository.findCommonCodesByGroupId(grpId);
      appLogger.info(`Retrieved ${codes.length} common codes for group: ${grpId}`);
      return codes;
    } catch (error) {
      appLogger.error(`Error retrieving common codes for group ${grpId}:`, error);
      throw new BusinessError(
        ErrorCode.DATABASE_ERROR,
        'DB 조회 중 오류가 발생했습니다.',
        { error, groupId: grpId });
    }
  },

  /**
   * 그룹 ID와 코드 ID로 특정 공통 코드 조회
   */
  async getCodeById(grpId: string, codeId: string): Promise<SysCommonCode | null> {
    try {
      const code = await commonCodeRepository.findCommonCodeById(grpId, codeId);
      if (!code) {
        appLogger.warn(`Common code not found: ${grpId}/${codeId}`);
        throw new ResourceError(
          ErrorCode.SYS_CODE_NOT_FOUND, 
          '해당 공통 코드를 찾을 수 없습니다.',
          'CommonCode',
          `${grpId}/${codeId}`
        );
      }
      return code;
    } catch (error) {
      appLogger.error(`Error retrieving common code ${grpId}/${codeId}:`, error);
      throw new BusinessError(
        ErrorCode.DATABASE_ERROR,
        'DB 조회 중 오류가 발생했습니다.',
        { error } 
        );
    }
  },


  /**
   * 코드 타입별로 공통 코드 목록 조회
   */
  async getCodesByType(codeType: 'B' | 'A' | 'S'): Promise<SysCommonCode[]> {
    try {
      const codes = await commonCodeRepository.findCommonCodesByType(codeType);
      appLogger.info(`Retrieved ${codes.length} common codes for type: ${codeType}`);
      return codes;
    } catch (error) {
      appLogger.error(`Error retrieving common codes for type ${codeType}:`, error);
      throw new BusinessError(
        ErrorCode.DATABASE_ERROR,
        'DB 조회 중 오류가 발생했습니다.',
        { error, codeType }
      );
    }
  },

  /**
   * 계층형 구조의 공통 코드 조회 (parent_code_id 기준)
   */
  async getCodesByParent(grpId: string, parentCodeId?: string): Promise<SysCommonCode[]> {
    try {
      const codes = await commonCodeRepository.findCommonCodesByParent(grpId, parentCodeId);
      appLogger.info(`Retrieved ${codes.length} common codes for group ${grpId} with parent ${parentCodeId || 'root'}`);
      return codes;
    } catch (error) {
      appLogger.error(`Error retrieving common codes for group ${grpId} with parent ${parentCodeId}:`, error);
      throw error;
    }
  },


  /**
   * 공통 코드 생성
   */
  async createCommonCode(codeData: SysCommonCodeAttributes, createdBy?: string): Promise< string> {
    try {
      await commonCodeRepository.createCommonCode({
        ...codeData,
        createdBy: createdBy || CODE_SYS_WORK_TYPES.MANUAL
      });
      appLogger.info(`Created common code: ${codeData.grpId}/${codeData.codeId}`);
      return codeData.codeId;
    } catch (error) {
      appLogger.error(`Error creating common code ${codeData.grpId}/${codeData.codeId}:`, error);
      throw new BusinessError( ErrorCode.DATABASE_ERROR,
        'DB 조회 중 오류가 발생했습니다.',
      );
    }
  },


  /**
   * 공통 코드 수정
   */
  async updateCommonCodeById(grpId: string, codeId: string, updateData: Partial<SysCommonCodeAttributes>, updatedBy?: string): Promise<number> {
    try {
      const affectedCount = await commonCodeRepository.updateCommonCode(grpId, codeId, {
        ...updateData,
        updatedBy: updatedBy || CODE_SYS_WORK_TYPES.MANUAL
      });
      appLogger.info(`Updated common code: ${grpId}/${codeId}, affected rows: ${affectedCount}`);
      return affectedCount;
    } catch (error) {
      appLogger.error(`Error updating common code ${grpId}/${codeId}:`, error);
      throw error;
    }
  },

  /**
   * 공통 코드 삭제
   */
  async deleteCommonCodeById(grpId: string, codeId: string, deletedBy?: string): Promise<number> {
    try {
      const affectedCount = await commonCodeRepository.deleteCommonCode(grpId, codeId, deletedBy);
      appLogger.info(`Deleted common code: ${grpId}/${codeId}, affected rows: ${affectedCount}`);
      return affectedCount;
    } catch (error) {
      appLogger.error(`Error deleting common code ${grpId}/${codeId}:`, error);
      throw error;
    }
  },


  /**
   * 그룹 내 공통 코드 목록 삭제
   */
  async deleteCommonCodeByGroup( grpId: string, codeIds: string[], deletedBy?: string): Promise<number> {
    try {
      const affectedCount = await commonCodeRepository.deleteCommonCodesByGroupId(grpId, codeIds, deletedBy);
      
      appLogger.info(`Deleted ${affectedCount} common codes from group, requested: ${codeIds.length}`);
      return affectedCount;
    } catch (error) {
      appLogger.error(`Error deleting common codes from group:`, error);
      throw new BusinessError(
        ErrorCode.DATABASE_ERROR,
        'DB 삭제 중 오류가 발생했습니다.',
        { error, codeIds }
      );
    }
  },


  /**
   * 관리자 역할 코드 이름 조회
   */
  async getAdminRoleCodeName(roleCodeId: string): Promise<string> {
    try {
      const code = await commonCodeRepository.findCommonCodeById(COMMON_CODE_GROUPS.SYS_ADMIN_ROLES, roleCodeId);
      return code ? code.codeNm : '관리자';
    } catch (error) {
      appLogger.error(`Error retrieving admin role name for ${roleCodeId}:`, error);
      return '관리자';
    }
  },

  /**
   * 공통 코드 그룹 목록 조회
   */
  async getCodeGroups(filters?: { search?: string; useYn?: string; sort?: string }): Promise<CodeGroupData[]> {
    try {
      appLogger.info("===== getCodeGroups :: {} -==", filters)
      const groups = await commonCodeRepository.getCommonCodeGroups(filters);
      appLogger.info(`Retrieved ${groups.length} common code groups`);
      return groups;
    } catch (error) {
      appLogger.error('Error retrieving common code groups:', error);
      throw new BusinessError(
            ErrorCode.DATABASE_ERROR,
            'DB 조회 중 오류가 발생했습니다.',
            { error }
          );
    }
  },

  /**
   * 공통 코드 그룹 생성 (코드 리스트 포함)
   */
  async createCodeGroup(groupData: {
    grpId: string;
    grpNm: string;
    codeType: 'B' | 'A' | 'S';
    codeDes?: string;
    codes: Array<{
      codeId: string;
      codeNm: string;
      parentCodeId?: string;
      codeLvl?: number;
      sortOrder?: number;
      codeDes?: string;
    }>;
  }, createdBy?: string): Promise<void> {
    try {
      // 코드 데이터 배열 준비 (일괄 삽입용)
      const codeDataList: SysCommonCodeAttributes[] = groupData.codes.map(code => ({
        grpId: groupData.grpId,
        grpNm: groupData.grpNm,
        codeId: code.codeId,
        codeNm: code.codeNm,
        codeType: groupData.codeType,
        parentCodeId: code.parentCodeId,
        codeLvl: code.codeLvl,
        sortOrder: code.sortOrder,
        codeDes: code.codeDes,
        useYn: 'Y',
        delYn: 'N',
        createdBy: createdBy || CODE_SYS_WORK_TYPES.MANUAL
      }));

      // 일괄 삽입으로 모든 코드를 한 번에 생성
      await commonCodeRepository.createCommonCodes(codeDataList);

      appLogger.info(`Created common code group: ${groupData.grpId} with ${groupData.codes.length} codes (bulk insert)`);
    } catch (error) {
      appLogger.error(`Error creating common code group ${groupData.grpId}:`, error);
      throw new BusinessError(
        ErrorCode.DATABASE_ERROR,
        'DB 생성 중 오류가 발생했습니다.',
        { error, groupId: groupData.grpId }
      );
    }
  },



  /**
   * 공통 코드 그룹 수정
   */
  async updateCodeGroup(grpId: string, updateData: { grpNm: string }, updatedBy?: string): Promise<number> {
    try {
      const affectedCount = await commonCodeRepository.updateCommonCodeWithGroupByGroup(
        grpId, 
        updateData.grpNm,  
        updatedBy || CODE_SYS_WORK_TYPES.MANUAL
      );
      appLogger.info(`Updated group common code: ${grpId}, affected rows: ${affectedCount}`);
      return affectedCount;
    } catch (error) {
      appLogger.error(`Error updating common code group ${grpId}:`, error);
      throw new BusinessError(
        ErrorCode.DATABASE_ERROR,
        'DB 수정 중 오류가 발생했습니다.',
        { error, groupId: grpId }
      );
    }
  },


  /**
   * 공통 코드 그룹 삭제 (관리자용)
   */
  async deleteCodeGroups( grpIds: string[], deletedBy?: string ) : Promise<number> {

    try {
      const affectedCount = await commonCodeRepository.deleteCommonCodesByGroupIdes(grpIds, deletedBy);
      return affectedCount;
    } catch (error) {
      appLogger.error(`Error delete common code group ${grpIds}:`, error);
      throw new BusinessError(
        ErrorCode.DATABASE_ERROR,
        'DB 수정 중 오류가 발생했습니다.',
        { error, groupId: grpIds }
      );
    }
  },


} as const;



