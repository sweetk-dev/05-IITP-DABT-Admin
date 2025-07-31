import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
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
import PageTitle from '../../components/common/PageTitle';
import ThemedCard from '../../components/common/ThemedCard';
import ThemedButton from '../../components/common/ThemedButton';
import CommonDialog from '../../components/CommonDialog';
import { getThemeColors } from '../../theme';
import type { UserOpenApiCreateReq, UserOpenApiExtendReq } from '@iitp-dabt/common';
import type { UserOpenApiListRes } from '../../types/api';

interface OpenApiManagementProps {
  id?: string;
}

export const OpenApiManagement: React.FC<OpenApiManagementProps> = ({ id = 'openapi-management' }) => {
  const navigate = useNavigate();
  const [openApiList, setOpenApiList] = useState<UserOpenApiListRes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
  const theme: 'user' | 'admin' = 'user';
  const colors = getThemeColors(theme);

  useEffect(() => {
    loadOpenApiList();
  }, []);

  const loadOpenApiList = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getUserOpenApiList({});
      if (response.success) {
        setOpenApiList(response.data!);
      } else {
        setError(response.errorMessage || '인증키 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('인증키 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async () => {
    if (!createForm.keyName || !createForm.keyDesc) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

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
        await loadOpenApiList();
      } else {
        setError(response.errorMessage || '인증키 생성에 실패했습니다.');
      }
    } catch (err) {
      setError('인증키 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async () => {
    if (!selectedKeyId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await deleteUserOpenApi(selectedKeyId);
      if (response.success) {
        setDeleteDialogOpen(false);
        setSelectedKeyId(null);
        await loadOpenApiList();
      } else {
        setError(response.errorMessage || '인증키 삭제에 실패했습니다.');
      }
    } catch (err) {
      setError('인증키 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleExtendKey = async () => {
    if (!selectedKeyId) return;

    try {
      setLoading(true);
      setError(null);

      const requestData: UserOpenApiExtendReq = {
        keyId: selectedKeyId,
        extensionDays: extendForm.extensionDays
      };

      const response = await extendUserOpenApi(requestData);
      if (response.success) {
        setExtendDialogOpen(false);
        setSelectedKeyId(null);
        setExtendForm({ extensionDays: 90 });
        await loadOpenApiList();
      } else {
        setError(response.errorMessage || '인증키 기간 연장에 실패했습니다.');
      }
    } catch (err) {
      setError('인증키 기간 연장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(ROUTES.USER.DASHBOARD);
  };

  const handleCopyKey = (authKey: string) => {
    navigator.clipboard.writeText(authKey);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const hasActiveKey = openApiList?.authKeys && openApiList.authKeys.length > 0;

  if (loading) {
    return <LoadingSpinner />;
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
        <PageTitle title="API 인증키 관리" theme={theme} />
      </Box>

      {error && <ErrorAlert message={error} />}

      <ThemedCard theme={theme}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2" sx={{ color: colors.text }}>
              발행된 인증키
            </Typography>
            {!hasActiveKey && (
              <ThemedButton
                id="create-key-btn"
                theme={theme}
                variant="primary"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
              >
                신규 인증키 발행
              </ThemedButton>
            )}
          </Box>

          {hasActiveKey ? (
            <List>
              {openApiList!.authKeys.map((authKey) => (
                <ListItem key={authKey.keyId} divider>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {authKey.authKey.substring(0, 8)}...
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
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          유효기간: {formatDate(authKey.startDt)} ~ {formatDate(authKey.endDt)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          생성일: {formatDate(authKey.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={authKey.activeYn === 'Y' ? '활성' : '비활성'}
                      color={authKey.activeYn === 'Y' ? 'success' : 'default'}
                      size="small"
                    />
                    {authKey.activeYn === 'Y' && (
                      <>
                        <ThemedButton
                          id={`extend-key-${authKey.keyId}`}
                          theme={theme}
                          variant="outlined"
                          size="small"
                          startIcon={<ScheduleIcon />}
                          onClick={() => {
                            setSelectedKeyId(authKey.keyId);
                            setExtendDialogOpen(true);
                          }}
                        >
                          기간연장
                        </ThemedButton>
                        <ThemedButton
                          id={`delete-key-${authKey.keyId}`}
                          theme={theme}
                          variant="outlined"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => {
                            setSelectedKeyId(authKey.keyId);
                            setDeleteDialogOpen(true);
                          }}
                          sx={{ color: colors.error }}
                        >
                          삭제
                        </ThemedButton>
                      </>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info">
              발행된 인증키가 없습니다. 신규 발행 버튼을 클릭하여 인증키를 발행하세요.
            </Alert>
          )}
        </CardContent>
      </ThemedCard>

      {/* 신규 인증키 발행 다이얼로그 */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>신규 인증키 발행</DialogTitle>
        <DialogContent>
          <TextField
            id="key-name"
            fullWidth
            label="API 이름 (필수, 120자 이내)"
            value={createForm.keyName}
            onChange={(e) => setCreateForm(prev => ({ ...prev, keyName: e.target.value }))}
            required
            sx={{ mb: 2, mt: 1 }}
            inputProps={{ maxLength: 120 }}
          />
          <TextField
            id="key-desc"
            fullWidth
            label="API 사용 목적 (필수, 600자 이내)"
            value={createForm.keyDesc}
            onChange={(e) => setCreateForm(prev => ({ ...prev, keyDesc: e.target.value }))}
            required
            multiline
            rows={3}
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 600 }}
          />
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              id="start-date"
              label="시작일 (선택)"
              type="date"
              value={createForm.startDt}
              onChange={(e) => setCreateForm(prev => ({ ...prev, startDt: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
            <TextField
              id="end-date"
              label="종료일 (선택)"
              type="date"
              value={createForm.endDt}
              onChange={(e) => setCreateForm(prev => ({ ...prev, endDt: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <ThemedButton
              theme={theme}
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
              theme={theme}
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
          <ThemedButton theme={theme} variant="text" onClick={() => setCreateDialogOpen(false)}>
            취소
          </ThemedButton>
          <ThemedButton theme={theme} variant="primary" onClick={handleCreateKey} disabled={loading}>
            발행
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
        theme={theme}
      />

      {/* 기간 연장 다이얼로그 */}
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
          <ThemedButton theme={theme} variant="text" onClick={() => setExtendDialogOpen(false)}>
            취소
          </ThemedButton>
          <ThemedButton theme={theme} variant="primary" onClick={handleExtendKey} disabled={loading}>
            연장
          </ThemedButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 