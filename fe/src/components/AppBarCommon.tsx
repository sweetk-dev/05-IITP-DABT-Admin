import { Box, Typography, IconButton } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useNavigate } from 'react-router-dom';
import { getThemeColors } from '../theme';

export function HomeIconButton({ to = '/', theme = 'user' }: { to?: string; theme?: 'user' | 'admin' }) {
  const navigate = useNavigate();
  const colors = getThemeColors(theme);
  
  return (
    <IconButton
      id="home-icon-button"
      onClick={() => navigate(to)}
      sx={{
        background: `${colors.primary}20`,
        color: colors.primary,
        borderRadius: '50%',
        boxShadow: 1,
        p: 0.7,
        mr: 1,
        transition: 'all 0.2s',
        '&:hover': { 
          boxShadow: 2, 
          background: `${colors.primary}40`,
          opacity: 0.8
        },
        height: 36,
        width: 36,
        minWidth: 0,
      }}
    >
      <HomeOutlinedIcon id="home-icon" sx={{ fontSize: 22 }} />
    </IconButton>
  );
}

export function Logo({ serviceName, theme = 'user' }: { serviceName: string; theme?: 'user' | 'admin' }) {
  const navigate = useNavigate();
  const colors = getThemeColors(theme);
  
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
        noWrap 
        sx={{ color: colors.text, fontWeight: 700, fontSize: '1.25rem' }}
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