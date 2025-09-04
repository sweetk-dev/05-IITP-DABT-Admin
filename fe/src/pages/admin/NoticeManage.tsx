import { useState, useEffect } from 'react';
import { Box, Stack, Chip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon } from '@mui/icons-material';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ListScaffold from '../../components/common/ListScaffold';
import ListItemCard from '../../components/common/ListItemCard';
import ThemedButton from '../../components/common/ThemedButton';
import ErrorAlert from '../../components/ErrorAlert';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { hasContentEditPermission } from '../../utils/auth';
import { getAdminRole } from '../../store/user';
import { getAdminNoticeList, deleteAdminNoticeList } from '../../api/notice';
import { useDataFetching } from '../../hooks/useDataFetching';
import { usePagination } from '../../hooks/usePagination';
import { PAGINATION } from '../../constants/pagination';
import { getNoticeTypeLabel, getNoticeTypeColor, NOTICE_TYPE_FILTER_OPTIONS } from '../../constants/noticeTypes';
import type { NoticeType } from '../../constants/noticeTypes';
import type { AdminNoticeListItem, AdminNoticeListQuery } from '@iitp-dabt/common';

export default function NoticeManage() {
  const navigate = useNavigate();
  const adminRole = getAdminRole();

  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | NoticeType>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Y' | 'N'>('all');

  // 에러 상태
  const [error, setError] = useState<string | null>(null);

  // 페이지네이션
  const pagination = usePagination({ initialLimit: PAGINATION.DEFAULT_PAGE_SIZE });

  // API 데이터 페칭
  const { data: noticeData, isError, refetch, status } = useDataFetching({
    fetchFunction: () => getAdminNoticeList({
      page: pagination.currentPage,
      limit: pagination.pageSize,
      ...(searchTerm && { searchTerm }),
      ...(filterType !== 'all' && { noticeType: filterType }),
      ...(filterStatus !== 'all' && { publicYn: filterStatus })
    } as AdminNoticeListQuery),
    dependencies: [pagination.currentPage, pagination.pageSize, searchTerm, filterType, filterStatus]
  });

  // error 상태 추출 - useDataFetching의 state에서 error 추출
  const apiError = isError && status === 'error' ? (noticeData as any)?.error : undefined;

  // 필터 변경 시 첫 페이지로 이동하며 refetch
  useEffect(() => {
    pagination.handlePageChange(1);
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterStatus]);

  const handleNoticeClick = (noticeId: number) => {
    navigate(ROUTES.ADMIN.NOTICES.DETAIL.replace(':id', String(noticeId)));
  };

  const handleCreateNotice = () => {
    navigate(ROUTES.ADMIN.NOTICES.CREATE);
  };

  const finalError = error || apiError;
  const totalCount = noticeData?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pagination.pageSize)));

  return (
    <Box id="admin-notice-manage-page">
      <AdminPageHeader />

      {finalError && <ErrorAlert error={finalError} onClose={() => setError(null)} />}

      <Box sx={{ p: SPACING.LARGE }}>
        <ListScaffold
          title="공지사항 관리"
          loading={status === 'loading'}
          emptyText={noticeData?.items && noticeData.items.length > 0 ? undefined : '등록된 공지사항이 없습니다.'}
          search={{
            value: searchTerm,
            onChange: (v) => setSearchTerm(v),
            placeholder: '공지사항 제목으로 검색...'
          }}
          actionsRight={
            <Box sx={{ display: 'flex', gap: 1 }}>
              {hasContentEditPermission(adminRole) && (
                <ThemedButton
                  variant="primary"
                  startIcon={<AddIcon />}
                  onClick={handleCreateNotice}
                >
                  공지사항 추가
                </ThemedButton>
              )}
            </Box>
          }
          filters={[
            {
              label: '타입',
              value: filterType,
              options: NOTICE_TYPE_FILTER_OPTIONS,
              onChange: (value: string) => setFilterType(value as 'all' | NoticeType)
            },
            {
              label: '공개여부',
              value: filterStatus,
              options: [
                { value: 'all', label: '전체' },
                { value: 'Y', label: '공개' },
                { value: 'N', label: '비공개' }
              ],
              onChange: (value: string) => setFilterStatus(value as 'all' | 'Y' | 'N')
            }
          ]}
          total={totalCount}
          pagination={{
            page: pagination.currentPage,
            totalPages,
            onPageChange: (p: number) => pagination.handlePageChange(p),
            pageSize: pagination.pageSize,
            onPageSizeChange: (s: number) => pagination.handlePageSizeChange(s)
          }}
          selectable={{
            enabled: true,
            items: noticeData?.items || [],
            getId: (notice) => notice.noticeId,
            onSelectionChange: () => {},
            renderCheckbox: true,
            deleteConfig: {
              apiFunction: async (ids: (number | string)[]) => {
                await deleteAdminNoticeList(ids);
              },
              confirmTitle: '공지사항 삭제 확인',
              confirmMessage: '선택된 공지사항들을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.',
              successMessage: '선택된 공지사항들이 삭제되었습니다.',
              errorMessage: '공지사항 삭제 중 오류가 발생했습니다.',
              onDeleteSuccess: () => {
                refetch();
              }
            }
          }}
        >
          <Stack id="notice-list-stack" spacing={SPACING.MEDIUM}>
            {(noticeData?.items || []).map((notice: AdminNoticeListItem) => (
              <ListItemCard 
                key={notice.noticeId} 
                onClick={() => handleNoticeClick(notice.noticeId)}
              >
                <Box id={`notice-item-header-${notice.noticeId}`} sx={{ display: 'flex', alignItems: 'center', mb: SPACING.SMALL }}>
                  <Chip 
                    id={`notice-item-type-${notice.noticeId}`}
                    label={getNoticeTypeLabel(notice.noticeType)} 
                    color={getNoticeTypeColor(notice.noticeType)} 
                    size="small"
                    sx={{ mr: SPACING.MEDIUM }} 
                  />
                  <Chip 
                    id={`notice-item-status-${notice.noticeId}`}
                    label={notice.publicYn === 'Y' ? '공개' : '비공개'} 
                    color={notice.publicYn === 'Y' ? 'success' : 'default'} 
                    size="small"
                    sx={{ mr: SPACING.MEDIUM }} 
                  />
                  <Typography 
                    id={`notice-item-date-${notice.noticeId}`} 
                    variant="caption" 
                    sx={{ color: 'text.secondary', ml: 'auto' }}
                  >
                    {new Date(notice.postedAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography 
                  id={`notice-item-title-${notice.noticeId}`} 
                  variant="subtitle1" 
                  sx={{ color: 'text.primary', fontWeight: 600, mb: SPACING.SMALL }}
                >
                  {notice.title}
                </Typography>
                {notice.startDt && (
                  <Typography 
                    id={`notice-item-period-${notice.noticeId}`} 
                    variant="caption" 
                    sx={{ color: 'text.secondary', display: 'block' }}
                  >
                    게시기간: {new Date(notice.startDt).toLocaleDateString()} 
                    {notice.endDt && ` ~ ${new Date(notice.endDt).toLocaleDateString()}`}
                  </Typography>
                )}
                <Typography 
                  id={`notice-item-created-${notice.noticeId}`} 
                  variant="caption" 
                  sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
                >
                  작성일: {new Date(notice.createdAt).toLocaleDateString()}
                </Typography>
              </ListItemCard>
            ))}
          </Stack>
        </ListScaffold>
      </Box>
    </Box>
  );
}