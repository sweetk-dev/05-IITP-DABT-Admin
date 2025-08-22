import React, { useState } from 'react';
import { Box, CardContent, Stack } from '@mui/material';
import { AdminPanelSettings as OperatorIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAdminRole } from '../../store/user';
import { hasAccountManagementPermission } from '../../utils/auth';
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

// 임시 운영자 데이터 (실제로는 API에서 가져옴)
const mockOperators = [
  {
    id: 1,
    loginId: 'admin001',
    name: '시스템 관리자',
    email: 'admin@example.com',
    role: 'S-ADMIN',
    status: 'ACTIVE',
    lastLoginAt: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    loginId: 'admin002',
    name: '일반 관리자',
    email: 'manager@example.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    lastLoginAt: '2024-01-14T15:45:00Z',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 3,
    loginId: 'admin003',
    name: '편집자',
    email: 'editor@example.com',
    role: 'EDITOR',
    status: 'ACTIVE',
    lastLoginAt: '2024-01-13T09:20:00Z',
    createdAt: '2024-01-03T00:00:00Z'
  }
];

export default function OperatorManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminRole = getAdminRole();
  const canManage = hasAccountManagementPermission(adminRole);

  // ROUTE_META에서 페이지 정보 동적 가져오기
  const pageMeta = (ROUTE_META as any)[ROUTES.ADMIN.OPERATORS.LIST];
  const pageTitle = pageMeta?.title || '운영자 관리';

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selected, setSelected] = useState<Array<number>>([]);
  const [sort, setSort] = useState('name-asc');

  const { query, setQuery } = useQuerySync({
    page: 1, limit: 10, search: '', status: '', role: '', sort: 'name-asc'
  });

  React.useEffect(() => {
    if (query.page) setPage(Number(query.page) || 1);
    if (query.limit) setLimit(Number(query.limit) || 10);
    if (query.search !== undefined) setSearch(query.search);
    if (query.status !== undefined) setStatus(query.status);
    if (query.role !== undefined) setRole(query.role);
    if (query.sort) setSort(query.sort);
  }, [query.page, query.limit, query.search, query.status, query.role, query.sort]);

  const { data, isLoading, isEmpty, isError, refetch } = useDataFetching({
    fetchFunction: () => {
      return Promise.resolve({
        operators: mockOperators,
        total: mockOperators.length,
        totalPages: Math.ceil(mockOperators.length / limit)
      });
    },
    dependencies: [page, limit, search, status, role, sort]
  });

  const operators = (data as any)?.operators || [];
  const totalPages = (data as any)?.totalPages || 0;

  const columns: Array<DataTableColumn<any>> = [
    {
      key: 'loginId', header: '로그인 ID', render: (r) => (
        <span
          style={{ cursor: 'pointer', color: '#1976d2' }}
          onClick={() => navigate(`/admin/operators/${r.id}`)}
        >
          {r.loginId}
        </span>
      )
    },
    { key: 'name', header: '이름' },
    { key: 'email', header: '이메일' },
    {
      key: 'role', header: '역할', render: (r) => (
        <StatusChip
          kind={r.role === 'S-ADMIN' ? 'error' : r.role === 'ADMIN' ? 'warning' : r.role === 'EDITOR' ? 'info' : 'default'}
          label={r.role}
        />
      )
    },
    {
      key: 'status', header: '상태', render: (r) => (
        <StatusChip
          kind={r.status === 'ACTIVE' ? 'success' : r.status === 'INACTIVE' ? 'warning' : 'error'}
          label={r.status === 'ACTIVE' ? '활성' : r.status === 'INACTIVE' ? '비활성' : '정지'}
        />
      )
    },
    { key: 'lastLoginAt', header: '최근 로그인', width: 160, render: (r) => formatYmdHm(r.lastLoginAt) },
    { key: 'createdAt', header: '생성일', width: 160, render: (r) => formatYmdHm(r.createdAt) }
  ];

  const toggleAll = (checked: boolean) => setSelected(checked ? operators.map((o: any) => o.id) : []);
  const toggleRow = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleBulkDelete = async () => {
    console.log('선택된 운영자 삭제:', selected);
    setSelected([]);
    refetch();
  };

  const handleCreateOperator = () => {
    navigate('/admin/operators/create');
  };

  return (
    <Box id="admin-operator-list-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader
        id="admin-operator-list-header"
        title={pageTitle}
        search={{
          value: search,
          onChange: (v) => {
            setSearch(v);
            setQuery({ search: v, page: 1, limit, status, role, sort }, { replace: true });
          },
          placeholder: '로그인 ID/이름/이메일 검색'
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
              setQuery({ status: v, page: 1, limit, search, role, sort }, { replace: true });
            }
          },
          {
            label: '역할',
            value: role,
            options: [
              { value: '', label: '전체' },
              { value: 'S-ADMIN', label: 'S-ADMIN' },
              { value: 'ADMIN', label: 'ADMIN' },
              { value: 'EDITOR', label: 'EDITOR' },
              { value: 'VIEWER', label: 'VIEWER' }
            ],
            onChange: (v: string) => {
              setRole(v);
              setQuery({ role: v, page: 1, limit, search, status, sort }, { replace: true });
            }
          },
          {
            label: '정렬',
            value: sort,
            options: [
              { value: 'name-asc', label: '이름순' },
              { value: 'createdAt-desc', label: '생성순(최신)' },
              { value: 'lastLoginAt-desc', label: '로그인순(최신)' },
            ],
            onChange: (v: string) => {
              const nv = v || 'name-asc';
              setSort(nv);
              setQuery({ sort: nv, page: 1, limit, status, role, search }, { replace: true });
            }
          }
        ]}
      />

      <ListScaffold
        title=""
        total={(data as any)?.total}
        loading={isLoading}
        errorText={isError ? '운영자 목록을 불러오는 중 오류가 발생했습니다.' : ''}
        emptyText={isEmpty ? '표시할 운영자가 없습니다.' : ''}
        pagination={{
          page,
          totalPages,
          onPageChange: (p) => {
            setPage(p);
            setQuery({ page: p, limit, search, status, role, sort }, { replace: true });
          },
          pageSize: limit,
          onPageSizeChange: (s) => {
            setLimit(s);
            setPage(1);
            setQuery({ page: 1, limit: s, search, status, role, sort }, { replace: true });
          }
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ mb: 1 }}>
            <div />
            <Stack direction="row" spacing={1}>
              {canManage && (
                <ThemedButton
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateOperator}
                  buttonSize="cta"
                >
                  운영자 추가
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
            id="admin-operator-table"
            columns={columns}
            rows={operators}
            getRowId={(r) => r.id}
            selectedIds={selected}
            onToggleRow={(id) => toggleRow(id as number)}
            onToggleAll={toggleAll}
            emptyText={isEmpty ? '표시할 운영자가 없습니다.' : undefined}
          />
        </CardContent>
      </ListScaffold>
    </Box>
  );
}
