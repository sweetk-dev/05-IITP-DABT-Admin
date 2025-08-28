import { useMemo, useState, useEffect } from 'react';
import { Box, CardContent, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import ErrorAlert from '../../components/ErrorAlert';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import ByteLimitHelper from '../../components/common/ByteLimitHelper';
import { getAdminNoticeDetail, updateAdminNotice } from '../../api';
import { useDataFetching } from '../../hooks/useDataFetching';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import type { AdminNoticeUpdateReq } from '@iitp-dabt/common';

export default function AdminNoticeEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const noticeId = Number(id);

  const { data, error: fetchError } = useDataFetching({ 
    fetchFunction: () => getAdminNoticeDetail(noticeId), 
    dependencies: [noticeId], 
    autoFetch: !!noticeId 
  });
  
  const detail = (data as any)?.notice || (data as any) || {};

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noticeType, setNoticeType] = useState<'G' | 'S' | 'E'>('G');
  const [pinnedYn, setPinnedYn] = useState<'Y' | 'N'>('N');
  const [publicYn, setPublicYn] = useState<'Y' | 'N'>('Y');
  const [startDt, setStartDt] = useState('');
  const [endDt, setEndDt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const titleBytes = useMemo(()=> new TextEncoder().encode(title).length, [title]);
  const contentBytes = useMemo(()=> new TextEncoder().encode(content).length, [content]);
  
  const TITLE_MAX = 600; 
  const CONTENT_MAX = 6000;

  useEffect(() => {
    if (detail) {
      setTitle(detail.title || '');
      setContent(detail.content || '');
      setNoticeType(detail.noticeType || 'G');
      setPinnedYn(detail.pinnedYn || 'N');
      setPublicYn(detail.publicYn || 'Y');
      setStartDt(detail.startDt ? detail.startDt.split('T')[0] : '');
      setEndDt(detail.endDt ? detail.endDt.split('T')[0] : '');
    }
  }, [detail]);

  const handleBack = () => navigate(ROUTES.ADMIN.NOTICES.DETAIL.replace(':id', String(noticeId)));
  
  const handleSave = async () => {
    if (!title || !content) { 
      setError('제목과 내용을 입력해 주세요.'); 
      return; 
    }
    
    if (titleBytes > TITLE_MAX || contentBytes > CONTENT_MAX) { 
      setError('입력 용량을 초과했습니다.'); 
      return; 
    }
    
    // 날짜 유효성 검사
    if (startDt && endDt && new Date(startDt) > new Date(endDt)) {
      setError('시작일은 종료일보다 이전이어야 합니다.');
      return;
    }
    
    setLoading(true); 
    setError(null);
    
    const updateData: AdminNoticeUpdateReq = {
      title, 
      content, 
      noticeType, 
      pinnedYn, 
      publicYn, 
      startDt: startDt || undefined, 
      endDt: endDt || undefined 
    };
    
    const res = await updateAdminNotice(noticeId, updateData);
    handleApiResponse(res, () => navigate(ROUTES.ADMIN.NOTICES.DETAIL.replace(':id', String(noticeId))), (msg)=>setError(msg));
    setLoading(false);
  };

  return (
    <Box id="admin-notice-edit-page" sx={{ p: SPACING.LARGE }}>
      <AdminPageHeader />
      
      <PageHeader 
        id="admin-notice-edit-header" 
        title="공지 수정" 
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
          <TextField 
            id="notice-title" 
            fullWidth 
            label="제목" 
            value={title} 
            onChange={(e)=>setTitle(e.target.value)} 
            sx={{ mb: 0.5 }} 
            required
          />
          <ByteLimitHelper id="notice-title-bytes" currentBytes={titleBytes} maxBytes={TITLE_MAX} />
          
          <TextField 
            id="notice-content" 
            fullWidth 
            label="내용" 
            value={content} 
            onChange={(e)=>setContent(e.target.value)} 
            multiline 
            minRows={12} 
            sx={{ mb: 0.5 }} 
            required
          />
          <ByteLimitHelper id="notice-content-bytes" currentBytes={contentBytes} maxBytes={CONTENT_MAX} />
          
          <FormControl fullWidth sx={{ mb: SPACING.MEDIUM }}>
            <InputLabel id="notice-type-label">공지 유형</InputLabel>
            <Select
              labelId="notice-type-label"
              id="notice-type"
              value={noticeType}
              label="공지 유형"
              onChange={(e) => setNoticeType(e.target.value as 'G' | 'S' | 'E')}
            >
              <MenuItem value="G">일반 (G)</MenuItem>
              <MenuItem value="S">중요 (S)</MenuItem>
              <MenuItem value="E">긴급 (E)</MenuItem>
            </Select>
            <FormHelperText>공지의 중요도를 설정합니다</FormHelperText>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: SPACING.MEDIUM }}>
            <InputLabel id="notice-pinned-label">상단 고정</InputLabel>
            <Select
              labelId="notice-pinned-label"
              id="notice-pinned"
              value={pinnedYn}
              label="상단 고정"
              onChange={(e) => setPinnedYn(e.target.value as 'Y' | 'N')}
            >
              <MenuItem value="Y">고정</MenuItem>
              <MenuItem value="N">일반</MenuItem>
            </Select>
            <FormHelperText>공지사항을 목록 상단에 고정할지 여부를 설정합니다</FormHelperText>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: SPACING.MEDIUM }}>
            <InputLabel id="notice-public-label">공개 여부</InputLabel>
            <Select
              labelId="notice-public-label"
              id="notice-public"
              value={publicYn}
              label="공개 여부"
              onChange={(e) => setPublicYn(e.target.value as 'Y' | 'N')}
            >
              <MenuItem value="Y">공개</MenuItem>
              <MenuItem value="N">비공개</MenuItem>
            </Select>
            <FormHelperText>사용자에게 공지사항을 보여줄지 여부를 설정합니다</FormHelperText>
          </FormControl>
          
          <TextField
            id="notice-start-date"
            fullWidth
            label="시작일"
            type="date"
            value={startDt}
            onChange={(e) => setStartDt(e.target.value)}
            sx={{ mb: SPACING.MEDIUM }}
            InputLabelProps={{ shrink: true }}
            helperText="공지사항을 표시할 시작일을 설정합니다 (선택사항)"
          />
          
          <TextField
            id="notice-end-date"
            fullWidth
            label="종료일"
            type="date"
            value={endDt}
            onChange={(e) => setEndDt(e.target.value)}
            sx={{ mb: SPACING.MEDIUM }}
            InputLabelProps={{ shrink: true }}
            helperText="공지사항을 표시할 종료일을 설정합니다 (선택사항)"
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: SPACING.MEDIUM }}>
            <ThemedButton variant="outlined" onClick={handleBack} buttonSize="cta">취소</ThemedButton>
            <ThemedButton variant="primary" onClick={handleSave} disabled={loading} buttonSize="cta">저장</ThemedButton>
          </Box>
        </CardContent>
      </ThemedCard>
    </Box>
  );
}


