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
import { hasAccountManagementPermission } from '../../utils/auth';
import { getAdminRole } from '../../store/user';
import { formatYmdHm } from '../../utils/date';
import { getAdminAccountList, deleteAdminAccount } from '../../api/account';
import type { AdminAccountListItem } from '@iitp-dabt/common';

export default function OperatorManagement() {
  const navigate = useNavigate();
  const adminRole = getAdminRole();
  
  // 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedOperators, setSelectedOperators] = useState<number[]>([]);
  const [sortField, setSortField] = useState<'name' | 'createdAt' | 'role'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [error, setError] = useState<string | null>(null);

  // 페이징
  const { currentPage, pageSize, handlePageChange, handlePageSizeChange } = usePagination();

  // API 호출 - 실제 API 함수를 래핑하여 useDataFetching에 전달
  const { data: operatorData, isLoading, isError, refetch } = useDataFetching({
    fetchFunction: () => getAdminAccountList({
      search: searchTerm,
      status: selectedStatus,
      role: selectedRole,
      page: currentPage,
      limit: pageSize
    }),
    dependencies: [searchTerm, selectedStatus, selectedRole, currentPage, pageSize]
  });

  // 운영자 선택 처리
  const handleOperatorSelect = (adminId: number, checked: boolean) => {
    if (checked) {
      setSelectedOperators(prev => [...prev, adminId]);
    } else {
      setSelectedOperators(prev => prev.filter(id => id !== adminId));
    }
  };

  // 전체 선택 처리
  const handleSelectAll = (checked: boolean) => {
    if (checked && operatorData?.data?.items) {
      setSelectedOperators(operatorData.data.items.map(operator => operator.adminId));
    } else {
      setSelectedOperators([]);
    }
  };

  // 선택된 운영자 삭제 - 실제 API 호출
  const handleDeleteSelected = async () => {
    if (selectedOperators.length === 0) return;
    
    try {
      // 실제 API 호출
      for (const adminId of selectedOperators) {
        await deleteAdminAccount(adminId);
      }
      setSelectedOperators([]);
      refetch(); // 목록 새로고침
      setError(null); // 에러 메시지 초기화
    } catch (error) {
      console.error('운영자 삭제 중 오류:', error);
      setError('운영자 삭제 중 오류가 발생했습니다.');
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

  // 역할 필터 처리
  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    handlePageChange(1); // Reset to first page on role filter
  };

  // 정렬 처리
  const handleSort = (field: 'name' | 'createdAt' | 'role') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 운영자 클릭 처리
  const handleOperatorClick = (adminId: number) => {
    navigate(ROUTES.ADMIN.OPERATORS.DETAIL.replace(':id', String(adminId)));
  };

  // 운영자 생성 처리
  const handleCreateOperator = () => {
    navigate(ROUTES.ADMIN.OPERATORS.CREATE);
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

  // 역할 라벨
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'S': return '슈퍼관리자';
      case 'A': return '일반관리자';
      default: return role;
    }
  };

  // 정렬된 운영자 목록
  const sortedOperators = operatorData?.data?.items ? [...operatorData.data.items].sort((a, b) => {
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
          },
          {
            label: '역할',
            value: selectedRole,
            options: [
              { value: '', label: '전체' },
              { value: 'S', label: '슈퍼관리자' },
              { value: 'A', label: '일반관리자' }
            ],
            onChange: handleRoleFilter
          }
        ]}
        actionsRight={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {hasAccountManagementPermission(adminRole) && (
                <ThemedButton
                variant="danger"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteSelected}
                disabled={selectedOperators.length === 0}
              >
                선택 삭제 ({selectedOperators.length})
              </ThemedButton>
            )}
            {hasAccountManagementPermission(adminRole) && (
              <ThemedButton variant="primary" startIcon={<AddIcon />} onClick={handleCreateOperator}>
                  운영자 추가
                </ThemedButton>
              )}
          </Box>
        }
        pagination={{
          page: currentPage,
          totalPages: operatorData?.data?.totalPages || 1,
          pageSize,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange
        }}
        selectable={{
          selected: selectedOperators,
          onToggleAll: handleSelectAll,
          onToggleRow: handleOperatorSelect
        }}
        loading={isLoading}
        emptyMessage="등록된 운영자가 없습니다."
      >
        {sortedOperators.map((operator) => (
          <ListItemCard
            key={operator.adminId}
            onClick={() => handleOperatorClick(operator.adminId)}
            selectable={{
              selected: selectedOperators.includes(operator.adminId),
              onToggle: (checked: boolean) => handleOperatorSelect(operator.adminId, checked)
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" component="div">
                  {operator.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {operator.loginId}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <StatusChip
                  label={getStatusLabel(operator.status)}
                  color={getStatusColor(operator.status)}
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  {getRoleLabel(operator.role)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatYmdHm(operator.createdAt)}
                </Typography>
              </Box>
            </Box>
          </ListItemCard>
        ))}
        </ListScaffold>
    </Box>
  );
}
