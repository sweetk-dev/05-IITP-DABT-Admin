import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Divider
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  QuestionAnswer as QnaIcon
} from '@mui/icons-material';
import { getUserQnaList, getUserQnaDetail } from '../../api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorAlert } from '../../components/ErrorAlert';
import { ROUTES } from '../../routes';
import PageTitle from '../../components/common/PageTitle';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { getThemeColors } from '../../theme';
import type { UserQnaListRes, UserQnaDetailRes } from '@iitp-dabt/common';

interface QnaHistoryProps {
  id?: string;
}

export const QnaHistory: React.FC<QnaHistoryProps> = ({ id = 'qna-history' }) => {
  const navigate = useNavigate();
  const [qnaList, setQnaList] = useState<UserQnaListRes | null>(null);
  const [expandedQna, setExpandedQna] = useState<number | null>(null);
  const [qnaDetails, setQnaDetails] = useState<Record<number, UserQnaDetailRes>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 테마 설정 (사용자 페이지는 'user' 테마)
  const theme: 'user' | 'admin' = 'user';
  const colors = getThemeColors(theme);

  useEffect(() => {
    loadQnaHistory();
  }, []);

  const loadQnaHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getUserQnaList({});
      if (response.success) {
        setQnaList(response.data!);
      } else {
        setError(response.errorMessage || '문의 내역을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('문의 내역을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
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
      if (response.success) {
        setQnaDetails(prev => ({
          ...prev,
          [qnaId]: response.data!
        }));
      }
    } catch (err) {
      console.error('QnA 상세 정보 로드 실패:', err);
    }
  };

  const handleBack = () => {
    navigate(ROUTES.USER.DASHBOARD);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box id={id} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ThemedButton
          id="back-btn"
          theme={theme}
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          뒤로가기
        </ThemedButton>
        <PageTitle title="내 문의 내역" theme={theme} />
      </Box>

      {error && <ErrorAlert message={error} />}

      <ThemedCard theme={theme}>
        <CardContent>
          {qnaList?.qnas && qnaList.qnas.length > 0 ? (
            <List>
              {qnaList.qnas.map((qna, index) => (
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
                      theme={theme}
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
                                  답변일: {formatDate(qnaDetails[qna.qnaId].qna.answeredAt)}
                                </Typography>
                              )}
                            </>
                          )}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  )}
                  
                  {index < qnaList.qnas.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Alert severity="info">
              등록된 문의가 없습니다.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}; 