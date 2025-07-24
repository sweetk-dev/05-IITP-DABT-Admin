import { Box, Typography, Button, Card, CardContent, Stack, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FloatingLogo } from '../components/AppBarCommon';

const dummyNotices = [
  {
    title: '[2024-07-18] 장애인 데이터 API 신규 버전이 출시되었습니다.',
    content: '신규 버전 안내...'
  },
  {
    title: '[2024-07-10] 시스템 점검 안내: 7/20(토) 00:00~04:00',
    content: '점검 안내...'
  },
  {
    title: '[2024-07-01] 회원가입 시 이메일 인증이 추가되었습니다.',
    content: '이메일 인증 안내...'
  },
  {
    title: '[2024-06-20] 개인정보 처리방침이 변경되었습니다.',
    content: '개인정보 안내...'
  },
  {
    title: '[2024-06-10] 장애인 데이터 API 서비스 오픈',
    content: '서비스 오픈 안내...'
  }
];

const dummyFaqs = [
  {
    question: 'API 신청은 어떻게 하나요?',
    answer: '로그인 후 [API 관리] 메뉴에서 신청할 수 있습니다.'
  },
  {
    question: '키 발급은 얼마나 걸리나요?',
    answer: '관리자의 승인 후 즉시 발급됩니다.'
  },
  {
    question: '비밀번호를 잊어버렸어요?',
    answer: '로그인 화면에서 비밀번호 찾기를 이용해 주세요.'
  }
];

const bgMain = '#FFF7ED';
const section2 = '#E3F2FD';


export default function Home() {
  const navigate = useNavigate();
  const openApiDocUrl = 'https://your-openapi-doc-url.com';
  return (
    <Box id="home-page" sx={{
      background: bgMain,
      py: { xs: 4, md: 8 },
      pt: { xs: 'calc(var(--appbar-height, 64px) + 24px)', md: 'calc(var(--appbar-height, 64px) + 48px)' },
      pb: { xs: 'calc(var(--footer-height, 56px) + 20px)', md: 'calc(var(--footer-height, 56px) + 40px)' },
    }}>
      {/* 컨텐츠 래퍼: 소개+3구역 */}
      <Box id="home-main-section" sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
        {/* 서비스 소개 */}
        <Box id="home-intro-section" sx={{ mt: { xs: 3, md: 4 }, background: '#90CAF9', borderRadius: 3, p: 4, mb: 4, boxShadow: 1, width: { xs: '100%', md: '80%' }, mx: 'auto' }}>
          <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ color: '#2D3142' }}>
            장애인 자립 생활 지원 플랫폼 API 센터
          </Typography>
          <Typography align="center" color="#2D3142">
            누구나 쉽고 안전하게 장애인 자립 생활 지원 플랫폼 데이터 API를 탐색하고 활용할 수 있는 공간입니다.
          </Typography>
        </Box>
        {/* 3구역(공지/FAQ/문서) */}
        <Box id="home-3section" sx={{ width: { xs: '100%', md: '95%' }, mx: 'auto' }}>
          <Stack
            id="home-3section-stack"
            direction={{ xs: 'column', md: 'row' }}
            divider={<Divider orientation="vertical" flexItem sx={{ borderColor: 'transparent' }} />}
            spacing={0}
            sx={{
              background: section2,
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
              flex={1}
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              p={4}
              minWidth={0}
              sx={{ minWidth: { xs: '100%', md: 0 }, maxWidth: { xs: '100%', md: 360 } }}
            >
              <Button
                variant="contained"
                onClick={() => navigate('/notice')}
                sx={{
                  minWidth: 160,
                  alignSelf: 'flex-start',
                  mb: 2,
                  backgroundColor: '#FFE0B2',
                  color: '#7B3F00',
                  '&:hover': { backgroundColor: '#FFD8B0' },
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  boxShadow: 'none',
                }}
              >
                공지사항
              </Button>
              {dummyNotices.slice(0, 3).map((notice, idx) => (
                <Typography key={idx} variant="body1" color="text.secondary" mb={1}>
                  {notice.title}
                </Typography>
              ))}
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
              sx={{ minWidth: { xs: '100%', md: 0 }, maxWidth: { xs: '100%', md: 360 } }}
            >
              <Button
                variant="contained"
                onClick={() => navigate('/faq')}
                sx={{
                  minWidth: 160,
                  alignSelf: 'flex-start',
                  mb: 2,
                  backgroundColor: '#FFE0B2',
                  color: '#7B3F00',
                  '&:hover': { backgroundColor: '#FFD8B0' },
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  boxShadow: 'none',
                }}
              >
                FAQ 바로가기
              </Button>
              <Stack spacing={2} sx={{ width: '100%', maxWidth: 320 }}>
                {dummyFaqs.map((faq, idx) => (
                  <Card key={idx} variant="outlined" sx={{ background: '#fff', width: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">Q. {faq.question}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>A. {faq.answer}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
            {/* Open API 문서 */}
            <Box
              id="openapi-section"
              flex={1}
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              p={4}
              minWidth={0}
              sx={{ minWidth: { xs: '100%', md: 0 }, maxWidth: { xs: '100%', md: 360 } }}
            >
              <Button
                variant="outlined"
                onClick={() => window.open(openApiDocUrl, '_blank')}
                sx={{
                  minWidth: 180,
                  alignSelf: 'flex-start',
                  mb: 2,
                  borderColor: '#64B5F6',
                  color: '#1976D2',
                  backgroundColor: '#E3F2FD',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#1976D2',
                    color: '#fff',
                    borderColor: '#1976D2',
                  },
                }}
              >
                Open API 문서 바로가기
              </Button>
              <Typography variant="body1" color="text.secondary" mt={2}>
                API 명세, 사용법, 예제 등 자세한 문서를 확인하실 수 있습니다.
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
      <FloatingLogo id="home-logo2-floating" width={280} />
    </Box>
  );
} 