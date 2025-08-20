import { useState, useEffect } from 'react';
import { Box, Typography, Chip, Divider } from '@mui/material';
import StatusChip from '../../components/common/StatusChip';
import QnaTypeChip from '../../components/common/QnaTypeChip';
import { useCommonCode } from '../../hooks/useCommonCode';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import { useDataFetching } from '../../hooks/useDataFetching';
import CommonToast from '../../components/CommonToast';
import { getUserQnaDetail, getUserQnaList } from '../../api';
import { SPACING } from '../../constants/spacing';
import type { UserQnaItem } from '@iitp-dabt/common';
import PageHeader from '../../components/common/PageHeader';

export default function QnaDetail() {
  const navigate = useNavigate();
  const { qnaId } = useParams<{ qnaId: string }>();
  const { fetchCodesByGroup } = useCommonCode();
  const muiTheme = useTheme();
  const colors = {
    primary: muiTheme.palette.primary.main,
    secondary: muiTheme.palette.secondary.main,
    border: muiTheme.palette.divider,
    text: muiTheme.palette.text.primary,
    textSecondary: muiTheme.palette.text.secondary,
    background: muiTheme.palette.background.default,
  } as const;

  const [allQnas, setAllQnas] = useState<UserQnaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const { data: qna, isLoading, isEmpty, isError } = useDataFetching({ fetchFunction: () => getUserQnaDetail(Number(qnaId)), dependencies: [qnaId], autoFetch: !!qnaId });
  const [toast, setToast] = useState<{ open: boolean; message: string; severity?: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  useEffect(() => {
    const fetchAllQnas = async () => {
      try {
        const response = await getUserQnaList({ page: 1, limit: 1000 });
        const items = (response as any)?.items ?? [];
        setAllQnas(items);
        const index = items.findIndex((q: any) => Number(q.qnaId) === Number(qnaId));
        setCurrentIndex(index);
      } catch (error) { console.error('전체 Q&A 목록 조회 실패:', error); }
    };
    if (qnaId) fetchAllQnas();
  }, [qnaId]);

  // Guard: non-owner trying to open private detail → notify then go back
  useEffect(() => {
    const item = (qna as any)?.qna ?? qna;
    if (item && item.secretYn === 'Y' && !item.isMine) {
      setToast({ open: true, message: '비공개 질문입니다. 작성자만 열람할 수 있습니다.', severity: 'info' });
      const id = setTimeout(() => handleBackToList(), 600);
      return () => clearTimeout(id);
    }
  }, [qna]);

  // Preload codes for this page once
  useEffect(() => { fetchCodesByGroup('qna_type').catch(() => {}); }, [fetchCodesByGroup]);

  const handleBackToList = () => { navigate('/qna'); };
  const handlePreviousQna = () => { if (currentIndex > 0) navigate(`/qna/${(allQnas[currentIndex - 1] as any).qnaId}`); };
  const handleNextQna = () => { if (currentIndex < allQnas.length - 1) navigate(`/qna/${(allQnas[currentIndex + 1] as any).qnaId}`); };

  const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-';
  const maskAuthorName = (name?: string) => {
    if (!name) return '-';
    return name.length <= 2 ? name : name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  };

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allQnas.length - 1;

  return (
    <Box id="qna-detail-page" sx={{ minHeight: '100vh', background: colors.background, py: SPACING.LARGE }}>
      <Box id="qna-detail-container" sx={{ mx: 'auto', px: { xs: SPACING.MEDIUM, md: SPACING.LARGE } }}>
        {/* 헤더 */}
        <Box id="qna-detail-header">
          <PageHeader title="Q&A" onBack={handleBackToList} />
        </Box>

        {/* Q&A 상세 */}
        <ThemedCard>
          {isLoading ? (
            <Box sx={{ position: 'relative', minHeight: 400 }}>
              <LoadingSpinner loading={true} />
            </Box>
          ) : isError ? (
            <EmptyState message="Q&A를 불러오는 중 오류가 발생했습니다." />
          ) : isEmpty ? (
            <EmptyState message="Q&A를 찾을 수 없습니다." />
          ) : qna ? (
            <Box sx={{ p: SPACING.LARGE }}>
              {/* Guard runs in effect; no side-effects in render */}
              {(() => { const item = (qna as any).qna ?? qna; return (
              <Box sx={{ mb: SPACING.LARGE }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: SPACING.MEDIUM, flexWrap: 'wrap' }}>
                  {item.secretYn === 'Y' && (
                    <StatusChip kind="private" />
                  )}
                  <Box component="span" sx={{ mr: SPACING.MEDIUM, mb: SPACING.SMALL }}>
                    <QnaTypeChip typeId={item.qnaType} size="medium" label={item.qnaTypeName || item.qnaType} />
                  </Box>
                  <Chip label={item.answeredYn === 'Y' ? '답변완료' : '답변대기'} color={item.answeredYn === 'Y' ? 'success' : 'warning'} size="medium" sx={{ mr: SPACING.MEDIUM, mb: SPACING.SMALL }} />
                  <Typography variant="body2" sx={{ color: colors.textSecondary, ml: 'auto', mb: SPACING.SMALL }}>{formatDate(item.createdAt)}</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: colors.text, fontWeight: 600, mb: SPACING.MEDIUM }}>{item.title}</Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary, mb: SPACING.SMALL }}>작성자: {maskAuthorName(item.writerName)}</Typography>
              </Box>
              ); })()}

              <Divider sx={{ mb: SPACING.LARGE }} />

              <Box sx={{ mb: SPACING.LARGE }}>
                <Typography variant="h6" sx={{ color: colors.text, fontWeight: 500, mb: SPACING.MEDIUM }}>질문</Typography>
                <Typography variant="body1" sx={{ color: colors.text, lineHeight: 1.8, whiteSpace: 'pre-wrap', backgroundColor: `${colors.primary}05`, p: SPACING.LARGE, borderRadius: 2, border: `1px solid ${colors.border}` }}>{(((qna as any).qna ?? qna) as any).content}</Typography>
              </Box>

              {(((qna as any).qna ?? qna) as any).answeredYn === 'Y' && (((qna as any).qna ?? qna) as any).answerContent && (
                <Box sx={{ mb: SPACING.LARGE }}>
                  <Typography variant="h6" sx={{ color: colors.text, fontWeight: 500, mb: SPACING.MEDIUM }}>답변</Typography>
                  <Typography variant="body1" sx={{ color: colors.text, lineHeight: 1.8, whiteSpace: 'pre-wrap', backgroundColor: `${colors.secondary}10`, p: SPACING.LARGE, borderRadius: 2, border: `1px solid ${colors.border}` }}>{(((qna as any).qna ?? qna) as any).answerContent}</Typography>
                  {(((qna as any).qna ?? qna) as any).answeredAt && (
                    <Typography variant="caption" sx={{ color: colors.textSecondary, display: 'block', mt: SPACING.SMALL, textAlign: 'right' }}>답변일: {formatDate((((qna as any).qna ?? qna) as any).answeredAt)}</Typography>
                  )}
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: SPACING.LARGE, borderTop: `1px solid ${colors.border}` }}>
                <ThemedButton variant="outlined" startIcon={<NavigateBefore />} onClick={handlePreviousQna} disabled={!hasPrevious}>이전글</ThemedButton>
                <ThemedButton variant="outlined" onClick={handleBackToList}>목록</ThemedButton>
                <ThemedButton variant="outlined" endIcon={<NavigateNext />} onClick={handleNextQna} disabled={!hasNext}>다음글</ThemedButton>
              </Box>
            </Box>
          ) : null}
        </ThemedCard>
      </Box>
      <CommonToast open={!!toast?.open} message={toast?.message || ''} severity={toast?.severity} onClose={() => setToast(null)} />
    </Box>
  );
} 