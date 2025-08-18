import { useMemo, useState } from 'react';
import { Box, CardContent, TextField, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { getAdminQnaDetail, answerAdminQna, updateAdminQna } from '../../api';
import { useDataFetching } from '../../hooks/useDataFetching';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import ByteLimitHelper from '../../components/common/ByteLimitHelper';

export default function AdminQnaReply() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const qnaId = Number(id);

  const { data } = useDataFetching({ fetchFunction: ()=> getAdminQnaDetail(qnaId), dependencies: [qnaId], autoFetch: !!qnaId });
  const detail = (data as any)?.qna || (data as any) || {};

  const [title, setTitle] = useState(detail.title || '');
  const [content, setContent] = useState(detail.content || '');
  const [answer, setAnswer] = useState(detail.answerContent || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const MAX_TITLE = 600, MAX_CONTENT = 6000;
  const titleBytes = useMemo(()=> new TextEncoder().encode(title).length, [title]);
  const contentBytes = useMemo(()=> new TextEncoder().encode(content).length, [content]);
  const answerBytes = useMemo(()=> new TextEncoder().encode(answer).length, [answer]);

  const handleBack = () => navigate(ROUTES.ADMIN.QNA.DETAIL.replace(':id', String(qnaId)));
  const handleSave = async () => {
    if (titleBytes > MAX_TITLE || contentBytes > MAX_CONTENT || answerBytes > MAX_CONTENT) { setError('바이트 제한을 확인해 주세요.'); return; }
    setLoading(true); setError(null);
    const res = await updateAdminQna(qnaId, { title, content, answerContent: answer } as any);
    handleApiResponse(res, () => navigate(ROUTES.ADMIN.QNA.DETAIL.replace(':id', String(qnaId))), (msg)=>setError(msg));
    setLoading(false);
  };
  const handleAnswer = async () => {
    if (!answer) { setError('답변 내용을 입력해 주세요.'); return; }
    if (answerBytes > MAX_CONTENT) { setError('답변 내용의 바이트 제한을 초과했습니다.'); return; }
    setLoading(true); setError(null);
    const res = await answerAdminQna(qnaId, { answerContent: answer } as any);
    handleApiResponse(res, () => navigate(ROUTES.ADMIN.QNA.DETAIL.replace(':id', String(qnaId))), (msg)=>setError(msg));
    setLoading(false);
  };

  return (
    <Box id="admin-qna-reply-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader id="admin-qna-reply-header" title="Q&A 답변/수정" onBack={handleBack} />
      <ThemedCard>
        <CardContent>
          {error && (<Alert severity="error" sx={{ mb: SPACING.MEDIUM }} onClose={()=>setError(null)}>{error}</Alert>)}

          <TextField id="qna-title" fullWidth label="제목" value={title} onChange={(e)=>setTitle(e.target.value)} sx={{ mb: 0.5 }} />
          <ByteLimitHelper id="qna-title-bytes" currentBytes={titleBytes} maxBytes={MAX_TITLE} />

          <TextField id="qna-content" fullWidth label="질문 내용" value={content} onChange={(e)=>setContent(e.target.value)} multiline minRows={8} sx={{ mb: 0.5 }} />
          <ByteLimitHelper id="qna-content-bytes" currentBytes={contentBytes} maxBytes={MAX_CONTENT} />

          <TextField id="qna-answer" fullWidth label="답변 내용" value={answer} onChange={(e)=>setAnswer(e.target.value)} multiline minRows={10} sx={{ mb: 0.5 }} />
          <ByteLimitHelper id="qna-answer-bytes" currentBytes={answerBytes} maxBytes={MAX_CONTENT} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: SPACING.MEDIUM }}>
            <ThemedButton variant="outlined" onClick={handleBack} buttonSize="cta">취소</ThemedButton>
            <ThemedButton variant="outlined" onClick={handleSave} disabled={loading} buttonSize="cta">저장</ThemedButton>
            <ThemedButton variant="primary" onClick={handleAnswer} disabled={loading} buttonSize="cta">답변완료</ThemedButton>
          </Box>
        </CardContent>
      </ThemedCard>
    </Box>
  );
}


