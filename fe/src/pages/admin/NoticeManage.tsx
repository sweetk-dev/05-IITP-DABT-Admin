import { useState, useEffect } from 'react';
import { Box, Stack, Chip, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ListScaffold from '../../components/common/ListScaffold';
import ListItemCard from '../../components/common/ListItemCard';
import ThemedButton from '../../components/common/ThemedButton';
import ErrorAlert from '../../components/ErrorAlert';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { hasContentEditPermission } from '../../utils/auth';
import { getAdminRole } from '../../store/user';

// 임시 공지사항 데이터
const mockNotices = [
  {
    noticeId: 1,
    title: '시스템 점검 안내',
    content: '정기 시스템 점검이 예정되어 있습니다.',
    noticeType: 'S',
    publicYn: 'Y',
    postedAt: '2024-01-15T10:00:00Z',
    startDt: '2024-01-15T00:00:00Z',
    endDt: '2024-01-20T23:59:59Z',
    createdAt: '2024-01-15T09:00:00Z'
  },
  {
    noticeId: 2,
    title: '새로운 기능 업데이트',
    content: '사용자 편의를 위한 새로운 기능이 추가되었습니다.',
    noticeType: 'G',
    publicYn: 'Y',
    postedAt: '2024-01-14T14:00:00Z',
    startDt: '2024-01-14T00:00:00Z',
    endDt: null,
    createdAt: '2024-01-14T13:00:00Z'
  }
];

export default function NoticeManage() {
  const navigate = useNavigate();
  const adminRole = getAdminRole();

  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'G' | 'S' | 'E'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Y' | 'N'>('all');
  
  // 선택된 공지사항 항목들
  const [selectedNotices, setSelectedNotices] = useState<number[]>([]);
  
  // 에러 상태
  const [error, setError] = useState<string | null>(null);
  
  // 필터링된 공지사항
  const filteredNotices = mockNotices.filter(notice => {
    const matchesSearch = !searchTerm || 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notice.noticeType === filterType;
    const matchesStatus = filterStatus === 'all' || notice.publicYn === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // 개별 공지사항 선택/해제
  const handleNoticeSelect = (noticeId: number, checked: boolean) => {
    if (checked) {
      setSelectedNotices(prev => [...prev, noticeId]);
    } else {
      setSelectedNotices(prev => prev.filter(id => id !== noticeId));
    }
  };

  // 전체 선택/해제
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotices(filteredNotices.map(notice => notice.noticeId));
    } else {
      setSelectedNotices([]);
    }
  };

  // 선택된 공지사항 삭제
  const handleDeleteSelected = async () => {
    if (selectedNotices.length === 0) return;
    
    try {
      // TODO: 실제 삭제 API 호출
      console.log('삭제할 공지사항 IDs:', selectedNotices);
      setSelectedNotices([]);
      setError(null); // 에러 메시지 초기화
    } catch (error) {
      console.error('공지사항 삭제 중 오류:', error);
      setError('공지사항 삭제 중 오류가 발생했습니다.');
    }
  };

  // 공지사항 타입별 라벨
  const getNoticeTypeLabel = (type: string) => {
    switch (type) {
      case 'G': return '일반';
      case 'S': return '시스템';
      case 'E': return '긴급';
      default: return type;
    }
  };

  // 공지사항 타입별 색상
  const getNoticeTypeColor = (type: string): 'primary' | 'info' | 'error' | 'default' => {
    switch (type) {
      case 'G': return 'primary';
      case 'S': return 'info';
      case 'E': return 'error';
      default: return 'default';
    }
  };

  const handleNoticeClick = (noticeId: number) => {
    navigate(`/admin/notices/${noticeId}`);
  };

  const handleCreateNotice = () => {
    navigate(ROUTES.ADMIN.NOTICES.CREATE);
  };

  const isEmpty = filteredNotices.length === 0;

  return (
    <Box id="admin-notice-manage-page">
      <AdminPageHeader />

      {/* 에러 알림 */}
      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}

      <Box sx={{ p: SPACING.LARGE }}>
        <ListScaffold
          title="공지사항 관리"
          loading={false}
          emptyText={isEmpty ? '등록된 공지사항이 없습니다.' : ''}
          search={{
            value: searchTerm,
            onChange: setSearchTerm,
            placeholder: '공지사항 제목으로 검색...'
          }}
          actionsRight={
            <Box sx={{ display: 'flex', gap: 1 }}>
              {hasContentEditPermission(adminRole) && selectedNotices.length > 0 && (
                <ThemedButton
                  variant="danger"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteSelected}
                >
                  선택 삭제 ({selectedNotices.length})
                </ThemedButton>
              )}
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
              options: [
                { value: 'all', label: '전체' },
                { value: 'G', label: '일반' },
                { value: 'S', label: '시스템' },
                { value: 'E', label: '긴급' }
              ],
              onChange: (value: string) => setFilterType(value as 'all' | 'G' | 'S' | 'E')
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
          total={filteredNotices.length}
          wrapInCard={false}
        >
          <Stack id="notice-list-stack" spacing={SPACING.MEDIUM}>
            {filteredNotices.map((notice) => (
              <ListItemCard 
                id={`notice-item-${notice.noticeId}`} 
                key={notice.noticeId} 
                onClick={() => handleNoticeClick(notice.noticeId)}
              >
                <Box id={`notice-item-header-${notice.noticeId}`} sx={{ display: 'flex', alignItems: 'center', mb: SPACING.SMALL }}>
                  <Box 
                    onClick={(e) => e.stopPropagation()} 
                    sx={{ mr: SPACING.SMALL }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedNotices.includes(notice.noticeId)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleNoticeSelect(notice.noticeId, e.target.checked);
                          }}
                          size="small"
                        />
                      }
                      label=""
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Box>
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
                
                <Typography 
                  id={`notice-item-content-${notice.noticeId}`} 
                  variant="body2" 
                  sx={{ color: 'text.secondary', mb: SPACING.SMALL }}
                >
                  {notice.content}
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