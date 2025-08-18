import { useState } from 'react';
import { Box, CardContent, Typography } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import { SPACING } from '../../constants/spacing';

export default function AdminOpenApiRequests() {
  const [search, setSearch] = useState('');

  return (
    <Box id="admin-openapi-requests-page" sx={{ p: SPACING.LARGE }}>
      <PageHeader id="admin-openapi-requests-header" title="OpenAPI 요청 관리" search={{ value: search, onChange: setSearch, placeholder: '요청 키워드 검색' }} />
      <ThemedCard>
        <CardContent>
          <Typography variant="body2" color="text.secondary">요청 관리 테이블은 추후 연동 예정입니다.</Typography>
        </CardContent>
      </ThemedCard>
    </Box>
  );
}


