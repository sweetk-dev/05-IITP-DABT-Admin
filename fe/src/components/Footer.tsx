import { Box, Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

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
				{/* Copy centered */}
				<Box id="footer-copy" sx={{ textAlign: 'center' }}>
					<Typography variant="body2" sx={{ opacity: 0.85 }}>
						© 2025 {SERVICE_NAME}. All rights reserved.
					</Typography>
					<Typography variant="caption" sx={{ opacity: 0.65, display: 'block', mt: 0.5 }}>
						장애인 자립 생활 지원 플랫폼 Open Api 센터
					</Typography>
				</Box>

				{/* Decorative brand image at right, overlapping upward */}
					<Box
					id="footer-brand-image-wrap"
					sx={{
						position: 'absolute',
							right: { xs: -8, md: 'max(-16px, calc((100vw - var(--content-max-width, 1600px)) / 40 - 24px))' },
						bottom: 0,
					// Pull up into content area, but keep part overlapping the footer
							transform: 'translateY(-30%)',
						pointerEvents: 'none',
						userSelect: 'none',
						zIndex: 2
					}}
				>
					<Box
						component="img"
						id="footer-brand-image"
						src="/iitp_cms_logo_img_2.png"
						alt="IITP Logo"
						sx={{ height: { xs: 80, md: 160 }, width: 'auto', opacity: 0.95, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))' }}
					/>
				</Box>
			</Container>
		</Box>
	);
} 