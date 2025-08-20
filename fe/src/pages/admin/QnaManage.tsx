import React, { useState } from 'react';
import { Box, CardContent, Typography, Stack } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import Pagination from '../../components/common/Pagination';
import { SPACING } from '../../constants/spacing';
import { useDataFetching } from '../../hooks/useDataFetching';
import { getAdminQnaList, deleteAdminQna } from '../../api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes';
import DataTable, { type DataTableColumn } from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import QnaTypeChip from '../../components/common/QnaTypeChip';
import ThemedButton from '../../components/common/ThemedButton';
import { useQuerySync } from '../../hooks/useQuerySync';

export default function AdminQnaList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selected, setSelected] = useState<Array<number>>([]);
  const [sort, setSort] = useState('name-asc');
  const { query, setQuery } = useQuerySync({ page: 1, limit: 10, search: '', status: '', sort: 'name-asc' });

  React.useEffect(() => {
    if (query.page) setPage(Number(query.page) || 1);
    if (query.limit) setLimit(Number(query.limit) || 10);
    if (query.search !== undefined) setSearch(query.search);
    if (query.status !== undefined) setStatus(query.status);
    if (query.sort) setSort(query.sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, query.limit, query.search, query.status, query.sort]);

  const { data, isLoading, isEmpty, isError, refetch } = useDataFetching({
    fetchFunction: () => getAdminQnaList({ page, limit, search, status, sort } as any),
    dependencies: [page, limit, search, status, sort]
  });

  const raw = (data as any)?.items || (data as any)?.qnas || [];
  const qnas = [...raw].sort((a: any, b: any) => {
    const [key, order] = sort.split('-');
    const av = key === 'name' ? (a.title ?? '') : (a[`${key}`] ?? '');
    const bv = key === 'name' ? (b.title ?? '') : (b[`${key}`] ?? '');
    if (key === 'name') return av.localeCompare(bv) * (order === 'asc' ? 1 : -1);
    return (new Date(av).getTime() - new Date(bv).getTime()) * (order === 'asc' ? 1 : -1);
  });
  const totalPages = (data as any)?.totalPages || 0;

  const columns: Array<DataTableColumn<any>> = [
    { key: 'title', header: '제목', render: (r) => (
      <span style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={()=>navigate(ROUTES.ADMIN.QNA.DETAIL.replace(':id', String(r.qnaId)))}>
        {r.secretYn === 'Y' && (<StatusChip kind="private" />)}
        {r.title}
      </span>
    ) },
    { key: 'qnaType', header: '유형', render: (r) => <QnaTypeChip typeId={r.qnaType} label={r.qnaTypeName || r.qnaType} /> },
    { key: 'status', header: '상태', render: (r) => <StatusChip kind={r.answeredYn === 'Y' ? 'answered' : 'pending'} /> },
    { key: 'postedAt', header: '등록일', width: 160 },
  ];

  const toggleAll = (checked: boolean) => setSelected(checked ? qnas.map((q: any)=>q.qnaId) : []);
  const toggleRow = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);

  const handleBulkDelete = async () => {
    for (const id of selected) { await deleteAdminQna(id); }
    setSelected([]); refetch();
  };

  return (
    <Box id="admin-qna-list-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader id="admin-qna-list-header" title="Q&A 관리" search={{ value: search, onChange: (v)=>{ setSearch(v); setQuery({ search: v, page: 1, limit, status, sort }, { replace: true }); }, placeholder: '제목/내용 검색' }} filters={[
        { label: '상태', value: status, options: [{ value: '', label: '전체' }, { value: 'answered', label: '답변완료' }, { value: 'pending', label: '답변대기' }], onChange: (v: string)=>{ setStatus(v); setQuery({ status: v, page: 1, limit, search, sort }, { replace: true }); } },
        { label: '정렬', value: sort, options: [
          { value: 'name-asc', label: '이름순' },
          { value: 'createdAt-desc', label: '생성순(최신)' },
          { value: 'updatedAt-desc', label: '업데이트순(최신)' },
        ], onChange: (v: string)=> { const nv = v || 'name-asc'; setSort(nv); setQuery({ sort: nv, page: 1, limit, status, search }, { replace: true }); } }
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
              id="admin-qna-table"
              columns={columns}
              rows={qnas}
              getRowId={(r)=>r.qnaId}
              selectedIds={selected}
              onToggleRow={(id)=>toggleRow(id as number)}
              onToggleAll={toggleAll}
              emptyText={isEmpty ? '표시할 항목이 없습니다.' : undefined}
            />
          )}
          {totalPages > 1 && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p)=>{ setPage(p); setQuery({ page: p, limit, search, status, sort }, { replace: true }); }} pageSize={limit} onPageSizeChange={(s)=>{ setLimit(s); setPage(1); setQuery({ page: 1, limit: s, search, status, sort }, { replace: true }); }} />
            </Box>
          )}
        </CardContent>
      </ThemedCard>
    </Box>
  );
}


