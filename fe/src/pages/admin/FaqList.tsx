import React, { useEffect, useState } from 'react';
import { Add as AddIcon } from '@mui/icons-material';
import { Box, CardContent, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import Pagination from '../../components/common/Pagination';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { useDataFetching } from '../../hooks/useDataFetching';
import { getAdminFaqList, deleteAdminFaq } from '../../api';
import DataTable, { type DataTableColumn } from '../../components/common/DataTable';
import { useQuerySync } from '../../hooks/useQuerySync';

export default function AdminFaqList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selected, setSelected] = useState<Array<number>>([]);
  const [sort, setSort] = useState('name-asc');
  const { query, setQuery } = useQuerySync({ page: 1, limit: 10, search: '', sort: 'name-asc' });

  // initialize from query
  React.useEffect(() => {
    if (query.page) setPage(Number(query.page) || 1);
    if (query.limit) setLimit(Number(query.limit) || 10);
    if (query.search !== undefined) setSearch(query.search);
    if (query.sort) setSort(query.sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, query.limit, query.search, query.sort]);

  const { data, isLoading, isEmpty, isError, refetch } = useDataFetching({
    fetchFunction: () => getAdminFaqList({ page, limit, search, sort } as any),
    dependencies: [page, limit, search, sort],
    autoFetch: true
  });

  useEffect(() => { /* refetch triggered by dependencies */ }, [page, limit, search, refetch]);

  const itemsRaw = (data as any)?.items || (data as any)?.faqs || [];
  const items = [...itemsRaw].sort((a: any, b: any) => {
    const [key, order] = sort.split('-');
    const av = key === 'name' ? (a.title ?? a.question ?? '') : (a[`${key}`] ?? '');
    const bv = key === 'name' ? (b.title ?? b.question ?? '') : (b[`${key}`] ?? '');
    if (key === 'name') {
      return (av || '').localeCompare(bv || '') * (order === 'asc' ? 1 : -1);
    }
    return (new Date(av).getTime() - new Date(bv).getTime()) * (order === 'asc' ? 1 : -1);
  });
  const totalPages = (data as any)?.totalPages || 0;

  const columns: Array<DataTableColumn<any>> = [
    { key: 'title', header: '제목', render: (r) => <span style={{ cursor: 'pointer' }} onClick={()=>navigate(ROUTES.ADMIN.FAQ.DETAIL.replace(':id', String(r.faqId)))}>{r.title}</span> },
    { key: 'createdAt', header: '등록일', width: 160 },
  ];

  const toggleAll = (checked: boolean) => setSelected(checked ? items.map((f: any)=>f.faqId) : []);
  const toggleRow = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);

  const handleBulkDelete = async () => {
    for (const id of selected) { await deleteAdminFaq(id); }
    setSelected([]); refetch();
  };

  return (
    <Box id="admin-faq-list-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader
        id="admin-faq-list-header"
        title="FAQ 관리"
        actionsRight={
          <ThemedButton id="admin-faq-create-btn" variant="primary" size="small" startIcon={<AddIcon />} onClick={() => navigate(ROUTES.ADMIN.FAQ.CREATE)} buttonSize="cta">등록</ThemedButton>
        }
        search={{ value: search, onChange: (v)=>{ setSearch(v); setQuery({ search: v, page: 1, limit, sort }, { replace: true }); }, placeholder: '제목/내용 검색' }}
        filters={[{ label: '정렬', value: sort, options: [
          { value: 'name-asc', label: '이름순' },
          { value: 'createdAt-desc', label: '생성순(최신)' },
          { value: 'updatedAt-desc', label: '업데이트순(최신)' },
        ], onChange: (v: string)=> { const nv = v || 'name-asc'; setSort(nv); setQuery({ sort: nv, page: 1, limit }, { replace: true }); } }]}
      />

      <ThemedCard id="admin-faq-list-card">
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
              id="admin-faq-table"
              columns={columns}
              rows={items}
              getRowId={(r)=>r.faqId}
              selectedIds={selected}
              onToggleRow={(id)=>toggleRow(id as number)}
              onToggleAll={toggleAll}
              emptyText={isEmpty ? '표시할 항목이 없습니다.' : undefined}
            />
          )}
          {totalPages > 1 && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p)=>{ setPage(p); setQuery({ page: p, limit, sort }, { replace: true }); }} pageSize={limit} onPageSizeChange={(s)=>{ setLimit(s); setPage(1); setQuery({ page: 1, limit: s, sort }, { replace: true }); }} />
            </Box>
          )}
        </CardContent>
      </ThemedCard>
    </Box>
  );
}


