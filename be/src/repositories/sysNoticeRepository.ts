import { Op } from 'sequelize';
import SysNotice, { SysNoticeAttributes, SysNoticeCreationAttributes } from '../models/sysNotice';

export interface NoticeListParams {
  page?: number;
  limit?: number;
  noticeType?: 'G' | 'S' | 'E';
  publicOnly?: boolean;
  includeExpired?: boolean;
  isAdmin?: boolean; // 관리자 여부 추가
}

export interface NoticeListResult {
  notices: SysNoticeAttributes[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class SysNoticeRepository {
  /**
   * 공지사항 목록 조회
   */
  static async getNoticeList(params: NoticeListParams = {}): Promise<NoticeListResult> {
    const {
      page = 1,
      limit = 10,
      noticeType,
      publicOnly = true,
      includeExpired = false,
      isAdmin = false
    } = params;

    const offset = (page - 1) * limit;
    const where: any = {};

    // 공지 유형 필터
    if (noticeType) {
      where.noticeType = noticeType;
    }

    // 공개 여부 필터 - 관리자가 아닌 경우 공개된 것만, 관리자는 모든 것
    if (!isAdmin) {
      where.publicYn = 'Y';
    } else if (publicOnly) {
      // 관리자이지만 publicOnly가 true인 경우 공개된 것만
      where.publicYn = 'Y';
    }
    // 관리자이고 publicOnly가 false인 경우 모든 공지사항 (공개/비공개 모두)

    // 만료일 필터
    if (!includeExpired) {
      where[Op.or] = [
        { endDt: { [Op.is]: null } },
        { endDt: { [Op.gte]: new Date() } }
      ];
    }

    const { count, rows } = await SysNotice.findAndCountAll({
      where,
      order: [
        ['pinnedYn', 'DESC'], // 상단 고정 우선
        ['postedAt', 'DESC']  // 최신순
      ],
      limit,
      offset
    });

    return {
      notices: rows.map(row => row.toJSON()),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  }

  /**
   * 공지사항 상세 조회
   */
  static async getNoticeById(noticeId: number): Promise<SysNoticeAttributes | null> {
    const notice = await SysNotice.findByPk(noticeId);
    return notice ? notice.toJSON() : null;
  }

  /**
   * 공지사항 생성
   */
  static async createNotice(data: SysNoticeCreationAttributes): Promise<SysNoticeAttributes> {
    const notice = await SysNotice.create(data);
    return notice;
  }

  /**
   * 공지사항 수정
   */
  static async updateNotice(noticeId: number, data: Partial<SysNoticeCreationAttributes>): Promise<SysNoticeAttributes | null> {
    const notice = await SysNotice.findByPk(noticeId);
    if (!notice) {
      return null;
    }

    await notice.update({
      ...data,
      updatedAt: new Date()
    });

    return notice.toJSON();
  }

  /**
   * 공지사항 삭제
   */
  static async deleteNotice(noticeId: number): Promise<boolean> {
    const notice = await SysNotice.findByPk(noticeId);
    if (!notice) {
      return false;
    }

    await notice.destroy();
    return true;
  }



 /**
  * FAQ 다중 삭제
  */
  static async deleteNoticeList(noticeIds: number[]): Promise<number> {
    const deletedCount = await SysNotice.destroy({  where: { noticeId: { [Op.in]: noticeIds } } });
    return deletedCount ? deletedCount : 0;  
  }



  /**
   * 상단 고정 공지사항 조회 (홈 화면용)
   */
  static async getPinnedNotices(limit: number = 5, isAdmin: boolean = false): Promise<SysNoticeAttributes[]> {
    const where: any = {
      pinnedYn: 'Y',
      [Op.or]: [
        { endDt: { [Op.is]: null } },
        { endDt: { [Op.gte]: new Date() } }
      ]
    };

    // 관리자가 아닌 경우 공개된 것만
    if (!isAdmin) {
      where.publicYn = 'Y';
    }

    const notices = await SysNotice.findAll({
      where,
      order: [['postedAt', 'DESC']],
      limit
    });

    return notices.map(notice => notice.toJSON());
  }

  /**
   * 최신 공지사항 조회 (홈 화면용)
   */
  static async getRecentNotices(limit: number = 5, isAdmin: boolean = false): Promise<SysNoticeAttributes[]> {
    const where: any = {
      [Op.or]: [
        { endDt: { [Op.is]: null } },
        { endDt: { [Op.gte]: new Date() } }
      ]
    };

    // 관리자가 아닌 경우 공개된 것만
    if (!isAdmin) {
      where.publicYn = 'Y';
    }

    const notices = await SysNotice.findAll({
      where,
      order: [['postedAt', 'DESC']],
      limit
    });

    return notices.map(notice => notice.toJSON());
  }
}

export default SysNoticeRepository; 