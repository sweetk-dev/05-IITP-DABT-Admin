import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CardContent, Typography, Stack } from '@mui/material';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ListScaffold from '../../components/common/ListScaffold';
import ErrorAlert from '../../components/ErrorAlert';
import { SPACING } from '../../constants/spacing';
import { useDataFetching } from '../../hooks/useDataFetching';
import { getAdminOpenApiList } from '../../api';
import DataTable, { type DataTableColumn } from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import ThemedButton from '../../components/common/ThemedButton';
import { useQuerySync } from '../../hooks/useQuerySync';
import { formatYmdHm } from '../../utils/date';
import { getOpenApiKeyStatus } from '../../utils/openApiStatus';
import { ROUTES } from '../../routes';

export default function AdminOpenApiRequests() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const { query, setQuery } = useQuerySync({ page: 1, limit: 10, search: '' });

  React.useEffect(() => {
    if (query.page) setPage(Number(query.page) || 1);
    if (query.limit) setLimit(Number(query.limit) || 10);
    if (query.search !== undefined) setSearch(query.search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, query.limit, query.search]);

  // pending 상태만 조회 (activeYn = 'N' AND active_at IS NULL)
  const { data, isLoading, isEmpty, isError, refetch } = useDataFetching({
    fetchFunction: () => getAdminOpenApiList({ 
      page, 
      limit, 
      searchKeyword: search, 
      activeYn: 'N', // pending 상태만
      pendingOnly: true // pending 전용 플래그 (백엔드에서 처리)
    } as any),
    dependencies: [page, limit, search]
  });

  const raw = (data as any)?.items || (data as any)?.authKeys || [];
  const items = raw.filter((item: any) => 
    item.activeYn === 'N' && !item.activeAt // pending 상태만 필터링
  );
  const totalPages = (data as any)?.totalPages || 0;

  const columns: Array<DataTableColumn<any>> = [
    { 
      key: 'keyName', 
      header: '키 이름', 
      render: (r) => (
        <span 
          style={{ cursor: 'pointer', color: '#1976d2' }} 
          onClick={() => navigate(`/admin/openapi/requests/${r.keyId}`)}
        >
          {r.keyName || `Key ${r.keyId}`}
        </span>
      ) 
    },
    { 
      key: 'userId', 
      header: '사용자 ID', 
      render: (r) => r.userId 
    },
    { 
      key: 'keyDesc', 
      header: '사용 목적', 
      render: (r) => r.keyDesc || '-' 
    },
    { 
      key: 'status', 
      header: '상태', 
      render: (r) => <StatusChip kind={getOpenApiKeyStatus(r)} /> 
    },
    { 
      key: 'createdAt', 
      header: '신청일', 
      width: 160, 
      render: (r) => formatYmdHm(r.createdAt) 
    },
  ];

  const handleRequestClick = (keyId: number) => {
    navigate(`/admin/openapi/requests/${keyId}`);
  };

  return (
    <Box id="admin-openapi-requests-page">
      <AdminPageHeader />
      
      {/* 에러 알림 */}
      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}
      
      <Box sx={{ p: SPACING.LARGE }}>
        <ListScaffold
          title="API 신청 요청 목록"
          loading={isLoading}
          errorText={isError ? '목록을 불러오는 중 오류가 발생했습니다.' : undefined}
          emptyText={isEmpty ? '처리할 API 요청이 없습니다.' : ''}
          search={{
            value: search,
            onChange: (v) => {
              setSearch(v);
              setQuery({ search: v, page: 1, limit }, { replace: true });
            },
            placeholder: '키 이름/설명/사용자 검색'
          }}
          pagination={{
            page,
            totalPages,
            onPageChange: (p) => {
              setPage(p);
              setQuery({ page: p, limit, search }, { replace: true });
            },
            pageSize: limit,
            onPageSizeChange: (s) => {
              setLimit(s);
              setPage(1);
              setQuery({ page: 1, limit: s, search }, { replace: true });
            }
          }}
          wrapInCard={false}
          actionsRight={
            <ThemedButton 
              variant="outlined" 
              onClick={() => navigate(ROUTES.ADMIN.OPENAPI.CLIENTS)}
            >
              전체 관리로 이동
            </ThemedButton>
          }
        >
          <DataTable
            id="admin-openapi-requests-table"
            columns={columns}
            rows={items}
            getRowId={(r: any) => r.keyId}
            selectedIds={[]}
            onToggleRow={() => {}}
            onToggleAll={() => {}}
            emptyText={isEmpty ? '처리할 API 요청이 없습니다.' : undefined}
          />
        </ListScaffold>
      </Box>
    </Box>
  );
}


