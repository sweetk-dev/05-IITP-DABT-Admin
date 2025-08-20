import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { createUserQna, getCommonCodesByGroupId } from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { ROUTES } from '../../routes';
import { SPACING } from '../../constants/spacing';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import ByteLimitHelper from '../../components/common/ByteLimitHelper';
// import { getThemeColors } from '../../theme';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import { useDataFetching } from '../../hooks/useDataFetching';
import type { CommonCodeByGroupRes } from '@iitp-dabt/common';
import { useToast } from '../../components/ToastProvider';

interface QnaCreateProps {
  id?: string;
}

export const QnaCreate: React.FC<QnaCreateProps> = ({ id = 'qna-create' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    qnaType: '',
    title: '',
    content: '',
    secretYn: 'N',
    writerName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  // QNA 유형 공통코드 로드 (QnaList와 동일 소스 사용)
  const { data: qnaTypeCodes, isLoading: qnaTypeLoading } = useDataFetching<CommonCodeByGroupRes>({
    fetchFunction: () => getCommonCodesByGroupId('qna_type'),
    autoFetch: true
  });

  // Bytes helpers
  const getBytes = (value: string) => new TextEncoder().encode(value || '').length;
  const titleBytes = useMemo(() => getBytes(formData.title), [formData.title]);
  const contentBytes = useMemo(() => getBytes(formData.content), [formData.content]);
  const TITLE_MAX = 600;
  const CONTENT_MAX = 6000;
  const isTitleOver = titleBytes > TITLE_MAX;
  const isContentOver = contentBytes > CONTENT_MAX;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.qnaType || !formData.title || !formData.content) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }
    if (isTitleOver || isContentOver) {
      setError('입력 용량을 초과했습니다. 제목(최대 600바이트), 내용(최대 6000바이트)을 확인해 주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await createUserQna({
        qnaType: formData.qnaType,
        title: formData.title,
        content: formData.content,
        secretYn: formData.secretYn,
        writerName: formData.writerName || undefined
      });

      // handleApiResponse를 사용하여 에러 코드별 자동 처리
      handleApiResponse(response, 
        () => {
          showToast('문의가 성공적으로 등록되었습니다.', 'success');
          navigate(ROUTES.USER.DASHBOARD);
        },
        (errorMessage) => {
          setError(errorMessage);
        }
      );
    } catch (err) {
      setError('문의 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const from = (location.state as any)?.from as string | undefined;
    if (from) {
      navigate(from, { replace: true });
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(ROUTES.USER.DASHBOARD);
    }
  };

  if (loading) {
    return <LoadingSpinner loading={true} />;
  }

  return (
    <Box id={id} sx={{ p: SPACING.LARGE }}>
      <Box id="qna-create-header">
        <PageHeader title="문의하기" onBack={handleBack} />
      </Box>

      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}
      

      <ThemedCard>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: SPACING.MEDIUM }}>
            <FormControl fullWidth sx={{ mb: SPACING.MEDIUM }}>
              <InputLabel id="qna-type-label">문의 유형</InputLabel>
              <Select
                id="qna-type-select"
                labelId="qna-type-label"
                value={formData.qnaType}
                label="문의 유형"
                onChange={(e) => handleInputChange('qnaType', e.target.value)}
                required
              >
                <MenuItem value="" disabled>
                  {qnaTypeLoading ? '유형 불러오는 중...' : '유형을 선택하세요'}
                </MenuItem>
                {((qnaTypeCodes as CommonCodeByGroupRes | undefined)?.codes || []).map((code) => (
                  <MenuItem key={code.codeId} value={code.codeId}>{code.codeNm}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              id="qna-title"
              fullWidth
              label="제목"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              sx={{ mb: 0.5 }}
              inputProps={{ maxLength: 200 }}
              error={isTitleOver}
            />
            <ByteLimitHelper id="qna-title-bytes" currentBytes={titleBytes} maxBytes={TITLE_MAX} />

            <TextField
              id="qna-content"
              fullWidth
              label="내용"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              required
              multiline
              minRows={12}
              sx={{ mb: 0.5 }}
              inputProps={{ maxLength: 20000 }}
              error={isContentOver}
            />
            <ByteLimitHelper id="qna-content-bytes" currentBytes={contentBytes} maxBytes={CONTENT_MAX} />

            <TextField
              id="qna-writer-name"
              fullWidth
              label="작성자명 (선택)"
              value={formData.writerName}
              onChange={(e) => handleInputChange('writerName', e.target.value)}
              sx={{ mb: SPACING.MEDIUM }}
              inputProps={{ maxLength: 50 }}
            />

            <FormControlLabel
              id="qna-secret-switch"
              control={
                <Switch
                  checked={formData.secretYn === 'Y'}
                  onChange={(e) => handleInputChange('secretYn', e.target.checked ? 'Y' : 'N')}
                />
              }
              label="비공개 문의"
              sx={{ mb: SPACING.MEDIUM }}
            />

            <Box sx={{ display: 'flex', gap: SPACING.MEDIUM, justifyContent: 'flex-end' }}>
              <ThemedButton
                id="cancel-btn"
                buttonSize="cta"
                variant="outlined"
                onClick={handleBack}
              >
                취소
              </ThemedButton>
              <ThemedButton
                id="submit-btn"
                buttonSize="cta"
                variant="primary"
                type="submit"
                disabled={loading}
              >
                문의 등록
              </ThemedButton>
            </Box>
          </Box>
        </CardContent>
      </ThemedCard>
    </Box>
  );
}; 