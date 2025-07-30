import { Box, Typography, Stack, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getThemeColors } from '../theme';
import ThemedButton from '../components/common/ThemedButton';
import ThemedCard from '../components/common/ThemedCard';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowForward } from '@mui/icons-material';
import { OPPEN_API_DOC_URL} from '../config';
import { PAGINATION } from '../constants/pagination';
import { useDataFetching } from '../hooks/useDataFetching';
import { getHomeNoticeList, getHomeFaqList, getHomeQnaList } from '../api';
import type { UserNoticeItem, UserFaqItem, UserQnaItem } from '@iitp-dabt/common';

export default function Home() {
  const navigate = useNavigate();
  const theme = 'user';
  const colors = getThemeColors(theme);
  const openApiDocUrl = OPPEN_API_DOC_URL;
  
  // 공지사항 데이터 페칭
  const {
    data: notices,
    isLoading: noticesLoading,
    isEmpty: noticesEmpty,
    isError: noticesError,
    refetch: refetchNotices
  } = useDataFetching({
    fetchFunction: getHomeNoticeList
  });

  // FAQ 데이터 페칭
  const {
    data: faqs,
    isLoading: faqsLoading,
    isEmpty: faqsEmpty,
    isError: faqsError,
    refetch: refetchFaqs
  } = useDataFetching({
    fetchFunction: getHomeFaqList
  });

  // Q&A 데이터 페칭
  const {
    data: qnas,
    isLoading: qnasLoading,
    isEmpty: qnasEmpty,
    isError: qnasError,
    refetch: refetchQnas
  } = useDataFetching({
    fetchFunction: getHomeQnaList
  });
  
  const handleContentClick = (type: 'notice' | 'faq' | 'qna', id: number) => {
    navigate(`/${type}/${id}`);
  };

  const handleSectionClick = (type: 'notice' | 'faq' | 'qna') => {
    navigate(`/${type}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const renderNoticeSection = () => (
    <Box
      id="notice-section"
      className="home-notice-section"
      flex={1}
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      p={4}
      minWidth={0}
      sx={{ 
        minWidth: { xs: '100%', md: 0 }, 
        maxWidth: { xs: '100%', md: 360 },
        background: 'transparent',
        position: 'relative',
        isolation: 'isolate'
      }}
    >
      <ThemedButton
        theme={theme}
        variant="primary"
        className="home-notice-button"
        onClick={() => handleSectionClick('notice')}
        endIcon={<ArrowForward />}
        sx={{
          width: '100%',
          mb: 2,
          fontSize: '1rem',
          position: 'relative',
          isolation: 'isolate',
          '& .MuiButton-endIcon': {
            position: 'absolute !important',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            isolation: 'isolate'
          }
        }}
      >
        공지사항
      </ThemedButton>
      
      {/* 컨텐츠 영역 테두리 */}
      <Box 
        sx={{ 
          border: `3px solid ${colors.border}`,
          borderRadius: 3,
          p: 3,
          background: 'transparent',
          flex: 1,
          minHeight: 200,
          boxShadow: `0 2px 8px ${colors.border}30`
        }}
      >
        {noticesLoading ? (
          <LoadingSpinner loading={true} />
        ) : noticesError ? (
          <EmptyState 
            message="공지사항을 불러오는 중 오류가 발생했습니다." 
            theme={theme}
          />
        ) : noticesEmpty ? (
          <EmptyState 
            message="등록된 공지사항이 없습니다." 
            theme={theme}
          />
        ) : (
          <Stack spacing={1.5}>
            {notices?.slice(0, PAGINATION.HOME_PAGE_SIZE).map((notice: UserNoticeItem) => (
              <Box
                key={notice.noticeId}
                onClick={() => handleContentClick('notice', notice.noticeId)}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: `${colors.primary}15`,
                    borderColor: colors.primary,
                    transform: 'translateY(-1px)',
                    boxShadow: `0 4px 12px ${colors.primary}20`,
                    '& .content-text': {
                      textDecoration: 'underline',
                      textDecorationColor: colors.text,
                      textDecorationThickness: '2px'
                    }
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  className="content-text"
                  sx={{ 
                    color: colors.textSecondary,
                    transition: 'all 0.2s ease-in-out',
                    mb: 0.5
                  }}
                >
                  {notice.title}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: colors.textSecondary,
                    opacity: 0.7
                  }}
                >
                  {formatDate(notice.postedAt)}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );

  const renderFaqSection = () => (
    <Box
      id="faq-section"
      flex={1}
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      p={4}
      minWidth={0}
      sx={{ 
        minWidth: { xs: '100%', md: 0 }, 
        maxWidth: { xs: '100%', md: 360 },
        background: 'transparent'
      }}
    >
      <ThemedButton
        theme={theme}
        variant="primary"
        className="home-faq-button"
        onClick={() => handleSectionClick('faq')}
        endIcon={<ArrowForward />}
        sx={{
          width: '100%',
          mb: 2,
          fontSize: '1rem',
          position: 'relative',
          '& .MuiButton-endIcon': {
            position: 'absolute !important',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)'
          }
        }}
      >
        FAQ
      </ThemedButton>
      
      {/* 컨텐츠 영역 테두리 */}
      <Box 
        sx={{ 
          border: `3px solid ${colors.border}`,
          borderRadius: 3,
          p: 3,
          background: 'transparent',
          flex: 1,
          minHeight: 200,
          boxShadow: `0 2px 8px ${colors.border}30`
        }}
      >
        {faqsLoading ? (
          <LoadingSpinner loading={true} />
        ) : faqsError ? (
          <EmptyState 
            message="FAQ를 불러오는 중 오류가 발생했습니다." 
            theme={theme}
          />
        ) : faqsEmpty ? (
          <EmptyState 
            message="등록된 FAQ가 없습니다." 
            theme={theme}
          />
        ) : (
          <Stack spacing={1.5}>
            {faqs?.slice(0, PAGINATION.HOME_PAGE_SIZE).map((faq: UserFaqItem) => (
              <Box
                key={faq.faqId}
                onClick={() => handleContentClick('faq', faq.faqId)}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: `${colors.primary}15`,
                    borderColor: colors.primary,
                    transform: 'translateY(-1px)',
                    boxShadow: `0 4px 12px ${colors.primary}20`,
                    '& .content-text': {
                      textDecoration: 'underline',
                      textDecorationColor: colors.text,
                      textDecorationThickness: '2px'
                    }
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  className="content-text"
                  sx={{ 
                    color: colors.textSecondary,
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Q. {faq.question}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );

  const renderQnaSection = () => (
    <Box
      id="qna-section"
      flex={1}
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      p={4}
      minWidth={0}
      sx={{ 
        minWidth: { xs: '100%', md: 0 }, 
        maxWidth: { xs: '100%', md: 360 },
        background: 'transparent'
      }}
    >
      <ThemedButton
        theme={theme}
        variant="primary"
        className="home-qna-button"
        onClick={() => handleSectionClick('qna')}
        endIcon={<ArrowForward />}
        sx={{
          width: '100%',
          mb: 2,
          fontSize: '1rem',
          position: 'relative',
          '& .MuiButton-endIcon': {
            position: 'absolute !important',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)'
          }
        }}
      >
        Q&A
      </ThemedButton>
      
      {/* 컨텐츠 영역 테두리 */}
      <Box 
        sx={{ 
          border: `3px solid ${colors.border}`,
          borderRadius: 3,
          p: 3,
          background: 'transparent',
          flex: 1,
          minHeight: 200,
          boxShadow: `0 2px 8px ${colors.border}30`
        }}
      >
        {qnasLoading ? (
          <LoadingSpinner loading={true} />
        ) : qnasError ? (
          <EmptyState 
            message="Q&A를 불러오는 중 오류가 발생했습니다." 
            theme={theme}
          />
        ) : qnasEmpty ? (
          <EmptyState 
            message="등록된 Q&A가 없습니다." 
            theme={theme}
          />
        ) : (
          <Stack spacing={1.5}>
            {qnas?.slice(0, PAGINATION.HOME_PAGE_SIZE).map((qna: UserQnaItem) => (
              <Box
                key={qna.qnaId}
                onClick={() => handleContentClick('qna', qna.qnaId)}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: `${colors.primary}15`,
                    borderColor: colors.primary,
                    transform: 'translateY(-1px)',
                    boxShadow: `0 4px 12px ${colors.primary}20`,
                    '& .content-text': {
                      textDecoration: 'underline',
                      textDecorationColor: colors.text,
                      textDecorationThickness: '2px'
                    }
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  className="content-text"
                  sx={{ 
                    color: colors.textSecondary,
                    transition: 'all 0.2s ease-in-out',
                    mb: 0.5
                  }}
                >
                  {qna.title}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: colors.textSecondary,
                    opacity: 0.7
                  }}
                >
                  {formatDate(qna.postedAt)}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
  
  return (
    <Box 
      className="home-page-container"
      sx={{ 
        minHeight: '100%',
        width: '100%',
        position: 'relative',
        isolation: 'isolate'
      }}
    >
      {/* 컨텐츠 래퍼: 소개+3구역 */}
      <Box 
        id="home-main-section" 
        className="home-main-section"
        sx={{ 
          width: '100%', 
          maxWidth: 1200, 
          mx: 'auto',
          background: colors.background,
          py: { xs: 4, md: 8 },
          pb: { xs: 'calc(var(--footer-height, 56px) + 20px)', md: 'calc(var(--footer-height, 56px) + 40px)' },
          position: 'relative',
          isolation: 'isolate'
        }}
      >
        {/* 서비스 소개 */}
        <ThemedCard 
          theme={theme} 
          className="home-intro-section"
          sx={{ 
            width: { xs: '100%', md: '95%' }, 
            mx: 'auto',
            mb: { xs: 4, md: 6 },
            position: 'relative',
            isolation: 'isolate'
          }}
        >
          <Box sx={{ 
            background: colors.primary, 
            borderRadius: 3, 
            p: 4, 
            boxShadow: `0 4px 12px ${colors.primary}20`,
            position: 'relative',
            isolation: 'isolate'
          }}>
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              align="center" 
              gutterBottom 
              sx={{ 
                color: colors.text,
                position: 'relative',
                isolation: 'isolate'
              }}
            >
              장애인 자립 생활 지원 플랫폼 API 센터
            </Typography>
            <Typography 
              align="center" 
              sx={{ 
                color: colors.text,
                position: 'relative',
                isolation: 'isolate'
              }}
            >
              누구나 쉽고 안전하게 장애인 자립 생활 지원 플랫폼 데이터 API를 탐색하고 활용할 수 있는 공간입니다.
            </Typography>
          </Box>
        </ThemedCard>

        {/* Open API 문서 바로가기 버튼 */}
        <Box sx={{ 
          width: { xs: '100%', md: '95%' }, 
          mx: 'auto', 
          mb: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          position: 'relative',
          isolation: 'isolate'
        }}>
          <ThemedButton
            theme={theme}
            variant="outlined"
            onClick={() => window.open(openApiDocUrl, '_blank')}
            className="home-api-button"
            sx={{
              fontSize: '1rem',
              px: 3,
              py: 1,
              position: 'relative',
              isolation: 'isolate'
            }}
          >
            Open API 문서 바로가기
          </ThemedButton>
        </Box>
        
        {/* 3구역(공지/FAQ/Q&A) */}
        <ThemedCard 
          theme={theme} 
          className="home-3section"
          sx={{ 
            width: { xs: '100%', md: '95%' }, 
            mx: 'auto',
            position: 'relative',
            isolation: 'isolate'
          }}
        >
          <Stack
            id="home-3section-stack"
            direction={{ xs: 'column', md: 'row' }}
            divider={<Divider orientation="vertical" flexItem sx={{ borderColor: 'transparent' }} />}
            spacing={0}
            sx={{
              background: colors.secondary,
              borderRadius: 3,
              boxShadow: 1,
              minHeight: { xs: 600, md: 700 },
              width: '100%',
              justifyContent: 'center',
              alignItems: 'stretch',
              flexWrap: { xs: 'wrap', md: 'nowrap' },
            }}
          >
            {renderNoticeSection()}
            {renderFaqSection()}
            {renderQnaSection()}
          </Stack>
        </ThemedCard>
      </Box>
    </Box>
  );
} 