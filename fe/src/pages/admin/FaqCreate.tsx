import { useMemo, useState } from 'react';
import { Box, CardContent, TextField, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import ByteLimitHelper from '../../components/common/ByteLimitHelper';
import { createAdminFaq } from '../../api';
import { handleApiResponse } from '../../utils/apiResponseHandler';

export default function AdminFaqCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const titleBytes = useMemo(()=> new TextEncoder().encode(title).length, [title]);
  const contentBytes = useMemo(()=> new TextEncoder().encode(content).length, [content]);
  const TITLE_MAX = 600;
  const CONTENT_MAX = 6000;

  const handleBack = () => navigate(ROUTES.ADMIN.FAQ.LIST);
  const handleSubmit = async () => {
    if (!title || !content) {
      setError('제목과 내용을 입력해 주세요.');
      return;
    }
    if (titleBytes > TITLE_MAX || contentBytes > CONTENT_MAX) {
      setError('입력 용량을 초과했습니다. 제목 600B, 내용 6000B 이내로 입력해 주세요.');
      return;
    }
    setLoading(true);
    setError(null);
    const res = await createAdminFaq({ title, content } as any);
    handleApiResponse(res, () => {
      navigate(ROUTES.ADMIN.FAQ.LIST);
    }, (msg) => setError(msg));
    setLoading(false);
  };

  return (
    <Box id="admin-faq-create-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader id="admin-faq-create-header" title="FAQ 등록" onBack={handleBack} />
      <ThemedCard>
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: SPACING.MEDIUM }} onClose={() => setError(null)}>{error}</Alert>
          )}
          <TextField id="faq-title" fullWidth label="제목" value={title} onChange={(e)=>setTitle(e.target.value)} sx={{ mb: 0.5 }} />
          <ByteLimitHelper id="faq-title-bytes" currentBytes={titleBytes} maxBytes={TITLE_MAX} />
          <TextField id="faq-content" fullWidth label="내용" value={content} onChange={(e)=>setContent(e.target.value)} multiline minRows={12} sx={{ mb: 0.5 }} />
          <ByteLimitHelper id="faq-content-bytes" currentBytes={contentBytes} maxBytes={CONTENT_MAX} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: SPACING.MEDIUM }}>
            <ThemedButton variant="outlined" onClick={handleBack} buttonSize="cta">취소</ThemedButton>
            <ThemedButton variant="primary" buttonSize="cta" onClick={handleSubmit} disabled={loading}>등록</ThemedButton>
          </Box>
        </CardContent>
      </ThemedCard>
    </Box>
  );
}


