import { useEffect } from 'react';
import { Box, Typography, Stack, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ListScaffold from '../../components/common/ListScaffold';
import { PAGINATION } from '../../constants/pagination';
import { SPACING } from '../../constants/spacing';
import { useDataFetching } from '../../hooks/useDataFetching';
import { usePagination } from '../../hooks/usePagination';
import { getUserNoticeList } from '../../api';
import ListItemCard from '../../components/common/ListItemCard';
import { useQuerySync } from '../../hooks/useQuerySync';
import { useErrorHandler, type UseErrorHandlerResult } from '../../hooks/useErrorHandler';

interface NoticeItem { noticeId: number; title: string; content: string; noticeType: string; postedAt: string; pinnedYn?: 'Y' | 'N'; }

export default function NoticeList() {
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const colors = {
    primary: muiTheme.palette.primary.main,
    border: muiTheme.palette.divider,
    text: muiTheme.palette.text.primary,
    textSecondary: muiTheme.palette.text.secondary,
    background: muiTheme.palette.background.default,
  } as const;

  const pagination = usePagination({ initialLimit: PAGINATION.DEFAULT_PAGE_SIZE });
  const { query, setQuery } = useQuerySync({ page: 1, limit: pagination.pageSize, type: '' });
  const errorHandler: UseErrorHandlerResult = useErrorHandler();

  // sync pagination with query using effects to avoid setState during render
  useEffect(() => {
    const qp = Number(query.page) || 1;
    if (qp !== pagination.currentPage) pagination.handlePageChange(qp);
    const ql = Number(query.limit) || PAGINATION.DEFAULT_PAGE_SIZE;
    if (ql !== pagination.pageSize) pagination.handlePageSizeChange(ql);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, query.limit]);

  const { data: noticeData, isLoading, isEmpty, isError } = useDataFetching({
    fetchFunction: () => getUserNoticeList({ page: pagination.currentPage, limit: pagination.pageSize, noticeType: (query.type as any) || undefined }),
    dependencies: [pagination.currentPage, pagination.pageSize, query.type],
    autoFetch: true,
    onError: (msg) => errorHandler.setInlineError(msg)
  });

  useEffect(() => { if (noticeData) pagination.handlePageSizeChange(noticeData.limit); }, [noticeData]);

  const handlePageChange = (page: number) => { pagination.handlePageChange(page); setQuery({ page }, { replace: true }); };
  const handleNoticeClick = (noticeId: number) => { navigate(`/notice/${noticeId}`); };
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const getNoticeTypeLabel = (type: string) => (type === 'G' ? '일반' : type === 'S' ? '시스템' : type === 'E' ? '긴급' : '기타');
  const getNoticeTypeColor = (type: string) => (type === 'S' ? 'info' : type === 'E' ? 'error' : 'default');

  return (
    <Box id="notice-list-page" sx={{ minHeight: '100vh', background: colors.background, py: SPACING.LARGE }}>
      <Box id="notice-list-container" sx={{ mx: 'auto', px: { xs: SPACING.MEDIUM, md: SPACING.LARGE } }}>
        {errorHandler.InlineError}

        <ListScaffold
          title="공지사항"
          onBack={() => navigate('/')}
          filters={[{
            label: '유형',
            value: query.type || '',
            options: [
              { value: 'G', label: '일반' },
              { value: 'S', label: '시스템' },
              { value: 'E', label: '긴급' }
            ],
            onChange: (v: string) => setQuery({ type: v || '', page: 1 })
          }]}
          total={noticeData?.total}
          loading={isLoading}
          errorText={isError ? '공지사항을 불러오는 중 오류가 발생했습니다.' : ''}
          emptyText={isEmpty ? '등록된 공지사항이 없습니다.' : ''}
          pagination={{ page: pagination.currentPage, totalPages: noticeData?.totalPages || 0, onPageChange: handlePageChange, pageSize: pagination.pageSize, onPageSizeChange: (size)=>{ pagination.handlePageSizeChange(size); setQuery({ limit: size, page: 1 }); } }}
          wrapInCard={false}
        >
          <Stack id="notice-list-stack" spacing={SPACING.MEDIUM}>
            {noticeData?.items.map((notice: NoticeItem) => (
              <ListItemCard id={`notice-item-${notice.noticeId}`} key={notice.noticeId} onClick={() => handleNoticeClick(notice.noticeId)}>
                <Box id={`notice-item-header-${notice.noticeId}`} sx={{ display: 'flex', alignItems: 'center', mb: SPACING.SMALL }}>
                  <Chip label={getNoticeTypeLabel(notice.noticeType)} color={getNoticeTypeColor(notice.noticeType) as any} size="small" sx={{ mr: SPACING.MEDIUM }} />
                  {notice.pinnedYn === 'Y' && <Chip label="고정" color="warning" size="small" sx={{ mr: SPACING.MEDIUM }} />}
                  <Typography id={`notice-item-date-${notice.noticeId}`} variant="caption" sx={{ color: colors.textSecondary, ml: 'auto' }}>{formatDate(notice.postedAt)}</Typography>
                </Box>
                <Typography id={`notice-item-title-${notice.noticeId}`} variant="subtitle1" sx={{ color: colors.text, fontWeight: 600, mb: SPACING.SMALL }}>{notice.title}</Typography>
                <Typography id={`notice-item-content-${notice.noticeId}`} variant="body2" sx={{ color: colors.textSecondary, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>{notice.content}</Typography>
              </ListItemCard>
            ))}
          </Stack>
        </ListScaffold>
      </Box>
    </Box>
  );
} 