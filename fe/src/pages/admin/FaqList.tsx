import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Chip, TextField, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Help as FaqIcon,
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

export default function FaqList() {
  const navigate = useNavigate();

  // ROUTE_META에서 페이지 정보 동적 가져오기
  const pageMeta = (ROUTE_META as any)[ROUTES.ADMIN.FAQ.LIST];
  const pageTitle = pageMeta?.title || 'FAQ 관리';

  const theme: 'user' | 'admin' = 'admin';
  const colors = getThemeColors(theme);

  // 임시 FAQ 데이터 (실제로는 API에서 가져옴)
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      title: 'OpenAPI 사용법',
      category: 'API',
      status: '활성',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: 2,
      title: '계정 관리 방법',
      category: '계정',
      status: '활성',
      createdAt: '2024-01-14',
      updatedAt: '2024-01-14'
    },
    {
      id: 3,
      title: '서비스 이용 제한',
      category: '서비스',
      status: '비활성',
      createdAt: '2024-01-13',
      updatedAt: '2024-01-13'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const categories = ['전체', 'API', '계정', '서비스', '기타'];

  const handleCreateFaq = () => {
    navigate(ROUTES.ADMIN.FAQ.CREATE);
  };

  const handleEditFaq = (id: number) => {
    navigate(`${ROUTES.ADMIN.FAQ.EDIT}/${id}`);
  };

  const handleViewFaq = (id: number) => {
    navigate(`${ROUTES.ADMIN.FAQ.DETAIL}/${id}`);
  };

  const handleDeleteFaq = (id: number) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    return status === '활성' ? 'success' : 'error';
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
          icon={<FaqIcon />}
          actionsRight={
            <ThemedButton
              variant="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateFaq}
            >
              FAQ 추가
            </ThemedButton>
          }
        />
      </ThemedCard>

      {/* 검색 및 필터 */}
      <ThemedCard sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="FAQ 제목으로 검색..."
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
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                총 {filteredFaqs.length}개의 FAQ
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </ThemedCard>

      {/* FAQ 목록 */}
      <Grid container spacing={3}>
        {filteredFaqs.map((faq) => (
          <Grid item xs={12} md={6} lg={4} key={faq.id}>
            <ThemedCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Chip
                    label={faq.category}
                    size="small"
                    color={getCategoryColor(faq.category) as any}
                    variant="outlined"
                  />
                  <StatusChip
                    label={faq.status}
                    kind={getStatusColor(faq.status)}
                    size="small"
                  />
                </Box>
                <Typography variant="h6" gutterBottom sx={{ color: colors.text, minHeight: 48 }}>
                  {faq.title}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    생성: {faq.createdAt}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    수정: {faq.updatedAt}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <ThemedButton
                  variant="outlined"
                  size="small"
                  onClick={() => handleViewFaq(faq.id)}
                >
                  보기
                </ThemedButton>
                <Box>
                  <ThemedButton
                    variant="outlined"
                    size="small"
                    onClick={() => handleEditFaq(faq.id)}
                    sx={{ mr: 1 }}
                  >
                    편집
                  </ThemedButton>
                  <ThemedButton
                    variant="dangerOutlined"
                    size="small"
                    onClick={() => handleDeleteFaq(faq.id)}
                  >
                    삭제
                  </ThemedButton>
                </Box>
              </CardActions>
            </ThemedCard>
          </Grid>
        ))}
      </Grid>

      {filteredFaqs.length === 0 && (
        <ThemedCard>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <FaqIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              FAQ가 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm || selectedCategory !== '전체' ? '검색 조건을 변경해보세요.' : '새로운 FAQ를 추가해보세요.'}
            </Typography>
          </CardContent>
        </ThemedCard>
      )}
    </Box>
  );
}


