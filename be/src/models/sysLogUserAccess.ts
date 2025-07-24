import { DataTypes, Model, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

export interface SysLogUserAccessAttributes {
  logId?: number;
  userId: number;
  userType: string;
  logType: string;
  actResult: string;
  errCode?: string;
  errMsg?: string;
  ipAddr?: string;
  userAgent?: string;
  accessTm: Date;
  createdAt?: Date;
}

export interface SysLogUserAccessCreationAttributes extends Optional<SysLogUserAccessAttributes, 'logId' | 'errCode' | 'errMsg' | 'ipAddr' | 'userAgent' | 'accessTm' | 'createdAt'> {}

export class SysLogUserAccess extends Model<SysLogUserAccessAttributes, SysLogUserAccessCreationAttributes> implements SysLogUserAccessAttributes {
  public logId!: number;
  public userId!: number;
  public userType!: string;
  public logType!: string;
  public actResult!: string;
  public errCode?: string;
  public errMsg?: string;
  public ipAddr?: string;
  public userAgent?: string;
  public accessTm!: Date;
  public createdAt?: Date;
}

export function initSysLogUserAccess(sequelize: Sequelize) {
  SysLogUserAccess.init(
    {
      logId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        field: 'log_id',
        comment: '로그 고유 ID',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        comment: '사용자 ID',
      },
      userType: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        field: 'user_type',
        comment: '사용자 유형 (U: 일반사용자, A: 관리자)',
        validate: {
          isIn: [['U', 'A']],
        },
      },
      logType: {
        type: DataTypes.STRING(8),
        allowNull: false,
        field: 'log_type',
        comment: '수행한 액션 종류 (LOGIN, LOGOUT)',
        validate: {
          isIn: [['LOGIN', 'LOGOUT']],
        },
      },
      actResult: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        field: 'act_result',
        comment: '액션 결과 (S: 성공, F: 실패)',
        validate: {
          isIn: [['S', 'F']],
        },
      },
      errCode: {
        type: DataTypes.STRING(10),
        field: 'err_code',
        comment: '실패 시 에러 코드',
      },
      errMsg: {
        type: DataTypes.STRING(200),
        field: 'err_msg',
        comment: '실패 시 에러 메시지',
      },
      ipAddr: {
        type: DataTypes.STRING(50),
        field: 'ip_addr',
        comment: '요청 IP 주소',
      },
      userAgent: {
        type: DataTypes.STRING(512),
        field: 'user_agent',
        comment: '사용자 디바이스 정보 (브라우저 등)',
      },
      accessTm: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'access_tm',
        comment: 'access 시각',
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
        comment: '레코드 생성 시각',
      },
    },
    {
      sequelize,
      tableName: 'sys_log_user_access',
      timestamps: false, // access_tm을 사용하므로 timestamps 비활성화
      indexes: [
        {
          fields: ['user_id', 'user_type', 'log_type'],
          name: 'idx_sys_log_user_access_user_type',
        },
      ],
    }
  );
} 