import { Box, Grid, Typography, Divider } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import PageTitle from '../../components/common/PageTitle';
import ThemedCard from '../../components/common/ThemedCard';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';

export default function Privacy() {
  const muiTheme = useTheme();
  return (
    <Box id="page-privacy">
      <PageTitle title="개인정보처리방침" />

      {/* Hero */}
      <Box
        id="privacy-hero"
        sx={{
          mb: 4,
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(muiTheme.palette.secondary.main, 0.12)}, ${alpha(muiTheme.palette.secondary.dark, 0.26)})`,
          border: `1px solid ${alpha(muiTheme.palette.secondary.main, 0.2)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PrivacyTipIcon color="secondary" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            개인정보 보호 원칙
          </Typography>
        </Box>
        <Typography sx={{ mt: 1.25, opacity: 0.9 }}>
          센터는 개인정보보호법을 준수하며 최소 수집, 목적 외 이용 금지, 안전한 보관·파기를 준수합니다.
        </Typography>
      </Box>

      {/* Summary tiles */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <ThemedCard sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 700, mb: 0.5 }}>수집 최소화</Typography>
            <Typography variant="body2" color="text.secondary">필수 정보만 수집하고 목적 달성 후 즉시 파기</Typography>
          </ThemedCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <ThemedCard sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 700, mb: 0.5 }}>안전한 처리</Typography>
            <Typography variant="body2" color="text.secondary">암호화·접근 통제·접속 기록 등 보호조치 적용</Typography>
          </ThemedCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <ThemedCard sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 700, mb: 0.5 }}>권리 보장</Typography>
            <Typography variant="body2" color="text.secondary">열람·정정·삭제·처리정지·동의철회 요청 가능</Typography>
          </ThemedCard>
        </Grid>
      </Grid>

      {/* Sections */}
      <ThemedCard sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>1. 처리하는 개인정보 항목</Typography>
        <Typography paragraph>회원 가입 및 서비스 제공을 위해 필수(이름, 이메일, 연락처), 선택(소속 등) 항목을 처리할 수 있습니다.</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>2. 개인정보의 처리 목적</Typography>
        <Typography paragraph>회원 관리, API 키 발급/인증, 서비스 제공·개선, 문의 응대, 법령 준수 목적에 사용됩니다.</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>3. 보유 및 이용기간</Typography>
        <Typography paragraph>관계 법령 준수 및 목적 달성 후 지체 없이 파기합니다. 법령에서 정한 별도 보존기간을 따릅니다.</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>4. 제3자 제공 및 처리위탁</Typography>
        <Typography paragraph>법령 근거 또는 동의가 있는 경우에 한하여 최소한으로 제공합니다. 위탁 시 적절한 보호조치를 이행합니다.</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>5. 정보주체의 권리</Typography>
        <Typography paragraph>이용자는 열람, 정정·삭제, 처리정지, 동의 철회를 언제든지 요청할 수 있습니다.</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>6. 안전성 확보조치</Typography>
        <Typography paragraph>접근권한 통제, 암호화, 접속기록 보관, 물리적 보호 등 안전성 확보조치를 적용합니다.</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>7. 개인정보 보호책임자</Typography>
        <Typography paragraph>개인정보 보호 관련 문의는 센터의 개인정보 보호책임자에게 연락해 주시기 바랍니다.</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>부칙</Typography>
        <Typography>본 방침은 공지한 날로부터 시행합니다.</Typography>
      </ThemedCard>
    </Box>
  );
}


