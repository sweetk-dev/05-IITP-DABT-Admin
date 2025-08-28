import React, { useState } from 'react';
import { Box, CardContent, Typography, Stack } from '@mui/material';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ListScaffold from '../../components/common/ListScaffold';
import ErrorAlert from '../../components/ErrorAlert';
import { SPACING } from '../../constants/spacing';
import { useDataFetching } from '../../hooks/useDataFetching';
import { getAdminOpenApiList, deleteAdminOpenApi } from '../../api';
import DataTable, { type DataTableColumn } from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import ThemedButton from '../../components/common/ThemedButton';
import { useQuerySync } from '../../hooks/useQuerySync';
import { formatYmdHm } from '../../utils/date';
import { getOpenApiKeyStatus } from '../../utils/openApiStatus';
import { ROUTES } from '../../routes';
import { useNavigate } from 'react-router-dom';

export default function AdminOpenApiClients() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeYn, setActiveYn] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selected, setSelected] = useState<Array<number>>([]);
  const [sort, setSort] = useState('name-asc');
  const [error, setError] = useState<string | null>(null);
  const { query, setQuery } = useQuerySync({ page: 1, limit: 10, search: '', activeYn: '', sort: 'name-asc' });

  React.useEffect(() => {
    if (query.page) setPage(Number(query.page) || 1);
    if (query.limit) setLimit(Number(query.limit) || 10);
    if (query.search !== undefined) setSearch(query.search);
    if (query.activeYn !== undefined) setActiveYn(query.activeYn);
    if (query.sort) setSort(query.sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, query.limit, query.search, query.activeYn, query.sort]);

  const { data, isLoading, isEmpty, isError, refetch } = useDataFetching({
    fetchFunction: () => getAdminOpenApiList({ page, limit, searchKeyword: search, activeYn, sort } as any),
    dependencies: [page, limit, search, activeYn, sort]
  });

  const raw = (data as any)?.items || (data as any)?.authKeys || [];
  const items = [...raw].sort((a: any, b: any) => {
    const [key, order] = sort.split('-');
    const av = key === 'name' ? (a.keyName ?? '') : (a[`${key}`] ?? '');
    const bv = key === 'name' ? (b.keyName ?? '') : (b[`${key}`] ?? '');
    if (key === 'name') return av.localeCompare(bv) * (order === 'asc' ? 1 : -1);
    return (new Date(av).getTime() - new Date(bv).getTime()) * (order === 'asc' ? 1 : -1);
  });
  const totalPages = (data as any)?.totalPages || 0;

  // pending 상태인 요청 개수 계산
  const pendingCount = items.filter((item: any) => 
    item.activeYn === 'N' && !item.activeAt
  ).length;

  const columns: Array<DataTableColumn<any>> = [
    { key: 'keyName', header: '이름', render: (r) => <span style={{ cursor: 'pointer' }} onClick={()=>window.location.assign(`/admin/openapi/clients/${r.keyId}`)}>{r.keyName || `Key ${r.keyId}`}</span> },
    { key: 'activeYn', header: '상태', render: (r) => <StatusChip kind={getOpenApiKeyStatus(r)} /> },
    { key: 'createdAt', header: '생성일', width: 160, render: (r) => formatYmdHm(r.createdAt) },
  ];

  const toggleAll = (checked: boolean) => setSelected(checked ? items.map((k: any)=>k.keyId) : []);
  const toggleRow = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);

  const handleBulkDelete = async () => {
    try {
      for (const id of selected) { 
        await deleteAdminOpenApi(id); 
      }
      setSelected([]); 
      refetch();
      setError(null); // 에러 메시지 초기화
    } catch (error) {
      console.error('OpenAPI 키 삭제 중 오류:', error);
      setError('OpenAPI 키 삭제 중 오류가 발생했습니다.');
    }
  };

  // API 요청 처리 화면으로 이동
  const handleGoToRequests = () => {
    navigate(ROUTES.ADMIN.OPENAPI.REQUESTS);
  };

  return (
    <Box id="admin-openapi-clients-page">
      <AdminPageHeader />
      
      {/* 에러 알림 */}
      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}
      
      <Box sx={{ p: SPACING.LARGE }}>
        {/* API 요청 처리 버튼 - pending 상태가 있을 때만 표시 */}
        {pendingCount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <ThemedButton 
              variant="primary" 
              onClick={handleGoToRequests}
              sx={{ 
                backgroundColor: '#ff9800',
                '&:hover': { backgroundColor: '#f57c00' }
              }}
            >
              API 요청 처리 ({pendingCount})
            </ThemedButton>
          </Box>
        )}

        <ListScaffold
        title="Open API 인증 키관리"
        loading={isLoading}
        errorText={isError ? '목록을 불러오는 중 오류가 발생했습니다.' : undefined}
        emptyText={isEmpty ? '표시할 OpenAPI 키가 없습니다.' : ''}
        search={{
          value: search,
          onChange: (v) => {
            setSearch(v);
            setQuery({ search: v, page: 1, limit, activeYn, sort }, { replace: true });
          },
          placeholder: '키/설명/사용자 검색'
        }}
        filters={[
          {
            label: '상태',
            value: activeYn,
            options: [
              { value: '', label: '전체' },
              { value: 'Y', label: '활성' },
              { value: 'N', label: '비활성' }
            ],
            onChange: (v: string) => {
              setActiveYn(v);
              setQuery({ activeYn: v, page: 1, limit, search, sort }, { replace: true });
            }
          },
          {
            label: '정렬',
            value: sort,
            options: [
              { value: 'name-asc', label: '이름순' },
              { value: 'createdAt-desc', label: '생성순(최신)' },
              { value: 'updatedAt-desc', label: '업데이트순(최신)' }
            ],
            onChange: (v: string) => {
              const nv = v || 'name-asc';
              setSort(nv);
              setQuery({ sort: nv, page: 1, limit, activeYn, search }, { replace: true });
            }
          }
        ]}
        pagination={{
          page,
          totalPages,
          onPageChange: (p) => {
            setPage(p);
            setQuery({ page: p, limit, search, activeYn, sort }, { replace: true });
          },
          pageSize: limit,
          onPageSizeChange: (s) => {
            setLimit(s);
            setPage(1);
            setQuery({ page: 1, limit: s, search, activeYn, sort }, { replace: true });
          }
        }}
        wrapInCard={false}
        actionsRight={
          <ThemedButton 
            variant="outlined" 
            onClick={handleBulkDelete} 
            disabled={selected.length === 0}
          >
            선택 삭제
          </ThemedButton>
        }
      >
        <DataTable
          id="admin-openapi-table"
          columns={columns}
          rows={items}
          getRowId={(r) => r.keyId}
          selectedIds={selected}
          onToggleRow={(id) => toggleRow(id as number)}
          onToggleAll={toggleAll}
          emptyText={isEmpty ? '표시할 항목이 없습니다.' : undefined}
        />
        </ListScaffold>
      </Box>
    </Box>
  );
}


