import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Alert
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { createUserQna } from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { ROUTES } from '../../routes';
import PageTitle from '../../components/common/PageTitle';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { getThemeColors } from '../../theme';
import { handleApiResponse } from '../../utils/apiResponseHandler';

interface QnaCreateProps {
  id?: string;
}

export const QnaCreate: React.FC<QnaCreateProps> = ({ id = 'qna-create' }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    qnaType: '',
    title: '',
    content: '',
    secretYn: 'N',
    writerName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // 테마 설정 (사용자 페이지는 'user' 테마)
  const theme: 'user' | 'admin' = 'user';
  const colors = getThemeColors(theme);

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
        (data) => {
          setSuccess(true);
          setTimeout(() => {
            navigate(ROUTES.USER.DASHBOARD);
          }, 2000);
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
    navigate(ROUTES.USER.DASHBOARD);
  };

  if (loading) {
    return <LoadingSpinner loading={true} />;
  }

  return (
    <Box id={id} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ThemedButton
          id="back-btn"
          theme={theme}
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          뒤로가기
        </ThemedButton>
        <PageTitle title="문의하기" theme={theme} />
      </Box>

      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          문의가 성공적으로 등록되었습니다. 잠시 후 대시보드로 이동합니다.
        </Alert>
      )}

      <ThemedCard theme={theme}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="qna-type-label">문의 유형</InputLabel>
              <Select
                id="qna-type-select"
                labelId="qna-type-label"
                value={formData.qnaType}
                label="문의 유형"
                onChange={(e) => handleInputChange('qnaType', e.target.value)}
                required
              >
                <MenuItem value="general">일반 문의</MenuItem>
                <MenuItem value="technical">기술 문의</MenuItem>
                <MenuItem value="billing">결제 문의</MenuItem>
                <MenuItem value="bug">버그 신고</MenuItem>
                <MenuItem value="feature">기능 요청</MenuItem>
              </Select>
            </FormControl>

            <TextField
              id="qna-title"
              fullWidth
              label="제목"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 200 }}
            />

            <TextField
              id="qna-content"
              fullWidth
              label="내용"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              required
              multiline
              rows={6}
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 2000 }}
            />

            <TextField
              id="qna-writer-name"
              fullWidth
              label="작성자명 (선택)"
              value={formData.writerName}
              onChange={(e) => handleInputChange('writerName', e.target.value)}
              sx={{ mb: 2 }}
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
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <ThemedButton
                id="cancel-btn"
                theme={theme}
                variant="outlined"
                onClick={handleBack}
              >
                취소
              </ThemedButton>
              <ThemedButton
                id="submit-btn"
                theme={theme}
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