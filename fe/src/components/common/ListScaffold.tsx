import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { Delete as DeleteIcon } from '@mui/icons-material';
import ThemedCard from './ThemedCard';
import LoadingSpinner from '../LoadingSpinner';
import EmptyState from './EmptyState';
import Pagination from './Pagination';
import ListHeader from './ListHeader';
import ListTotal from './ListTotal';
import CommonDialog from '../CommonDialog';
import ThemedButton from './ThemedButton';

type FilterOption = { value: string; label: string };

export interface ListScaffoldProps {
  title: string;
  onBack?: () => void;
  actionsRight?: ReactNode;

  search?: { value: string; onChange: (v: string) => void; placeholder?: string };
  filters?: Array<{ label: string; value: string; options: FilterOption[]; onChange: (v: string) => void }>;

  total?: number;

  loading?: boolean;
  errorText?: string;
  emptyText?: string;

  children: ReactNode;
  preContent?: ReactNode;

  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
    pageSize?: number;
    onPageSizeChange?: (s: number) => void;
  };

  // 전체 선택 기능 (admin 화면용)
  selectable?: {
    enabled: boolean;                    // 체크박스 기능 활성화 여부
    items: any[];                       // 아이템 목록
    getId: (item: any) => number | string; // ID 추출 함수
    onSelectionChange: (selected: (number | string)[]) => void; // 선택 변경 콜백
    renderCheckbox?: boolean;            // 개별 체크박스 렌더링 여부 (기본값: true)
    // 삭제 기능 관련
    deleteConfig?: {
      apiFunction: (ids: (number | string)[]) => Promise<void>; // 삭제 API 함수
      confirmTitle?: string;             // 삭제 확인 다이얼로그 제목
      confirmMessage?: string;           // 삭제 확인 다이얼로그 메시지
      successMessage?: string;           // 삭제 성공 메시지
      errorMessage?: string;             // 삭제 실패 메시지
      onDeleteSuccess?: () => void;      // 삭제 성공 후 콜백
    };
  };

  // whether to wrap body in a card. default: true
  wrapInCard?: boolean;
}

export default function ListScaffold({
  title,
  onBack,
  actionsRight,
  search,
  filters = [],
  total,
  loading,
  errorText,
  emptyText,
  children,
  preContent,
  pagination,
  wrapInCard = true,
  selectable,
}: ListScaffoldProps) {
  const showPagination = !!pagination && (pagination.totalPages || 0) > 0;
  
  // selectable이 활성화된 경우 선택 상태 관리
  const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);
  
  // 삭제 관련 상태
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // selectable.items가 변경될 때마다 선택 상태 초기화
  useEffect(() => {
    if (selectable?.enabled) {
      setSelectedIds([]);
    }
  }, [selectable?.items, selectable?.enabled]);
  
  // 선택 변경 핸들러
  const handleSelectionChange = (newSelectedIds: (number | string)[]) => {
    setSelectedIds(newSelectedIds);
    selectable?.onSelectionChange(newSelectedIds);
  };
  
  // 삭제 확인 다이얼로그 열기
  const handleDeleteClick = () => {
    if (selectedIds.length > 0) {
      setDeleteDialogOpen(true);
    }
  };
  
  // 삭제 실행
  const handleDeleteConfirm = async () => {
    if (!selectable?.deleteConfig?.apiFunction || selectedIds.length === 0) {
      setDeleteDialogOpen(false);
      return;
    }
    
    setIsDeleting(true);
    try {
      await selectable.deleteConfig.apiFunction(selectedIds);
      
      // 성공 메시지 표시 (필요시)
      if (selectable.deleteConfig.successMessage) {
        console.log(selectable.deleteConfig.successMessage);
      }
      
      // 선택 상태 초기화
      setSelectedIds([]);
      selectable.onSelectionChange([]);
      
      // 성공 콜백 실행
      if (selectable.deleteConfig.onDeleteSuccess) {
        selectable.deleteConfig.onDeleteSuccess();
      }
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      
      // 에러 메시지 표시 (필요시)
      if (selectable.deleteConfig.errorMessage) {
        console.error(selectable.deleteConfig.errorMessage);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ListHeader
        title={title}
        onBack={onBack}
        searchPlaceholder={search?.placeholder}
        searchValue={search?.value}
        onSearchChange={search?.onChange}
        filters={filters}
        totalCount={total}
        showTotalInHeader={false}
      />

             {/* 선택 삭제 버튼과 기존 액션 버튼들 (오른쪽) */}
       {(selectable?.enabled && selectable?.deleteConfig && selectedIds.length > 0) || actionsRight ? (
         <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3, gap: 2 }}>
           {/* 선택 삭제 버튼 */}
           {selectable?.enabled && selectable?.deleteConfig && selectedIds.length > 0 && (
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
               <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                 {selectedIds.length}개 선택됨
               </Typography>
               <ThemedButton
                 variant="danger"
                 startIcon={<DeleteIcon />}
                 onClick={handleDeleteClick}
                 disabled={isDeleting}
                 size="small"
               >
                 {isDeleting ? '삭제 중...' : '선택 삭제'}
               </ThemedButton>
             </Box>
           )}
           
           {/* 기존 액션 버튼들 */}
           {actionsRight && (
             <Box sx={{ display: 'flex', gap: 1 }}>
               {actionsRight}
             </Box>
           )}
         </Box>
       ) : null}

       {preContent}

       <ListTotal 
         total={total} 
         selectable={selectable?.enabled ? {
           ...selectable,
           selectedIds,
           onSelectionChange: handleSelectionChange
         } : undefined} 
       />

      {wrapInCard ? (
        <ThemedCard sx={{ boxShadow: 0 }}>
          {loading ? (
            <Box sx={{ position: 'relative', minHeight: 400 }}>
              <LoadingSpinner loading={true} />
            </Box>
          ) : errorText ? (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="error.main">{errorText}</Typography>
            </Box>
          ) : emptyText ? (
            <EmptyState message={emptyText} />
          ) : (
            children
          )}

          {showPagination && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                currentPage={pagination!.page}
                totalPages={pagination!.totalPages}
                onPageChange={pagination!.onPageChange}
                pageSize={pagination!.pageSize}
                onPageSizeChange={pagination!.onPageSizeChange}
              />
            </Box>
          )}
        </ThemedCard>
      ) : (
        <>
          {loading ? (
            <Box sx={{ position: 'relative', minHeight: 400 }}>
              <LoadingSpinner loading={true} />
            </Box>
          ) : errorText ? (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="error.main">{errorText}</Typography>
            </Box>
          ) : emptyText ? (
            <EmptyState message={emptyText} />
          ) : (
            children
          )}

          {showPagination && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                currentPage={pagination!.page}
                totalPages={pagination!.totalPages}
                onPageChange={pagination!.onPageChange}
                pageSize={pagination!.pageSize}
                onPageSizeChange={pagination!.onPageSizeChange}
              />
            </Box>
          )}
        </>
      )}
      
      {/* 삭제 확인 다이얼로그 */}
      {selectable?.deleteConfig && (
        <CommonDialog
          open={deleteDialogOpen}
          title={selectable.deleteConfig.confirmTitle || '삭제 확인'}
          message={selectable.deleteConfig.confirmMessage || `선택된 ${selectedIds.length}개 항목을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          showCancel={true}
          confirmText="삭제"
          cancelText="취소"
        />
      )}
    </>
  );
}


