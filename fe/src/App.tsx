import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Card, CardContent, Stack, Container, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

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

// 따뜻한 색상 팔레트
const bgMain = '#FFF7ED'; // 연한 베이지
const section1 = '#FFE5D0'; // 연한 오렌지
const section2 = '#E3F2FD'; // 연한 블루
const footerBg = '#2D3142'; // 네이비에 가까운 보라
const footerText = '#fff';

const APPBAR_HEIGHT = 64;
const FOOTER_HEIGHT = 56;

function Home() {
  const navigate = useNavigate();
  const openApiDocUrl = 'https://your-openapi-doc-url.com';
  return (
    <Box sx={{
      minHeight: `calc(100vh - ${APPBAR_HEIGHT + FOOTER_HEIGHT}px)`,
      background: bgMain,
      py: 6,
      pt: { xs: `${APPBAR_HEIGHT + 16}px`, md: `${APPBAR_HEIGHT + 32}px` },
      pb: { xs: `${FOOTER_HEIGHT + 16}px`, md: `${FOOTER_HEIGHT + 32}px` },
    }}>
      {/* 컨텐츠 래퍼: 소개+3구역 */}
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
        {/* 서비스 소개 */}
        <Box sx={{ background: '#90CAF9', borderRadius: 3, p: 4, mb: 4, boxShadow: 1, width: { xs: '100%', md: '80%' }, mx: 'auto' }}>
          <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ color: '#2D3142' }}>
            장애인 자립 생활 지원 플랫폼 API 센터
          </Typography>
          <Typography align="center" color="#2D3142">
            누구나 쉽고 안전하게 장애인 자립 생활 지원 플랫폼 데이터 API를 탐색하고 활용할 수 있는 공간입니다.
          </Typography>
        </Box>
        {/* 3구역(공지/FAQ/문서) */}
        <Box sx={{ width: { xs: '100%', md: '95%' }, mx: 'auto' }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            divider={<Divider orientation="vertical" flexItem sx={{ borderColor: 'transparent' }} />}
            spacing={0}
            sx={{
              background: section2,
              borderRadius: 3,
              boxShadow: 1,
              minHeight: 340,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'stretch',
              flexWrap: { xs: 'wrap', md: 'nowrap' },
            }}
          >
            {/* 공지사항 */}
            <Box
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
    </Box>
  );
}

function NoticeList() {
  return (
    <Box sx={{ minHeight: 'calc(100vh - 120px)', background: bgMain, py: 6, pt: { xs: `${APPBAR_HEIGHT + 16}px`, md: `${APPBAR_HEIGHT + 32}px` }, pb: { xs: `${FOOTER_HEIGHT + 16}px`, md: `${FOOTER_HEIGHT + 32}px` } }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight="bold" mb={4}>
          공지사항 전체
        </Typography>
        <Stack spacing={2}>
          {dummyNotices.map((notice, idx) => (
            <Card key={idx} variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight="bold">{notice.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{notice.content}</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}

function Footer() {
  return (
    <Box sx={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      background: footerBg,
      color: footerText,
      zIndex: 1200,
      py: 2,
      textAlign: 'center',
    }}>
      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          © {new Date().getFullYear()} IITP 장애인 자립 생활 지원 플랫폼 API 센터. All rights reserved.
        </Typography>
        {/* 회사 로고 등 추가 공간 */}
        <Box sx={{ height: 16 }} />
      </Container>
    </Box>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: bgMain }}>
      {/* AppBar를 Box로 감싸서 배경색이 100vw로 확실히 적용되도록 함 */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        background: '#fff',
        zIndex: 1200,
      }}>
        <AppBar
          position="static"
          color="default"
          elevation={1}
          sx={{
            background: 'transparent',
            boxShadow: 'none',
          }}
        >
          <Toolbar sx={{ minHeight: `${APPBAR_HEIGHT}px !important` }}>
            {/* IITP 텍스트 + 로고 */}
            <Box display="flex" alignItems="center" flexGrow={1}>
              <Typography variant="h6" color="inherit" noWrap sx={{ mr: 1, color: '#7B3F00', fontWeight: 700 }}>
                IITP
              </Typography>
              <img src="/iitp_cms_logo_img_1.png" alt="IITP Logo" style={{ height: 40, marginRight: 12 }} />
            </Box>
            {/* 우측 끝 버튼 */}
            <Box>
              <Button color="primary" variant="outlined" style={{ marginRight: 8 }}>로그인</Button>
              <Button color="primary" variant="contained">회원가입</Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Box sx={{ flex: 1 }}>{children}</Box>
      <Footer />
    </Box>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notice" element={<NoticeList />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
