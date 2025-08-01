import { useState, useEffect } from 'react';
import { Box, Typography, Stack, Chip, Divider } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getThemeColors } from '../theme';
import ThemedCard from '../components/common/ThemedCard';
import PageTitle from '../components/common/PageTitle';
import ThemedButton from '../components/common/ThemedButton';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowBack, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { useDataFetching } from '../hooks/useDataFetching';
import { getUserQnaDetail, getUserQnaList } from '../api';
import { SPACING } from '../constants/spacing';
import type { QnaItem } from '../types/api';

export default function QnaDetail() {
  const navigate = useNavigate();
  const { qnaId } = useParams<{ qnaId: string }>();
  const theme = 'user';
  const colors = getThemeColors(theme);

  const [allQnas, setAllQnas] = useState<QnaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const {
    data: qna,
    isLoading,
    isEmpty,
    isError,
    refetch
  } = useDataFetching({
    fetchFunction: () => getUserQnaDetail(Number(qnaId)),
    dependencies: [qnaId],
    autoFetch: !!qnaId
  });

  // 전체 Q&A 목록을 가져와서 이전/다음 글 기능 구현
  useEffect(() => {
    const fetchAllQnas = async () => {
      try {
        const response = await getUserQnaList({ page: 1, limit: 1000 });
        setAllQnas(response.items);
        
        // 현재 Q&A의 인덱스 찾기
        const index = response.items.findIndex(q => q.qnaId === Number(qnaId));
        setCurrentIndex(index);
      } catch (error) {
        console.error('전체 Q&A 목록 조회 실패:', error);
      }
    };

    if (qnaId) {
      fetchAllQnas();
    }
  }, [qnaId]);

  const handleBackToList = () => {
    navigate('/qna');
  };

  const handlePreviousQna = () => {
    if (currentIndex > 0) {
      const prevQna = allQnas[currentIndex - 1];
      navigate(`/qna/${prevQna.qnaId}`);
    }
  };

  const handleNextQna = () => {
    if (currentIndex < allQnas.length - 1) {
      const nextQna = allQnas[currentIndex + 1];
      navigate(`/qna/${nextQna.qnaId}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const maskAuthorName = (name: string) => {
    if (name.length <= 2) return name;
    return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  };

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allQnas.length - 1;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: colors.background,
       //Ｐ가 이상하면 ４로 수정 현재는 ３임
        py: SPACING.LARGE
      }}
    >
      <Box
        sx={{
          maxWidth: 1000,
          mx: 'auto',
          //Ｐ가 이상하면 ４로 수정 현재는 ３임 
          px: { xs: SPACING.MEDIUM, md: SPACING.LARGE }
        }}
      >
        {/* 헤더 */}
        {/* Ｐ가 이상하면 ４로 수정 현재는 ３임 */}
        <Box sx={{ mb: SPACING.LARGE }}>
          <ThemedButton
            theme={theme}
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBackToList}
            sx={{ mb: SPACING.MEDIUM }}
          >
            목록으로
          </ThemedButton>
          <PageTitle title="Q&A" theme={theme} />
        </Box>

        {/* Q&A 상세 */}
        <ThemedCard theme={theme}>
          {isLoading ? (
            <Box sx={{ position: 'relative', minHeight: 400 }}>
              <LoadingSpinner loading={true} />
            </Box>
          ) : isError ? (
            <EmptyState 
              message="Q&A를 불러오는 중 오류가 발생했습니다." 
              theme={theme}
            />
          ) : isEmpty ? (
            <EmptyState 
              message="Q&A를 찾을 수 없습니다." 
              theme={theme}
            />
          ) : qna ? (
            //Ｐ가 이상하면 ４로 수정 현재는 ３임
            <Box sx={{ p: SPACING.LARGE }}>
              {/* 헤더 정보 */}
              <Box sx={{ mb: SPACING.LARGE }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: SPACING.MEDIUM, flexWrap: 'wrap' }}>
                  <Chip
                    label={qna.publicYn === 'Y' ? '공개' : '비공개'}
                    color={qna.publicYn === 'Y' ? 'success' : 'default'}
                    size="medium"
                    sx={{ mr: SPACING.MEDIUM, mb: SPACING.SMALL }}
                  />
                  <Chip
                    label={qna.qnaType}
                    color="primary"
                    size="medium"
                    sx={{ mr: SPACING.MEDIUM, mb: SPACING.SMALL }}
                  />
                  <Chip
                    label={qna.answeredYn === 'Y' ? '답변완료' : '답변대기'}
                    color={qna.answeredYn === 'Y' ? 'success' : 'warning'}
                    size="medium"
                    sx={{ mr: SPACING.MEDIUM, mb: SPACING.SMALL }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.textSecondary,
                      ml: 'auto',
                      mb: SPACING.SMALL
                    }}
                  >
                    {formatDate(qna.postedAt)}
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: colors.text,
                    fontWeight: 600,
                    mb: SPACING.MEDIUM
                  }}
                >
                  {qna.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.textSecondary,
                    mb: SPACING.SMALL
                  }}
                >
                  작성자: {maskAuthorName(qna.authorName)}
                </Typography>
              </Box>

              <Divider sx={{ mb: SPACING.LARGE }} />

              {/* 질문 내용 */}
              {/* Ｐ가 이상하면 ４로 수정 현재는 ３임 */}
              <Box sx={{ mb: SPACING.LARGE }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: colors.text,
                    fontWeight: 500,
                    mb: SPACING.MEDIUM
                  }}
                >
                  질문
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: colors.text,
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                    backgroundColor: `${colors.primary}05`,
                    p: SPACING.LARGE,
                    borderRadius: 2,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  {qna.content}
                </Typography>
              </Box>

              {/* 답변 내용 */}
              {qna.answeredYn === 'Y' && qna.answerContent && (
                //Ｐ가 이상하면 ４로 수정 현재는 ３임 */}
                <Box sx={{ mb: SPACING.LARGE }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: colors.text,
                      fontWeight: 500,
                      mb: SPACING.MEDIUM
                    }}
                  >
                    답변
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: colors.text,
                      lineHeight: 1.8,
                      whiteSpace: 'pre-wrap',
                      backgroundColor: `${colors.secondary}10`,
                      p: SPACING.LARGE,
                      borderRadius: 2,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    {qna.answerContent}
                  </Typography>
                  {qna.answeredAt && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.textSecondary,
                        display: 'block',
                        mt: SPACING.SMALL,
                        textAlign: 'right'
                      }}
                    >
                      답변일: {formatDate(qna.answeredAt)}
                    </Typography>
                  )}
                </Box>
              )}

              {/* 네비게이션 버튼 */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                pt: SPACING.LARGE,
                borderTop: `1px solid ${colors.border}`
              }}>
                <ThemedButton
                  theme={theme}
                  variant="outlined"
                  startIcon={<NavigateBefore />}
                  onClick={handlePreviousQna}
                  disabled={!hasPrevious}
                >
                  이전글
                </ThemedButton>

                <ThemedButton
                  theme={theme}
                  variant="outlined"
                  onClick={handleBackToList}
                >
                  목록
                </ThemedButton>

                <ThemedButton
                  theme={theme}
                  variant="outlined"
                  endIcon={<NavigateNext />}
                  onClick={handleNextQna}
                  disabled={!hasNext}
                >
                  다음글
                </ThemedButton>
              </Box>
            </Box>
          ) : null}
        </ThemedCard>
      </Box>
    </Box>
  );
} 