import React, { useState } from 'react';
import { Box, CardContent, Stack } from '@mui/material';
import { People as UserIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAdminRole } from '../../store/user';
import { hasUserAccountEditPermission } from '../../utils/auth';
import { SPACING } from '../../constants/spacing';
import { ROUTES, ROUTE_META } from '../../routes';
import PageHeader from '../../components/common/PageHeader';
import ListScaffold from '../../components/common/ListScaffold';
import ThemedButton from '../../components/common/ThemedButton';
import DataTable, { type DataTableColumn } from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import { useQuerySync } from '../../hooks/useQuerySync';
import { useDataFetching } from '../../hooks/useDataFetching';
import { formatYmdHm } from '../../utils/date';

// 임시 사용자 데이터 (실제로는 API에서 가져옴)
const mockUsers = [
  {
    id: 1,
    name: '홍길동',
    email: 'hong@example.com',
    status: 'ACTIVE',
    lastLoginAt: '2024-01-15T10:30:00Z',
    openApiKeyCount: 2,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: '김철수',
    email: 'kim@example.com',
    status: 'INACTIVE',
    lastLoginAt: '2024-01-10T15:45:00Z',
    openApiKeyCount: 1,
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 3,
    name: '이영희',
    email: 'lee@example.com',
    status: 'ACTIVE',
    lastLoginAt: '2024-01-14T09:20:00Z',
    openApiKeyCount: 3,
    createdAt: '2024-01-03T00:00:00Z'
  }
];

export default function UserManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminRole = getAdminRole();
  const canEdit = hasUserAccountEditPermission(adminRole);

  // ROUTE_META에서 페이지 정보 동적 가져오기
  const pageMeta = (ROUTE_META as any)[ROUTES.ADMIN.USERS.LIST];
  const pageTitle = pageMeta?.title || '사용자 관리';

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selected, setSelected] = useState<Array<number>>([]);
  const [sort, setSort] = useState('name-asc');

  const { query, setQuery } = useQuerySync({
    page: 1, limit: 10, search: '', status: '', sort: 'name-asc'
  });

  React.useEffect(() => {
    if (query.page) setPage(Number(query.page) || 1);
    if (query.limit) setLimit(Number(query.limit) || 10);
    if (query.search !== undefined) setSearch(query.search);
    if (query.status !== undefined) setStatus(query.status);
    if (query.sort) setSort(query.sort);
  }, [query.page, query.limit, query.search, query.status, query.sort]);

  const { data, isLoading, isEmpty, isError, refetch } = useDataFetching({
    fetchFunction: () => {
      return Promise.resolve({
        users: mockUsers,
        total: mockUsers.length,
        totalPages: Math.ceil(mockUsers.length / limit)
      });
    },
    dependencies: [page, limit, search, status, sort]
  });

  const users = (data as any)?.users || [];
  const totalPages = (data as any)?.totalPages || 0;

  const columns: Array<DataTableColumn<any>> = [
    {
      key: 'name', header: '이름', render: (r) => (
        <span
          style={{ cursor: 'pointer', color: '#1976d2' }}
          onClick={() => navigate(`/admin/users/${r.id}`)}
        >
          {r.name}
        </span>
      )
    },
    { key: 'email', header: '이메일' },
    {
      key: 'status', header: '상태', render: (r) => (
        <StatusChip
          kind={r.status === 'ACTIVE' ? 'success' : r.status === 'INACTIVE' ? 'warning' : 'error'}
          label={r.status === 'ACTIVE' ? '활성' : r.status === 'INACTIVE' ? '비활성' : '정지'}
        />
      )
    },
    {
      key: 'openApiKeyCount', header: 'API 키 수',
      render: (r) => (
        <span style={{
          padding: '4px 8px', backgroundColor: '#e3f2fd', color: '#1976d2', borderRadius: '4px',
          fontSize: '0.875rem'
        }}>
          {r.openApiKeyCount}
        </span>
      )
    },
    { key: 'lastLoginAt', header: '최근 로그인', width: 160, render: (r) => formatYmdHm(r.lastLoginAt) },
    { key: 'createdAt', header: '가입일', width: 160, render: (r) => formatYmdHm(r.createdAt) }
  ];

  const toggleAll = (checked: boolean) => setSelected(checked ? users.map((u: any) => u.id) : []);
  const toggleRow = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleBulkDelete = async () => {
    console.log('선택된 사용자 삭제:', selected);
    setSelected([]);
    refetch();
  };

  const handleCreateUser = () => {
    navigate('/admin/users/create');
  };

  return (
    <Box id="admin-user-list-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader
        id="admin-user-list-header"
        title={pageTitle}
        search={{
          value: search,
          onChange: (v) => {
            setSearch(v);
            setQuery({ search: v, page: 1, limit, status, sort }, { replace: true });
          },
          placeholder: '이름/이메일 검색'
        }}
        filters={[
          {
            label: '상태',
            value: status,
            options: [
              { value: '', label: '전체' },
              { value: 'ACTIVE', label: '활성' },
              { value: 'INACTIVE', label: '비활성' },
              { value: 'SUSPENDED', label: '정지' }
            ],
            onChange: (v: string) => {
              setStatus(v);
              setQuery({ status: v, page: 1, limit, search, sort }, { replace: true });
            }
          },
          {
            label: '정렬',
            value: sort,
            options: [
              { value: 'name-asc', label: '이름순' },
              { value: 'createdAt-desc', label: '가입순(최신)' },
              { value: 'lastLoginAt-desc', label: '로그인순(최신)' },
            ],
            onChange: (v: string) => {
              const nv = v || 'name-asc';
              setSort(nv);
              setQuery({ sort: nv, page: 1, limit, status, search }, { replace: true });
            }
          }
        ]}
      />

      <ListScaffold
        title=""
        total={(data as any)?.total}
        loading={isLoading}
        errorText={isError ? '사용자 목록을 불러오는 중 오류가 발생했습니다.' : ''}
        emptyText={isEmpty ? '표시할 사용자가 없습니다.' : ''}
        pagination={{
          page,
          totalPages,
          onPageChange: (p) => {
            setPage(p);
            setQuery({ page: p, limit, search, status, sort }, { replace: true });
          },
          pageSize: limit,
          onPageSizeChange: (s) => {
            setLimit(s);
            setPage(1);
            setQuery({ page: 1, limit: s, search, status, sort }, { replace: true });
          }
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ mb: 1 }}>
            <div />
            <Stack direction="row" spacing={1}>
              {canEdit && (
                <ThemedButton
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateUser}
                  buttonSize="cta"
                >
                  사용자 추가
                </ThemedButton>
              )}
              {canEdit && (
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
            id="admin-user-table"
            columns={columns}
            rows={users}
            getRowId={(r) => r.id}
            selectedIds={selected}
            onToggleRow={(id) => toggleRow(id as number)}
            onToggleAll={toggleAll}
            emptyText={isEmpty ? '표시할 사용자가 없습니다.' : undefined}
          />
        </CardContent>
      </ListScaffold>
    </Box>
  );
}
