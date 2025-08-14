import { useState, useEffect } from 'react';
import { Box, Typography, Stack, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ThemedCard from '../components/common/ThemedCard';
import PageTitle from '../components/common/PageTitle';
import ThemedButton from '../components/common/ThemedButton';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import SelectField from '../components/common/SelectField';
import { ArrowBack, ExpandMore } from '@mui/icons-material';
import { PAGINATION } from '../constants/pagination';
import { SPACING } from '../constants/spacing';
import { useDataFetching } from '../hooks/useDataFetching';
import { usePagination } from '../hooks/usePagination';
import { getUserFaqList, getUserFaqListByType, getCommonCodesByGroupId } from '../api';
import type { UserFaqItem } from '@iitp-dabt/common';

export default function FaqList() {
  const navigate = useNavigate();
  const muiTheme = useTheme();

  const [faqType, setFaqType] = useState<string>('ALL');
  const [faqTypeOptions, setFaqTypeOptions] = useState<{ value: string; label: string }[]>([
    { value: 'ALL', label: '전체' }
  ]);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  const pagination = usePagination({ initialLimit: PAGINATION.DEFAULT_PAGE_SIZE });

  const { data: faqTypeCodes, isLoading: faqTypeLoading } = useDataFetching({ fetchFunction: () => getCommonCodesByGroupId('faq_type'), autoFetch: true });

  useEffect(() => {
    if (faqTypeCodes) {
      const options = [ { value: 'ALL', label: '전체' }, ...faqTypeCodes.codes.map((code: any) => ({ value: code.codeId, label: code.codeNm })) ];
      setFaqTypeOptions(options);
    }
  }, [faqTypeCodes]);

  const { data: faqData, isLoading, isEmpty, isError } = useDataFetching({
    fetchFunction: () => (faqType === 'ALL' ? getUserFaqList({ page: pagination.currentPage, limit: pagination.pageSize }) : getUserFaqListByType(faqType, { page: pagination.currentPage, limit: pagination.pageSize })),
    dependencies: [pagination.currentPage, pagination.pageSize, faqType],
    autoFetch: true
  });

  useEffect(() => { if (faqData) pagination.handlePageSizeChange(faqData.limit); }, [faqData]);

  const handlePageChange = (page: number) => pagination.handlePageChange(page);
  const handleFaqTypeChange = (newFaqType: string) => { setFaqType(newFaqType); setExpandedFaq(null); pagination.handlePageChange(1); };
  const handleFaqExpand = (faqId: number) => setExpandedFaq(expandedFaq === faqId ? null : faqId);

  return (
    <Box id="faq-list-page" sx={{ minHeight: '100vh', background: muiTheme.palette.background.default, py: SPACING.LARGE }}>
      <Box id="faq-list-container" sx={{ mx: 'auto', px: { xs: SPACING.MEDIUM, md: SPACING.LARGE } }}>
        {/* 헤더 */}
        <Box sx={{ mb: SPACING.LARGE }}>
          <ThemedButton variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mb: SPACING.MEDIUM }}>
            홈으로
          </ThemedButton>
          <PageTitle title="FAQ" />
        </Box>

        {/* FAQ 타입 선택 */}
        <ThemedCard sx={{ mb: SPACING.LARGE }}>
          <Box sx={{ p: SPACING.LARGE }}>
            <Typography variant="h6" sx={{ color: muiTheme.palette.text.primary, mb: SPACING.MEDIUM, fontWeight: 500 }}>
              FAQ 유형 선택
            </Typography>
            <SelectField value={faqType} onChange={handleFaqTypeChange} options={faqTypeOptions} label="FAQ 유형" disabled={faqTypeLoading} />
          </Box>
        </ThemedCard>

        {/* FAQ 목록 */}
        <ThemedCard>
          {isLoading ? (
            <Box sx={{ position: 'relative', minHeight: 400 }}>
              <LoadingSpinner loading={true} />
            </Box>
          ) : isError ? (
            <EmptyState message="FAQ를 불러오는 중 오류가 발생했습니다." />
          ) : isEmpty ? (
            <EmptyState message="등록된 FAQ가 없습니다." />
          ) : (
            <>
              <Stack spacing={1}>
                {faqData?.items.map((faq: UserFaqItem) => (
                  <Accordion key={faq.faqId} expanded={expandedFaq === faq.faqId} onChange={() => handleFaqExpand(faq.faqId)} sx={{ '&:before': { display: 'none' }, border: `1px solid ${muiTheme.palette.divider}`, borderRadius: 2, mb: 1, '&.Mui-expanded': { borderColor: muiTheme.palette.primary.main, boxShadow: muiTheme.shadows[2] } }}>
                    <AccordionSummary expandIcon={<ExpandMore />} sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center' } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Chip label={faqTypeOptions.find(opt => opt.value === faq.faqType)?.label ?? faq.faqType} color="primary" size="small" sx={{ mr: 2 }} />
                        <Typography variant="h6" sx={{ color: muiTheme.palette.text.primary, fontWeight: 500, flex: 1 }}>
                          Q. {faq.question}
                        </Typography>
                        <Typography variant="caption" sx={{ color: muiTheme.palette.text.secondary, ml: 2 }}>
                          조회수: {faq.hitCnt}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ backgroundColor: 'action.hover', borderTop: `1px solid ${muiTheme.palette.divider}` }}>
                      <Typography variant="body1" sx={{ color: muiTheme.palette.text.primary, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>

              {faqData && faqData.totalPages > 1 && (
                <Pagination currentPage={pagination.currentPage} totalPages={faqData.totalPages} onPageChange={handlePageChange} />
              )}
            </>
          )}
        </ThemedCard>
      </Box>
    </Box>
  );
} 