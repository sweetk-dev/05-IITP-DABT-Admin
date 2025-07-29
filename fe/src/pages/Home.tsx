import { Box, Typography, Stack, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getThemeColors } from '../theme';
import ThemedButton from '../components/common/ThemedButton';
import ThemedCard from '../components/common/ThemedCard';
import { ArrowForward } from '@mui/icons-material';

const dummyNotices = [
  {
    id: 1,
    title: '[2024-07-18] 장애인 데이터 API 신규 버전이 출시되었습니다.',
    content: '신규 버전 안내...'
  },
  {
    id: 2,
    title: '[2024-07-10] 시스템 점검 안내: 7/20(토) 00:00~04:00',
    content: '점검 안내...'
  },
  {
    id: 3,
    title: '[2024-07-01] 회원가입 시 이메일 인증이 추가되었습니다.',
    content: '이메일 인증 안내...'
  },
  {
    id: 4,
    title: '[2024-06-20] 개인정보 처리방침이 변경되었습니다.',
    content: '개인정보 안내...'
  },
  {
    id: 5,
    title: '[2024-06-10] 장애인 데이터 API 서비스 오픈',
    content: '서비스 오픈 안내...'
  }
];

const dummyFaqs = [
  {
    id: 1,
    question: 'API 신청은 어떻게 하나요?',
    answer: '로그인 후 [API 관리] 메뉴에서 신청할 수 있습니다.'
  },
  {
    id: 2,
    question: '키 발급은 얼마나 걸리나요?',
    answer: '관리자의 승인 후 즉시 발급됩니다.'
  },
  {
    id: 3,
    question: '비밀번호를 잊어버렸어요?',
    answer: '로그인 화면에서 비밀번호 찾기를 이용해 주세요.'
  },
  {
    id: 4,
    question: 'API 사용량 제한이 있나요?',
    answer: '일일 사용량 제한이 있으며, 상세한 내용은 API 문서를 참조하세요.'
  },
  {
    id: 5,
    question: '데이터 형식은 어떻게 되나요?',
    answer: 'JSON 형식으로 제공되며, 상세한 스키마는 API 문서에서 확인할 수 있습니다.'
  }
];

const dummyQnas = [
  {
    id: 1,
    title: 'API 키가 만료되었는데 어떻게 하나요?',
    content: 'API 키가 만료된 경우 새로운 키를 발급받으셔야 합니다...'
  },
  {
    id: 2,
    title: '데이터 업데이트 주기는 어떻게 되나요?',
    content: '데이터는 매일 자정에 업데이트되며, 실시간 데이터는 제공되지 않습니다...'
  },
  {
    id: 3,
    title: 'API 호출 시 오류가 발생합니다.',
    content: 'API 호출 시 오류가 발생하는 경우 다음 사항들을 확인해주세요...'
  },
  {
    id: 4,
    title: '대용량 데이터 다운로드는 어떻게 하나요?',
    content: '대용량 데이터는 배치 처리 방식을 통해 다운로드할 수 있습니다...'
  },
  {
    id: 5,
    title: 'API 사용 통계는 어디서 확인할 수 있나요?',
    content: 'API 사용 통계는 대시보드에서 실시간으로 확인할 수 있습니다...'
  }
];

export default function Home() {
  const navigate = useNavigate();
  const theme = 'user';
  const colors = getThemeColors(theme);
  const openApiDocUrl = 'https://your-openapi-doc-url.com';
  
  const handleContentClick = (type: 'notice' | 'faq' | 'qna', id: number) => {
    navigate(`/${type}/${id}`);
  };
  
  return (
    <Box 
      className="home-page-container"
      sx={{ 
        minHeight: '100%',
        width: '100%',
        position: 'relative',
        isolation: 'isolate' // CSS 격리
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
            mb: { xs: 4, md: 6 },
            position: 'relative',
            isolation: 'isolate'
          }}
        >
          <Box sx={{ 
            textAlign: 'center',
            position: 'relative',
            isolation: 'isolate'
          }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                color: colors.text,
                mb: 3,
                fontWeight: 'bold',
                position: 'relative',
                isolation: 'isolate'
              }}
            >
              장애인 자립 생활 지원 플랫폼
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: colors.textSecondary,
                mb: 4,
                position: 'relative',
                isolation: 'isolate'
              }}
            >
              Open API 센터에 오신 것을 환영합니다
            </Typography>
            <ThemedButton
              theme={theme}
              variant="primary"
              onClick={() => window.open(openApiDocUrl, '_blank')}
              className="home-api-button"
              sx={{
                fontSize: '1.1rem',
                px: 4,
                py: 1.5,
                position: 'relative',
                isolation: 'isolate'
              }}
            >
              Open API 문서 바로가기
            </ThemedButton>
          </Box>
        </ThemedCard>
        
        {/* 3구역 */}
        <ThemedCard 
          theme={theme} 
          className="home-3section"
          sx={{ 
            background: colors.secondary,
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
            {/* 공지사항 */}
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
                onClick={() => navigate('/notice')}
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
                <Stack spacing={1.5}>
                  {dummyNotices.slice(0, 5).map((notice) => (
                    <Box
                      key={notice.id}
                      onClick={() => handleContentClick('notice', notice.id)}
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
                        {notice.title}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
            
            {/* FAQ */}
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
                onClick={() => navigate('/faq')}
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
                <Stack spacing={1.5}>
                  {dummyFaqs.slice(0, 5).map((faq) => (
                    <Box
                      key={faq.id}
                      onClick={() => handleContentClick('faq', faq.id)}
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
              </Box>
            </Box>
            
            {/* Q&A */}
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
                onClick={() => navigate('/qna')}
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
                <Stack spacing={1.5}>
                  {dummyQnas.slice(0, 5).map((qna) => (
                    <Box
                      key={qna.id}
                      onClick={() => handleContentClick('qna', qna.id)}
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
                        {qna.title}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Stack>
        </ThemedCard>
      </Box>
    </Box>
  );
} 