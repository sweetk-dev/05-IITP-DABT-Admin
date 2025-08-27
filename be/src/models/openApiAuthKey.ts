import { DataTypes, Model, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

export interface OpenApiAuthKeyAttributes {
  keyId?: number;
  userId: number;
  authKey: string;
  activeYn: string;
  startDt?: Date;
  endDt?: Date;
  delYn: string;
  keyName: string;
  keyDesc: string;
  keyRejectReason?: string;
  activeAt?: Date;
  latestAccAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdBy: string;
  updatedBy?: string;
  deletedBy?: string;
}

export type OpenApiAuthKeyCreationAttributes = Optional<OpenApiAuthKeyAttributes, 
  'keyId' |
  'startDt' |
  'endDt' |
  'keyRejectReason' |
  'activeAt' | 
  'latestAccAt' | 
  'createdAt' |
  'updatedAt' | 
  'deletedAt' | 
  'updatedBy' | 
  'deletedBy'
>;

export class OpenApiAuthKey extends Model<OpenApiAuthKeyAttributes, OpenApiAuthKeyCreationAttributes> implements OpenApiAuthKeyAttributes {
  public keyId!: number;
  public userId!: number;
  public authKey!: string;
  public activeYn!: string;
  public startDt?: Date;
  public endDt?: Date;
  public delYn!: string;
  public keyName!: string;
  public keyDesc!: string;
  public keyRejectReason?: string;
  public activeAt?: Date;
  public latestAccAt?: Date;
  public createdAt!: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;
  public createdBy!: string;
  public updatedBy?: string;
  public deletedBy?: string;

  // static associate(models: any) {
  //   // define association here
  //   OpenApiAuthKey.belongsTo(models.OpenApiUser, {
  //     foreignKey: 'userId',
  //     as: 'user'
  //   });
  // }
}

export function initOpenApiAuthKey(sequelize: Sequelize) {
  OpenApiAuthKey.init(
    {
      keyId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'key_id',
        comment: 'system id, 고유 식별자 (자동 증가)',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        comment: 'api user sys id. open_api_user.user_id',
      },
      authKey: {
        type: DataTypes.STRING(60),
        allowNull: false,
        field: 'auth_key',
        comment: 'api auth key',
        unique: true,
      },
      activeYn: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'Y',
        field: 'active_yn',
        comment: '활성화 여부 (Y:활성화)',
      },
      startDt: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'start_dt',
        comment: 'api auth key 유효 시작일',
      },
      endDt: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'end_dt',
        comment: 'api auth key 유효 종료일',
      },
      delYn: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'N',
        field: 'del_yn',
        comment: '삭제여부 (Y: 삭제)',
      },
      keyName: {
        type: DataTypes.STRING(120),
        allowNull: false,
        field: 'key_name',
        comment: 'api key name',
      },
      keyDesc: {
        type: DataTypes.STRING(600),
        allowNull: false,
        field: 'key_desc',
        comment: 'api key 사용 목적',
      },
      keyRejectReason: {
        type: DataTypes.STRING(1000),
        allowNull: true,
        field: 'key_reject_reason',
        comment: 'API 키 거절 사유',
      },
      activeAt: {
        type: DataTypes.DATE,
        field: 'active_at',
        comment: 'key 활성화된 일시',
      },
      latestAccAt: {
        type: DataTypes.DATE,
        field: 'latest_acc_at',
        comment: 'latest access time',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
        comment: '레코드 생성 시각',
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
        comment: '레코드 수정 시각',
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at',
        comment: '삭제 일시 (논리 삭제 시 기록)',
      },
      createdBy: {
        type: DataTypes.STRING(40),
        allowNull: false,
        field: 'created_by',
        comment: '데이터 생성자 (SYS-BACH, SYS-MANUAL, BY-USER, admin name), "sys_work_type" comm code 참조',
      },
      updatedBy: {
        type: DataTypes.STRING(40),
        field: 'updated_by',
        comment: '데이터 수정자',
      },
      deletedBy: {
        type: DataTypes.STRING(40),
        field: 'deleted_by',
        comment: '데이터 삭제자',
      },
    },
    {
      sequelize,
      tableName: 'open_api_auth_key',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      paranoid: true, // 논리 삭제 사용
      indexes: [
        {
          unique: true,
          fields: ['auth_key'],
          name: 'uidx_open_api_auth_key_authkey',
        },
        {
          fields: ['user_id', 'start_dt', 'end_dt'],
          name: 'idx_open_api_auth_key_user_date',
        },
        {
          fields: ['user_id', 'del_yn', 'active_yn'],
          name: 'idx_open_api_auth_key_user_status',
        },
        {
          fields: ['user_id', 'del_yn', 'active_yn', 'start_dt', 'end_dt'],
          name: 'idx_open_api_auth_key_user_status_date',
        },
      ],
    }
  );
} 