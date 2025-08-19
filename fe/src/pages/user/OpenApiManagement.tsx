import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { 
  getUserOpenApiList, 
  createUserOpenApi, 
  deleteUserOpenApi, 
  extendUserOpenApi 
} from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { ROUTES } from '../../routes';
import { SPACING } from '../../constants/spacing';
import PageHeader from '../../components/common/PageHeader';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import EmptyState from '../../components/common/EmptyState';
import StatusChip from '../../components/common/StatusChip';
import { getOpenApiKeyStatus } from '../../utils/openApiStatus';
import CommonDialog from '../../components/CommonDialog';
import { useTheme, alpha } from '@mui/material/styles';
import { useDataFetching } from '../../hooks/useDataFetching';
import type { 
  UserOpenApiCreateReq, 
  UserOpenApiExtendReq, 
  UserOpenApiListRes
} from '@iitp-dabt/common';


interface OpenApiManagementProps {
  id?: string;
}

export const OpenApiManagement: React.FC<OpenApiManagementProps> = ({ id = 'openapi-management' }) => {
  const navigate = useNavigate();
  
  // 다이얼로그 상태
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState<number | null>(null);
  
  // 폼 데이터
  const [createForm, setCreateForm] = useState({
    keyName: '',
    keyDesc: '',
    startDt: '',
    endDt: ''
  });
  const [extendForm, setExtendForm] = useState({
    extensionDays: 90
  });
  
  // 테마 설정 (사용자 페이지는 'user' 테마)
  const muiTheme = useTheme();
  const colors = { text: muiTheme.palette.text.primary, error: muiTheme.palette.error.main } as const;

  // 데이터 페칭 훅 사용
  const {
    data: openApiList,
    isLoading: loading,
    isEmpty,
    isError,
    refetch
  } = useDataFetching<UserOpenApiListRes>({
    fetchFunction: () => getUserOpenApiList({}),
    autoFetch: true
  });

  // 페이지네이션은 추후 API 연동 시 적용 예정

  const handleCreateKey = async () => {
    if (!createForm.keyName || !createForm.keyDesc) {
      // 에러 처리는 ErrorAlert 컴포넌트에서 처리됨
      return;
    }

    const requestData: UserOpenApiCreateReq = {
      keyName: createForm.keyName,
      keyDesc: createForm.keyDesc,
      startDt: createForm.startDt || undefined,
      endDt: createForm.endDt || undefined
    };

    const response = await createUserOpenApi(requestData);
    if (response.success) {
      setCreateDialogOpen(false);
      setCreateForm({ keyName: '', keyDesc: '', startDt: '', endDt: '' });
      refetch();
    }
  };

  const handleDeleteKey = async () => {
    if (!selectedKeyId) return;

    const response = await deleteUserOpenApi(selectedKeyId);
    if (response.success) {
      setDeleteDialogOpen(false);
      setSelectedKeyId(null);
      refetch();
    }
  };

  const handleExtendKey = async () => {
    if (!selectedKeyId) return;

    const requestData: UserOpenApiExtendReq = {
      extensionDays: extendForm.extensionDays
    };

    const response = await extendUserOpenApi({ keyId: String(selectedKeyId) } as any, requestData);
    if (response.success) {
      setExtendDialogOpen(false);
      setSelectedKeyId(null);
      setExtendForm({ extensionDays: 90 });
      refetch();
    }
  };

  const handleBack = () => {
    navigate(ROUTES.USER.DASHBOARD);
  };

  const handleCopyKey = (authKey: string) => {
    navigator.clipboard.writeText(authKey);
  };


  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  // 발행된 키가 1개라도 있으면(대기/완료 포함) 신청 버튼은 숨김
  const hasAnyKey = !!(openApiList?.authKeys && openApiList.authKeys.length > 0);

  if (loading) {
    return <LoadingSpinner loading={true} />;
  }

  return (
    <Box id={id} sx={{ p: SPACING.LARGE }}>
      <Box id="openapi-management-header">
        <PageHeader title="API 인증키 관리" onBack={handleBack} />
      </Box>

      {isError && (
        <Box sx={{ mb: SPACING.ERROR_ALERT_BOTTOM }}>
          <ErrorAlert 
            error="인증키 목록을 불러오는 중 오류가 발생했습니다." 
            onClose={() => {}}
          />
        </Box>
      )}

      <ThemedCard>
        {loading ? (
          <Box sx={{ position: 'relative', minHeight: 400 }}>
            <LoadingSpinner loading={true} />
          </Box>
        ) : isEmpty ? (
          <CardContent>
            <EmptyState message="발행된 인증키가 없습니다.">
              <ThemedButton
                id="apply-openapi-key-button"
                variant="primary"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
                buttonSize="cta"
              >
                인증키 신청
              </ThemedButton>
            </EmptyState>
          </CardContent>
        ) : (
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: SPACING.MEDIUM }}>
             <Typography variant="h6" component="h2" sx={{ color: colors.text }}>
              발행된 인증키
            </Typography>
          </Box>

          {hasAnyKey ? (
            <List sx={{ minHeight: 320 }}>
              {openApiList!.authKeys.map((authKey) => (
                <ListItem key={authKey.keyId} divider sx={{ alignItems: 'center' }}>
                  {/* Middle: Key info on two lines with inline status chip */}
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <StatusChip kind={getOpenApiKeyStatus(authKey)} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                          {authKey.authKey}
                        </Typography>
                        <Tooltip title="복사">
                          <IconButton
                            id={`copy-key-${authKey.keyId}`}
                            size="small"
                            onClick={() => handleCopyKey(authKey.authKey)}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          유효기간: {formatDate(authKey.startDt)} ~ {formatDate(authKey.endDt)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          생성일: {formatDate(authKey.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                  {/* Right: Actions */}
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', pl: 2 }}>
                    {authKey.activeYn === 'Y' && (
                      <>
                        <ThemedButton
                          id={`extend-key-${authKey.keyId}`}
                          variant="outlined"
                          size="small"
                          startIcon={<ScheduleIcon />}
                          onClick={() => {
                            setSelectedKeyId(authKey.keyId);
                            setExtendDialogOpen(true);
                          }}
                          buttonSize="cta"
                        >
                          기간연장
                        </ThemedButton>
                        <ThemedButton
                          id={`delete-key-${authKey.keyId}`}
                          variant="outlined"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => {
                            setSelectedKeyId(authKey.keyId);
                            setDeleteDialogOpen(true);
                          }}
                          sx={{ color: colors.error }}
                          buttonSize="cta"
                        >
                          삭제
                        </ThemedButton>
                      </>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : null}
          </CardContent>
        )}
      </ThemedCard>
      {/* 신규 인증키 발행 다이얼로그 */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            minHeight: { xs: '60vh', md: '60vh' }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1.5 }}>
          신규 인증키 신청
          <Box sx={{ mt: 1, height: 2, background: `linear-gradient(90deg, ${alpha(muiTheme.palette.primary.main, 0.6)}, ${alpha(muiTheme.palette.primary.main, 0.2)}, ${alpha(muiTheme.palette.primary.main, 0.6)})`, borderRadius: 1 }} />
        </DialogTitle>
        <DialogContent sx={{ pt: 4 }}>
          <TextField
            id="key-name"
            fullWidth
            label="API 이름 (필수, 40자 이내)"
            value={createForm.keyName}
            onChange={(e) => setCreateForm(prev => ({ ...prev, keyName: e.target.value }))}
            required
            sx={{ mb: SPACING.EXTRA_LARGE + 1, mt: SPACING.MEDIUM }}
            InputLabelProps={{ shrink: true, sx: { fontWeight: 700, fontSize: '1.1rem', color: 'text.primary' } }}
            InputProps={{ sx: { minHeight: 68, '& .MuiInputBase-input': { py: 2 } } }}
            inputProps={{ maxLength: 120 }}
          />
          <TextField
            id="key-desc"
            fullWidth
            label="API 사용 목적 (필수, 200자 이내)"
            value={createForm.keyDesc}
            onChange={(e) => setCreateForm(prev => ({ ...prev, keyDesc: e.target.value }))}
            required
            multiline
            rows={8}
            sx={{ mb: SPACING.EXTRA_LARGE + 1 }}
            InputLabelProps={{ shrink: true, sx: { fontWeight: 700, fontSize: '1.1rem', color: 'text.primary' } }}
            inputProps={{ maxLength: 600 }}
            helperText="키 발급 목적을 구체적으로 작성해 주세요. (예: 사용 서비스, 호출 빈도 등)"
          />
          <Box sx={{ display: 'flex', gap: SPACING.MEDIUM, mb: SPACING.EXTRA_LARGE + 1 }}>
            <TextField
              id="start-date"
              label="시작일 (선택)"
              type="date"
              value={createForm.startDt}
              onChange={(e) => setCreateForm(prev => ({ ...prev, startDt: e.target.value }))}
              InputLabelProps={{ shrink: true, sx: { fontWeight: 700, fontSize: '1.1rem', color: 'text.primary' } }}
              sx={{ flex: 1 }}
            />
            <TextField
              id="end-date"
              label="종료일 (선택)"
              type="date"
              value={createForm.endDt}
              onChange={(e) => setCreateForm(prev => ({ ...prev, endDt: e.target.value }))}
              InputLabelProps={{ shrink: true, sx: { fontWeight: 700, fontSize: '1.1rem', color: 'text.primary' } }}
              sx={{ flex: 1 }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <ThemedButton
              
              variant="outlined"
              onClick={() => {
                const today = new Date();
                const days90 = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
                setCreateForm(prev => ({
                  ...prev,
                  startDt: today.toISOString().split('T')[0],
                  endDt: days90.toISOString().split('T')[0]
                }));
              }}
            >
              90일 설정
            </ThemedButton>
            <ThemedButton
              
              variant="outlined"
              onClick={() => {
                const today = new Date();
                const days365 = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000);
                setCreateForm(prev => ({
                  ...prev,
                  startDt: today.toISOString().split('T')[0],
                  endDt: days365.toISOString().split('T')[0]
                }));
              }}
            >
              1년 설정
            </ThemedButton>
          </Box>
        </DialogContent>
        <DialogActions>
          <ThemedButton variant="text" onClick={() => setCreateDialogOpen(false)} buttonSize="cta" sx={{ minHeight: 52, px: 3, py: 1.75, fontSize: '1.05rem' }}>
            취소
          </ThemedButton>
          <ThemedButton variant="primary" onClick={handleCreateKey} disabled={loading} buttonSize="cta" sx={{ minHeight: 52, px: 3, py: 1.75, fontSize: '1.05rem' }}>
            신청
          </ThemedButton>
        </DialogActions>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <CommonDialog
        open={deleteDialogOpen}
        title="인증키 삭제 확인"
        message="선택한 인증키를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteKey}
        showCancel={true}
        confirmText="삭제"
        cancelText="취소"
        
      />
      {/* 인증키 기간 연장 다이얼로그 */}
      <Dialog open={extendDialogOpen} onClose={() => setExtendDialogOpen(false)}>
        <DialogTitle>인증키 기간 연장</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" sx={{ mt: 1 }}>
            <RadioGroup
              value={extendForm.extensionDays}
              onChange={(e) => setExtendForm(prev => ({ ...prev, extensionDays: Number(e.target.value) }))}
            >
              <FormControlLabel value={90} control={<Radio />} label="90일 연장" />
              <FormControlLabel value={365} control={<Radio />} label="1년 연장" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <ThemedButton variant="text" onClick={() => setExtendDialogOpen(false)} buttonSize="cta">
            취소
          </ThemedButton>
          <ThemedButton variant="primary" onClick={handleExtendKey} disabled={loading} buttonSize="cta">
            연장
          </ThemedButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 