import { DataTypes, Model, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

export interface SysQnaAttributes {
  qnaId?: number;
  userId: number;
  qnaType: string;
  title: string;
  content: string;
  secretYn: string;
  delYn?: 'Y' | 'N';
  writerName?: string;
  answerContent?: string;
  answeredBy?: string;
  answeredAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface SysQnaCreationAttributes extends Optional<SysQnaAttributes, 'qnaId' | 'secretYn' | 'writerName' | 'answerContent' | 'answeredBy' | 'answeredAt' | 'updatedAt' | 'deletedAt' | 'createdBy' | 'updatedBy' | 'deletedBy'> {}

export class SysQna extends Model<SysQnaAttributes, SysQnaCreationAttributes> implements SysQnaAttributes {
  public qnaId!: number;
  public userId!: number;
  public qnaType!: string;
  public title!: string;
  public content!: string;
  public secretYn!: string;
  public delYn?: 'Y' | 'N';
  public writerName?: string;
  public answerContent?: string;
  public answeredBy?: string;
  public answeredAt?: Date;
  public createdAt!: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;
  public createdBy?: string;
  public updatedBy?: string;
  public deletedBy?: string;
}

export function initSysQna(sequelize: Sequelize) {
  SysQna.init(
    {
      qnaId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        field: 'qna_id',
        comment: '질문 고유 식별자',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        comment: '작성자 system ID',
      },
      qnaType: {
        type: DataTypes.STRING(32),
        allowNull: false,
        field: 'qna_type',
        comment: '질문 유형, "qna_type" comm code 참조',
      },
      title: {
        type: DataTypes.STRING(600),
        allowNull: false,
        comment: '질문 제목',
      },
      content: {
        type: DataTypes.STRING(6000),
        allowNull: false,
        comment: '질문 내용',
      },
      secretYn: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'N',
        field: 'secret_yn',
        comment: '비공개 여부 (Y: 비공개, N: 공개)',
      },
      delYn: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'N',
        field: 'del_yn',
        comment: '삭제여부 (Y: 삭제)',
      },
      writerName: {
        type: DataTypes.STRING(90),
        field: 'writer_name',
        comment: '작성자 이름 (선택 입력)',
      },
      answerContent: {
        type: DataTypes.STRING(6000),
        field: 'answer_content',
        comment: '답변 내용',
      },
      answeredBy: {
        type: DataTypes.STRING(40),
        field: 'answered_by',
        comment: '답변자 ID 또는 이름',
      },
      answeredAt: {
        type: DataTypes.DATE,
        field: 'answered_at',
        comment: '답변 일시',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
        comment: '질문 등록일시',
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
        comment: '마지막 수정일시',
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at',
        comment: '삭제 일시',
      },
      createdBy: {
        type: DataTypes.STRING(40),
        field: 'created_by',
        comment: '생성자',
      },
      updatedBy: {
        type: DataTypes.STRING(40),
        field: 'updated_by',
        comment: '수정자',
      },
      deletedBy: {
        type: DataTypes.STRING(40),
        field: 'deleted_by',
        comment: '삭제자',
      },
    },
    {
      sequelize,
      tableName: 'sys_qna',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      paranoid: true, // 논리 삭제 사용
      indexes: [
        {
          fields: ['qna_type', 'secret_yn'],
          name: 'idx_sys_qna_type_screct',
        },
      ],
    }
  );
} 