import React, { useState } from 'react';
import { Box, CardContent, Stack } from '@mui/material';
import { 
  Code as CodeIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
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
import { 
  getCommonCodesByGroupIdDetail, 
  deleteCommonCodeList,
  updateCommonCode,
  createCommonCode
} from '../../api/commonCode';
import type { CommonCodeByGroupDetailRes } from '@iitp-dabt/common';

export default function CodeGroupDetail() {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const adminRole = getAdminRole();
  const canManage = hasAccountManagementPermission(adminRole);
  
  // ROUTE_META에서 페이지 정보 동적 가져오기
  const pageMeta = (ROUTE_META as any)[ROUTES.ADMIN.CODE.DETAIL];
  const pageTitle = pageMeta?.title || `코드 관리 - ${groupId}`;

  const [search, setSearch] = useState('');
  const [useYn, setUseYn] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selected, setSelected] = useState<Array<string>>([]);
  const [sort, setSort] = useState('sortOrder-asc');
  const [error, setError] = useState<string | null>(null);
  
  const { query, setQuery } = useQuerySync({ 
    page: 1, 
    limit: 10, 
    search: '', 
    useYn: '',
    sort: 'sortOrder-asc' 
  });

  React.useEffect(() => {
    if (query.page) setPage(Number(query.page) || 1);
    if (query.limit) setLimit(Number(query.limit) || 10);
    if (query.search !== undefined) setSearch(query.search);
    if (query.useYn !== undefined) setUseYn(query.useYn);
    if (query.sort) setSort(query.sort);
  }, [query.page, query.limit, query.search, query.useYn, query.sort]);

  // 그룹별 코드 목록 조회
  const { data, isLoading, isEmpty, isError, refetch } = useDataFetching({
    fetchFunction: () => getCommonCodesByGroupIdDetail(groupId!),
    dependencies: [groupId]
  });

  // 필터링된 코드 목록
  const filteredCodes = React.useMemo(() => {
    if (!data?.codes) return [];
    
    let codes = data.codes;
    
    // 검색 필터
    if (search) {
      codes = codes.filter((code: any) => 
        code.codeId?.toLowerCase().includes(search.toLowerCase()) ||
        code.codeNm?.toLowerCase().includes(search.toLowerCase()) ||
        code.codeDes?.toLowerCase().includes(search.toLowerCase())  // ✅ description → codeDes로 수정
      );
    }
    
    // 사용여부 필터
    if (useYn) {
      codes = codes.filter((code: any) => code.useYn === useYn);
    }
    
    return codes;
  }, [data?.codes, search, useYn]);

  // 정렬된 코드 목록
  const sortedCodes = React.useMemo(() => {
    const [key, order] = sort.split('-');
    
    return [...filteredCodes].sort((a: any, b: any) => {
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
    { key: 'codeId', header: '코드 ID' },
    { key: 'codeNm', header: '코드명' },
    { key: 'codeDes', header: '설명' },  // ✅ description → codeDes로 수정
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

  const toggleAll = (checked: boolean) => setSelected(checked ? paginatedCodes.map((c: any) => c.codeId) : []);
  const toggleRow = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleCreateCode = () => {
    // TODO: 코드 생성 다이얼로그 구현
    console.log('코드 생성');
  };

  const handleEditGroup = () => {
    // TODO: 그룹 정보 수정 다이얼로그 구현
    console.log('그룹 정보 수정');
  };

  const handleBackToList = () => {
    navigate('/admin/code');
  };

  return (
    <Box id="admin-code-group-detail-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader 
        id="admin-code-group-detail-header" 
        title={pageTitle}
        backButton={{
          onClick: handleBackToList,
          label: '그룹 목록으로'
        }}
        search={{ 
          value: search, 
          onChange: (v) => { 
            setSearch(v); 
            setQuery({ search: v, page: 1, limit, useYn, sort }, { replace: true }); 
          }, 
          placeholder: '코드 ID/코드명/설명 검색' 
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
              { value: 'sortOrder-asc', label: '정렬순서순' },
              { value: 'codeId-asc', label: '코드 ID순' },
              { value: 'createdAt-desc', label: '생성순(최신)' },
            ], 
            onChange: (v: string) => { 
              const nv = v || 'sortOrder-asc'; 
              setSort(nv); 
              setQuery({ sort: nv, page: 1, limit, search, useYn }, { replace: true }); 
            } 
          }
        ]} 
      />
      
      {/* 에러 알림 */}
      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}
      
      <ListScaffold
        title={`${groupId} 그룹 코드 관리`}
        total={sortedCodes.length}
        loading={isLoading}
        errorText={isError ? '코드 목록을 불러오는 중 오류가 발생했습니다.' : ''}
        emptyText={sortedCodes && sortedCodes.length > 0 ? undefined : '표시할 코드가 없습니다.'}
        selectable={{
          enabled: true,
          items: sortedCodes,
          getId: (code) => code.codeId,
          onSelectionChange: (selected) => setSelected(selected as string[]),
          renderCheckbox: true,
          deleteConfig: {
            apiFunction: async (ids: (number | string)[]) => {
              // 코드 일괄 삭제 API 호출
              await deleteCommonCodeList(ids);
            },
            confirmTitle: '코드 삭제 확인',
            confirmMessage: '선택된 코드들을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.',
            successMessage: '선택된 코드들이 삭제되었습니다.',
            errorMessage: '코드 삭제 중 오류가 발생했습니다.',
            onDeleteSuccess: () => {
              refetch();
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
                <>
                  <ThemedButton 
                    variant="outlined" 
                    startIcon={<EditIcon />} 
                    onClick={handleEditGroup}
                    buttonSize="default"
                  >
                    그룹 정보 수정
                  </ThemedButton>
                  <ThemedButton 
                    variant="primary" 
                    startIcon={<AddIcon />} 
                    onClick={handleCreateCode}
                    buttonSize="default"
                  >
                    코드 추가
                  </ThemedButton>
                </>
              )}
            </Stack>
          </Stack>
          
          <DataTable
            id="admin-code-group-detail-table"
            columns={columns}
            rows={paginatedCodes}
            getRowId={(r) => r.codeId}
            selectedIds={selected}
            onToggleRow={(id) => toggleRow(id as string)}
            onToggleAll={toggleAll}
            emptyText={isEmpty ? '표시할 코드가 없습니다.' : undefined}
          />
        </CardContent>
      </ListScaffold>
    </Box>
  );
}
