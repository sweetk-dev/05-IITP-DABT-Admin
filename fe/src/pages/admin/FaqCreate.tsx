import { useMemo, useState } from 'react';
import { Box, CardContent, TextField, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { COMMON_CODE_GROUPS } from '@iitp-dabt/common';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import ByteLimitHelper from '../../components/common/ByteLimitHelper';
import { createAdminFaq, getCommonCodesByGroupId } from '../../api';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import SelectField from '../../components/common/SelectField';
import { useDataFetching } from '../../hooks/useDataFetching';

export default function AdminFaqCreate() {
  const navigate = useNavigate();
  const [faqType, setFaqType] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const questionBytes = useMemo(()=> new TextEncoder().encode(question).length, [question]);
  const answerBytes = useMemo(()=> new TextEncoder().encode(answer).length, [answer]);
  const TITLE_MAX = 600;
  const CONTENT_MAX = 6000;

  // load FAQ type codes
  const { data: faqTypeCodes } = useDataFetching({ fetchFunction: () => getCommonCodesByGroupId(COMMON_CODE_GROUPS.FAQ_TYPE), autoFetch: true });
  const faqTypeOptions = [{ value: '', label: '선택하세요' }, ...((faqTypeCodes as any)?.codes || []).map((c: any) => ({ value: c.codeId, label: c.codeNm }))];

  const handleBack = () => navigate(ROUTES.ADMIN.FAQ.LIST);
  const handleSubmit = async () => {
    if (!faqType || !question || !answer) {
      setError('유형, 질문, 답변을 모두 입력해 주세요.');
      return;
    }
    if (questionBytes > TITLE_MAX || answerBytes > CONTENT_MAX) {
      setError('입력 용량을 초과했습니다. 질문 600B, 답변 6000B 이내로 입력해 주세요.');
      return;
    }
    setLoading(true);
    setError(null);
    const res = await createAdminFaq({ faqType, question, answer } as any);
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
          <SelectField id="faq-type" value={faqType} onChange={(v)=>setFaqType(v)} options={faqTypeOptions} label="FAQ 유형" />
          <TextField id="faq-question" fullWidth label="질문" value={question} onChange={(e)=>setQuestion(e.target.value)} sx={{ mb: 0.5, mt: SPACING.SMALL }} />
          <ByteLimitHelper id="faq-question-bytes" currentBytes={questionBytes} maxBytes={TITLE_MAX} />
          <TextField id="faq-answer" fullWidth label="답변" value={answer} onChange={(e)=>setAnswer(e.target.value)} multiline minRows={12} sx={{ mb: 0.5 }} />
          <ByteLimitHelper id="faq-answer-bytes" currentBytes={answerBytes} maxBytes={CONTENT_MAX} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: SPACING.MEDIUM }}>
            <ThemedButton variant="outlined" onClick={handleBack} buttonSize="cta">취소</ThemedButton>
            <ThemedButton variant="primary" buttonSize="cta" onClick={handleSubmit} disabled={loading}>등록</ThemedButton>
          </Box>
        </CardContent>
      </ThemedCard>
    </Box>
  );
}


