import SysNoticeRepository from '../../repositories/sysNoticeRepository';

export interface AdminNoticeListParams {
  page: number;
  limit: number;
  noticeType?: 'G' | 'S' | 'E';
  publicYn?: 'Y' | 'N';
  pinnedYn?: 'Y' | 'N';
  search?: string;
}

export const getNoticeListAdmin = async (params: AdminNoticeListParams) => {
  const { page, limit, noticeType, publicYn } = params;
  const result = await SysNoticeRepository.getNoticeList({
    page,
    limit,
    noticeType,
    publicOnly: publicYn === 'Y',
    includeExpired: true,
    isAdmin: true
  });
  return result;
};

export const getNoticeDetailAdmin = async (noticeId: number) => {
  return SysNoticeRepository.getNoticeById(noticeId);
};

export interface AdminNoticeCreateData {
  title: string;
  content: string;
  noticeType: 'G' | 'S' | 'E';
  pinnedYn?: 'Y' | 'N';
  publicYn?: 'Y' | 'N';
  startDt?: string;
  endDt?: string;
}

export const createNoticeAdmin = async (data: AdminNoticeCreateData, adminId: number) => {
  const created = await SysNoticeRepository.createNotice({
    title: data.title,
    content: data.content,
    noticeType: data.noticeType,
    pinnedYn: data.pinnedYn ?? 'N',
    publicYn: data.publicYn ?? 'Y',
    postedAt: new Date(),
    startDt: data.startDt ? new Date(data.startDt) : undefined,
    endDt: data.endDt ? new Date(data.endDt) : undefined,
    createdBy: adminId.toString()
  } as any);
  return created;
};

export interface AdminNoticeUpdateData {
  title?: string;
  content?: string;
  noticeType?: 'G' | 'S' | 'E';
  pinnedYn?: 'Y' | 'N';
  publicYn?: 'Y' | 'N';
  startDt?: string;
  endDt?: string;
}

export const updateNoticeAdmin = async (noticeId: number, data: AdminNoticeUpdateData, adminId: number) => {
  return SysNoticeRepository.updateNotice(noticeId, {
    ...data,
    startDt: data.startDt ? new Date(data.startDt) : undefined,
    endDt: data.endDt ? new Date(data.endDt) : undefined,
    updatedBy: adminId.toString()
  } as any);
};

export const deleteNoticeAdmin = async (noticeId: number) => {
  return SysNoticeRepository.deleteNotice(noticeId);
};


