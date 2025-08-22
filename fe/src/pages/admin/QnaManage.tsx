import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Chip, TextField, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  QuestionAnswer as QnaIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { ROUTES, ROUTE_META } from '../../routes';
import { getThemeColors } from '../../theme';
import ListHeader from '../../components/common/ListHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import StatusChip from '../../components/common/StatusChip';

export default function QnaManage() {
  const navigate = useNavigate();

  // ROUTE_META에서 페이지 정보 동적 가져오기
  const pageMeta = (ROUTE_META as any)[ROUTES.ADMIN.QNA.LIST];
  const pageTitle = pageMeta?.title || 'Q&A 관리';

  const theme: 'user' | 'admin' = 'admin';
  const colors = getThemeColors(theme);

  // 임시 Q&A 데이터 (실제로는 API에서 가져옴)
  const [qnas, setQnas] = useState([
    {
      id: 1,
      title: 'OpenAPI 인증키 발급 방법',
      author: '김사용자',
      status: '답변대기',
      category: 'API',
      createdAt: '2024-01-15',
      isSecret: false
    },
    {
      id: 2,
      title: '계정 정보 수정 문의',
      author: '이사용자',
      status: '답변완료',
      category: '계정',
      createdAt: '2024-01-14',
      isSecret: true
    },
    {
      id: 3,
      title: '서비스 이용 제한 해제',
      author: '박사용자',
      status: '답변대기',
      category: '서비스',
      createdAt: '2024-01-13',
      isSecret: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('전체');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const statuses = ['전체', '답변대기', '답변완료'];
  const categories = ['전체', 'API', '계정', '서비스', '기타'];

  const handleCreateQna = () => {
    navigate(ROUTES.ADMIN.QNA.CREATE);
  };

  const handleViewQna = (id: number) => {
    navigate(`${ROUTES.ADMIN.QNA.DETAIL}/${id}`);
  };

  const handleReplyQna = (id: number) => {
    navigate(`${ROUTES.ADMIN.QNA.REPLY}/${id}`);
  };

  const handleDeleteQna = (id: number) => {
    setQnas(qnas.filter(qna => qna.id !== id));
  };

  const filteredQnas = qnas.filter(qna => {
    const matchesSearch = qna.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qna.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '전체' || qna.status === selectedStatus;
    const matchesCategory = selectedCategory === '전체' || qna.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    return status === '답변완료' ? 'success' : 'warning';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'API':
        return 'primary';
      case '계정':
        return 'secondary';
      case '서비스':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <ThemedCard sx={{ mb: 3 }}>
        <ListHeader
          title={pageTitle}
          icon={<QnaIcon />}
          actionsRight={
            <ThemedButton
              variant="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateQna}
            >
              Q&A 추가
            </ThemedButton>
          }
        />
      </ThemedCard>

      {/* 검색 및 필터 */}
      <ThemedCard sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="제목 또는 작성자로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="상태"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                SelectProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterIcon />
                    </InputAdornment>
                  ),
                }}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="카테고리"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                SelectProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterIcon />
                    </InputAdornment>
                  ),
                }}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary">
                총 {filteredQnas.length}개
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </ThemedCard>

      {/* Q&A 목록 */}
      <Grid container spacing={3}>
        {filteredQnas.map((qna) => (
          <Grid item xs={12} md={6} lg={4} key={qna.id}>
            <ThemedCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={qna.category}
                      size="small"
                      color={getCategoryColor(qna.category) as any}
                      variant="outlined"
                    />
                    {qna.isSecret && (
                      <Chip
                        label="비공개"
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <StatusChip
                    label={qna.status}
                    kind={getStatusColor(qna.status)}
                    size="small"
                  />
                </Box>
                <Typography variant="h6" gutterBottom sx={{ color: colors.text, minHeight: 48 }}>
                  {qna.title}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    작성자: {qna.author}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {qna.createdAt}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <ThemedButton
                  variant="outlined"
                  size="small"
                  onClick={() => handleViewQna(qna.id)}
                >
                  보기
                </ThemedButton>
                <Box>
                  {qna.status === '답변대기' && (
                    <ThemedButton
                      variant="primary"
                      size="small"
                      onClick={() => handleReplyQna(qna.id)}
                      sx={{ mr: 1 }}
                    >
                      답변
                    </ThemedButton>
                  )}
                  <ThemedButton
                    variant="dangerOutlined"
                    size="small"
                    onClick={() => handleDeleteQna(qna.id)}
                  >
                    삭제
                  </ThemedButton>
                </Box>
              </CardActions>
            </ThemedCard>
          </Grid>
        ))}
      </Grid>

      {filteredQnas.length === 0 && (
        <ThemedCard>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <QnaIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Q&A가 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm || selectedStatus !== '전체' || selectedCategory !== '전체' ? '검색 조건을 변경해보세요.' : '새로운 Q&A를 추가해보세요.'}
            </Typography>
          </CardContent>
        </ThemedCard>
      )}
    </Box>
  );
}


