import { Box, Grid, Typography, Chip, Divider, IconButton, Tooltip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import PageTitle from '../../components/common/PageTitle';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { OPEN_API_DOC_URL, OPEN_API_SERVER_URL } from '../../config';
import { ROUTES } from '../../routes';
import {
  Api as ApiIcon,
  DescriptionOutlined as DocIcon,
  OpenInNew as OpenInNewIcon,
  VpnKey as KeyIcon,
  HowToReg as RegisterIcon,
  BuildCircle as BuildIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';

export default function OpenApiAbout() {
  const muiTheme = useTheme();
  const openApiDocUrl = OPEN_API_DOC_URL;
  const openApiServerUrl = OPEN_API_SERVER_URL;
  return (
    <Box id="page-openapi-about">
      <PageTitle title="OpenAPI센터 소개" />

      {/* Hero */}
      <Box
        sx={{
          mb: 4,
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(muiTheme.palette.primary.main, 0.15)}, ${alpha(muiTheme.palette.primary.dark, 0.35)})`,
          border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.25)}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ApiIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            데이터로보는자립 OpenAPI 센터
          </Typography>
        </Box>
        <Typography sx={{ mt: 1.5, opacity: 0.9 }}>
          공공·민간 데이터를 바탕으로 장애인의 자립 생활을 지원하는 서비스를 빠르게 구축할 수 있도록 표준화된 OpenAPI를 제공합니다.
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 2.5 }}>
          <ThemedButton
            id="btn-openapi-docs"
            component="a"
            href={openApiDocUrl}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<DocIcon />}
            endIcon={<OpenInNewIcon />}
            buttonSize="cta"
          >
            Open API 문서 열기
          </ThemedButton>
          <ThemedButton
            id="btn-apply-key"
            variant="outlined"
            component={RouterLink as any}
            to={ROUTES.USER.OPEN_API_MANAGEMENT}
            startIcon={<KeyIcon />}
            buttonSize="cta"
          >
            인증키 신청/관리
          </ThemedButton>
        </Box>
      </Box>

      

      {/* 인증키 발급 절차 */}
      <ThemedCard sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <KeyIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>인증키 발급 절차</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <ThemedCard sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip label="1" size="small" color="primary" />
                <Typography sx={{ fontWeight: 700 }}>회원가입/로그인</Typography>
              </Box>
              <Box sx={{ color: 'text.secondary' }}>서비스에 회원가입 후 로그인합니다.</Box>
            </ThemedCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <ThemedCard sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip label="2" size="small" color="primary" />
                <Typography sx={{ fontWeight: 700 }}>인증키 신청</Typography>
              </Box>
              <Box sx={{ color: 'text.secondary' }}>마이페이지의 "API 인증키 관리"에서 신규 신청을 진행합니다.</Box>
            </ThemedCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <ThemedCard sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip label="3" size="small" color="primary" />
                <Typography sx={{ fontWeight: 700 }}>검토/승인</Typography>
              </Box>
              <Box sx={{ color: 'text.secondary' }}>운영 정책에 따라 검토 후 승인됩니다.</Box>
            </ThemedCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <ThemedCard sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip label="4" size="small" color="primary" />
                <Typography sx={{ fontWeight: 700 }}>키 발급/사용</Typography>
              </Box>
              <Box sx={{ color: 'text.secondary' }}>발급된 키를 헤더에 포함하여 API를 호출합니다.</Box>
            </ThemedCard>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <ThemedButton
            variant="text"
            component={RouterLink as any}
            to={ROUTES.USER.OPEN_API_MANAGEMENT}
            startIcon={<RegisterIcon />}
          >
            인증키 신청 바로가기
          </ThemedButton>
        </Box>
      </ThemedCard>

      {/* 사용 방법 */}
      <ThemedCard sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <BuildIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>사용 방법</Typography>
        </Box>
        {/* Open API 서버 URL + 복사 */}
        <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: alpha(muiTheme.palette.background.paper, 0.6), border: `1px solid ${muiTheme.palette.divider}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Open API 서버 URL</Typography>
              <Typography sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', wordBreak: 'break-all' }}>
                {openApiServerUrl}
              </Typography>
            </Box>
            <Tooltip title="URL 복사">
              <IconButton size="small" onClick={() => navigator.clipboard.writeText(openApiServerUrl)}>
                <CopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            각 API의 상세 경로와 요청/응답 규격은 아래의 <b>Open API 문서</b>에서 확인해 주세요.
          </Typography>
        </Box>
        <Typography sx={{ mb: 1.5 }}>
          API 요청 시 헤더에 <b>"X-API-KEY"</b> 항목으로 발급받은 키를 포함해야 합니다.
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>cURL 예시</Typography>
        <Box component="pre" sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: alpha(muiTheme.palette.background.paper, 0.6),
          border: `1px solid ${muiTheme.palette.divider}`,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          fontSize: 13,
          overflowX: 'auto',
          mb: 2
        }}>
{`curl -H "X-API-KEY: YOUR_API_KEY" \
  "https://your-api-host/v1/example?param=value"`}
        </Box>

        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>JavaScript fetch 예시</Typography>
        <Box component="pre" sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: alpha(muiTheme.palette.background.paper, 0.6),
          border: `1px solid ${muiTheme.palette.divider}`,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          fontSize: 13,
          overflowX: 'auto'
        }}>
{`fetch('https://your-api-host/v1/example?param=value', {
  method: 'GET',
  headers: {
    'X-API-KEY': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
}).then(r => r.json())
  .then(console.log);`}
        </Box>

        <Box sx={{ mt: 2 }}>
          <ThemedButton
            component="a"
            href={openApiDocUrl}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<DocIcon />}
            endIcon={<OpenInNewIcon />}
          >
            Open API 문서 보기
          </ThemedButton>
        </Box>
      </ThemedCard>
    </Box>
  );
}


