import React, { useState } from 'react';
import { Box, CardContent, Stack } from '@mui/material';
import { 
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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
import { getCommonCodeGroups, deleteCommonCodeGroupList } from '../../api/commonCode';

export default function CodeManagement() {
  const navigate = useNavigate();
  const adminRole = getAdminRole();
  const canManage = hasAccountManagementPermission(adminRole);
  
  // ROUTE_META에서 페이지 정보 동적 가져오기
  const pageMeta = (ROUTE_META as any)[ROUTES.ADMIN.CODE.LIST];
  const pageTitle = pageMeta?.title || '코드 그룹 관리';

  const [search, setSearch] = useState('');
  const [useYn, setUseYn] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selected, setSelected] = useState<Array<string>>([]);
  const [sort, setSort] = useState('grpId-asc');
  const [error, setError] = useState<string | null>(null);
  
  const { query, setQuery } = useQuerySync({ 
    page: 1, 
    limit: 10, 
    search: '', 
    useYn: '',
    sort: 'grpId-asc' 
  });

  React.useEffect(() => {
    if (query.page) setPage(Number(query.page) || 1);
    if (query.limit) setLimit(Number(query.limit) || 10);
    if (query.search !== undefined) setSearch(query.search);
    if (query.useYn !== undefined) setUseYn(query.useYn);
    if (query.sort) setSort(query.sort);
  }, [query.page, query.limit, query.search, query.useYn, query.sort]);

  // 그룹 목록 조회
  const { data, isLoading, isEmpty, isError, refetch } = useDataFetching({
    fetchFunction: () => getCommonCodeGroups({ search, useYn, sort }),  // ✅ 필터 값들을 API 요청에 포함
    dependencies: [search, useYn, sort]  // ✅ 필터 값이 변경될 때마다 재조회
  });

  // ✅ 서버에서 이미 필터링된 데이터를 받아오므로 클라이언트 필터링 제거
  const filteredGroups = React.useMemo(() => {
    if (!data?.groups) {
      return [];
    }

    return data.groups;  // ✅ data.groups로 직접 접근
  }, [data?.groups]);

  // ✅ 서버에서 이미 정렬된 데이터를 받아오므로 클라이언트 정렬 제거
  const sortedGroups = filteredGroups;

  // 페이징 처리
  const paginatedGroups = React.useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const result = sortedGroups.slice(startIndex, endIndex);
    
    return result;
  }, [sortedGroups, page, limit]);

  const totalPages = Math.ceil(sortedGroups.length / limit);

  const columns: Array<DataTableColumn<any>> = [
    { 
      key: 'grpId', 
      header: '그룹 ID', 
      render: (r) => (
        <span 
          style={{ cursor: 'pointer', color: '#1976d2' }} 
          onClick={() => navigate(`/admin/code/group/${r.grpId}`)}
        >
          {r.grpId}
        </span>
      ) 
    },
    { key: 'grpNm', header: '그룹명' },
    { 
      key: 'codeType', 
      header: '코드 타입',
      render: (r) => r.codeType || '-'  // ✅ codeType이 없으면 '-' 표시
    },
    { key: 'codeCount', header: '코드 수' },
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

  const toggleAll = (checked: boolean) => setSelected(checked ? paginatedGroups.map((g: any) => g.grpId) : []);
  const toggleRow = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleCreateGroup = () => {
    // TODO: 그룹 생성 다이얼로그 구현
    console.log('그룹 생성');
  };

  return (
    <Box id="admin-code-group-list-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader 
        id="admin-code-group-list-header" 
        title={pageTitle} 
        search={{ 
          value: search, 
          onChange: (v) => { 
            setSearch(v); 
            setQuery({ search: v, page: 1, limit, useYn, sort }, { replace: true }); 
          }, 
          placeholder: '그룹 ID/그룹명 검색' 
        }} 
        filters={[
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
              setQuery({ useYn: v, page: 1, limit, search, sort }, { replace: true }); 
            } 
          },
          { 
            label: '정렬', 
            value: sort, 
            options: [
              { value: 'grpId-asc', label: '그룹 ID순' },
              { value: 'grpNm-asc', label: '그룹명순' },
              { value: 'createdAt-desc', label: '생성순(최신)' },
            ], 
            onChange: (v: string) => { 
              const nv = v || 'grpId-asc'; 
              setSort(nv); 
              setQuery({ sort: nv, page: 1, limit, search, useYn }, { replace: true }); 
            } 
          }
        ]} 
      />
      
      {/* 에러 알림 */}
      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}
      
      <ListScaffold
        title="코드 그룹 관리"
        total={sortedGroups.length}
        loading={isLoading}
        errorText={isError ? '그룹 목록을 불러오는 중 오류가 발생했습니다.' : undefined}
        emptyText={isEmpty && !isLoading ? '표시할 그룹이 없습니다.' : undefined}  // ✅ 로딩 중이 아닐 때만 empty 표시
        selectable={{
          enabled: true,
          items: sortedGroups,
          getId: (group) => group.grpId,
          selectedIds: selected,
          onSelectionChange: (selectedIds) => setSelected(selectedIds as string[]),
          renderCheckbox: true,
          deleteConfig: {
            apiFunction: async (ids: (number | string)[]) => {
              // 그룹 일괄 삭제 API 호출
              await deleteCommonCodeGroupList(ids);
            },
            confirmTitle: '그룹 삭제 확인',
            confirmMessage: '선택된 그룹들을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.',
            successMessage: '선택된 그룹들이 삭제되었습니다.',
            errorMessage: '그룹 삭제 중 오류가 발생했습니다.',
            onDeleteSuccess: () => {
              refetch();
              setSelected([]);
            }
          }
        }}
        pagination={{ 
          page, 
          totalPages, 
          onPageChange: (p) => { 
            setPage(p); 
            setQuery({ page: p, limit, search, useYn, sort }, { replace: true }); 
          }, 
          pageSize: limit, 
          onPageSizeChange: (s) => { 
            setLimit(s); 
            setPage(1); 
            setQuery({ page: 1, limit: s, search, useYn, sort }, { replace: true }); 
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
                  onClick={handleCreateGroup}
                  buttonSize="cta"
                >
                  그룹 추가
                </ThemedButton>
              )}
            </Stack>
          </Stack>
          
          <DataTable
            id="admin-code-group-table"
            columns={columns}
            rows={paginatedGroups}
            getRowId={(r) => r.grpId}
            selectedIds={selected}
            onToggleRow={(id) => toggleRow(id as string)}
            onToggleAll={toggleAll}
            emptyText={paginatedGroups.length === 0 && !isLoading ? '표시할 그룹이 없습니다.' : undefined}  // ✅ 로딩 중이 아닐 때만 empty 표시
          />
        </CardContent>
      </ListScaffold>
    </Box>
  );
}
