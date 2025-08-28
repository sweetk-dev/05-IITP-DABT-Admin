import { useMemo, useState } from 'react';
import { Box, CardContent, TextField, Alert, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
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
import ErrorAlert from '../../components/ErrorAlert';

export default function AdminFaqCreate() {
  const navigate = useNavigate();
  const [faqType, setFaqType] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [useYn, setUseYn] = useState<'Y' | 'N'>('Y');
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
    if (sortOrder < 1) {
      setError('정렬순서는 1 이상이어야 합니다.');
      return;
    }
    
    setLoading(true);
    setError(null);
    const res = await createAdminFaq({ 
      faqType, 
      question, 
      answer, 
      sortOrder, 
      useYn 
    } as any);
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
            <ErrorAlert 
              error={error} 
              onClose={() => setError(null)} 
            />
          )}
          
          <SelectField 
            id="faq-type" 
            value={faqType} 
            onChange={(v)=>setFaqType(v)} 
            options={faqTypeOptions} 
            label="FAQ 유형" 
            sx={{ mb: SPACING.MEDIUM }}
            required
          />
          
          <TextField 
            id="faq-question" 
            fullWidth 
            label="질문" 
            value={question} 
            onChange={(e)=>setQuestion(e.target.value)} 
            sx={{ mb: 0.5, mt: SPACING.SMALL }} 
            required
          />
          <ByteLimitHelper id="faq-question-bytes" currentBytes={questionBytes} maxBytes={TITLE_MAX} />
          
          <TextField 
            id="faq-answer" 
            fullWidth 
            label="답변" 
            value={answer} 
            onChange={(e)=>setAnswer(e.target.value)} 
            multiline 
            minRows={12} 
            sx={{ mb: 0.5 }} 
            required
          />
          <ByteLimitHelper id="faq-answer-bytes" currentBytes={answerBytes} maxBytes={CONTENT_MAX} />
          
          <TextField
            id="faq-sort-order"
            fullWidth
            label="정렬순서"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            sx={{ mb: SPACING.MEDIUM }}
            required
            helperText="1 이상의 값으로 입력해주세요"
            inputProps={{ min: 1 }}
          />
          
          <FormControl fullWidth sx={{ mb: SPACING.MEDIUM }}>
            <InputLabel id="faq-use-yn-label">사용여부</InputLabel>
            <Select
              labelId="faq-use-yn-label"
              id="faq-use-yn"
              value={useYn}
              label="사용여부"
              onChange={(e) => setUseYn(e.target.value as 'Y' | 'N')}
            >
              <MenuItem value="Y">사용</MenuItem>
              <MenuItem value="N">미사용</MenuItem>
            </Select>
            <FormHelperText>FAQ를 사용자에게 공개할지 여부를 설정합니다</FormHelperText>
          </FormControl>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: SPACING.MEDIUM }}>
            <ThemedButton variant="outlined" onClick={handleBack} buttonSize="cta">취소</ThemedButton>
            <ThemedButton variant="primary" buttonSize="cta" onClick={handleSubmit} disabled={loading}>등록</ThemedButton>
          </Box>
        </CardContent>
      </ThemedCard>
    </Box>
  );
}


