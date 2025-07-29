import { Model, DataTypes, Sequelize } from 'sequelize';
import { Sequelize as SequelizeType } from 'sequelize';

export interface SysNoticeAttributes {
  noticeId: number;
  title: string;
  content: string;
  noticeType: 'G' | 'S' | 'E';
  pinnedYn: 'Y' | 'N';
  publicYn: 'Y' | 'N';
  postedAt: Date;
  startDt?: Date;
  endDt?: Date;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SysNoticeCreationAttributes extends Omit<SysNoticeAttributes, 'noticeId' | 'createdAt' | 'updatedAt'> {
  noticeId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SysNotice extends Model<SysNoticeAttributes, SysNoticeCreationAttributes> implements SysNoticeAttributes {
  public noticeId!: number;
  public title!: string;
  public content!: string;
  public noticeType!: 'G' | 'S' | 'E';
  public pinnedYn!: 'Y' | 'N';
  public publicYn!: 'Y' | 'N';
  public postedAt!: Date;
  public startDt?: Date;
  public endDt?: Date;
  public createdBy?: string;
  public updatedBy?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initSysNotice(sequelize: SequelizeType): void {
  SysNotice.init(
    {
      noticeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'notice_id'
      },
      title: {
        type: DataTypes.STRING(300),
        allowNull: false,
        field: 'title'
      },
      content: {
        type: DataTypes.STRING(6000),
        allowNull: false,
        field: 'content'
      },
      noticeType: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'G',
        field: 'notice_type',
        validate: {
          isIn: [['G', 'S', 'E']]
        }
      },
      pinnedYn: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'N',
        field: 'pinned_yn',
        validate: {
          isIn: [['Y', 'N']]
        }
      },
      publicYn: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'Y',
        field: 'public_yn',
        validate: {
          isIn: [['Y', 'N']]
        }
      },
      postedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'posted_at'
      },
      startDt: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'start_dt'
      },
      endDt: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'end_dt'
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'created_by'
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'updated_by'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'updated_at'
      }
    },
    {
      sequelize,
      tableName: 'sys_notice',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
}

export default SysNotice; 