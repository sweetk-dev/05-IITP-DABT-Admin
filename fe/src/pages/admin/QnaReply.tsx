import { useMemo, useState, useEffect } from 'react';
import { Box, CardContent, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import ErrorAlert from '../../components/ErrorAlert';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { getAdminQnaDetail, answerAdminQna, updateAdminQna } from '../../api';
import { useDataFetching } from '../../hooks/useDataFetching';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import ByteLimitHelper from '../../components/common/ByteLimitHelper';
import type { AdminQnaUpdateReq, AdminQnaAnswerReq } from '@iitp-dabt/common';

export default function AdminQnaReply() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const qnaId = Number(id);

  const { data, error: fetchError } = useDataFetching({ 
    fetchFunction: ()=> getAdminQnaDetail(qnaId), 
    dependencies: [qnaId], 
    autoFetch: !!qnaId 
  });
  
  const detail = (data as any)?.qna || (data as any) || {};

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [answer, setAnswer] = useState('');
  const [qnaType, setQnaType] = useState<string>('');
  const [secretYn, setSecretYn] = useState<'Y' | 'N'>('N');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const MAX_TITLE = 600, MAX_CONTENT = 6000;
  const titleBytes = useMemo(()=> new TextEncoder().encode(title).length, [title]);
  const contentBytes = useMemo(()=> new TextEncoder().encode(content).length, [content]);
  const answerBytes = useMemo(()=> new TextEncoder().encode(answer).length, [answer]);

  useEffect(() => {
    if (detail) {
      setTitle(detail.title || '');
      setContent(detail.content || '');
      setAnswer(detail.answerContent || '');
      setQnaType(detail.qnaType || '');
      setSecretYn(detail.secretYn || 'N');
    }
  }, [detail]);

  const handleBack = () => navigate(ROUTES.ADMIN.QNA.DETAIL.replace(':id', String(qnaId)));
  
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('제목과 질문 내용을 입력해주세요.');
      return;
    }
    
    if (titleBytes > MAX_TITLE || contentBytes > MAX_CONTENT || answerBytes > MAX_CONTENT) { 
      setError('바이트 제한을 확인해 주세요.'); 
      return; 
    }
    
    setLoading(true); 
    setError(null);
    
    const updateData: AdminQnaUpdateReq = { 
      title, 
      content, 
      answerContent: answer,
      qnaType,
      secretYn
    };
    
    const res = await updateAdminQna(qnaId, updateData);
    handleApiResponse(res, () => navigate(ROUTES.ADMIN.QNA.DETAIL.replace(':id', String(qnaId))), (msg)=>setError(msg));
    setLoading(false);
  };
  
  const handleAnswer = async () => {
    if (!answer.trim()) { 
      setError('답변 내용을 입력해 주세요.'); 
      return; 
    }
    
    if (answerBytes > MAX_CONTENT) { 
      setError('답변 내용의 바이트 제한을 초과했습니다.'); 
      return; 
    }
    
    setLoading(true); 
    setError(null);
    
    const answerData: AdminQnaAnswerReq = { 
      answerContent: answer 
    };
    
    const res = await answerAdminQna(qnaId, answerData);
    handleApiResponse(res, () => navigate(ROUTES.ADMIN.QNA.DETAIL.replace(':id', String(qnaId))), (msg)=>setError(msg));
    setLoading(false);
  };

  return (
    <Box id="admin-qna-reply-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader id="admin-qna-reply-header" title="Q&A 답변/수정" onBack={handleBack} />
      
      {/* 에러 알림 */}
      {(error || fetchError) && (
        <ErrorAlert 
          error={error || fetchError} 
          onClose={() => setError(null)} 
        />
      )}
      
      <ThemedCard>
        <CardContent>
          <TextField 
            id="qna-title" 
            fullWidth 
            label="제목" 
            value={title} 
            onChange={(e)=>setTitle(e.target.value)} 
            sx={{ mb: 0.5 }} 
            required
          />
          <ByteLimitHelper id="qna-title-bytes" currentBytes={titleBytes} maxBytes={MAX_TITLE} />

          <TextField 
            id="qna-content" 
            fullWidth 
            label="질문 내용" 
            value={content} 
            onChange={(e)=>setContent(e.target.value)} 
            multiline 
            minRows={8} 
            sx={{ mb: 0.5 }} 
            required
          />
          <ByteLimitHelper id="qna-content-bytes" currentBytes={contentBytes} maxBytes={MAX_CONTENT} />

          <FormControl fullWidth sx={{ mb: SPACING.MEDIUM }}>
            <InputLabel id="qna-type-label">Q&A 유형</InputLabel>
            <Select
              labelId="qna-type-label"
              id="qna-type"
              value={qnaType}
              label="Q&A 유형"
              onChange={(e) => setQnaType(e.target.value)}
            >
              <MenuItem value="GENERAL">일반</MenuItem>
              <MenuItem value="TECHNICAL">기술</MenuItem>
              <MenuItem value="ACCOUNT">계정</MenuItem>
              <MenuItem value="OTHER">기타</MenuItem>
            </Select>
            <FormHelperText>Q&A의 유형을 선택해주세요</FormHelperText>
          </FormControl>

          <FormControl fullWidth sx={{ mb: SPACING.MEDIUM }}>
            <InputLabel id="secret-yn-label">비공개 여부</InputLabel>
            <Select
              labelId="secret-yn-label"
              id="secret-yn"
              value={secretYn}
              label="비공개 여부"
              onChange={(e) => setSecretYn(e.target.value as 'Y' | 'N')}
            >
              <MenuItem value="N">공개</MenuItem>
              <MenuItem value="Y">비공개</MenuItem>
            </Select>
            <FormHelperText>Q&A를 비공개로 설정할지 여부를 선택해주세요</FormHelperText>
          </FormControl>

          <TextField 
            id="qna-answer" 
            fullWidth 
            label="답변 내용" 
            value={answer} 
            onChange={(e)=>setAnswer(e.target.value)} 
            multiline 
            minRows={10} 
            sx={{ mb: 0.5 }} 
            helperText="질문에 대한 답변을 입력해주세요"
          />
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


