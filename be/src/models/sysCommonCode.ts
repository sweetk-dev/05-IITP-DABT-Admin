import { Model, DataTypes, Sequelize } from 'sequelize';

export interface SysCommonCodeAttributes {
  grpId: string;
  grpNm: string;
  codeId: string;
  codeNm: string;
  parentGrpId?: string;
  parentCodeId?: string;
  codeType: 'B' | 'A' | 'S';
  codeLvl?: number;
  sortOrder?: number;
  useYn?: 'Y' | 'N';
  delYn?: 'Y' | 'N';
  codeDes?: string;
  memo?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface SysCommonCodeCreationAttributes extends SysCommonCodeAttributes {}

export class SysCommonCode extends Model<SysCommonCodeAttributes, SysCommonCodeCreationAttributes> {
  public grpId!: string;
  public grpNm!: string;
  public codeId!: string;
  public codeNm!: string;
  public parentGrpId?: string;
  public parentCodeId?: string;
  public codeType!: 'B' | 'A' | 'S';
  public codeLvl?: number;
  public sortOrder?: number;
  public useYn?: 'Y' | 'N';
  public delYn?: 'Y' | 'N';
  public codeDes?: string;
  public memo?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;
  public createdBy?: string;
  public updatedBy?: string;
  public deletedBy?: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date;
}

export function initSysCommonCode(sequelize: Sequelize): void {
  SysCommonCode.init(
    {
      grpId: {
        type: DataTypes.STRING(44),
        allowNull: false,
        primaryKey: true,
        field: 'grp_id',
        comment: '코드 그룹 ID (예: GENDER, REGION)',
      },
      grpNm: {
        type: DataTypes.STRING(80),
        allowNull: false,
        field: 'grp_nm',
        comment: '코드 그룹 이름 (예: 성별, 지역)',
      },
      codeId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        primaryKey: true,
        field: 'code_id',
        comment: '코드 ID (예: M, F, 1000)',
      },
      codeNm: {
        type: DataTypes.STRING(64),
        allowNull: false,
        field: 'code_nm',
        comment: '코드 이름 (예: 남성, 여성, 컴퓨터)',
      },
      parentGrpId: {
        type: DataTypes.STRING(40),
        allowNull: true,
        field: 'parent_grp_id',
        comment: '상위 그룹 ID (optional)',
      },
      parentCodeId: {
        type: DataTypes.STRING(40),
        allowNull: true,
        field: 'parent_code_id',
        comment: '상위 코드 ID (optional) (동일 그룹 내 계층형 코드 구조)',
      },
      codeType: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        field: 'code_type',
        comment: '코드 타입: B(서비스용), A(관리자서비스용) S(시스템용)',
        validate: {
          isIn: [['B', 'A', 'S']],
        },
      },
      codeLvl: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
        field: 'code_lvl',
        comment: '코드 계층 레벨',
      },
      sortOrder: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        defaultValue: 0,
        field: 'sort_order',
        comment: '정렬 순서 (UI 정렬 등에 사용)',
      },
      useYn: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        defaultValue: 'Y',
        field: 'use_yn',
        comment: '사용 여부 (Y: 사용, N: 미사용)',
        validate: {
          isIn: [['Y', 'N']],
        },
      },
      delYn: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        defaultValue: 'N',
        field: 'del_yn',
        comment: '삭제 여부: N(정상), Y(삭제)',
        validate: {
          isIn: [['Y', 'N']],
        },
      },
      codeDes: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'code_des',
        comment: '코드 설명',
      },
      memo: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'memo',
        comment: '메모: 버전정등 기타 기록 정보',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created_at',
        comment: '생성 시각 (UTC)',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'updated_at',
        comment: '수정 시각 (UTC)',
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
        comment: '삭제 일시 (논리 삭제 시 기록)',
      },
      createdBy: {
        type: DataTypes.STRING(40),
        allowNull: true,
        field: 'created_by',
        comment: '데이터 생성자 (SYS-BACH, SYS-MANUAL, BY-USER, admin name), "sys_work_type" comm code 참조',
      },
      updatedBy: {
        type: DataTypes.STRING(40),
        allowNull: true,
        field: 'updated_by',
        comment: '수정자 ID',
      },
      deletedBy: {
        type: DataTypes.STRING(40),
        allowNull: true,
        field: 'deleted_by',
        comment: '삭제 처리자 ID 또는 시스템',
      },
    },
    {
      sequelize,
      tableName: 'sys_common_code',
      timestamps: true,
      paranoid: true, // 논리 삭제 지원
      underscored: true,
      indexes: [
        {
          name: 'idx_sys_common_code_grp_parent',
          fields: ['grp_id', 'parent_code_id'],
        },
        {
          name: 'idx_sys_common_code_type_grp_sort',
          fields: ['code_type', 'grp_id', 'code_lvl', 'sort_order'],
        },
      ],
    }
  );
} 