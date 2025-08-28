import { useState, useEffect } from 'react';
import { Box, Stack, Chip, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon } from '@mui/icons-material';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ListScaffold from '../../components/common/ListScaffold';
import ListItemCard from '../../components/common/ListItemCard';
import ThemedButton from '../../components/common/ThemedButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { getAdminFaqList, deleteAdminFaq, deleteAdminFaqList } from '../../api/faq';
import { getCommonCodesByGroupId } from '../../api';
import { useDataFetching } from '../../hooks/useDataFetching';
import { usePagination } from '../../hooks/usePagination';
import { PAGINATION } from '../../constants/pagination';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { formatYmdHm } from '../../utils/date';
import { hasContentEditPermission } from '../../utils/auth';
import { getAdminRole } from '../../store/user';
import { COMMON_CODE_GROUPS } from '@iitp-dabt/common';
import type { AdminFaqListItem, AdminFaqListQuery } from '@iitp-dabt/common';

export default function FaqList() {
  const navigate = useNavigate();
  const adminRole = getAdminRole();

  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // 선택된 FAQ 항목들
  const [selectedFaqs, setSelectedFaqs] = useState<number[]>([]);
  
  // 페이지네이션
  const pagination = usePagination({ initialLimit: PAGINATION.DEFAULT_PAGE_SIZE });
  
  // 공통 코드 조회 (FAQ 타입)
  const { data: faqTypeCodes, isLoading: faqTypeLoading } = useDataFetching({ 
    fetchFunction: () => getCommonCodesByGroupId(COMMON_CODE_GROUPS.FAQ_TYPE), 
    autoFetch: true 
  });
  
  // FAQ 타입 옵션 생성 (User FaqList와 동일한 방식)
  const [faqTypeOptions, setFaqTypeOptions] = useState<{ value: string; label: string }[]>([
    { value: '', label: '전체' }
  ]);
  
  useEffect(() => {
    if (faqTypeCodes?.codes) {
      const options = [
        { value: '', label: '전체' },
        ...faqTypeCodes.codes.map((code: any) => ({ 
          value: code.codeId, 
          label: code.codeNm 
        }))
      ];
      setFaqTypeOptions(options);
    }
  }, [faqTypeCodes]);
  
  
  // API 데이터 페칭
  const {
    data: faqData,
    isLoading,
    isError,
    refetch,
    status
  } = useDataFetching({
    fetchFunction: () => getAdminFaqList({
      page: pagination.currentPage,
      limit: pagination.pageSize,
      ...(searchTerm && { searchTerm }),
      ...(selectedCategory && { faqType: selectedCategory }),
      ...(selectedStatus && { useYn: selectedStatus })
    } as AdminFaqListQuery),
    dependencies: [pagination.currentPage, pagination.pageSize, searchTerm, selectedCategory, selectedStatus]
  });

  // error 상태 추출 - useDataFetching의 state에서 error 추출
  const error = status === 'error' ? (faqData as any)?.error : undefined;

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    pagination.handlePageChange(page);
  };

  // 검색 핸들러
  const handleSearch = () => {
    pagination.handlePageChange(1);
    refetch();
  };

  // 필터 변경 시 자동 refetch
  useEffect(() => {
    refetch();
  }, [selectedCategory, selectedStatus, refetch]);

  // FAQ 타입별 라벨 (User FaqList와 동일한 방식)
  const getTypeLabel = (faqType: string) => {
    // faqType을 대문자로 변환해서 비교 (BE에서 소문자로 오고, 공통코드는 대문자)
    const option = faqTypeOptions.find(opt => opt.value === faqType);
    return option ? option.label : faqType;
  };

  // // FAQ 타입별 색상 (User FaqList와 동일한 방식)
  // const getTypeColor = (faqType: string): 'primary' | 'info' | 'success' | 'warning' | 'default' => {
  //   const option = faqTypeOptions.find(opt => opt.value === faqType);
  //   if (!option) return 'default';
    
  //   // faqTypeOptions의 순서에 따라 색상 매핑
  //   const colors: ('primary' | 'info' | 'success' | 'warning' | 'default')[] = ['primary', 'info', 'success', 'warning'];
  //   const index = faqTypeOptions.findIndex(opt => opt.value === faqType);
  //   return index >= 0 && index < colors.length ? colors[index] : 'default';
  // };

  // FAQ 사용 여부별 라벨
  const getUseYnLabel = (useYn: string) => {
    switch (useYn) {
      case 'Y': return '사용';
      case 'N': return '미사용';
      default: return useYn;
    }
  };

  // FAQ 사용 여부별 색상
  const getUseYnColor = (useYn: string): 'success' | 'default' => {
    switch (useYn) {
      case 'Y': return 'success';
      case 'N': return 'default';
      default: return 'default';
    }
  };

  const handleFaqClick = (faqId: number) => {
    navigate(`/admin/faqs/${faqId}`);
  };

  const handleCreateFaq = () => {
    navigate(ROUTES.ADMIN.FAQ.CREATE);
  };

  const isEmpty = !faqData?.items || faqData.items.length === 0;

  if (isLoading) {
    return <LoadingSpinner loading={true} />;
  }

  if (isError && error) {
    return <ErrorAlert error={error} />;
  }

  // 개별 FAQ 선택/해제
  const handleFaqSelect = (faqId: number, checked: boolean) => {
    if (checked) {
      setSelectedFaqs(prev => [...prev, faqId]);
    } else {
      setSelectedFaqs(prev => prev.filter(id => id !== faqId));
    }
  };





  return (
    <Box id="admin-faq-list-page">
      <AdminPageHeader />

      <Box sx={{ p: SPACING.LARGE }}>
        <ListScaffold
        title="FAQ 관리"
        loading={isLoading}
        emptyText={isEmpty ? '등록된 FAQ가 없습니다.' : ''}
        search={{
          value: searchTerm,
          onChange: setSearchTerm,
          placeholder: 'FAQ 제목으로 검색...'
        }}
          actionsRight={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {hasContentEditPermission(adminRole) && (
              <ThemedButton
                variant="primary"
                startIcon={<AddIcon />}
                onClick={handleCreateFaq}
              >
                FAQ 추가
              </ThemedButton>
            )}

          </Box>
        }
                 filters={[
           {
             label: '타입',
             value: selectedCategory,
             options: faqTypeLoading ? [
               { value: '', label: '로딩 중...' }
             ] : faqTypeOptions,
             onChange: setSelectedCategory
           },
          {
            label: '사용여부',
            value: selectedStatus,
            options: [
              { value: '', label: '전체' },
              { value: 'Y', label: '사용' },
              { value: 'N', label: '미사용' }
            ],
            onChange: setSelectedStatus
          }
        ]}
        pagination={{
          page: pagination.currentPage,
          totalPages: faqData?.totalPages || 0,
          onPageChange: handlePageChange,
          pageSize: pagination.pageSize,
          onPageSizeChange: (size) => {
            pagination.handlePageSizeChange(size);
          }
        }}
        wrapInCard={false}
                  selectable={{
            enabled: true,
            items: faqData?.items || [],
            getId: (faq) => faq.faqId,
            onSelectionChange: (selected) => setSelectedFaqs(selected as number[]),
            renderCheckbox: true,
            deleteConfig: {
              apiFunction: async (ids: (number | string)[]) => {
                // LIST_DELETE API 호출 - 일괄 삭제
                await deleteAdminFaqList(ids);
              },
              confirmTitle: 'FAQ 삭제 확인',
              confirmMessage: '선택된 FAQ들을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.',
              successMessage: '선택된 FAQ들이 삭제되었습니다.',
              errorMessage: 'FAQ 삭제 중 오류가 발생했습니다.',
              onDeleteSuccess: () => {
                // 삭제 성공 후 목록 새로고침
                refetch();
              }
            }
          }}
      >
        <Stack id="faq-list-stack" spacing={SPACING.MEDIUM}>
          {faqData?.items.map((faq: AdminFaqListItem) => (
            <ListItemCard 
              id={`faq-item-${faq.faqId}`} 
              key={faq.faqId} 
              onClick={() => handleFaqClick(faq.faqId)}
            >
               <Box id={`faq-item-header-${faq.faqId}`} sx={{ display: 'flex', alignItems: 'center', mb: SPACING.SMALL }}>
                  <Box 
                    onClick={(e) => e.stopPropagation()} 
                    sx={{ mr: SPACING.SMALL }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedFaqs.includes(faq.faqId)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleFaqSelect(faq.faqId, e.target.checked);
                          }}
                          size="small"
                        />
                      }
                      label=""
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Box>
                  <Chip
                   id={`faq-item-type-${faq.faqId}`}
                   label={getTypeLabel(faq.faqType)} 
                   color="primary"
                    size="small"
                   sx={{ mr: SPACING.MEDIUM }} 
                 />
                 <Chip 
                   id={`faq-item-use-yn-${faq.faqId}`}
                   label={getUseYnLabel(faq.useYn)} 
                   color={getUseYnColor(faq.useYn)} 
                    size="small"
                   sx={{ mr: SPACING.MEDIUM }} 
                 />
                 <Typography 
                   id={`faq-item-date-${faq.faqId}`} 
                   variant="caption" 
                   sx={{ color: 'text.secondary', ml: 'auto' }}
                 >
                   {formatYmdHm(faq.createdAt)}
                 </Typography>
                </Box>
               
               <Typography 
                 id={`faq-item-title-${faq.faqId}`} 
                 variant="subtitle1" 
                 sx={{ color: 'text.primary', fontWeight: 600, mb: SPACING.SMALL }}
               >
                 {faq.question}
                </Typography>
              
                             <Box sx={{ display: 'flex', alignItems: 'center', mt: SPACING.SMALL, gap: 2 }}>
                 <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                   조회수: {faq.hitCnt || 0}
                  </Typography>
                 <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                   순서: {faq.sortOrder || 0}
                  </Typography>
                </Box>
            </ListItemCard>
          ))}
        </Stack>
        </ListScaffold>
                </Box>
    </Box>
  );
}
