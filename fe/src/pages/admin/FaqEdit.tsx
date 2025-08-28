import { useMemo, useState, useEffect } from 'react';
import { Box, CardContent, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { COMMON_CODE_GROUPS } from '@iitp-dabt/common';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import ErrorAlert from '../../components/ErrorAlert';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import ByteLimitHelper from '../../components/common/ByteLimitHelper';
import { getAdminFaqDetail, updateAdminFaq, getCommonCodesByGroupId } from '../../api';
import { useDataFetching } from '../../hooks/useDataFetching';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import SelectField from '../../components/common/SelectField';
import type { AdminFaqUpdateReq } from '@iitp-dabt/common';

export default function AdminFaqEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const faqId = Number(id);

  const { data, error: fetchError } = useDataFetching({ 
    fetchFunction: () => getAdminFaqDetail(faqId), 
    dependencies: [faqId], 
    autoFetch: !!faqId 
  });
  
  const detail = (data as any)?.faq || (data as any) || {};

  const [faqType, setFaqType] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [useYn, setUseYn] = useState<'Y' | 'N'>('Y');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const questionBytes = useMemo(()=> new TextEncoder().encode(question).length, [question]);
  const answerBytes = useMemo(()=> new TextEncoder().encode(answer).length, [answer]);

  const TITLE_MAX = 600; 
  const CONTENT_MAX = 6000;

  useEffect(() => {
    if (detail) {
      setFaqType(detail.faqType || '');
      setQuestion(detail.question || '');
      setAnswer(detail.answer || '');
      setSortOrder(detail.sortOrder || 1);
      setUseYn(detail.useYn || 'Y');
    }
  }, [detail]);

  // load FAQ type codes
  const { data: faqTypeCodes } = useDataFetching({ 
    fetchFunction: () => getCommonCodesByGroupId(COMMON_CODE_GROUPS.FAQ_TYPE), 
    autoFetch: true 
  });
  
  const faqTypeOptions = [
    { value: '', label: '선택하세요' }, 
    ...((faqTypeCodes as any)?.codes || []).map((c: any) => ({ value: c.codeId, label: c.codeNm }))
  ];

  const handleBack = () => navigate(ROUTES.ADMIN.FAQ.DETAIL.replace(':id', String(faqId)));
  
  const handleSave = async () => {
    if (!faqType || !question || !answer) { 
      setError('유형, 질문, 답변을 모두 입력해 주세요.'); 
      return; 
    }
    
    if (questionBytes > TITLE_MAX || answerBytes > CONTENT_MAX) { 
      setError('입력 용량을 초과했습니다.'); 
      return; 
    }
    
    if (sortOrder < 1) {
      setError('정렬순서는 1 이상이어야 합니다.');
      return;
    }
    
    setLoading(true); 
    setError(null);
    
    const updateData: AdminFaqUpdateReq = {
      faqType, 
      question, 
      answer, 
      sortOrder, 
      useYn 
    };
    
    const res = await updateAdminFaq(faqId, updateData);
    handleApiResponse(res, () => navigate(ROUTES.ADMIN.FAQ.DETAIL.replace(':id', String(faqId))), (msg)=>setError(msg));
    setLoading(false);
  };

  return (
    <Box id="admin-faq-edit-page" sx={{ p: SPACING.LARGE }}>
      <AdminPageHeader />
      
      <PageHeader 
        id="admin-faq-edit-header" 
        title="FAQ 수정" 
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
            <ThemedButton variant="primary" onClick={handleSave} disabled={loading} buttonSize="cta">저장</ThemedButton>
          </Box>
        </CardContent>
      </ThemedCard>
    </Box>
  );
}


