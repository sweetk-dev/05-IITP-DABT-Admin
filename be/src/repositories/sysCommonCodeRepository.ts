import { SysCommonCode, SysCommonCodeAttributes } from '../models/sysCommonCode';
import { Op } from 'sequelize';
import { toIsoString } from '../utils/timeUtils';

import { CodeGroupData } from '../services/common/commonCodeService';





export const commonCodeRepository = {

  /**
   * 그룹 ID로 공통 코드 목록 조회
   */
  async findCommonCodesByGroupId(grpId: string): Promise<SysCommonCode[]> {
    return SysCommonCode.findAll({
      where: {
        grpId,
        useYn: 'Y',
        delYn: 'N'
      },
      order: [
        ['codeLvl', 'ASC'],
        ['sortOrder', 'ASC'],
        ['codeId', 'ASC']
      ]
    });
  },

  /**
   * 그룹 ID와 코드 ID로 특정 공통 코드 조회
   */
  async findCommonCodeById(grpId: string, codeId: string): Promise<SysCommonCode | null> {
    return SysCommonCode.findOne({
      where: {
        grpId,
        codeId,
        useYn: 'Y',
        delYn: 'N'
      }
    });
  },

  /**
   * 코드 타입별로 공통 코드 목록 조회
   */
  async findCommonCodesByType(codeType: 'B' | 'A' | 'S'): Promise<SysCommonCode[]> {
    return SysCommonCode.findAll({
      where: {
        codeType,
        useYn: 'Y',
        delYn: 'N'
      },
      order: [
        ['grpId', 'ASC'],
        ['codeLvl', 'ASC'],
        ['sortOrder', 'ASC']
      ]
    });
  },

  /**
   * 계층형 구조의 공통 코드 조회 (parent_code_id 기준)
   */
  async findCommonCodesByParent(grpId: string, parentCodeId?: string): Promise<SysCommonCode[]> {
    const whereCondition: any = {
      grpId,
      useYn: 'Y',
      delYn: 'N'
    };

    if (parentCodeId) {
      whereCondition.parentCodeId = parentCodeId;
    } else {
      whereCondition.parentCodeId = { [Op.is]: null };
    }

    return SysCommonCode.findAll({
      where: whereCondition,
      order: [
        ['codeLvl', 'ASC'],
        ['sortOrder', 'ASC'],
        ['codeId', 'ASC']
      ]
    });
  },

  /**
   * 공통 코드 생성
   */
  async createCommonCode(codeData: SysCommonCodeAttributes): Promise<SysCommonCode> {
    return SysCommonCode.create(codeData);
  },

  /**
   * 공통 코드 일괄 생성
   */
  async createCommonCodes(codeDataList: SysCommonCodeAttributes[]): Promise<SysCommonCode[]> {
    return SysCommonCode.bulkCreate(codeDataList);
  },

  /**
   * 공통 코드 수정
   */
  async updateCommonCode(grpId: string, codeId: string, updateData: Partial<SysCommonCodeAttributes>): Promise<number> {
    const [affectedCount] = await SysCommonCode.update(updateData, {
      where: {
        grpId,
        codeId,
        delYn: 'N'
      }
    });
    return affectedCount;
  },

  /**
   * 공통 코드 논리 삭제
   */
  async deleteCommonCode(grpId: string, codeId: string, deletedBy?: string): Promise<number> {
    const [affectedCount] = await SysCommonCode.update({
      delYn: 'Y',
      deletedBy,
      deletedAt: new Date()
    }, {
      where: {
        grpId,
        codeId,
        delYn: 'N'
      }
    });
    return affectedCount;
  },


  async deleteCommonCodesByGroupId(grpId: string, codeIds: string[], deletedBy?: string) : Promise<number> {
    const [affectedCount] = await SysCommonCode.update({
      delYn: 'Y',
      deletedBy,
      deletedAt: new Date()
    }, {
      where: {
        grpId,
        codeId: {
          [Op.in]: codeIds
        },
      }
    });
    return affectedCount;
  },


  /**
   * 그룹별 공통 코드 통계 조회
   */
  async getCommonCodeStats(): Promise<Array<{ grpId: string; grpNm: string; count: number }>> {
    const result = await SysCommonCode.findAll({
      attributes: [
        'grpId',
        'grpNm',
        [SysCommonCode.sequelize!.fn('COUNT', SysCommonCode.sequelize!.col('codeId')), 'count']
      ],
      where: {
        useYn: 'Y',
        delYn: 'N'
      },
      group: ['grpId', 'grpNm'],
      order: [['grpId', 'ASC']]
    });

    return result.map(item => ({
      grpId: item.grpId,
      grpNm: item.grpNm,
      count: parseInt(item.get('count') as string)
    }));
  },


  /**
   * 공통 코드 그룹 목록 조회
   */
  async getCommonCodeGroups(): Promise<CodeGroupData[]> {
    const result = await SysCommonCode.findAll({
      attributes: [
        'grpId',
        'grpNm',
        [SysCommonCode.sequelize!.fn('COUNT', SysCommonCode.sequelize!.col('codeId')), 'codeCount'],
        [SysCommonCode.sequelize!.fn('MIN', SysCommonCode.sequelize!.col('createdAt')), 'createdAt'],
        [SysCommonCode.sequelize!.fn('MAX', SysCommonCode.sequelize!.col('updatedAt')), 'updatedAt']
      ],
      where: {
        delYn: 'N'
      },
      group: ['grpId', 'grpNm'],
      order: [['grpId', 'ASC']]
    });

    return result.map(item => ({
      grpId: item.grpId,
      grpNm: item.grpNm,
      codeCount: parseInt(item.get('codeCount') as string),
      createdAt: item.get('createdAt') ? toIsoString(item.get('createdAt') as Date) : undefined,  
      updatedAt: item.get('updatedAt') ? toIsoString(item.get('updatedAt') as Date) : undefined
    }));
  },

  /**
   * 그룹 ID로 모든 코드의 그룹명 일괄 수정
   */
  async updateCommonCodeWithGroupByGroup(grpId: string, grpNm: string, updateBy?: string): Promise<number> {
    const [affectedCount] = await SysCommonCode.update({
      grpNm,
      updatedBy: updateBy,
      updatedAt: new Date()
    }, {
      where: { 
        grpId,
        delYn: 'N'  // 삭제되지 않은 코드만 수정
      }
    });

    return affectedCount;
  },


  /**
   * 그룹 ID 리스트로 모든 코드 일관  delete 상태 수정
   */
  async deleteCommonCodesByGroupIdes( grpIds: string[], deletedBy?:string ):  Promise<number> {
    const [affectedCount] = await SysCommonCode.update({
      delYn: 'Y',
      deletedBy,
      deletedAt: new Date()
    }, {
      where: {
        grpId : { [Op.in] : grpIds }
      }
    });
    return affectedCount;
  }




} as const;
