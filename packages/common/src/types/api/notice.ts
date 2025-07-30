// Notice 관련 DTO 정의
import { PaginationReq, PaginationRes } from './api';

// 사용자용 공지사항 아이템 (제한된 정보만)
export interface UserNoticeItem {
  noticeId: number;
  title: string;
  content: string;
  noticeType: 'G' | 'S' | 'E';
  pinnedYn: 'Y' | 'N';
  postedAt: string;
}

// 관리자용 공지사항 아이템 (전체 정보)
export interface AdminNoticeItem {
  noticeId: number;
  title: string;
  content: string;
  noticeType: 'G' | 'S' | 'E';
  pinnedYn: 'Y' | 'N';
  publicYn: 'Y' | 'N';
  postedAt: string;
  startDt?: string;
  endDt?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

// 공지사항 목록 조회 (사용자용)
export interface UserNoticeListReq extends PaginationReq {
  noticeType?: 'G' | 'S' | 'E';
  publicOnly?: boolean;
  includeExpired?: boolean;
}

export interface UserNoticeListRes extends PaginationRes<UserNoticeItem> {
  notices: UserNoticeItem[];
}

export interface UserNoticeDetailReq {
  noticeId: string;
}

export interface UserNoticeDetailRes {
  notice: UserNoticeItem;
}

// 홈 화면용 공지사항 조회 (사용자용)
export interface UserNoticeHomeRes {
  notices: UserNoticeItem[];
}

// 공지사항 목록 조회 (관리자용)
export interface AdminNoticeListReq extends PaginationReq {
  noticeType?: 'G' | 'S' | 'E';
  publicYn?: 'Y' | 'N';
  pinnedYn?: 'Y' | 'N';
  search?: string;
}

export interface AdminNoticeListRes extends PaginationRes<AdminNoticeItem> {
  notices: AdminNoticeItem[];
}

export interface AdminNoticeDetailReq {
  noticeId: string;
}

export interface AdminNoticeDetailRes {
  notice: AdminNoticeItem;
}

// 공지사항 생성 (관리자용)
export interface AdminNoticeCreateReq {
  title: string;
  content: string;
  noticeType: 'G' | 'S' | 'E';
  pinnedYn?: 'Y' | 'N';
  publicYn?: 'Y' | 'N';
  startDt?: string;
  endDt?: string;
  createdBy?: string;
}

export interface AdminNoticeCreateRes {
  noticeId: number;
  message: string;
}

// 공지사항 수정 (관리자용)
export interface AdminNoticeUpdateReq {
  title?: string;
  content?: string;
  noticeType?: 'G' | 'S' | 'E';
  pinnedYn?: 'Y' | 'N';
  publicYn?: 'Y' | 'N';
  startDt?: string;
  endDt?: string;
  updatedBy?: string;
}

export interface AdminNoticeUpdateRes {
  success: boolean;
  message: string;
}

// 공지사항 삭제 (관리자용)
export interface AdminNoticeDeleteRes {
  success: boolean;
  message: string;
}

// 공지사항 통계 (관리자용)
export interface AdminNoticeStatsRes {
  totalNotices: number;
  activeNotices: number;
  pinnedNotices: number;
  recentNotices: Array<{
    noticeId: number;
    title: string;
    createdAt: string;
  }>;
} 