import { DataTypes, Model, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

export interface OpenApiClientKeyAttributes {
  id?: number;
  apiCliId: number;
  apiKey: string;
  activeYn: string;
  delYn: string;
  keyActiveAt?: Date;
  latestAccAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdBy: string;
  updatedBy?: string;
  deletedBy?: string;
}

export type OpenApiClientKeyCreationAttributes = Optional<OpenApiClientKeyAttributes, 'keyActiveAt' | 'latestAccAt' | 'updatedAt' | 'deletedAt' | 'updatedBy' | 'deletedBy'>;

export class OpenApiClientKey extends Model<OpenApiClientKeyAttributes, OpenApiClientKeyCreationAttributes> implements OpenApiClientKeyAttributes {
  public id!: number;
  public apiCliId!: number;
  public apiKey!: string;
  public activeYn!: string;
  public delYn!: string;
  public keyActiveAt?: Date;
  public latestAccAt?: Date;
  public createdAt!: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;
  public createdBy!: string;
  public updatedBy?: string;
  public deletedBy?: string;

  // static associate(models: any) {
  //   // define association here
  // }
}

export function initOpenApiClientKey(sequelize: Sequelize) {
  OpenApiClientKey.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: 'system id, 고유 식별자 (자동 증가)',
      },
      apiCliId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'api_cli_id',
        comment: 'api client sys id. open_api_client.api_cli_id',
      },
      apiKey: {
        type: DataTypes.STRING(60),
        allowNull: false,
        field: 'api_key',
        comment: 'client api auth key',
      },
      activeYn: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'Y',
        field: 'active_yn',
        comment: '활성화 여부 (Y:활성화)',
      },
      delYn: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'N',
        field: 'del_yn',
        comment: '삭제여부 (Y: 삭제)',
      },
      keyActiveAt: {
        type: DataTypes.DATE,
        field: 'key_active_at',
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
        comment: '데이터 생성자 (SYS-BACH, SYS-MANUAL, user id), "sys_work_type" comm code 참조',
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
      tableName: 'open_api_client_key',
      schema: 'public',
      timestamps: false,
      comment: 'IITP OPENAPI Client Key 정보 테이블',
    }
  );
  return OpenApiClientKey;
} 