import { DataTypes, Model, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

export interface OpenApiUserAttributes {
  userId?: number;
  loginId: string;
  password: string;
  userName: string;
  status: string;
  delYn: string;
  latestKeyCreatedAt?: Date;
  latestLoginAt?: Date;
  affiliation?: string;
  note?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdBy: string;
  updatedBy?: string;
  deletedBy?: string;
}

export type OpenApiUserCreationAttributes = Optional<OpenApiUserAttributes, 
  'userId' |
  'latestKeyCreatedAt' | 
  'latestLoginAt' | 
  'affiliation' |
  'note' | 
  'createdAt' |
  'updatedAt' | 
  'deletedAt' | 
  'updatedBy' | 
  'deletedBy'
>;

export class OpenApiUser extends Model<OpenApiUserAttributes, OpenApiUserCreationAttributes> implements OpenApiUserAttributes {
  public userId!: number;
  public loginId!: string;
  public password!: string;
  public userName!: string;
  public status!: string;
  public delYn!: string;
  public latestKeyCreatedAt?: Date;
  public latestLoginAt?: Date;
  public affiliation?: string;
  public note?: string;
  public createdAt!: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;
  public createdBy!: string;
  public updatedBy?: string;
  public deletedBy?: string;

  // static associate(models: any) {
  //   // define association here
  //   OpenApiUser.hasMany(models.OpenApiAuthKey, {
  //     foreignKey: 'userId',
  //     as: 'authKeys'
  //   });
  // }
}

export function initOpenApiUser(sequelize: Sequelize) {
  OpenApiUser.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'user_id',
        comment: 'system id, 고유 식별자 (자동 증가)',
      },
      loginId: {
        type: DataTypes.STRING(128),
        allowNull: false,
        field: 'login_id',
        comment: 'user login id(e-mail)',
        unique: true,
      },
      password: {
        type: DataTypes.CHAR(60),
        allowNull: false,
        comment: 'user login password (bcrypt Hashing)',
      },
      userName: {
        type: DataTypes.STRING(90),
        allowNull: false,
        field: 'user_name',
        comment: 'user name',
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
      affiliation: {
        type: DataTypes.STRING(90),
        field: 'affiliation',
        comment: 'client 소속',
      },
      note: {
        type: DataTypes.STRING(600),
        field: 'note',
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
      tableName: 'open_api_user',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      paranoid: true, // 논리 삭제 사용
      indexes: [
        {
          unique: true,
          fields: ['login_id'],
          name: 'uidx_open_api_user_login',
        },
        {
          fields: ['user_name'],
          name: 'idx_open_api_user_name',
        },
      ],
    }
  );
} 