import { Box, Typography, IconButton } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useNavigate } from 'react-router-dom';

export function HomeIconButton({ to = '/' }: { to?: string }) {
  const navigate = useNavigate();
  return (
    <IconButton
      id="home-icon-button"
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
    >
      <HomeOutlinedIcon id="home-icon" sx={{ fontSize: 22 }} />
    </IconButton>
  );
}

export function Logo({ serviceName }: { serviceName: string }) {
  const navigate = useNavigate();
  return (
    <Box 
      id="appbar-logo-container" 
      display="flex" 
      alignItems="center" 
      sx={{ cursor: 'pointer' }} 
      onClick={() => navigate('/') }
    >
      <img 
        id="appbar-logo-image"
        src="/iitp_cms_logo_img_1.png" 
        alt="IITP Logo" 
        style={{ height: 48, marginRight: 12 }} 
      />
      <Typography 
        id="appbar-logo-text"
        variant="h6" 
        color="inherit" 
        noWrap 
        sx={{ color: '#7B3F00', fontWeight: 700, fontSize: '1.25rem' }}
      >
        {serviceName}
      </Typography>
    </Box>
  );
}

export function FloatingLogo({
  id = 'floating-logo',
  src = '/iitp_cms_logo_img_2.png',
  width = 280,
  bottom = 'calc(5vh + var(--footer-height, 56px))',
  right = '10%',
  maxWidth = '40vw',
  zIndex = 100,
  opacity = 0.95,
}: {
  id?: string;
  src?: string;
  width?: number;
  bottom?: string;
  right?: string;
  maxWidth?: string;
  zIndex?: number;
  opacity?: number;
}) {
  return (
    <Box
      id={id}
      sx={{
        position: 'fixed',
        bottom,
        right,
        zIndex,
        pointerEvents: 'none',
      }}
    >
      <img
        id={`${id}-image`}
        src={src}
        alt="Floating Logo"
        style={{ width, maxWidth, height: 'auto', opacity }}
      />
    </Box>
  );
} 