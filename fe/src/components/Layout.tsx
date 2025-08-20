import { Box, Container } from '@mui/material';
import { useLocation, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import AppBar from './AppBar';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { ToastProvider } from './ToastProvider';
import { createAppTheme } from '../theme/mui';
import { isAuthenticated, validateAndCleanTokens, isUserAuthenticated, isAdminAuthenticated } from '../store/auth';
import { ROUTES } from '../routes';
import Footer from './Footer';

const PUBLIC_PAGES = [
	ROUTES.PUBLIC.HOME, 
	ROUTES.PUBLIC.NOTICE, 
	ROUTES.PUBLIC.FAQ, 
	ROUTES.PUBLIC.QNA, 
	ROUTES.PUBLIC.LOGIN, 
	ROUTES.PUBLIC.REGISTER, 
	// 정적 공개 페이지들
	ROUTES.PUBLIC.ABOUT,
	ROUTES.PUBLIC.TERMS,
	ROUTES.PUBLIC.PRIVACY,
	ROUTES.ADMIN.LOGIN
];

export default function Layout() {
	const location = useLocation();
	const isLoggedIn = isAuthenticated();
	const isUserLoggedIn = isUserAuthenticated();
	const isAdminLoggedIn = isAdminAuthenticated();
	
	//TODO:: Remove console logs in production
	// This is for debugging purposes to see the current authentication state and path
	console.log('[Layout]', {
		pathname: location.pathname,
		isLoggedIn,
		isUserLoggedIn,
		isAdminLoggedIn,
		isAuthenticated: isAuthenticated(),
		isUserAuthenticated: isUserAuthenticated(),
		isAdminAuthenticated: isAdminAuthenticated()
	});
	
	useEffect(() => {
		// 토큰/유저정보 변경 또는 라우트 이동 시 토큰 정리
		validateAndCleanTokens();
	}, [location.pathname]);

	let appBarType: 'user' | 'public' | 'auth' | 'admin-login' | 'admin';

	const isAdminPath = location.pathname.startsWith('/admin');

	if (isAdminPath) {
		// 관리자 경로: 로그인 여부에 따라 상단바 분기
		appBarType = isAdminLoggedIn ? 'admin' : 'admin-login';
	} else if (location.pathname === ROUTES.PUBLIC.LOGIN || location.pathname === ROUTES.PUBLIC.REGISTER) {
		// 공개 로그인/회원가입 페이지
		appBarType = 'auth';
	} else if (isUserLoggedIn) {
		// 일반 사용자 로그인 상태
		appBarType = 'user';
	} else if (PUBLIC_PAGES.some(page => location.pathname === page || location.pathname.startsWith(page + '/'))) {
		// 공개 페이지들(비로그인 시)
		appBarType = 'public';
	} else {
		// 기본값: 공개
		appBarType = 'public';
	}

	console.log('[Layout] AppBar type determined:', appBarType);

	// Apply compact density; default to 70%, can switch to 60% if needed after preview
	const appTheme = createAppTheme(
		appBarType === 'admin' || appBarType === 'admin-login' ? 'admin' : 'user',
		'compact70'
	);

	return (
		<ThemeProvider theme={appTheme}>
			<CssBaseline />
			<Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
				<AppBar type={appBarType} />
				<ToastProvider>
				<Box
					component="main"
					id="main-content"
					sx={{
						flex: 1,
					// Use a capped footer height to avoid over-shrinking content on tall screens before measurement settles
					'--content-max-height': 'calc(100dvh - var(--header-height-px, 0px) - var(--admin-menu-height-px, 0px) - min(var(--footer-height-px, 0px), var(--footer-height-cap, 120px)))',
						minHeight: 'calc(100dvh - var(--header-height-px, 64px) - var(--admin-menu-height-px, 0px) - var(--footer-height-px, 0px) + var(--main-height-offset, 0px))'
					}}
				>
					<Container id="layout-content-container" maxWidth={false} sx={{ py: { xs: 2, md: 4 }, maxWidth: 'var(--content-max-width, 1600px)', mx: 'auto', minHeight: 'var(--content-max-height)' }}>
						<Outlet />
					</Container>
				</Box>
				</ToastProvider>
				<Box ref={(el: HTMLDivElement | null) => {
					if (!el) return;
					const root = document.documentElement;
					const updateFooter = () => {
						root.style.setProperty('--footer-height-px', `${el.offsetHeight || 0}px`);
					};
					updateFooter();
					const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateFooter) : null;
					if (ro) ro.observe(el);
				}}>
					<Footer />
				</Box>
			</Box>
		</ThemeProvider>
	);
} 