import { useMemo, useState, useEffect } from 'react';
import { Box, CardContent, TextField, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import ByteLimitHelper from '../../components/common/ByteLimitHelper';
import { getAdminFaqDetail, updateAdminFaq, getCommonCodesByGroupId } from '../../api';
import { useDataFetching } from '../../hooks/useDataFetching';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import SelectField from '../../components/common/SelectField';

export default function AdminFaqEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const faqId = Number(id);

  const { data } = useDataFetching({ fetchFunction: () => getAdminFaqDetail(faqId), dependencies: [faqId], autoFetch: !!faqId });
  const detail = (data as any)?.faq || (data as any) || {};

  const [faqType, setFaqType] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const questionBytes = useMemo(()=> new TextEncoder().encode(question).length, [question]);
  const answerBytes = useMemo(()=> new TextEncoder().encode(answer).length, [answer]);

  const TITLE_MAX = 600; const CONTENT_MAX = 6000;

  useEffect(() => {
    if (detail) {
      setFaqType(detail.faqType || '');
      setQuestion(detail.question || '');
      setAnswer(detail.answer || '');
    }
  }, [detail]);

  // load FAQ type codes
  const { data: faqTypeCodes } = useDataFetching({ fetchFunction: () => getCommonCodesByGroupId('faq_type'), autoFetch: true });
  const faqTypeOptions = [{ value: '', label: '선택하세요' }, ...((faqTypeCodes as any)?.codes || []).map((c: any) => ({ value: c.codeId, label: c.codeNm }))];

  const handleBack = () => navigate(ROUTES.ADMIN.FAQ.DETAIL.replace(':id', String(faqId)));
  const handleSave = async () => {
    if (!faqType || !question || !answer) { setError('유형, 질문, 답변을 모두 입력해 주세요.'); return; }
    if (questionBytes > TITLE_MAX || answerBytes > CONTENT_MAX) { setError('입력 용량을 초과했습니다.'); return; }
    setLoading(true); setError(null);
    const res = await updateAdminFaq(faqId, { faqType, question, answer } as any);
    handleApiResponse(res, () => navigate(ROUTES.ADMIN.FAQ.DETAIL.replace(':id', String(faqId))), (msg)=>setError(msg));
    setLoading(false);
  };

  return (
    <Box id="admin-faq-edit-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader id="admin-faq-edit-header" title="FAQ 수정" onBack={handleBack} />
      <ThemedCard>
        <CardContent>
          {error && (<Alert severity="error" sx={{ mb: SPACING.MEDIUM }} onClose={()=>setError(null)}>{error}</Alert>)}
          <SelectField id="faq-type" value={faqType} onChange={(v)=>setFaqType(v)} options={faqTypeOptions} label="FAQ 유형" />
          <TextField id="faq-question" fullWidth label="질문" value={question} onChange={(e)=>setQuestion(e.target.value)} sx={{ mb: 0.5, mt: SPACING.SMALL }} />
          <ByteLimitHelper id="faq-question-bytes" currentBytes={questionBytes} maxBytes={TITLE_MAX} />
          <TextField id="faq-answer" fullWidth label="답변" value={answer} onChange={(e)=>setAnswer(e.target.value)} multiline minRows={12} sx={{ mb: 0.5 }} />
          <ByteLimitHelper id="faq-answer-bytes" currentBytes={answerBytes} maxBytes={CONTENT_MAX} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: SPACING.MEDIUM }}>
            <ThemedButton variant="outlined" onClick={handleBack} buttonSize="cta">취소</ThemedButton>
            <ThemedButton variant="primary" onClick={handleSave} disabled={loading} buttonSize="cta">저장</ThemedButton>
          </Box>
        </CardContent>
      </ThemedCard>
    </Box>
  );
}


