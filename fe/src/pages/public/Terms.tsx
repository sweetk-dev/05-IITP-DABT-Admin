import { Box, Grid, Typography, Divider } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import PageTitle from '../../components/common/PageTitle';
import ThemedCard from '../../components/common/ThemedCard';
import GavelIcon from '@mui/icons-material/Gavel';

export default function Terms() {
  const muiTheme = useTheme();
  return (
    <Box id="page-terms">
      <PageTitle title="이용약관" />

      {/* Hero */}
      <Box
        id="terms-hero"
        sx={{
          mb: 4,
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(muiTheme.palette.primary.main, 0.12)}, ${alpha(muiTheme.palette.primary.dark, 0.28)})`,
          border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.2)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GavelIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            데이터로보는자립 OpenAPI 센터 서비스 이용약관
          </Typography>
        </Box>
        <Typography sx={{ mt: 1.25, opacity: 0.9 }}>
          본 약관은 서비스 이용에 관한 기본 사항을 안내합니다. 실제 운영 정책과 관련 법령을 우선 적용합니다.
        </Typography>
      </Box>

      {/* Summary tiles */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <ThemedCard sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 700, mb: 0.5 }}>적용 대상</Typography>
            <Typography variant="body2" color="text.secondary">센터의 OpenAPI 및 부가 서비스 이용자</Typography>
          </ThemedCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <ThemedCard sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 700, mb: 0.5 }}>키 발급/관리</Typography>
            <Typography variant="body2" color="text.secondary">API 키의 보안과 사용 책임은 이용자에게 있습니다</Typography>
          </ThemedCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <ThemedCard sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 700, mb: 0.5 }}>변경/중단</Typography>
            <Typography variant="body2" color="text.secondary">필요 시 공지 후 서비스가 변경될 수 있습니다</Typography>
          </ThemedCard>
        </Grid>
      </Grid>

      {/* Sections */}
      <ThemedCard sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>제1조(목적)</Typography>
        <Typography paragraph>센터가 제공하는 OpenAPI 및 관련 서비스의 이용 조건과 절차를 정합니다.</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>제2조(정의)</Typography>
        <Typography paragraph>"이용자"는 본 서비스에 접속하여 약관에 따라 이용하는 자를, "개발자"는 API 키를 발급받아 연동하는 이용자를 의미합니다.</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>제3조(약관의 효력 및 변경)</Typography>
        <Typography paragraph>센터는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 서비스 공지를 통해 안내합니다.</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>제4조(회원가입과 API 키 발급)</Typography>
        <Typography paragraph>이용자는 가입 후 개발자 등록을 통해 API 키를 발급받을 수 있으며, 키의 보관·관리 책임은 이용자에게 있습니다.</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>제5조(서비스 제공 및 변경)</Typography>
        <Typography paragraph>센터는 안정적인 제공을 위해 노력하며, 필요 시 공지 후 일부 또는 전부를 변경할 수 있습니다.</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>제6조(이용자의 의무)</Typography>
        <Typography paragraph>이용자는 법령, 본 약관, 공지 사항을 준수해야 하며 타인의 권리를 침해하거나 서비스 운영을 방해해서는 안 됩니다.</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>제7조(이용 제한)</Typography>
        <Typography paragraph>약관 위반, 과도한 트래픽 유발, 불법 목적의 이용 등 부적절한 사용에 대해 사전 통지 후 이용을 제한할 수 있습니다.</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>제8조(책임의 제한)</Typography>
        <Typography paragraph>불가항력, 시스템 장애, 제3자 서비스 사유로 발생한 손해에 대해서는 법령이 허용하는 범위 내에서 책임을 제한합니다.</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>부칙</Typography>
        <Typography>본 약관은 공지한 날로부터 시행합니다.</Typography>
      </ThemedCard>
    </Box>
  );
}


