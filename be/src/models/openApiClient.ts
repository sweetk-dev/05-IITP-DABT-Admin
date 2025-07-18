import { DataTypes, Model, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

export interface OpenApiClientAttributes {
  apiCliId: number;
  clientId: string;
  password: string;
  clientName: string;
  status: string;
  delYn: string;
  latestKeyCreatedAt?: Date;
  latestLoginAt?: Date;
  description?: string;
  note?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdBy: string;
  updatedBy?: string;
  deletedBy?: string;
}

export type OpenApiClientCreationAttributes = Optional<OpenApiClientAttributes, 'apiCliId' | 'latestKeyCreatedAt' | 'latestLoginAt' | 'description' | 'note' | 'updatedAt' | 'deletedAt' | 'updatedBy' | 'deletedBy'>;

export class OpenApiClient extends Model<OpenApiClientAttributes, OpenApiClientCreationAttributes> implements OpenApiClientAttributes {
  public apiCliId!: number;
  public clientId!: string;
  public password!: string;
  public clientName!: string;
  public status!: string;
  public delYn!: string;
  public latestKeyCreatedAt?: Date;
  public latestLoginAt?: Date;
  public description?: string;
  public note?: string;
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

export function initOpenApiClient(sequelize: Sequelize) {
  OpenApiClient.init(
    {
      apiCliId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'api_cli_id',
        comment: 'system id, 고유 식별자 (자동 증가)',
      },
      clientId: {
        type: DataTypes.STRING(40),
        allowNull: false,
        field: 'client_id',
        comment: 'client login id',
      },
      password: {
        type: DataTypes.STRING(40),
        allowNull: false,
        comment: 'client login password (encryption)',
      },
      clientName: {
        type: DataTypes.STRING(90),
        allowNull: false,
        field: 'client_name',
        comment: 'client name',
      },
      status: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'A',
        comment: '데이터 상태, "data_status" comm code 참조',
      },
      delYn: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'N',
        field: 'del_yn',
        comment: '삭제여부 (Y: 삭제)',
      },
      latestKeyCreatedAt: {
        type: DataTypes.DATE,
        field: 'latest_key_created_at',
        comment: '마지막으로 KEY 발급받은 시간',
      },
      latestLoginAt: {
        type: DataTypes.DATE,
        field: 'latest_login_at',
        comment: 'latest login time',
      },
      description: {
        type: DataTypes.STRING(600),
        comment: 'client 설명',
      },
      note: {
        type: DataTypes.STRING(600),
        comment: '비고',
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
      tableName: 'open_api_client',
      schema: 'public',
      timestamps: false,
      comment: 'IITP OPENAPI Client 정보 테이블 (Client -> IITP)',
    }
  );
  return OpenApiClient;
} 