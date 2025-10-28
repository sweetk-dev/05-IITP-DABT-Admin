import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import ThemedButton from '../../components/common/ThemedButton';
import ListItemCard from '../../components/common/ListItemCard';
import ListScaffold from '../../components/common/ListScaffold';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import StatusChip from '../../components/common/StatusChip';
import ErrorAlert from '../../components/ErrorAlert';
import { useDataFetching } from '../../hooks/useDataFetching';
import { usePagination } from '../../hooks/usePagination';
import { ROUTES } from '../../routes';
import { hasUserAccountEditPermission } from '../../utils/auth';
import { getAdminRole } from '../../store/user';
import { formatYmdHm } from '../../utils/date';
import { getUserAccountList, deleteUserAccountList } from '../../api/account';

export default function UserManagement() {
  const navigate = useNavigate();
  const adminRole = getAdminRole();
  
  // 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 페이징
  const { currentPage, pageSize, handlePageChange, handlePageSizeChange } = usePagination();

  // API 호출 - 실제 API 함수를 래핑하여 useDataFetching에 전달
  const { data: userData, isLoading, refetch } = useDataFetching({
    fetchFunction: () => getUserAccountList({
      search: searchTerm,
      status: selectedStatus,
      page: currentPage,
      limit: pageSize
    }),
    dependencies: [searchTerm, selectedStatus, currentPage, pageSize]
  });

  // 사용자 선택 처리
  const handleUserSelect = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };





  // 검색 처리
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    handlePageChange(1); // Reset to first page on search
  };

  // 상태 필터 처리
  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    handlePageChange(1); // Reset to first page on status filter
  };

  // 사용자 클릭 처리
  const handleUserClick = (userId: number) => {
    navigate(ROUTES.ADMIN.USERS.DETAIL.replace(':id', String(userId)));
  };

  // 사용자 생성 처리
  const handleCreateUser = () => {
    navigate(ROUTES.ADMIN.USERS.CREATE);
  };

  // 상태 라벨 및 색상
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'A': return '활성';
      case 'I': return '비활성';
      case 'S': return '정지';
      default: return status;
    }
  };

  const getStatusKind = (status: string) => {
    switch (status) {
      case 'A': return 'success';
      case 'I': return 'warning';
      case 'S': return 'error';
      default: return 'default';
    }
  };

  // 정렬된 사용자 목록 (생성일 기준 내림차순)
  const sortedUsers = userData?.items ? [...userData.items].sort((a, b) => {
    const aValue = new Date(a.createdAt).getTime();
    const bValue = new Date(b.createdAt).getTime();
    return bValue - aValue; // 최신순
  }) : [];

  return (
    <Box>
      <AdminPageHeader />
      
      {/* 에러 알림 */}
      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}
      
      <ListScaffold
        title="사용자 관리"
        search={{
          value: searchTerm,
          onChange: handleSearch,
          placeholder: "사용자명 또는 로그인 ID로 검색"
        }}
        filters={[
          {
            label: '상태',
            value: selectedStatus,
            options: [
              { value: '', label: '전체' },
              { value: 'A', label: '활성' },
              { value: 'I', label: '비활성' },
              { value: 'S', label: '정지' }
            ],
            onChange: handleStatusFilter
          }
        ]}
        actionsRight={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {hasUserAccountEditPermission(adminRole) && (
              <ThemedButton variant="primary" startIcon={<AddIcon />} onClick={handleCreateUser}>
                사용자 추가
              </ThemedButton>
            )}
          </Box>
        }
        pagination={{
          page: currentPage,
          totalPages: userData?.totalPages || 1,
          pageSize,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange
        }}
        total={userData?.total}
        loading={isLoading}
        emptyText={userData?.items && userData.items.length > 0 ? undefined : "등록된 사용자가 없습니다."}
        selectable={{
          enabled: true,
          items: userData?.items || [],
          getId: (user) => user.userId,
          selectedIds: selectedUsers,
          onSelectionChange: (selected) => setSelectedUsers(selected as number[]),
          renderCheckbox: true,
          deleteConfig: {
            apiFunction: async (ids: (number | string)[]) => {
              // LIST_DELETE API 호출 - 일괄 삭제
              await deleteUserAccountList(ids);
            },
            confirmTitle: '사용자 삭제 확인',
            confirmMessage: '선택된 사용자들을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.',
            successMessage: '선택된 사용자들이 삭제되었습니다.',
            errorMessage: '사용자 삭제 중 오류가 발생했습니다.',
            onDeleteSuccess: () => {
              // 삭제 성공 후 목록 새로고침
              refetch();
              setSelectedUsers([]);
            }
          }
        }}
      >
        {sortedUsers.map((user) => (
          <ListItemCard
            key={user.userId}
            onClick={() => handleUserClick(user.userId)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              {/* 체크박스 */}
              <Box 
                onClick={(e) => e.stopPropagation()} 
                sx={{ mr: 2 }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedUsers.includes(user.userId)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleUserSelect(user.userId, e.target.checked);
                      }}
                      size="small"
                    />
                  }
                  label=""
                  onClick={(e) => e.stopPropagation()}
                />
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" component="div">
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.loginId}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <StatusChip
                  kind={getStatusKind(user.status)}
                  label={getStatusLabel(user.status)}
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  키: {user.keyCount}개
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatYmdHm(user.createdAt)}
                </Typography>
              </Box>
            </Box>
          </ListItemCard>
        ))}
      </ListScaffold>
    </Box>
  );
}
