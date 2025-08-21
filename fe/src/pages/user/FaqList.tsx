import { useState, useEffect } from 'react';
import { Box, Typography, Stack, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ThemedCard from '../../components/common/ThemedCard';
import ListScaffold from '../../components/common/ListScaffold';
// import PageTitle from '../components/common/PageTitle';
// import ThemedButton from '../components/common/ThemedButton';
import { useQuerySync } from '../../hooks/useQuerySync';
// import EmptyState from '../../components/common/EmptyState';
// import LoadingSpinner from '../../components/LoadingSpinner';
// import Pagination from '../../components/common/Pagination';
import SelectField from '../../components/common/SelectField';
// import ListTotal from '../../components/common/ListTotal';
import { ExpandMore } from '@mui/icons-material';
import { PAGINATION } from '../../constants/pagination';
import { SPACING } from '../../constants/spacing';
import { useDataFetching } from '../../hooks/useDataFetching';
import { usePagination } from '../../hooks/usePagination';
import { getUserFaqList, getUserFaqListByType, getCommonCodesByGroupId, getUserFaqDetail } from '../../api';
import type { UserFaqItem } from '@iitp-dabt/common';
import { useErrorHandler, type UseErrorHandlerResult } from '../../hooks/useErrorHandler';

export default function FaqList() {
  const navigate = useNavigate();
  const muiTheme = useTheme();

  const [faqType, setFaqType] = useState<string>('ALL');
  const [faqTypeOptions, setFaqTypeOptions] = useState<{ value: string; label: string }[]>([
    { value: 'ALL', label: '전체' }
  ]);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  const pagination = usePagination({ initialLimit: PAGINATION.DEFAULT_PAGE_SIZE });
  const { query, setQuery } = useQuerySync({ page: 1, limit: pagination.pageSize, faqType: 'ALL', search: '', faqId: '' });
  const errorHandler: UseErrorHandlerResult = useErrorHandler();

  const { data: faqTypeCodes, isLoading: faqTypeLoading } = useDataFetching({ fetchFunction: () => getCommonCodesByGroupId('faq_type'), autoFetch: true });

  useEffect(() => {
    if (faqTypeCodes) {
      const options = [ { value: 'ALL', label: '전체' }, ...faqTypeCodes.codes.map((code: any) => ({ value: code.codeId, label: code.codeNm })) ];
      setFaqTypeOptions(options);
    }
  }, [faqTypeCodes]);

  const { data: faqData, isLoading, isEmpty, isError, refetch } = useDataFetching({
    fetchFunction: () => (faqType === 'ALL' ? getUserFaqList({ page: pagination.currentPage, limit: pagination.pageSize, search: query.search || undefined }) : getUserFaqListByType(faqType, { page: pagination.currentPage, limit: pagination.pageSize })),
    dependencies: [pagination.currentPage, pagination.pageSize, faqType, query.search],
    autoFetch: true,
    onError: (msg) => errorHandler.setInlineError(msg)
  });

  useEffect(() => { if (faqData) pagination.handlePageSizeChange(faqData.limit); }, [faqData]);

  const handlePageChange = (page: number) => { pagination.handlePageChange(page); setQuery({ page }, { replace: true }); };
  const handleFaqTypeChange = (newFaqType: string) => { setFaqType(newFaqType); setQuery({ faqType: newFaqType, page: 1 }); setExpandedFaq(null); pagination.handlePageChange(1); };
  const handleFaqExpand = async (faqId: number) => {
    const nextExpanded = expandedFaq === faqId ? null : faqId;
    setExpandedFaq(nextExpanded);
    // 상세 조회 호출로 조회수 증가 (백엔드가 증가 처리함)
    if (nextExpanded === faqId) {
      try {
        // 세션당 1회 증가: sessionStorage에 체크
        const key = `faq_viewed_${faqId}`;
        const alreadyViewed = sessionStorage.getItem(key) === '1';
        if (!alreadyViewed) {
          await getUserFaqDetail(faqId);
          sessionStorage.setItem(key, '1');
        } else {
          // 이미 본 경우 증가 스킵 요청
          await getUserFaqDetail(faqId, { skipHit: true });
        }
        // 목록 갱신하여 증가된 조회수 반영
        refetch();
      } catch (e) {
        // 조회 실패는 무시하고 UI는 그대로 유지
      }
    }
  };

  // 홈에서 넘어온 faqId가 있으면 자동 확장 처리
  useEffect(() => {
    const paramFaqId = Number(query.faqId);
    if (paramFaqId && !Number.isNaN(paramFaqId) && expandedFaq !== paramFaqId) {
      // 목록이 로드된 후에 확장
      if (faqData?.items?.some((f: any) => Number(f.faqId) === paramFaqId)) {
        setExpandedFaq(paramFaqId);
        // 상세 조회 호출하여 조회수 증가
        // 세션당 1회 증가 처리
        const key = `faq_viewed_${paramFaqId}`;
        const alreadyViewed = sessionStorage.getItem(key) === '1';
        getUserFaqDetail(paramFaqId, { skipHit: alreadyViewed })
          .then(() => refetch())
          .catch(() => {});
        if (!alreadyViewed) {
          sessionStorage.setItem(key, '1');
        }
      }
    }
  }, [query.faqId, faqData]);

  return (
    <Box id="faq-list-page" sx={{ minHeight: '100vh', background: muiTheme.palette.background.default, py: SPACING.LARGE }}>
      <Box id="faq-list-container" sx={{ mx: 'auto', px: { xs: SPACING.MEDIUM, md: SPACING.LARGE } }}>
        {errorHandler.InlineError}

        <ListScaffold
          title="FAQ"
          onBack={() => navigate('/')}
          search={{ value: query.search || '', onChange: (v)=> setQuery({ search: v, page: 1 }), placeholder: '질문/답변 검색' }}
          total={faqData?.total}
          loading={isLoading}
          errorText={isError ? 'FAQ를 불러오는 중 오류가 발생했습니다.' : ''}
          emptyText={isEmpty ? '등록된 FAQ가 없습니다.' : ''}
          preContent={(
            <ThemedCard id="faq-type-card" sx={{ mb: SPACING.LARGE }}>
              <Box id="faq-type-card-body" sx={{ p: SPACING.LARGE }}>
                <Typography id="faq-type-title" variant="h6" sx={{ color: muiTheme.palette.text.primary, mb: SPACING.MEDIUM, fontWeight: 500 }}>
                  FAQ 유형 선택
                </Typography>
                <SelectField id="faq-type-select" value={faqType} onChange={handleFaqTypeChange} options={faqTypeOptions} label="FAQ 유형" disabled={faqTypeLoading} />
              </Box>
            </ThemedCard>
          )}
          pagination={{ page: pagination.currentPage, totalPages: faqData?.totalPages || 0, onPageChange: handlePageChange, pageSize: pagination.pageSize, onPageSizeChange: (size)=>{ pagination.handlePageSizeChange(size); setQuery({ limit: size, page: 1 }); } }}
          wrapInCard={false}
        >
          <Stack id="faq-list-stack" spacing={1}>
            {faqData?.items.map((faq: UserFaqItem) => (
              <Accordion id={`faq-item-${faq.faqId}`} key={faq.faqId} expanded={expandedFaq === faq.faqId} onChange={() => handleFaqExpand(faq.faqId)} sx={{ '&:before': { display: 'none' }, border: `1px solid ${muiTheme.palette.divider}`, borderRadius: 2, mb: 1, '&.Mui-expanded': { borderColor: muiTheme.palette.primary.main, boxShadow: muiTheme.shadows[2] } }}>
                <AccordionSummary id={`faq-item-summary-${faq.faqId}`} expandIcon={<ExpandMore />} sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center' } }}>
                  <Box id={`faq-item-header-${faq.faqId}`} sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Chip id={`faq-item-type-${faq.faqId}`} label={faqTypeOptions.find(opt => opt.value === faq.faqType)?.label ?? faq.faqType} color="primary" size="small" sx={{ mr: 2 }} />
                    <Typography id={`faq-item-question-${faq.faqId}`} variant="h6" sx={{ color: muiTheme.palette.text.primary, fontWeight: 500, flex: 1 }}>
                      Q. {faq.question}
                    </Typography>
                    <Typography id={`faq-item-hit-${faq.faqId}`} variant="caption" sx={{ color: muiTheme.palette.text.secondary, ml: 2 }}>
                      조회수: {faq.hitCnt}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails id={`faq-item-details-${faq.faqId}`} sx={{ backgroundColor: 'action.hover', borderTop: `1px solid ${muiTheme.palette.divider}` }}>
                  <Typography id={`faq-item-answer-${faq.faqId}`} variant="body1" sx={{ color: muiTheme.palette.text.primary, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </ListScaffold>
      </Box>
    </Box>
  );
} 