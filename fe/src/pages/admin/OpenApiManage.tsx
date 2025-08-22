import React, { useState } from 'react';
import { Box, CardContent, Typography, Stack } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import Pagination from '../../components/common/Pagination';
import { SPACING } from '../../constants/spacing';
import { useDataFetching } from '../../hooks/useDataFetching';
import { getAdminOpenApiList, deleteAdminOpenApi } from '../../api';
import DataTable, { type DataTableColumn } from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import ThemedButton from '../../components/common/ThemedButton';
import { useQuerySync } from '../../hooks/useQuerySync';
import { formatYmdHm } from '../../utils/date';
import { getOpenApiKeyStatus } from '../../utils/openApiStatus';

export default function AdminOpenApiClients() {
  const [search, setSearch] = useState('');
  const [activeYn, setActiveYn] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selected, setSelected] = useState<Array<number>>([]);
  const [sort, setSort] = useState('name-asc');
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

  const columns: Array<DataTableColumn<any>> = [
    { key: 'keyName', header: '이름', render: (r) => <span style={{ cursor: 'pointer' }} onClick={()=>window.location.assign(`/admin/openapi/clients/${r.keyId}`)}>{r.keyName || `Key ${r.keyId}`}</span> },
    { key: 'activeYn', header: '상태', render: (r) => <StatusChip kind={getOpenApiKeyStatus(r)} /> },
    { key: 'createdAt', header: '생성일', width: 160, render: (r) => formatYmdHm(r.createdAt) },
  ];

  const toggleAll = (checked: boolean) => setSelected(checked ? items.map((k: any)=>k.keyId) : []);
  const toggleRow = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);

  const handleBulkDelete = async () => {
    for (const id of selected) { await deleteAdminOpenApi(id); }
    setSelected([]); refetch();
  };

  return (
    <Box id="admin-openapi-clients-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader id="admin-openapi-clients-header" title="OpenAPI 인증키 관리" search={{ value: search, onChange: (v)=>{ setSearch(v); setQuery({ search: v, page: 1, limit, activeYn, sort }, { replace: true }); }, placeholder: '키/설명/사용자 검색' }} filters={[
        { label: '상태', value: activeYn, options: [{ value: '', label: '전체' }, { value: 'Y', label: '활성' }, { value: 'N', label: '비활성' }], onChange: (v: string)=>{ setActiveYn(v); setQuery({ activeYn: v, page: 1, limit, search, sort }, { replace: true }); } },
        { label: '정렬', value: sort, options: [
          { value: 'name-asc', label: '이름순' },
          { value: 'createdAt-desc', label: '생성순(최신)' },
          { value: 'updatedAt-desc', label: '업데이트순(최신)' },
        ], onChange: (v: string)=> { const nv = v || 'name-asc'; setSort(nv); setQuery({ sort: nv, page: 1, limit, activeYn, search }, { replace: true }); } }
      ]} />
      <ThemedCard>
        <CardContent>
          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mb: 1 }}>
            <ThemedButton variant="outlined" onClick={handleBulkDelete} disabled={selected.length === 0} buttonSize="cta">선택 삭제</ThemedButton>
          </Stack>
          {isLoading ? (
            <Typography variant="body2">불러오는 중...</Typography>
          ) : isError ? (
            <Typography variant="body2" color="error.main">목록을 불러오는 중 오류가 발생했습니다.</Typography>
          ) : (
            <DataTable
              id="admin-openapi-table"
              columns={columns}
              rows={items}
              getRowId={(r)=>r.keyId}
              selectedIds={selected}
              onToggleRow={(id)=>toggleRow(id as number)}
              onToggleAll={toggleAll}
              emptyText={isEmpty ? '표시할 항목이 없습니다.' : undefined}
            />
          )}
          {totalPages > 1 && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p)=>{ setPage(p); setQuery({ page: p, limit, search, activeYn, sort }, { replace: true }); }} pageSize={limit} onPageSizeChange={(s)=>{ setLimit(s); setPage(1); setQuery({ page: 1, limit: s, search, activeYn, sort }, { replace: true }); }} />
            </Box>
          )}
        </CardContent>
      </ThemedCard>
    </Box>
  );
}


