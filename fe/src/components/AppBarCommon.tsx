import { Box, Typography, IconButton } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

export function HomeIconButton({ to = '/', theme = 'user' }: { to?: string; theme?: 'user' | 'admin' }) {
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const primary = muiTheme.palette.primary.main;
  
  return (
    <IconButton
      id="home-icon-button"
      onClick={() => navigate(to)}
      sx={{
        background: alpha(primary, 0.12),
        color: primary,
        borderRadius: '50%',
        boxShadow: 1,
        p: 0.9,
        mr: 1,
        transition: 'all 0.2s',
        '&:hover': { 
          boxShadow: 2, 
          background: alpha(primary, 0.25),
          opacity: 0.8
        },
        height: { xs: 40, md: 46 },
        width: { xs: 40, md: 46 },
        minWidth: 0,
      }}
    >
      <HomeOutlinedIcon id="home-icon" sx={{ fontSize: { xs: 22, md: 26 } }} />
    </IconButton>
  );
}

export function Logo({ serviceName, theme = 'user' }: { serviceName: string; theme?: 'user' | 'admin' }) {
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const text = muiTheme.palette.text.primary;
  
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
        style={{ height: 56, marginRight: 12 }} 
      />
      <Typography 
        id="appbar-logo-text"
        variant="h6" 
        noWrap 
        sx={{ color: text, fontWeight: 700, fontSize: { xs: '1.2rem', md: '1.4rem' } }}
      >
        {serviceName}
      </Typography>
    </Box>
  );
}

export function DashboardIconButton({ to = '/dashbd', theme = 'user' }: { to?: string; theme?: 'user' | 'admin' }) {
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const primary = muiTheme.palette.primary.main;
  
  return (
    <IconButton
      id="dashboard-icon-button"
      onClick={() => navigate(to)}
      sx={{
        background: alpha(primary, 0.12),
        color: primary,
        borderRadius: '50%',
        boxShadow: 1,
        p: 0.9,
        mr: 1,
        transition: 'all 0.2s',
        '&:hover': { 
          boxShadow: 2, 
          background: alpha(primary, 0.25),
          opacity: 0.8
        },
        height: { xs: 40, md: 46 },
        width: { xs: 40, md: 46 },
        minWidth: 0,
      }}
    >
      <DashboardOutlinedIcon id="dashboard-icon" sx={{ fontSize: { xs: 22, md: 26 } }} />
    </IconButton>
  );
} 