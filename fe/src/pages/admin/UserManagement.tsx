import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
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
import { getUserAccountList, deleteUserAccount } from '../../api/account';
import type { UserAccountListItem } from '@iitp-dabt/common';

export default function UserManagement() {
  const navigate = useNavigate();
  const adminRole = getAdminRole();
  
  // 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [sortField, setSortField] = useState<'name' | 'createdAt' | 'status'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [error, setError] = useState<string | null>(null);

  // 페이징
  const { currentPage, pageSize, handlePageChange, handlePageSizeChange } = usePagination();

  // API 호출 - 실제 API 함수를 래핑하여 useDataFetching에 전달
  const { data: userData, isLoading, isError, refetch } = useDataFetching({
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

  // 전체 선택 처리
  const handleSelectAll = (checked: boolean) => {
    if (checked && userData?.data?.items) {
      setSelectedUsers(userData.data.items.map(user => user.userId));
    } else {
      setSelectedUsers([]);
    }
  };

  // 선택된 사용자 삭제 - 실제 API 호출
  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) return;
    
    try {
      // 실제 API 호출
      for (const userId of selectedUsers) {
        await deleteUserAccount(userId);
      }
      setSelectedUsers([]);
      refetch(); // 목록 새로고침
      setError(null); // 에러 메시지 초기화
    } catch (error) {
      console.error('사용자 삭제 중 오류:', error);
      setError('사용자 삭제 중 오류가 발생했습니다.');
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

  // 정렬 처리
  const handleSort = (field: 'name' | 'createdAt' | 'status') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'A': return 'success';
      case 'I': return 'warning';
      case 'S': return 'error';
      default: return 'default';
    }
  };

  // 정렬된 사용자 목록
  const sortedUsers = userData?.data?.items ? [...userData.data.items].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];
    
    if (sortField === 'createdAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  }) : [];

  return (
    <Box>
      <AdminPageHeader />
      
      {/* 에러 알림 */}
      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}
      
        <ListScaffold
        searchValue={searchTerm}
        onSearch={handleSearch}
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
                <ThemedButton
                variant="danger"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteSelected}
                disabled={selectedUsers.length === 0}
              >
                선택 삭제 ({selectedUsers.length})
              </ThemedButton>
            )}
            {hasUserAccountEditPermission(adminRole) && (
              <ThemedButton variant="primary" startIcon={<AddIcon />} onClick={handleCreateUser}>
                  사용자 추가
                </ThemedButton>
              )}
          </Box>
        }
        pagination={{
          page: currentPage,
          totalPages: userData?.data?.totalPages || 1,
          pageSize,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange
        }}
        selectable={{
          selected: selectedUsers,
          onToggleAll: handleSelectAll,
          onToggleRow: handleUserSelect
        }}
        loading={isLoading}
        emptyMessage="등록된 사용자가 없습니다."
      >
        {sortedUsers.map((user) => (
          <ListItemCard
            key={user.userId}
            onClick={() => handleUserClick(user.userId)}
            selectable={{
              selected: selectedUsers.includes(user.userId),
              onToggle: (checked: boolean) => handleUserSelect(user.userId, checked)
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
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
                  label={getStatusLabel(user.status)}
                  color={getStatusColor(user.status)}
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
