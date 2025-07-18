import { Box, Typography, IconButton } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useNavigate } from 'react-router-dom';

export function HomeIconButton({ to = '/' }: { to?: string }) {
  const navigate = useNavigate();
  return (
    <IconButton
      color="primary"
      onClick={() => navigate(to)}
      sx={{
        background: '#fff',
        borderRadius: '50%',
        boxShadow: 2,
        p: 0.7,
        mr: 1,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 4, background: '#f5f5f5' },
        height: 36,
        width: 36,
        minWidth: 0,
      }}
      id="appbar-home-btn"
    >
      <HomeOutlinedIcon sx={{ fontSize: 22 }} />
    </IconButton>
  );
}

export function Logo({ serviceName }: { serviceName: string }) {
  const navigate = useNavigate();
  return (
    <Box id="appbar-logo" display="flex" alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => navigate('/') }>
      <img src="/iitp_cms_logo_img_1.png" alt="IITP Logo" style={{ height: 40, marginRight: 12 }} />
      <Typography variant="h6" color="inherit" noWrap sx={{ color: '#7B3F00', fontWeight: 700 }}>
        {serviceName}
      </Typography>
    </Box>
  );
} 