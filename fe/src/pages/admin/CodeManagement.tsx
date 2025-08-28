import React, { useState } from 'react';
import { Box, CardContent, Stack } from '@mui/material';
import { 
  Code as CodeIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAdminRole } from '../../store/user';
import { hasAccountManagementPermission } from '../../utils/auth';
import { ROUTES, ROUTE_META } from '../../routes';
import { SPACING } from '../../constants/spacing';
import PageHeader from '../../components/common/PageHeader';
import ListScaffold from '../../components/common/ListScaffold';
import ThemedButton from '../../components/common/ThemedButton';
import DataTable, { type DataTableColumn } from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import ErrorAlert from '../../components/ErrorAlert';
import { useQuerySync } from '../../hooks/useQuerySync';
import { useDataFetching } from '../../hooks/useDataFetching';
import { formatYmdHm } from '../../utils/date';
import { getCommonCodesByTypeDetail } from '../../api/commonCode';
import type { CommonCodeByTypeDetailRes } from '@iitp-dabt/common';

export default function CodeManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminRole = getAdminRole();
  const canManage = hasAccountManagementPermission(adminRole);
  
  // ROUTE_META에서 페이지 정보 동적 가져오기
  const pageMeta = (ROUTE_META as any)[ROUTES.ADMIN.CODE.LIST];
  const pageTitle = pageMeta?.title || '코드 관리';

  const [search, setSearch] = useState('');
  const [groupId, setGroupId] = useState('');
  const [useYn, setUseYn] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selected, setSelected] = useState<Array<number>>([]);
  const [sort, setSort] = useState('sortOrder-asc');
  const [error, setError] = useState<string | null>(null);
  
  const { query, setQuery } = useQuerySync({ 
    page: 1, 
    limit: 10, 
    search: '', 
    groupId: '', 
    useYn: '',
    sort: 'sortOrder-asc' 
  });

  React.useEffect(() => {
    if (query.page) setPage(Number(query.page) || 1);
    if (query.limit) setLimit(Number(query.limit) || 10);
    if (query.search !== undefined) setSearch(query.search);
    if (query.groupId !== undefined) setGroupId(query.groupId);
    if (query.useYn !== undefined) setUseYn(query.useYn);
    if (query.sort) setSort(query.sort);
  }, [query.page, query.limit, query.search, query.groupId, query.useYn, query.sort]);

  // 실제 API 호출 - 관리자용 코드 목록 조회
  const { data, isLoading, isEmpty, isError, refetch } = useDataFetching({
    fetchFunction: () => getCommonCodesByTypeDetail('A'), // 'A' = Admin 타입
    dependencies: []
  });

  // 필터링된 코드 목록
  const filteredCodes = React.useMemo(() => {
    if (!data?.data?.codes) return [];
    
    let codes = data.data.codes;
    
    // 검색 필터
    if (search) {
      codes = codes.filter(code => 
        code.grpId?.toLowerCase().includes(search.toLowerCase()) ||
        code.codeId?.toLowerCase().includes(search.toLowerCase()) ||
        code.codeNm?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // 그룹 ID 필터
    if (groupId) {
      codes = codes.filter(code => code.grpId === groupId);
    }
    
    // 사용여부 필터
    if (useYn) {
      codes = codes.filter(code => code.useYn === useYn);
    }
    
    return codes;
  }, [data?.data?.codes, search, groupId, useYn]);

  // 정렬된 코드 목록
  const sortedCodes = React.useMemo(() => {
    const [key, order] = sort.split('-');
    
    return [...filteredCodes].sort((a, b) => {
      let aValue: any = a[key as keyof typeof a];
      let bValue: any = b[key as keyof typeof b];
      
      if (key === 'createdAt') {
        aValue = new Date(aValue || '').getTime();
        bValue = new Date(bValue || '').getTime();
      } else if (key === 'sortOrder') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      }
      
      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredCodes, sort]);

  // 페이징 처리
  const paginatedCodes = React.useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return sortedCodes.slice(startIndex, endIndex);
  }, [sortedCodes, page, limit]);

  const totalPages = Math.ceil(sortedCodes.length / limit);

  const columns: Array<DataTableColumn<any>> = [
    { 
      key: 'grpId', 
      header: '그룹 ID', 
      render: (r) => (
        <span 
          style={{ cursor: 'pointer', color: '#1976d2' }} 
          onClick={() => navigate(`/admin/code/${r.id}`)}
        >
          {r.grpId}
        </span>
      ) 
    },
    { key: 'codeId', header: '코드 ID' },
    { key: 'codeNm', header: '코드명' },
    { key: 'description', header: '설명' },
    { key: 'sortOrder', header: '정렬순서' },
    { 
      key: 'useYn', 
      header: '사용여부', 
      render: (r) => (
        <StatusChip 
          kind={r.useYn === 'Y' ? 'success' : 'default'} 
          label={r.useYn === 'Y' ? '사용' : '미사용'}
        />
      ) 
    },
    { 
      key: 'createdAt', 
      header: '생성일', 
      width: 160, 
      render: (r) => formatYmdHm(r.createdAt) 
    }
  ];

  const toggleAll = (checked: boolean) => setSelected(checked ? paginatedCodes.map((c: any) => c.id) : []);
  const toggleRow = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleBulkDelete = async () => {
    try {
      // TODO: 실제 삭제 API 호출
      console.log('선택된 코드 삭제:', selected);
      setSelected([]); 
      refetch();
      setError(null); // 에러 메시지 초기화
    } catch (error) {
      console.error('코드 삭제 중 오류:', error);
      setError('코드 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleCreateCode = () => {
    navigate('/admin/code/create');
  };

  return (
    <Box id="admin-code-list-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader 
        id="admin-code-list-header" 
        title={pageTitle} 
        search={{ 
          value: search, 
          onChange: (v) => { 
            setSearch(v); 
            setQuery({ search: v, page: 1, limit, groupId, useYn, sort }, { replace: true }); 
          }, 
          placeholder: '그룹 ID/코드 ID/코드명 검색' 
        }} 
        filters={[
          { 
            label: '그룹 ID', 
            value: groupId, 
            options: [
              { value: '', label: '전체' }, 
              { value: 'USER_STATUS', label: '사용자 상태' }, 
              { value: 'ADMIN_ROLE', label: '관리자 역할' },
              { value: 'QNA_TYPE', label: 'Q&A 타입' },
              { value: 'NOTICE_TYPE', label: '공지 타입' }
            ], 
            onChange: (v: string) => { 
              setGroupId(v); 
              setQuery({ groupId: v, page: 1, limit, search, useYn, sort }, { replace: true }); 
            } 
          },
          { 
            label: '사용여부', 
            value: useYn, 
            options: [
              { value: '', label: '전체' }, 
              { value: 'Y', label: '사용' }, 
              { value: 'N', label: '미사용' }
            ], 
            onChange: (v: string) => { 
              setUseYn(v); 
              setQuery({ useYn: v, page: 1, limit, search, groupId, sort }, { replace: true }); 
            } 
          },
          { 
            label: '정렬', 
            value: sort, 
            options: [
              { value: 'sortOrder-asc', label: '정렬순서순' },
              { value: 'codeId-asc', label: '코드 ID순' },
              { value: 'createdAt-desc', label: '생성순(최신)' },
            ], 
            onChange: (v: string) => { 
              const nv = v || 'sortOrder-asc'; 
              setSort(nv); 
              setQuery({ sort: nv, page: 1, limit, search, groupId, useYn }, { replace: true }); 
            } 
          }
        ]} 
      />
      
      {/* 에러 알림 */}
      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}
      
      <ListScaffold
        title="코드 관리"
        total={sortedCodes.length}
        loading={isLoading}
        errorText={isError ? '코드 목록을 불러오는 중 오류가 발생했습니다.' : ''}
        emptyText={isEmpty ? '표시할 코드가 없습니다.' : ''}
        pagination={{ 
          page, 
          totalPages, 
          onPageChange: (p) => { 
            setPage(p); 
            setQuery({ page: p, limit, search, groupId, useYn, sort }, { replace: true }); 
          }, 
          pageSize: limit, 
          onPageSizeChange: (s) => { 
            setLimit(s); 
            setPage(1); 
            setQuery({ page: 1, limit: s, search, groupId, useYn, sort }, { replace: true }); 
          } 
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ mb: 1 }}>
            <div />
            <Stack direction="row" spacing={1}>
              {canManage && (
                <ThemedButton 
                  variant="primary" 
                  startIcon={<AddIcon />} 
                  onClick={handleCreateCode}
                  buttonSize="cta"
                >
                  코드 추가
                </ThemedButton>
              )}
              {canManage && (
                <ThemedButton 
                  variant="dangerSoft" 
                  onClick={handleBulkDelete} 
                  disabled={selected.length === 0} 
                  buttonSize="cta"
                >
                  선택 삭제
                </ThemedButton>
              )}
            </Stack>
          </Stack>
          
          <DataTable
            id="admin-code-table"
            columns={columns}
            rows={paginatedCodes}
            getRowId={(r) => r.id}
            selectedIds={selected}
            onToggleRow={(id) => toggleRow(id as number)}
            onToggleAll={toggleAll}
            emptyText={isEmpty ? '표시할 코드가 없습니다.' : undefined}
          />
        </CardContent>
      </ListScaffold>
    </Box>
  );
}
