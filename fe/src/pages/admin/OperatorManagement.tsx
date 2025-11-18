import React, { useState, useEffect } from 'react';
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
import { hasAccountManagementPermission } from '../../utils/auth';
import { getAdminRole } from '../../store/user';
import { formatYmdHm } from '../../utils/date';
import { getAdminAccountList, deleteAdminAccountList } from '../../api/account';
import { getCommonCodesByGroupId } from '../../api';
import { COMMON_CODE_GROUPS } from '@iitp-dabt/common';
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

  // 공통 코드 조회 (운영자 역할)
  const { data: roleCodes } = useDataFetching({ 
    fetchFunction: () => getCommonCodesByGroupId(COMMON_CODE_GROUPS.SYS_ADMIN_ROLES), 
    autoFetch: true 
  });
  
  // 역할 옵션 생성
  const [roleOptions, setRoleOptions] = useState<{ value: string; label: string }[]>([
    { value: '', label: '전체' }
  ]);
  
  useEffect(() => {
    if (roleCodes?.codes) {
      const options = [
        { value: '', label: '전체' },
        ...roleCodes.codes.map((code: any) => ({ 
          value: code.codeId, 
          label: code.codeNm 
        }))
      ];
      setRoleOptions(options);
    }
  }, [roleCodes]);

  // API 호출 - 실제 API 함수를 래핑하여 useDataFetching에 전달
  const { data: operatorData, isLoading, isError, status, refetch } = useDataFetching({
    fetchFunction: () => getAdminAccountList({
      search: searchTerm,
      status: selectedStatus,
      role: selectedRole,
      page: currentPage,
      limit: pageSize
    }),
    dependencies: [searchTerm, selectedStatus, selectedRole, currentPage, pageSize]
  });

  // apiError 포함한 최종 에러
  const apiError = isError && status === 'error' ? (operatorData as any)?.error : undefined;
  const finalError = error || apiError;

  // 운영자 선택 처리
  const handleOperatorSelect = (adminId: number, checked: boolean) => {
    if (checked) {
      setSelectedOperators(prev => [...prev, adminId]);
    } else {
      setSelectedOperators(prev => prev.filter(id => id !== adminId));
    }
  };

  // 검색 처리
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    handlePageChange(1);
  };

  // 상태 필터 처리
  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    handlePageChange(1);
  };

  // 역할 필터 처리
  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    handlePageChange(1);
  };

  // 정렬 필터 처리 (UI에서 선택)
  const handleSortSelect = (value: string) => {
    // value 예: 'createdAt-desc', 'createdAt-asc', 'name-asc', 'role-asc'
    const [field, dir] = value.split('-') as ['name' | 'createdAt' | 'role', 'asc' | 'desc'];
    setSortField(field);
    setSortDirection(dir);
  };

  // 운영자 클릭 처리
  const handleOperatorClick = (adminId: number) => {
    navigate(ROUTES.ADMIN.OPERATORS.DETAIL.replace(':id', String(adminId)));
  };

  // 운영자 생성 처리
  const handleCreateOperator = () => {
    navigate(ROUTES.ADMIN.OPERATORS.CREATE);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'A': return '활성';
      case 'I': return '비활성';
      case 'S': return '정지';
      default: return status;
    }
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'A': return 'success';
      case 'I': return 'warning';
      case 'S': return 'error';
      default: return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    if (roleCodes?.codes) {
      const roleCode = roleCodes.codes.find((code: any) => code.codeId === role);
      return roleCode ? roleCode.codeNm : role;
    }
    return role;
  };

  const sortedOperators = operatorData?.items ? [...operatorData.items].sort((a: AdminAccountListItem, b: AdminAccountListItem) => {
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
      {finalError && <ErrorAlert error={finalError} onClose={() => setError(null)} />}
      
      <ListScaffold
        title="운영자 관리"
        search={{
          value: searchTerm,
          onChange: handleSearch,
          placeholder: '운영자 이름 또는 로그인 ID로 검색'
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
          },
          {
            label: '역할',
            value: selectedRole,
            options: roleOptions,
            onChange: handleRoleFilter
          },
          {
            label: '정렬',
            value: `${sortField}-${sortDirection}`,
            options: [
              { value: 'createdAt-desc', label: '최신 등록순' },
              { value: 'createdAt-asc', label: '오래된 등록순' },
              { value: 'name-asc', label: '이름 오름차순' },
              { value: 'name-desc', label: '이름 내림차순' },
              { value: 'role-asc', label: '역할 오름차순' },
              { value: 'role-desc', label: '역할 내림차순' },
            ],
            onChange: handleSortSelect
          }
        ]}
        actionsRight={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {hasAccountManagementPermission(adminRole) && (
              <ThemedButton variant="primary" startIcon={<AddIcon />} onClick={handleCreateOperator}>
                운영자 추가
              </ThemedButton>
            )}
          </Box>
        }
        pagination={{
          page: currentPage,
          totalPages: operatorData?.totalPages || 1,
          pageSize,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange
        }}
        total={operatorData?.total}
        loading={isLoading}
        emptyText={operatorData?.items && operatorData.items.length > 0 ? undefined : "등록된 운영자가 없습니다."}
        selectable={{
          enabled: true,
          items: operatorData?.items || [],
          getId: (operator) => operator.adminId,
          selectedIds: selectedOperators,
          onSelectionChange: (selected) => setSelectedOperators(selected as number[]),
          renderCheckbox: true,
          deleteConfig: {
            apiFunction: async (ids: (number | string)[]) => {
              await deleteAdminAccountList(ids);
            },
            confirmTitle: '운영자 삭제 확인',
            confirmMessage: '선택된 운영자들을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.',
            successMessage: '선택된 운영자들이 삭제되었습니다.',
            errorMessage: '운영자 삭제 중 오류가 발생했습니다.',
            onDeleteSuccess: () => {
              refetch();
              setSelectedOperators([]);
            }
          }
        }}
      >
        {sortedOperators.map((operator) => (
          <ListItemCard
            key={operator.adminId}
            onClick={() => handleOperatorClick(operator.adminId)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              {/* 체크박스 */}
              <Box
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                sx={{ mr: 2 }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedOperators.includes(operator.adminId)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.stopPropagation();
                        handleOperatorSelect(operator.adminId, e.target.checked);
                      }}
                      size="small"
                    />
                  }
                  label=""
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                />
              </Box>
              
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
                  kind={getStatusColor(operator.status)}
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
