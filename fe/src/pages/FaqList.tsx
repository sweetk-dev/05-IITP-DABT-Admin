import { useState, useEffect } from 'react';
import { Box, Typography, Stack, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getThemeColors } from '../theme';
import ThemedCard from '../components/common/ThemedCard';
import PageTitle from '../components/common/PageTitle';
import ThemedButton from '../components/common/ThemedButton';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import SelectField from '../components/common/SelectField';
import { ArrowBack, ExpandMore } from '@mui/icons-material';
import { PAGINATION } from '../constants/pagination';
import { useDataFetching } from '../hooks/useDataFetching';
import { usePagination } from '../hooks/usePagination';
import { getUserFaqList, getUserFaqListByType, getCommonCodesByGroupId } from '../api';
import type { FaqItem, CommonCodeItem } from '../types/api';

export default function FaqList() {
  const navigate = useNavigate();
  const theme = 'user';
  const colors = getThemeColors(theme);

  const [faqType, setFaqType] = useState<string>('ALL');
  const [faqTypeOptions, setFaqTypeOptions] = useState<{ value: string; label: string }[]>([
    { value: 'ALL', label: '전체' }
  ]);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  const pagination = usePagination({
    initialLimit: PAGINATION.DEFAULT_PAGE_SIZE
  });

  // FAQ 타입 옵션 조회
  const {
    data: faqTypeCodes,
    isLoading: faqTypeLoading,
    refetch: refetchFaqTypes
  } = useDataFetching({
    fetchFunction: () => getCommonCodesByGroupId('FAQ_TYPE'),
    autoFetch: true
  });

  // FAQ 타입 옵션 설정
  useEffect(() => {
    if (faqTypeCodes) {
      const options = [
        { value: 'ALL', label: '전체' },
        ...faqTypeCodes.map((code: CommonCodeItem) => ({
          value: code.codeValue,
          label: code.codeName
        }))
      ];
      setFaqTypeOptions(options);
    }
  }, [faqTypeCodes]);

  // FAQ 목록 조회
  const {
    data: faqData,
    isLoading,
    isEmpty,
    isError,
    refetch
  } = useDataFetching({
    fetchFunction: () => {
      if (faqType === 'ALL') {
        return getUserFaqList({
          page: pagination.currentPage,
          limit: pagination.pageSize
        });
      } else {
        return getUserFaqListByType(faqType, {
          page: pagination.currentPage,
          limit: pagination.pageSize
        });
      }
    },
    dependencies: [pagination.currentPage, pagination.pageSize, faqType],
    autoFetch: true
  });

  useEffect(() => {
    if (faqData) {
      pagination.handlePageSizeChange(faqData.limit);
    }
  }, [faqData]);

  const handlePageChange = (page: number) => {
    pagination.handlePageChange(page);
  };

  const handleFaqTypeChange = (newFaqType: string) => {
    setFaqType(newFaqType);
    setExpandedFaq(null); // 타입 변경 시 펼쳐진 FAQ 닫기
    pagination.handlePageChange(1); // 첫 페이지로 이동
  };

  const handleFaqExpand = (faqId: number) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getFaqTypeLabel = (type: string) => {
    const option = faqTypeOptions.find(opt => opt.value === type);
    return option ? option.label : type;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: colors.background,
        py: 4
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, md: 4 }
        }}
      >
        {/* 헤더 */}
        <Box sx={{ mb: 4 }}>
          <ThemedButton
            theme={theme}
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ mb: 2 }}
          >
            홈으로
          </ThemedButton>
          <PageTitle title="FAQ" theme={theme} />
        </Box>

        {/* FAQ 타입 선택 */}
        <ThemedCard theme={theme} sx={{ mb: 3 }}>
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: colors.text,
                mb: 2,
                fontWeight: 500
              }}
            >
              FAQ 유형 선택
            </Typography>
            <SelectField
              value={faqType}
              onChange={handleFaqTypeChange}
              options={faqTypeOptions}
              label="FAQ 유형"
              theme={theme}
              disabled={faqTypeLoading}
            />
          </Box>
        </ThemedCard>

        {/* FAQ 목록 */}
        <ThemedCard theme={theme}>
          {isLoading ? (
            <Box sx={{ position: 'relative', minHeight: 400 }}>
              <LoadingSpinner loading={true} />
            </Box>
          ) : isError ? (
            <EmptyState 
              message="FAQ를 불러오는 중 오류가 발생했습니다." 
              theme={theme}
            />
          ) : isEmpty ? (
            <EmptyState 
              message="등록된 FAQ가 없습니다." 
              theme={theme}
            />
          ) : (
            <>
              <Stack spacing={1}>
                {faqData?.items.map((faq: FaqItem) => (
                  <Accordion
                    key={faq.faqId}
                    expanded={expandedFaq === faq.faqId}
                    onChange={() => handleFaqExpand(faq.faqId)}
                    sx={{
                      '&:before': {
                        display: 'none',
                      },
                      border: `1px solid ${colors.border}`,
                      borderRadius: 2,
                      mb: 1,
                      '&.Mui-expanded': {
                        borderColor: colors.primary,
                        boxShadow: `0 4px 12px ${colors.primary}20`
                      }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={{
                        '& .MuiAccordionSummary-content': {
                          alignItems: 'center'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Chip
                          label={getFaqTypeLabel(faq.faqType)}
                          color="primary"
                          size="small"
                          sx={{ mr: 2 }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            color: colors.text,
                            fontWeight: 500,
                            flex: 1
                          }}
                        >
                          Q. {faq.question}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: colors.textSecondary,
                            ml: 2
                          }}
                        >
                          조회수: {faq.hitCount}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        backgroundColor: `${colors.primary}05`,
                        borderTop: `1px solid ${colors.border}`
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: colors.text,
                          lineHeight: 1.8,
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>

              {/* 페이지네이션 */}
              {faqData && faqData.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={faqData.totalPages}
                  onPageChange={handlePageChange}
                  theme={theme}
                />
              )}
            </>
          )}
        </ThemedCard>
      </Box>
    </Box>
  );
} 