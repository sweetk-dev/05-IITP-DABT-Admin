import { useMemo, useState, useEffect } from 'react';
import { Box, CardContent, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
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

  const { data, isError, status } = useDataFetching({ 
    fetchFunction: ()=> getAdminQnaDetail(qnaId), 
    dependencies: [qnaId], 
    autoFetch: !!qnaId 
  });

  const fetchError = isError && status === 'error' ? (data as any)?.error : undefined;
  
  // API 응답 구조를 유연하게 처리
  const detail = (data as any)?.data?.qna || (data as any)?.qna || (data as any) || {};

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
    console.log('[QnaReply] detail data:', detail);
    console.log('[QnaReply] raw API response:', data);
    console.log('[QnaReply] data.data:', (data as any)?.data);
    console.log('[QnaReply] data.data?.qna:', (data as any)?.data?.qna);
    
    if (detail) {
      setTitle(detail.title || '');
      setContent(detail.content || '');
      setAnswer(detail.answerContent || '');
      setQnaType(detail.qnaType || '');
      setSecretYn(detail.secretYn || 'N');
    }
  }, [detail, data]);

  // const handleBack = () => navigate(ROUTES.ADMIN.QNA.DETAIL.replace(':id', String(qnaId)));
  
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
      updatedBy: 'admin' // TODO: 실제 관리자 정보로 교체
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
      answer: answer,
      answeredBy: 'admin' // TODO: 실제 관리자 정보로 교체
    };
    
    const res = await answerAdminQna(qnaId, answerData);
    handleApiResponse(res, () => navigate(ROUTES.ADMIN.QNA.DETAIL.replace(':id', String(qnaId))), (msg)=>setError(msg));
    setLoading(false);
  };

  return (
    <Box id="admin-qna-reply-page" sx={{ p: SPACING.LARGE }}>
      <AdminPageHeader />
      
      <PageHeader 
        id="admin-qna-reply-header" 
        title="Q&A 답변/수정" 
        sx={{ mt: 1, mb: 2 }}
      />
      
      {/* 에러 알림 */}
      {(error || fetchError) && (
        <ErrorAlert 
          error={error || fetchError} 
          onClose={() => setError(null)} 
        />
      )}
      
      <ThemedCard>
        <CardContent>
                     {/* 사용자 작성 내용 - 읽기 전용 */}
           <Box sx={{ 
             bgcolor: 'grey.50', 
             p: 2, 
             borderRadius: 1, 
             border: '1px solid',
             borderColor: 'grey.200',
             mb: SPACING.SMALL 
           }}>
            
            <TextField 
              id="qna-title" 
              fullWidth 
              label="제목" 
              value={title} 
              InputProps={{ readOnly: true }}
              sx={{ mb: 0.5, bgcolor: 'white' }} 
            />
            <ByteLimitHelper id="qna-title-bytes" currentBytes={titleBytes} maxBytes={MAX_TITLE} />

            <TextField 
              id="qna-content" 
              fullWidth 
              label="질문 내용" 
              value={content} 
              InputProps={{ readOnly: true }}
              multiline 
              minRows={8} 
              sx={{ mb: 0.5, bgcolor: 'white' }} 
            />
            <ByteLimitHelper id="qna-content-bytes" currentBytes={contentBytes} maxBytes={MAX_CONTENT} />

            <FormControl fullWidth sx={{ mb: SPACING.MEDIUM }}>
              <InputLabel id="qna-type-label">Q&A 유형</InputLabel>
              <Select
                labelId="qna-type-label"
                id="qna-type"
                value={qnaType}
                label="Q&A 유형"
                disabled={true}
                sx={{ bgcolor: 'white' }}
              >
                <MenuItem value="GENERAL">일반</MenuItem>
                <MenuItem value="TECHNICAL">기술</MenuItem>
                <MenuItem value="ACCOUNT">계정</MenuItem>
                <MenuItem value="OTHER">기타</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 0 }}>
              <InputLabel id="secret-yn-label">비공개 여부</InputLabel>
              <Select
                labelId="secret-yn-label"
                id="secret-yn"
                value={secretYn}
                label="비공개 여부"
                disabled={true}
                sx={{ bgcolor: 'white' }}
              >
                <MenuItem value="N">공개</MenuItem>
                <MenuItem value="Y">비공개</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* 어드민 편집 영역 - 답변만 수정 가능 */}
          <Box sx={{ 
            bgcolor: 'primary.50', 
            p: 2, 
            borderRadius: 1, 
            border: '2px solid',
            borderColor: 'primary.200',
            mb: SPACING.MEDIUM 
          }}>
            
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
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: SPACING.MEDIUM }}>
            {/* <ThemedButton variant="outlined" onClick={handleBack} buttonSize="cta">취소</ThemedButton> */}
            <ThemedButton variant="outlined" onClick={handleSave} disabled={loading} buttonSize="cta">저장</ThemedButton>
            <ThemedButton variant="primary" onClick={handleAnswer} disabled={loading} buttonSize="cta">답변완료</ThemedButton>
          </Box>
        </CardContent>
      </ThemedCard>
    </Box>
  );
}


