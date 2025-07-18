import { AppBar, Toolbar, Button, Box } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { HomeIconButton, Logo } from './AppBarCommon';

export default function AdminAppBar() {
  const navigate = useNavigate();
  const adminName = '관리자'; // TODO: 실제 관리자명 연동

  return (
    <AppBar position="fixed" color="default" elevation={1} sx={{ background: '#fff', boxShadow: 'none', zIndex: 1200 }}>
      <Toolbar sx={{ minHeight: '64px !important', px: { xs: '10%', md: '10%' }, justifyContent: 'space-between' }}>
        <Logo serviceName="장애인 자립 생활 지원 플랫폼 API 센터 - Admin" />
        <Box display="flex" alignItems="center">
          <HomeIconButton to="/admin/dashboard" />
          <Button color="primary" startIcon={<AccountCircle />} sx={{ ml: 2 }}>
            {adminName}
          </Button>
          <Button color="secondary" sx={{ ml: 2 }} onClick={() => {/* TODO: 로그아웃 처리 */}}>
            로그아웃
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
} 