import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Chip, TextField, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Announcement as NoticeIcon,
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

export default function NoticeManage() {
  const navigate = useNavigate();

  // ROUTE_META에서 페이지 정보 동적 가져오기
  const pageMeta = (ROUTE_META as any)[ROUTES.ADMIN.NOTICES.LIST];
  const pageTitle = pageMeta?.title || '공지사항 관리';

  const theme: 'user' | 'admin' = 'admin';
  const colors = getThemeColors(theme);

  // 임시 공지사항 데이터 (실제로는 API에서 가져옴)
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: '시스템 점검 안내',
      content: '2024년 1월 20일 새벽 2시부터 4시까지 시스템 점검이 진행됩니다.',
      category: '시스템',
      status: '활성',
      priority: '높음',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'OpenAPI 서비스 이용 안내',
      content: 'OpenAPI 서비스 이용 시 주의사항을 안내드립니다.',
      category: '서비스',
      status: '활성',
      priority: '보통',
      createdAt: '2024-01-14',
      updatedAt: '2024-01-14'
    },
    {
      id: 3,
      title: '개인정보 처리방침 개정',
      content: '개인정보 처리방침이 개정되었습니다. 자세한 내용은 첨부파일을 참고하세요.',
      category: '정책',
      status: '비활성',
      priority: '높음',
      createdAt: '2024-01-13',
      updatedAt: '2024-01-13'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedStatus, setSelectedStatus] = useState('전체');

  const categories = ['전체', '시스템', '서비스', '정책', '기타'];
  const statuses = ['전체', '활성', '비활성'];

  const handleCreateNotice = () => {
    navigate(ROUTES.ADMIN.NOTICES.CREATE);
  };

  const handleEditNotice = (id: number) => {
    navigate(`${ROUTES.ADMIN.NOTICES.EDIT}/${id}`);
  };

  const handleViewNotice = (id: number) => {
    navigate(`${ROUTES.ADMIN.NOTICES.DETAIL}/${id}`);
  };

  const handleDeleteNotice = (id: number) => {
    setNotices(notices.filter(notice => notice.id !== id));
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || notice.category === selectedCategory;
    const matchesStatus = selectedStatus === '전체' || notice.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    return status === '활성' ? 'success' : 'error';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '시스템':
        return 'error';
      case '서비스':
        return 'primary';
      case '정책':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case '높음':
        return 'error';
      case '보통':
        return 'warning';
      case '낮음':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <ThemedCard sx={{ mb: 3 }}>
        <ListHeader
          title={pageTitle}
          icon={<NoticeIcon />}
          actionsRight={
            <ThemedButton
              variant="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateNotice}
            >
              공지사항 추가
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
                placeholder="제목 또는 내용으로 검색..."
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
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary">
                총 {filteredNotices.length}개
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </ThemedCard>

      {/* 공지사항 목록 */}
      <Grid container spacing={3}>
        {filteredNotices.map((notice) => (
          <Grid item xs={12} md={6} lg={4} key={notice.id}>
            <ThemedCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={notice.category}
                      size="small"
                      color={getCategoryColor(notice.category) as any}
                      variant="outlined"
                    />
                    <Chip
                      label={notice.priority}
                      size="small"
                      color={getPriorityColor(notice.priority) as any}
                      variant="outlined"
                    />
                  </Box>
                  <StatusChip
                    label={notice.status}
                    kind={getStatusColor(notice.status)}
                    size="small"
                  />
                </Box>
                <Typography variant="h6" gutterBottom sx={{ color: colors.text, minHeight: 48 }}>
                  {notice.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                  {notice.content.length > 100 ? `${notice.content.substring(0, 100)}...` : notice.content}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    생성: {notice.createdAt}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    수정: {notice.updatedAt}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <ThemedButton
                  variant="outlined"
                  size="small"
                  onClick={() => handleViewNotice(notice.id)}
                >
                  보기
                </ThemedButton>
                <Box>
                  <ThemedButton
                    variant="outlined"
                    size="small"
                    onClick={() => handleEditNotice(notice.id)}
                    sx={{ mr: 1 }}
                  >
                    편집
                  </ThemedButton>
                  <ThemedButton
                    variant="dangerOutlined"
                    size="small"
                    onClick={() => handleDeleteNotice(notice.id)}
                  >
                    삭제
                  </ThemedButton>
                </Box>
              </CardActions>
            </ThemedCard>
          </Grid>
        ))}
      </Grid>

      {filteredNotices.length === 0 && (
        <ThemedCard>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <NoticeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              공지사항이 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm || selectedCategory !== '전체' || selectedStatus !== '전체' ? '검색 조건을 변경해보세요.' : '새로운 공지사항을 추가해보세요.'}
            </Typography>
          </CardContent>
        </ThemedCard>
      )}
    </Box>
  );
}


