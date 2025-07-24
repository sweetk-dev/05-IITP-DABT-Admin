import { DataTypes, Model, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

export interface SysLogChangeHisAttributes {
  logId?: number;
  actorType: string;
  actorId: number;
  actionType: string;
  targetType?: string;
  targetId?: number;
  actResult: string;
  chgSummary?: object;
  errCode?: string;
  errMsg?: string;
  ipAddr?: string;
  userAgent?: string;
  actTm: Date;
  createdAt?: Date;
}

export interface SysLogChangeHisCreationAttributes extends Optional<SysLogChangeHisAttributes, 'logId' | 'targetType' | 'targetId' | 'chgSummary' | 'errCode' | 'errMsg' | 'ipAddr' | 'userAgent' | 'actTm' | 'createdAt'> {}

export class SysLogChangeHis extends Model<SysLogChangeHisAttributes, SysLogChangeHisCreationAttributes> implements SysLogChangeHisAttributes {
  public logId!: number;
  public actorType!: string;
  public actorId!: number;
  public actionType!: string;
  public targetType?: string;
  public targetId?: number;
  public actResult!: string;
  public chgSummary?: object;
  public errCode?: string;
  public errMsg?: string;
  public ipAddr?: string;
  public userAgent?: string;
  public actTm!: Date;
  public createdAt?: Date;
}

export function initSysLogChangeHis(sequelize: Sequelize) {
  SysLogChangeHis.init(
    {
      logId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        field: 'log_id',
        comment: '로그 고유 ID',
      },
      actorType: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        field: 'actor_type',
        comment: '사용자 유형 (U: 일반사용자, A: 관리자)',
        validate: {
          isIn: [['U', 'A']],
        },
      },
      actorId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'actor_id',
        comment: 'user_id or admin_id depending on actor_type',
      },
      actionType: {
        type: DataTypes.STRING(36),
        allowNull: false,
        field: 'action_type',
        comment: '변경 타입 (예: DEL_ACCOUNT, EDIT_ACCOUNT)',
      },
      targetType: {
        type: DataTypes.STRING(64),
        field: 'target_type',
        comment: '변경 대상 타입(예: USER_PROFILE, ADMIN_MENU, ROLE, etc.)',
      },
      targetId: {
        type: DataTypes.BIGINT,
        field: 'target_id',
        comment: '대상 ID',
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
      chgSummary: {
        type: DataTypes.JSONB,
        field: 'chg_summary',
        comment: '주요 변경 내용 요약, 예: {"bf": {...}, "af: {...}}',
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
      actTm: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'act_tm',
        comment: 'action 시각',
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
      tableName: 'sys_log_change_his',
      timestamps: false, // act_tm을 사용하므로 timestamps 비활성화
      indexes: [
        {
          fields: ['actor_type', 'actor_id', 'action_type'],
          name: 'idx_sys_log_change_his_act_type_id',
        },
        {
          fields: ['target_type', 'target_id'],
          name: 'idx_sys_log_change_his_tgt_type_id',
        },
      ],
    }
  );
} 