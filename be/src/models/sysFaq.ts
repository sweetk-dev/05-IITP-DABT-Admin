import { DataTypes, Model, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

export interface SysFaqAttributes {
  faqId?: number;
  faqType: string;
  question: string;
  answer: string;
  sortOrder: number;
  hitCnt: number;
  useYn: string;
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface SysFaqCreationAttributes extends Optional<SysFaqAttributes, 'faqId' | 'sortOrder' | 'hitCnt' | 'useYn' | 'updatedAt' | 'createdBy' | 'updatedBy'> {}

export class SysFaq extends Model<SysFaqAttributes, SysFaqCreationAttributes> implements SysFaqAttributes {
  public faqId!: number;
  public faqType!: string;
  public question!: string;
  public answer!: string;
  public sortOrder!: number;
  public hitCnt!: number;
  public useYn!: string;
  public createdAt!: Date;
  public updatedAt?: Date;
  public createdBy?: string;
  public updatedBy?: string;
}

export function initSysFaq(sequelize: Sequelize) {
  SysFaq.init(
    {
      faqId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'faq_id',
        comment: 'system id, 고유 식별자 (자동 증가)',
      },
      faqType: {
        type: DataTypes.STRING(12),
        allowNull: false,
        field: 'faq_type',
        comment: 'FAQ 유형, "faq_type" comm code 참조',
      },
      question: {
        type: DataTypes.STRING(600),
        allowNull: false,
        comment: '질문',
      },
      answer: {
        type: DataTypes.STRING(3000),
        allowNull: false,
        comment: '답변',
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'sort_order',
        comment: '정렬 우선순위',
      },
      hitCnt: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'hit_cnt',
        comment: '조회수',
      },
      useYn: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'Y',
        field: 'use_yn',
        comment: '사용 여부 (Y/N)',
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
      createdBy: {
        type: DataTypes.STRING(40),
        field: 'created_by',
        comment: '데이터 생성자',
      },
      updatedBy: {
        type: DataTypes.STRING(40),
        field: 'updated_by',
        comment: '데이터 수정자',
      },
    },
    {
      sequelize,
      tableName: 'sys_faq',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          fields: ['faq_type', 'sort_order', 'use_yn'],
          name: 'idx_sys_faq_type_sort',
        },
      ],
    }
  );
} 