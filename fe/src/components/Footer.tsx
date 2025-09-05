import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../routes';

const SERVICE_NAME = 'IITP DABT';

export default function Footer() {
	const theme = useTheme();
	return (
		<Box
			component="footer"
			id="site-footer"
			sx={{
				bgcolor: theme.palette.grey[900],
				color: theme.palette.common.white,
				py: { xs: 3, md: 4 },
				mt: 'auto',
				position: 'relative',
				overflow: 'visible'
			}}
		>
				<Container id="footer-container" maxWidth={false} sx={{ maxWidth: 'var(--content-max-width, 1600px)', mx: 'auto', position: 'relative', px: { xs: 2, md: 0 } }}>
					<Box
						id="footer-content"
						sx={{
							display: 'grid',
							gridTemplateColumns: { xs: '1fr', md: 'minmax(220px, 1fr) minmax(360px, 1.5fr) auto' },
							alignItems: { xs: 'start', md: 'center' },
							rowGap: { xs: 1.5, md: 1 },
							columnGap: 2
						}}
					>
						{/* Left: Brand title */}
						<Box id="footer-left" sx={{ minWidth: 200, justifySelf: 'start' }}>
							<Typography id="footer-brand-title" variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.2, mt: 0.2 }}>
								데이터로보는자립
							</Typography>
						</Box>

						{/* Center: Copy text (previously centered) */}
						<Box id="footer-center" sx={{ textAlign: { xs: 'left', md: 'center' } }}>
							<Typography variant="body2" sx={{ opacity: 0.85, lineHeight: 1.6 }}>
								장애인 자립생활 지원 플랫폼 Open API 센터
							</Typography>
							<Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.25 }}>
								© 2025 {SERVICE_NAME}. All rights reserved.
							</Typography>
						</Box>

						{/* Right: Policy links */}
						<Box id="footer-right" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', justifySelf: { xs: 'start', md: 'end' } }}>
							<MuiLink id="footer-link-about" component={RouterLink} to={ROUTES.PUBLIC.ABOUT} underline="hover" color="inherit" sx={{ opacity: 0.9 }}>
								OpenAPI센터 소개
							</MuiLink>
							<Typography component="span" aria-hidden="true" sx={{ opacity: 0.5 }}>|</Typography>
							<MuiLink id="footer-link-terms" component={RouterLink} to={ROUTES.PUBLIC.TERMS} underline="hover" color="inherit" sx={{ opacity: 0.9 }}>
								이용약관
							</MuiLink>
							<Typography component="span" aria-hidden="true" sx={{ opacity: 0.5 }}>|</Typography>
							<MuiLink id="footer-link-privacy" component={RouterLink} to={ROUTES.PUBLIC.PRIVACY} underline="hover" color="inherit" sx={{ opacity: 0.9 }}>
								개인정보처리방침
							</MuiLink>
						</Box>
					</Box>

					{/* Decorative brand image at right, overlapping upward */}
					<Box
						id="footer-brand-image-wrap"
						sx={{
							position: 'absolute',
							right: { xs: -8, md: 'max(-16px, calc((100vw - var(--content-max-width, 1600px)) / 40 - 24px))' },
							bottom: 0,
							transform: 'translateY(-30%)',
							pointerEvents: 'none',
							userSelect: 'none',
							zIndex: 2
						}}
					>
						<Box
							component="img"
							id="footer-brand-image"
							src={`${import.meta.env.BASE_URL}iitp_cms_logo_img_2.png`}
							alt="IITP Logo"
							sx={{ height: { xs: 80, md: 160 }, width: 'auto', opacity: 0.95, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))' }}
						/>
					</Box>
				</Container>
		</Box>
	);
} 