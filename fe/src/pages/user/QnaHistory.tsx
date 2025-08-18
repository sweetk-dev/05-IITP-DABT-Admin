import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Accordion,
  AccordionDetails,
  Alert,
  Divider
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { getUserQnaList, getUserQnaDetail } from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
// import ErrorAlert from '../../components/ErrorAlert';
import Pagination from '../../components/common/Pagination';
import { ROUTES } from '../../routes';
import { PAGINATION } from '../../constants/pagination';
import PageTitle from '../../components/common/PageTitle';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
// import { getThemeColors } from '../../theme';
import { useDataFetching } from '../../hooks/useDataFetching';
import { usePagination } from '../../hooks/usePagination';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import type { UserQnaDetailRes } from '@iitp-dabt/common';

interface QnaHistoryProps {
  id?: string;
}

export const QnaHistory: React.FC<QnaHistoryProps> = ({ id = 'qna-history' }) => {
  const navigate = useNavigate();
  const [expandedQna, setExpandedQna] = useState<number | null>(null);
  const [qnaDetails, setQnaDetails] = useState<Record<number, UserQnaDetailRes>>({});
  
  // 테마 설정 (사용자 페이지는 'user' 테마)
  // const theme: 'user' | 'admin' = 'user';
  // const colors = getThemeColors(theme);

  // Pagination 훅 사용
  const pagination = usePagination({
    initialLimit: PAGINATION.DEFAULT_PAGE_SIZE
  });

  // 데이터 페칭 훅 사용
  const {
    data: qnaList,
    isLoading: loading,
    isEmpty,
    isError,
    // refetch
  } = useDataFetching({
    fetchFunction: () => getUserQnaList({
      page: pagination.currentPage,
      limit: pagination.pageSize
    }),
    dependencies: [pagination.currentPage, pagination.pageSize],
    autoFetch: true
  });

  // 페이지 크기 동기화
  useEffect(() => {
    if (qnaList) {
      pagination.handlePageSizeChange(qnaList.limit);
    }
  }, [qnaList]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    pagination.handlePageChange(page);
  };

  const handleQnaExpand = async (qnaId: number) => {
    if (expandedQna === qnaId) {
      setExpandedQna(null);
      return;
    }

    setExpandedQna(qnaId);

    // 이미 로드된 상세 정보가 있으면 재사용
    if (qnaDetails[qnaId]) {
      return;
    }

    try {
      const response = await getUserQnaDetail(qnaId);
      
      // handleApiResponse를 사용하여 에러 코드별 자동 처리
      handleApiResponse(response, 
        (data) => {
          setQnaDetails(prev => ({
            ...prev,
            [qnaId]: data
          }));
        },
        (errorMessage) => {
          console.error('QnA 상세 정보 로드 실패:', errorMessage);
        }
      );
    } catch (err) {
      console.error('QnA 상세 정보 로드 실패:', err);
    }
  };

  const handleBack = () => {
    navigate(ROUTES.USER.DASHBOARD);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (loading) {
    return <LoadingSpinner loading={true} />;
  }

  return (
    <Box id={id} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ThemedButton
          id="back-btn"
          
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          뒤로가기
        </ThemedButton>
        <PageTitle title="내 문의 내역" />
      </Box>

      <ThemedCard>
        {loading ? (
          <Box sx={{ position: 'relative', minHeight: 400 }}>
            <LoadingSpinner loading={true} />
          </Box>
        ) : isError ? (
          <CardContent>
            <Alert severity="error">
              문의 내역을 불러오는 중 오류가 발생했습니다.
            </Alert>
          </CardContent>
        ) : isEmpty ? (
          <CardContent>
            <Alert severity="info">
              등록된 문의가 없습니다.
            </Alert>
          </CardContent>
        ) : (
          <CardContent>
            {qnaList?.items && qnaList.items.length > 0 && (
            <List>
              {qnaList.items.map((qna: any, index: number) => (
                <React.Fragment key={qna.qnaId}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {qna.title}
                          </Typography>
                          <Chip
                            label={qna.status === 'answered' ? '답변완료' : '답변대기'}
                            color={qna.status === 'answered' ? 'success' : 'warning'}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(qna.createdAt)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            유형: {qna.qnaType} • {qna.secretYn === 'Y' ? '비공개' : '공개'}
                          </Typography>
                        </Box>
                      }
                    />
                    <ThemedButton
                      id={`expand-qna-${qna.qnaId}`}
                      
                      variant="outlined"
                      size="small"
                      onClick={() => handleQnaExpand(qna.qnaId)}
                    >
                      {expandedQna === qna.qnaId ? '접기' : '상세보기'}
                    </ThemedButton>
                  </ListItem>
                  
                  {expandedQna === qna.qnaId && (
                    <Accordion expanded={true} sx={{ boxShadow: 'none' }}>
                      <AccordionDetails>
                        <Box sx={{ pl: 2, pr: 2, pb: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            문의 내용
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                            {qna.content}
                          </Typography>
                          
                          {qnaDetails[qna.qnaId]?.qna.answerContent && (
                            <>
                              <Divider sx={{ my: 2 }} />
                              <Typography variant="h6" gutterBottom>
                                답변
                              </Typography>
                              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                {qnaDetails[qna.qnaId].qna.answerContent}
                              </Typography>
                              {qnaDetails[qna.qnaId].qna.answeredAt && (
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                  답변일: {qnaDetails[qna.qnaId].qna.answeredAt ? formatDate(qnaDetails[qna.qnaId].qna.answeredAt || '') : '-'}
                                </Typography>
                              )}
                            </>
                          )}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  )}
                  
                  {index < qnaList.items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            )}

            {/* 페이지네이션 */}
            {qnaList && qnaList.totalPages > 1 && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={qnaList.totalPages}
                  onPageChange={handlePageChange}
                  
                />
              </Box>
            )}
          </CardContent>
        )}
      </ThemedCard>
    </Box>
  );
}; 