import { useState } from 'react';
import { Box, CardContent, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import { SPACING } from '../../constants/spacing';
import { ROUTES } from '../../routes';
import { createCommonCode } from '../../api/commonCode';
import { handleApiResponse } from '../../utils/apiResponseHandler';
import ErrorAlert from '../../components/ErrorAlert';

export default function CodeCreate() {
  const navigate = useNavigate();
  const { grpId } = useParams<{ grpId: string }>();
  
  const [grpNm, setGrpNm] = useState('');
  const [codeId, setCodeId] = useState('');
  const [codeNm, setCodeNm] = useState('');
  const [parentGrpId, setParentGrpId] = useState('');
  const [parentCodeId, setParentCodeId] = useState('');
  const [codeType, setCodeType] = useState<'B' | 'A' | 'S'>('B');
  const [codeLvl, setCodeLvl] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [useYn, setUseYn] = useState<'Y' | 'N'>('Y');
  const [codeDes, setCodeDes] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // 유효성 검사
    if (!grpId || !grpNm || !codeId || !codeNm) {
      setError('그룹 ID, 그룹명, 코드 ID, 코드명은 필수입니다.');
      return;
    }

    if (codeId.length > 20) {
      setError('코드 ID는 20자 이하여야 합니다.');
      return;
    }

    if (codeNm.length > 100) {
      setError('코드명은 100자 이하여야 합니다.');
      return;
    }

    if (codeLvl < 1 || codeLvl > 10) {
      setError('코드 레벨은 1~10 사이의 값이어야 합니다.');
      return;
    }

    if (sortOrder < 1) {
      setError('정렬순서는 1 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await createCommonCode({
        grpId,
        grpNm,
        codeId,
        codeNm,
        parentGrpId: parentGrpId || undefined,
        parentCodeId: parentCodeId || undefined,
        codeType,
        codeLvl,
        sortOrder,
        useYn,
        codeDes: codeDes || undefined,
        memo: memo || undefined
      });

      handleApiResponse(res, () => {
        navigate(ROUTES.ADMIN.CODE.LIST);
      }, (msg) => setError(msg));
    } catch (error) {
      setError('공통 코드 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box id="admin-code-create-page" sx={{ p: SPACING.LARGE }}>
      <AdminPageHeader />
      
      <PageHeader 
        id="admin-code-create-header" 
        title="공통 코드 등록" 
      />
      <ThemedCard>
        <CardContent>
          {error && (
            <ErrorAlert 
              error={error} 
              onClose={() => setError(null)} 
            />
          )}
          
          <TextField
            id="code-group-id"
            fullWidth
            label="그룹 ID"
            value={grpId || ''}
            disabled
            sx={{ mb: SPACING.MEDIUM }}
            helperText="그룹 ID는 변경할 수 없습니다"
          />
          
          <TextField
            id="code-group-name"
            fullWidth
            label="그룹명"
            value={grpNm}
            onChange={(e) => setGrpNm(e.target.value)}
            sx={{ mb: SPACING.MEDIUM }}
            required
            helperText="코드 그룹의 이름을 입력해주세요"
          />
          
          <TextField
            id="code-id"
            fullWidth
            label="코드 ID"
            value={codeId}
            onChange={(e) => setCodeId(e.target.value)}
            sx={{ mb: SPACING.MEDIUM }}
            required
            helperText="20자 이하로 입력해주세요"
            inputProps={{ maxLength: 20 }}
          />
          
          <TextField
            id="code-name"
            fullWidth
            label="코드명"
            value={codeNm}
            onChange={(e) => setCodeNm(e.target.value)}
            sx={{ mb: SPACING.MEDIUM }}
            required
            helperText="100자 이하로 입력해주세요"
            inputProps={{ maxLength: 100 }}
          />
          
          <TextField
            id="code-parent-group-id"
            fullWidth
            label="부모 그룹 ID"
            value={parentGrpId}
            onChange={(e) => setParentGrpId(e.target.value)}
            sx={{ mb: SPACING.MEDIUM }}
            helperText="상위 그룹이 있는 경우 입력해주세요 (선택사항)"
          />
          
          <TextField
            id="code-parent-code-id"
            fullWidth
            label="부모 코드 ID"
            value={parentCodeId}
            onChange={(e) => setParentCodeId(e.target.value)}
            sx={{ mb: SPACING.MEDIUM }}
            helperText="상위 코드가 있는 경우 입력해주세요 (선택사항)"
          />
          
          <FormControl fullWidth sx={{ mb: SPACING.MEDIUM }}>
            <InputLabel id="code-type-label">코드 타입</InputLabel>
            <Select
              labelId="code-type-label"
              id="code-type"
              value={codeType}
              label="코드 타입"
              onChange={(e) => setCodeType(e.target.value as 'B' | 'A' | 'S')}
            >
              <MenuItem value="B">기본 (B)</MenuItem>
              <MenuItem value="A">관리자 (A)</MenuItem>
              <MenuItem value="S">시스템 (S)</MenuItem>
            </Select>
            <FormHelperText>코드의 용도와 권한을 결정합니다</FormHelperText>
          </FormControl>
          
          <TextField
            id="code-level"
            fullWidth
            label="코드 레벨"
            type="number"
            value={codeLvl}
            onChange={(e) => setCodeLvl(Number(e.target.value))}
            sx={{ mb: SPACING.MEDIUM }}
            required
            helperText="1~10 사이의 값으로 입력해주세요"
            inputProps={{ min: 1, max: 10 }}
          />
          
          <TextField
            id="code-sort-order"
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
            <InputLabel id="code-use-yn-label">사용여부</InputLabel>
            <Select
              labelId="code-use-yn-label"
              id="code-use-yn"
              value={useYn}
              label="사용여부"
              onChange={(e) => setUseYn(e.target.value as 'Y' | 'N')}
            >
              <MenuItem value="Y">사용</MenuItem>
              <MenuItem value="N">미사용</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            id="code-description"
            fullWidth
            label="코드 설명"
            value={codeDes}
            onChange={(e) => setCodeDes(e.target.value)}
            multiline
            minRows={3}
            sx={{ mb: SPACING.MEDIUM }}
            helperText="코드에 대한 상세 설명을 입력해주세요"
          />
          
          <TextField
            id="code-memo"
            fullWidth
            label="메모"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            multiline
            minRows={2}
            sx={{ mb: SPACING.MEDIUM }}
            helperText="관리자용 메모를 입력해주세요"
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: SPACING.LARGE }}>
            <ThemedButton 
              variant="outlined" 
              onClick={() => navigate(ROUTES.ADMIN.CODE.LIST)} 
              buttonSize="cta"
            >
              취소
            </ThemedButton>
            <ThemedButton 
              variant="primary" 
              buttonSize="cta" 
              onClick={handleSubmit} 
              disabled={loading}
            >
              등록
            </ThemedButton>
          </Box>
        </CardContent>
      </ThemedCard>
    </Box>
  );
}
