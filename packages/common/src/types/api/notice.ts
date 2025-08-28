// Notice 관련 DTO 정의
import { PaginationReq, PaginationRes } from './api';

// 사용자용 공지사항 아이템 (제한된 정보만)
export interface UserNoticeItem {
  noticeId: number;
  title: string;
  content: string;
  noticeType: 'G' | 'S' | 'E';
  pinnedYn: 'Y' | 'N';
  startDt?: string;
  endDt?: string;
  postedAt: string;
}


export interface UserNoticeListItem {
  noticeId: number;
  title: string;
  noticeType: 'G' | 'S' | 'E';
  pinnedYn: 'Y' | 'N';
  startDt?: string;
  endDt?: string;
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


export interface AdminNoticeListItem {
  noticeId: number;
  title: string;
  noticeType: 'G' | 'S' | 'E';
  pinnedYn: 'Y' | 'N';
  publicYn: 'Y' | 'N';
  postedAt: string;
  startDt?: string;
  endDt?: string;
  createdAt: string;
}


// 공지사항 목록 조회 (사용자용)
export interface UserNoticeListQuery extends PaginationReq {
  noticeType?: 'G' | 'S' | 'E';
  publicOnly?: boolean;
  includeExpired?: boolean;
}

export type UserNoticeListRes = PaginationRes<UserNoticeListItem>;

export interface UserNoticeDetailParams {
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
export interface AdminNoticeListQuery extends PaginationReq {
  noticeType?: 'G' | 'S' | 'E';
  publicYn?: 'Y' | 'N';
  pinnedYn?: 'Y' | 'N';
  search?: string;
}

export type AdminNoticeListRes = PaginationRes<AdminNoticeListItem>;


// 공지사항 목록 일괄 삭제 (관리자용)
export interface AdminNoticeListDeleteReq {
  noticeIds: number[];  
}
// AdminNoticeListDeleteRes는 ApiResponse<void> 사용

export interface AdminNoticeDetailParams {
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

// 업데이트 응답은 ApiResponse<void> 사용

// 공지사항 삭제 (관리자용)
// 삭제 응답은 ApiResponse<void> 사용

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