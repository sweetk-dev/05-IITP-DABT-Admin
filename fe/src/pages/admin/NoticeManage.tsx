import React, { useState } from 'react';
import { Add as AddIcon } from '@mui/icons-material';
import { Box, CardContent, Stack } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import ThemedButton from '../../components/common/ThemedButton';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { SPACING } from '../../constants/spacing';
import { useDataFetching } from '../../hooks/useDataFetching';
import { getAdminNoticeList, deleteAdminNotice } from '../../api';
import DataTable, { type DataTableColumn } from '../../components/common/DataTable';
import { useQuerySync } from '../../hooks/useQuerySync';
import ListScaffold from '../../components/common/ListScaffold';

export default function AdminNoticeList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selected, setSelected] = useState<Array<number>>([]);
  const [sort, setSort] = useState('name-asc');
  const { query, setQuery } = useQuerySync({ page: 1, limit: 10, search: '', sort: 'name-asc' });

  React.useEffect(() => {
    if (query.page) setPage(Number(query.page) || 1);
    if (query.limit) setLimit(Number(query.limit) || 10);
    if (query.search !== undefined) setSearch(query.search);
    if (query.sort) setSort(query.sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, query.limit, query.search, query.sort]);

  const { data, isLoading, isEmpty, isError, refetch } = useDataFetching({
    fetchFunction: () => getAdminNoticeList({ page, limit, search, sort } as any),
    dependencies: [page, limit, search, sort]
  });

  const raw = (data as any)?.items || (data as any)?.notices || [];
  const notices = [...raw].sort((a: any, b: any) => {
    const [key, order] = sort.split('-');
    const av = key === 'name' ? (a.title ?? '') : (a[`${key}`] ?? '');
    const bv = key === 'name' ? (b.title ?? '') : (b[`${key}`] ?? '');
    if (key === 'name') return av.localeCompare(bv) * (order === 'asc' ? 1 : -1);
    return (new Date(av).getTime() - new Date(bv).getTime()) * (order === 'asc' ? 1 : -1);
  });
  const totalPages = (data as any)?.totalPages || 0;

  const columns: Array<DataTableColumn<any>> = [
    { key: 'title', header: '제목', render: (n) => <span style={{ cursor: 'pointer' }} onClick={()=>navigate(ROUTES.ADMIN.NOTICES.DETAIL.replace(':id', String(n.noticeId)))}>{n.title}</span> },
    { key: 'postedAt', header: '게시일', width: 160 },
  ];

  const toggleAll = (checked: boolean) => setSelected(checked ? notices.map((n: any)=>n.noticeId) : []);
  const toggleRow = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);

  const handleBulkDelete = async () => {
    for (const id of selected) { await deleteAdminNotice(id); }
    setSelected([]); refetch();
  };

  return (
    <Box id="admin-notice-list-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader id="admin-notice-list-header" title="공지사항 관리" actionsRight={<ThemedButton variant="primary" size="small" startIcon={<AddIcon />} onClick={()=>navigate(ROUTES.ADMIN.NOTICES.CREATE)} buttonSize="cta">등록</ThemedButton>} search={{ value: search, onChange: (v)=>{ setSearch(v); setQuery({ search: v, page: 1, limit, sort }, { replace: true }); }, placeholder: '제목/내용 검색' }} filters={[{ label: '정렬', value: sort, options: [
        { value: 'name-asc', label: '이름순' },
        { value: 'postedAt-desc', label: '생성순(최신)' },
        { value: 'updatedAt-desc', label: '업데이트순(최신)' },
      ], onChange: (v: string)=> { const nv = v || 'name-asc'; setSort(nv); setQuery({ sort: nv, page: 1, limit }, { replace: true }); } }]} />
      <ListScaffold
        title=""
        total={(data as any)?.total}
        loading={isLoading}
        errorText={isError ? '목록을 불러오는 중 오류가 발생했습니다.' : ''}
        emptyText={isEmpty ? '표시할 항목이 없습니다.' : ''}
        pagination={{ page, totalPages, onPageChange: (p)=>{ setPage(p); setQuery({ page: p, limit, sort }, { replace: true }); }, pageSize: limit, onPageSizeChange: (s)=>{ setLimit(s); setPage(1); setQuery({ page: 1, limit: s, sort }, { replace: true }); } }}
      >
        <CardContent>
          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mb: 1 }}>
            <ThemedButton variant="dangerSoft" onClick={handleBulkDelete} disabled={selected.length === 0} buttonSize="cta">선택 삭제</ThemedButton>
          </Stack>
          <DataTable
            id="admin-notice-table"
            columns={columns}
            rows={notices}
            getRowId={(r)=>r.noticeId}
            selectedIds={selected}
            onToggleRow={(id)=>toggleRow(id as number)}
            onToggleAll={toggleAll}
            emptyText={isEmpty ? '표시할 항목이 없습니다.' : undefined}
          />
        </CardContent>
      </ListScaffold>
    </Box>
  );
}


