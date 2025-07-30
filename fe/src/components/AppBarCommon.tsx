import { Box, Typography, IconButton } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
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

export function DashboardIconButton({ to = '/dashbd', theme = 'user' }: { to?: string; theme?: 'user' | 'admin' }) {
  const navigate = useNavigate();
  const colors = getThemeColors(theme);
  
  return (
    <IconButton
      id="dashboard-icon-button"
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
      <DashboardOutlinedIcon id="dashboard-icon" sx={{ fontSize: 22 }} />
    </IconButton>
  );
} 