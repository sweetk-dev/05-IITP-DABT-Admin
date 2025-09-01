import { Box, Typography, Stack, Divider, Chip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// theme colors come from MUI palette
import ThemedButton from '../../components/common/ThemedButton';
import ThemedCard from '../../components/common/ThemedCard';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ArrowForward, Visibility as VisibilityIcon } from '@mui/icons-material';
import StatusChip from '../../components/common/StatusChip';
import QnaTypeChip from '../../components/common/QnaTypeChip';
import { OPEN_API_DOC_URL } from '../../config';
import CommonToast from '../../components/CommonToast';
import { PAGINATION } from '../../constants/pagination';
import { SPACING } from '../../constants/spacing';
import { useDataFetching } from '../../hooks/useDataFetching';
import { getHomeNoticeList, getHomeFaqList, getHomeQnaList, getCommonCodesByGroupId } from '../../api';
import type { UserNoticeItem, UserFaqItem, UserQnaItem } from '@iitp-dabt/common';
import { COMMON_CODE_GROUPS } from '@iitp-dabt/common';
import { useCommonCode } from '../../hooks/useCommonCode';
import { ROUTES } from '../../routes';
import { isUserAuthenticated, isAdminAuthenticated } from '../../store/auth';
import { getUserType } from '../../store/user';

export default function Home() {
  const navigate = useNavigate();
  
  const muiTheme = useTheme();
  const palette = muiTheme.palette;
  const openApiDocUrl = OPEN_API_DOC_URL;
  const { fetchCodesByGroup } = useCommonCode();
  
  // 인증 상태 체크 (Layout과 동일한 로직 사용)
  //const userType = getUserType();
  const isUserLoggedIn = isUserAuthenticated();
  const isAdminLoggedIn = isAdminAuthenticated();
  
  // 토큰이 유효하지 않으면 API 호출 건너뛰기
  //const shouldFetchData = isUserLoggedIn || isAdminLoggedIn;
  
  // 공지사항 데이터 페칭 (홈화면은 인증 여부와 관계없이 표시)
  const {
    data: notices,
    isLoading: noticesLoading,
    isEmpty: noticesEmpty,
    isError: noticesError,
    refetch: refetchNotices
  } = useDataFetching({
    fetchFunction: getHomeNoticeList,
    autoFetch: true // 홈화면은 항상 공지사항 표시
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
  // QnA 유형 공통코드 로드 (라벨 표시용)
  const { data: qnaTypeCodes } = useDataFetching({ fetchFunction: () => getCommonCodesByGroupId(COMMON_CODE_GROUPS.QNA_TYPE), autoFetch: true });
  const [toast, setToast] = useState<{ open: boolean; message: string; severity?: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  // Preload qna_type once for this page
  useEffect(() => { fetchCodesByGroup(COMMON_CODE_GROUPS.QNA_TYPE).catch(() => {}); }, [fetchCodesByGroup]);
  
  const handleContentClick = (type: 'notice' | 'faq' | 'qna', id: number) => {
    if (type === 'faq') {
      navigate(`${ROUTES.PUBLIC.FAQ}?faqId=${id}`);
      return;
    }
    navigate(`/${type}/${id}`);
  };

  const handleSectionClick = (type: 'notice' | 'faq' | 'qna') => {
    // 섹션 클릭 시 해당 데이터를 새로고침
    switch (type) {
      case 'notice':
        refetchNotices();
        break;
      case 'faq':
        refetchFaqs();
        break;
      case 'qna':
        refetchQnas();
        break;
    }
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
      id="home-notice-section"
      className="home-notice-section"
      flex={1}
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      p={SPACING.LARGE}
      minWidth={0}
      sx={{
        // P가 이상하면 4로 수정 현재는 3임 
        minWidth: { xs: '100%', md: 0 }, 
        maxWidth: { xs: '100%', md: '100%' },
        background: 'transparent',
        position: 'relative',
        isolation: 'isolate'
      }}
    >
          <ThemedButton
        variant="primary"
        className="home-notice-button"
        onClick={() => handleSectionClick('notice')}
        endIcon={<ArrowForward />}
        sx={{
          width: '100%',
              mb: 2,
              fontSize: { xs: '1.06rem', md: '1.12rem' },
              fontWeight: 700,
              py: { xs: 1.25, md: 1.5 },
              minHeight: { xs: 44, md: 52 },
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
          border: `3px solid ${palette.divider}`,
          borderRadius: 3,
          p: 3,
          backgroundColor: 'background.paper',
          flex: 1,
          minHeight: 200,
          boxShadow: 1
        }}
      >
        {noticesLoading ? (
          <LoadingSpinner loading={true} />
        ) : noticesError ? (
          <EmptyState message="공지사항을 불러오는 중 오류가 발생했습니다." />
        ) : noticesEmpty ? (
          <EmptyState message="등록된 공지사항이 없습니다." />
        ) : (
          <Stack spacing={1.5}>
            {notices?.notices?.slice(0, PAGINATION.HOME_PAGE_SIZE).map((notice: UserNoticeItem) => (
              <Box
                key={notice.noticeId}
                onClick={() => handleContentClick('notice', notice.noticeId)}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  border: `1px solid ${palette.divider}`,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    borderColor: palette.primary.main,
                    transform: 'translateY(-1px)',
                    boxShadow: 2,
                    '& .content-text': {
                      textDecoration: 'underline',
                      textDecorationColor: palette.text.primary,
                      textDecorationThickness: '2px'
                    }
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  className="content-text"
                  sx={{ 
                    color: palette.text.secondary,
                    transition: 'all 0.2s ease-in-out',
                    mb: 0.5
                  }}
                >
                  {notice.title}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: palette.text.secondary,
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
      id="home-faq-section"
      flex={1}
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      p={SPACING.LARGE}
      minWidth={0}
      sx={{
        // P가 이상하면 4로 수정 현재는 3임 
        minWidth: { xs: '100%', md: 0 }, 
        maxWidth: { xs: '100%', md: '100%' },
        background: 'transparent'
      }}
    >
          <ThemedButton
        variant="primary"
        className="home-faq-button"
        onClick={() => handleSectionClick('faq')}
        endIcon={<ArrowForward />}
        sx={{
          width: '100%',
          mb: SPACING.MEDIUM,
              fontSize: { xs: '1.06rem', md: '1.12rem' },
              fontWeight: 700,
              py: { xs: 1.25, md: 1.5 },
              minHeight: { xs: 44, md: 52 },
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
          border: `3px solid ${palette.divider}`,
          borderRadius: 3,
          p: SPACING.LARGE,
          backgroundColor: 'background.paper',
          flex: 1,
          minHeight: 200,
          boxShadow: 1
        }}
      >
        {faqsLoading ? (
          <LoadingSpinner loading={true} />
        ) : faqsError ? (
          <EmptyState message="FAQ를 불러오는 중 오류가 발생했습니다." />
        ) : faqsEmpty ? (
          <EmptyState message="등록된 FAQ가 없습니다." />
        ) : (
          <Stack spacing={1.5}>
            {faqs?.faqs?.slice(0, PAGINATION.HOME_PAGE_SIZE).map((faq: UserFaqItem) => (
              <Box
                key={faq.faqId}
                onClick={() => handleContentClick('faq', faq.faqId)}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  border: `1px solid ${palette.divider}`,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    borderColor: palette.primary.main,
                    transform: 'translateY(-1px)',
                    boxShadow: 2,
                    '& .content-text': {
                      textDecoration: 'underline',
                      textDecorationColor: palette.text.primary,
                      textDecorationThickness: '2px'
                    }
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  className="content-text"
                  sx={{ 
                    color: palette.text.secondary,
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
      id="home-qna-section"
      flex={1}
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      p={SPACING.LARGE}
      minWidth={0}
      sx={{
        // P가 이상하면 4로 수정 현재는 3임 
        minWidth: { xs: '100%', md: 0 }, 
        maxWidth: { xs: '100%', md: '100%' },
        background: 'transparent'
      }}
    >
          <ThemedButton
        variant="primary"
        className="home-qna-button"
        onClick={() => handleSectionClick('qna')}
        endIcon={<ArrowForward />}
        sx={{
          width: '100%',
          mb: SPACING.MEDIUM,
              fontSize: { xs: '1.06rem', md: '1.12rem' },
              fontWeight: 700,
              py: { xs: 1.25, md: 1.5 },
              minHeight: { xs: 44, md: 52 },
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
          border: `3px solid ${palette.divider}`,
          borderRadius: 3,
          p: SPACING.LARGE,
          backgroundColor: 'background.paper',
          flex: 1,
          minHeight: 200,
          boxShadow: 1
        }}
      >
        {qnasLoading ? (
          <LoadingSpinner loading={true} />
        ) : qnasError ? (
          <EmptyState message="Q&A를 불러오는 중 오류가 발생했습니다." />
        ) : qnasEmpty ? (
          <EmptyState message="등록된 Q&A가 없습니다." />
        ) : (
          <Stack spacing={1.5}>
            {qnas?.qnas?.slice(0, PAGINATION.HOME_PAGE_SIZE).map((qna: UserQnaItem) => {
              const isSecret = qna.secretYn === 'Y';
              const isOwner = !!(qna as any).isMine;
              const clickable = !isSecret || isOwner;
              return (
                <Box
                  key={qna.qnaId}
                  onClick={() => {
                    if (clickable) {
                      handleContentClick('qna', qna.qnaId);
                    } else {
                      setToast({ open: true, message: '비공개 질문입니다. 작성자만 상세를 볼 수 있습니다.', severity: 'info' });
                    }
                  }}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    cursor: clickable ? 'pointer' : 'default',
                    transition: 'all 0.2s ease-in-out',
                    border: `1px solid ${palette.divider}`,
                    backgroundColor: 'transparent',
                    opacity: clickable ? 1 : 0.75,
                    '&:hover': clickable ? {
                      backgroundColor: 'action.hover',
                      borderColor: palette.primary.main,
                      transform: 'translateY(-1px)',
                      boxShadow: 2,
                      '& .content-text': {
                        textDecoration: 'underline',
                        textDecorationColor: palette.text.primary,
                        textDecorationThickness: '2px'
                      }
                    } : undefined
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                    {/* 순서: 유형 → 상태 → 비공개 */}
                    <QnaTypeChip
                      typeId={qna.qnaType}
                      size="small"
                      label={((qnaTypeCodes as any)?.codes || []).find((c: any) => c.codeId === qna.qnaType)?.codeNm || qna.qnaType}
                    />
                    <Chip label={qna.answeredYn === 'Y' ? '답변완료' : '대기'} color={qna.answeredYn === 'Y' ? 'success' : 'warning'} size="small" />
                    {isSecret && (<StatusChip kind="private" />)}
                    {/* 조회수 */}
                    {typeof qna.hitCnt === 'number' && (
                      <Typography variant="caption" sx={{ color: palette.text.secondary, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                        <VisibilityIcon sx={{ fontSize: 16, opacity: 0.7 }} /> {qna.hitCnt}
                      </Typography>
                    )}
                    <Typography variant="caption" sx={{ color: palette.text.secondary, ml: 'auto' }}>
                      {formatDate(qna.createdAt)}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    className="content-text"
                    sx={{ 
                      color: palette.text.secondary,
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    {qna.title || '(제목 없음)'}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>
    </Box>
  );
  
  return (
    <Box 
      id="home-page-container"
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
          maxWidth: '100%', 
          mx: 'auto',
          
          background: palette.background.default,
          py: { xs: 4, md: 8 },
          pb: { xs: 'calc(var(--footer-height, 56px) + 20px)', md: 'calc(var(--footer-height, 56px) + 40px)' },
          position: 'relative',
          isolation: 'isolate'
        }}
      >
        {/* 서비스 소개 */}
      <ThemedCard 
          className="home-intro-section"
          sx={{ 
            width: { xs: '100%', md: '100%' }, 
            mx: 'auto',
            mb: { xs: 4, md: 6 },
            position: 'relative',
            isolation: 'isolate'
          }}
        >
          {/* P가 이상하면 4로 수정 현재는 3임 */}
          <Box sx={{ 
            background: palette.primary.main, 
            borderRadius: 3, 
            p: SPACING.LARGE, 
            boxShadow: 1,
            position: 'relative',
            isolation: 'isolate'
          }}>
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              align="center" 
              gutterBottom 
              sx={{ 
                color: muiTheme.palette.getContrastText(palette.primary.main),
                position: 'relative',
                isolation: 'isolate'
              }}
            >
              장애인 자립생활 지원 플랫폼 Open API 센터
            </Typography>
            <Typography 
              align="center" 
              sx={{ 
                color: muiTheme.palette.getContrastText(palette.primary.main),
                position: 'relative',
                isolation: 'isolate'
              }}
            >
              누구나 장애인 자립을 지원하는 서비스를 만들 수 있도록 <br/>
              장애인 자립 관련 데이터를 편리하게 받아서 활용할 수 있는 열린 데이터 공간입니다
            </Typography>
          </Box>
        </ThemedCard>

        {/* Open API 문서 바로가기 버튼 */}
        <Box id="home-openapi-button-row" sx={{ 
          width: { xs: '100%', md: '100%' }, 
          mx: 'auto', 
          mb:  SPACING.MEDIUM,
          display: 'flex',
          justifyContent: 'flex-end',
          position: 'relative',
          isolation: 'isolate'
        }}>
          <ThemedButton
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
          className="home-3section"
          sx={{ 
            width: { xs: '100%', md: '100%' }, 
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
            background: alpha(palette.secondary.main, 0.06),
              borderRadius: 3,
              boxShadow: 0,
              minHeight: { xs: 600, md: 700 },
              width: '100%',
              justifyContent: 'center',
              alignItems: 'stretch',
              flexWrap: { xs: 'wrap', md: 'nowrap' },
              p: { xs: 2, md: 3 }
            }}
          >
            {renderNoticeSection()}
            {renderFaqSection()}
            {renderQnaSection()}
          </Stack>
        </ThemedCard>
      </Box>
      <CommonToast open={!!toast?.open} message={toast?.message || ''} severity={toast?.severity} onClose={() => setToast(null)} />
    </Box>
  );
} 