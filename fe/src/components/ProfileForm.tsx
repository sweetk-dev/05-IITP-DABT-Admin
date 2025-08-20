import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Avatar, 
  Chip, 
  TextField, 
  Alert, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/Lock';
import { getThemeColors } from '../theme';
import type { ThemeType } from '../theme';
import PageHeader from './common/PageHeader';
import ThemedButton from './common/ThemedButton';
import ThemedCard from './common/ThemedCard';
import LoadingSpinner from './LoadingSpinner';
import { usePasswordValidation } from '../hooks/usePasswordValidation';
import { useInputWithTrim } from '../hooks/useInputWithTrim';
import { PAGE_SPACING } from '../constants/spacing';

interface ProfileData {
  name?: string;
  affiliation?: string;
  email?: string;
  loginId?: string;
  role?: string;
  createdAt?: string;
  [key: string]: any;
}

interface ProfileFormProps {
  title: string;
  profileData: ProfileData | null;
  loading: boolean;
  error: string | undefined;
  onSaveProfile: (data: { name: string; affiliation: string }) => Promise<void>;
  onChangePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => Promise<void>;
  onCloseError: () => void;
  showRole?: boolean;
  showLoginId?: boolean;
  theme?: ThemeType;
}

export default function ProfileForm({
  title,
  profileData,
  loading,
  error,
  onSaveProfile,
  onChangePassword,
  onCloseError,
  showRole = false,
  showLoginId = false,
  theme = 'user'
}: ProfileFormProps) {
  const colors = getThemeColors(theme);
  
  // 편집 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState('');
  
  // trim 처리가 적용된 입력 필드들
  const nameInput = useInputWithTrim('');
  const affiliationInput = useInputWithTrim('');
  
  // 비밀번호 변경 모달 상태
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);

  // 비밀번호 검증 Hook 사용 (현재 비밀번호 포함)
  const passwordValidation = usePasswordValidation({
    requireCurrentPassword: true,
    currentPassword,
    currentPasswordError: passwordError
  });

  // 프로필 데이터가 변경되면 편집 데이터 초기화
  useEffect(() => {
    if (profileData) {
      nameInput.onChange(profileData.name || '');
      affiliationInput.onChange(profileData.affiliation || '');
    }
  }, [profileData, nameInput, affiliationInput]);

  // 편집 모드 시작
  const handleStartEdit = () => {
    nameInput.onChange(profileData?.name || '');
    affiliationInput.onChange(profileData?.affiliation || '');
    setIsEditing(true);
  };

  // 정보 변경 저장
  const handleSaveProfile = async () => {
    // 이름 필수 검증 (사용자, 관리자 모두)
    const trimmedName = nameInput.getTrimmedValue();
    if (!trimmedName) {
      setNameError('이름을 입력해 주세요.');
      return;
    }
    setNameError('');

    setSaving(true);
    try {
      await onSaveProfile({ 
        name: trimmedName, 
        affiliation: affiliationInput.getTrimmedValue() // 소속은 선택적 (빈 값 허용)
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
    } finally {
      setSaving(false);
    }
  };

  // 편집 취소
  const handleCancelEdit = () => {
    nameInput.onChange(profileData?.name || '');
    affiliationInput.onChange(profileData?.affiliation || '');
    setNameError(''); // 에러 메시지 초기화
    setIsEditing(false);
  };

  // 비밀번호 변경
  const handleChangePassword = async () => {
    // Hook에서 이미 검증된 결과 사용
    if (!passwordValidation.isValid) {
      return;
    }

    setChangingPassword(true);
    setPasswordError(undefined);
    try {
      await onChangePassword({
        currentPassword,
        newPassword: passwordValidation.password,
        confirmPassword: passwordValidation.confirmPassword
      });
      setPasswordModalOpen(false);
      setCurrentPassword('');
      passwordValidation.reset();
    } catch (err) {
      console.error('Password change error:', err);
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <Box 
        id="profile-page" 
        sx={{ 
          p: 4, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          backgroundColor: 'background.default',
          position: 'relative'
        }}
      >
        <LoadingSpinner 
          loading={loading} 
          size={60}
          backgroundOpacity={0.8}
          color="primary"
        />
      </Box>
    );
  }

  const displayData = profileData;

  return (
    <Box 
      id="profile-page" 
      sx={{ 
        p: 4, 
        backgroundColor: 'background.default',
        minHeight: '100vh',
        borderTop: '1px solid',
        borderColor: 'divider',
        position: 'relative'
      }}
    >
      <LoadingSpinner 
        loading={saving || changingPassword} 
        size={50}
        backgroundOpacity={0.7}
        color="primary"
      />
      <PageHeader title={title} />
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: PAGE_SPACING.PROFILE.ERROR_ALERT_BOTTOM }} 
          onClose={onCloseError}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={4} alignItems="stretch">
        {/* 프로필 이미지 및 기본 정보 */}
        <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
          <ThemedCard sx={{ p: 4, textAlign: 'center', height: '100%', flex: 1 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 3,
                bgcolor: colors.avatar,
                fontSize: '3rem',
                boxShadow: `0 4px 12px ${colors.primary}30`,
                border: `3px solid ${colors.primary}20`
              }}
            >
              {displayData?.name?.charAt(0) || (theme === 'admin' ? 'A' : 'U')}
            </Avatar>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: colors.text
              }}
            >
              {displayData?.name || (theme === 'admin' ? '관리자' : '사용자')}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 2,
                color: colors.text,
                opacity: 0.8
              }}
            >
              {(displayData as any)?.affiliation || '소속 정보 없음'}
            </Typography>
            {showRole && displayData?.role && (
              <Chip 
                label={displayData.role} 
                sx={{ 
                  mb: 3,
                  bgcolor: colors.chip,
                  color: 'white',
                  fontWeight: 600,
                  boxShadow: `0 2px 8px ${colors.chip}40`
                }}
              />
            )}
            
            {/* 액션 버튼 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {!isEditing ? (
                <>
                  <ThemedButton
                    
                    variant="primary"
                    startIcon={<EditIcon />}
                    onClick={handleStartEdit}
                    id="edit-profile-btn"
                    fullWidth
                    buttonSize="cta"
                  >
                    정보 변경
                  </ThemedButton>
                  <ThemedButton
                    
                    variant="outlined"
                    startIcon={<LockIcon />}
                    onClick={() => setPasswordModalOpen(true)}
                    id="change-password-btn"
                    fullWidth
                    buttonSize="cta"
                  >
                    비밀번호 변경
                  </ThemedButton>
                </>
              ) : (
                <>
                  <ThemedButton
                    
                    variant="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                    disabled={saving}
                    id="save-profile-btn"
                    fullWidth
                    buttonSize="cta"
                  >
                    {saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : '저장'}
                  </ThemedButton>
                  <ThemedButton
                    
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancelEdit}
                    disabled={saving}
                    id="cancel-edit-btn"
                    fullWidth
                    buttonSize="cta"
                  >
                    취소
                  </ThemedButton>
                </>
              )}
            </Box>
          </ThemedCard>
        </Grid>

        {/* 상세 정보 */}
        <Grid item xs={12} md={8} sx={{ display: 'flex' }}>
          <ThemedCard sx={{ p: 4, height: '100%', flex: 1 }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                mb: 3,
                color: colors.text,
                fontWeight: 600,
                pb: 1,
                borderBottom: `1px solid ${colors.border}`
              }}
            >
              상세 정보
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  이름
                </Typography>
                {isEditing ? (
                  <TextField
                    id="profile-name-input"
                    label="이름"
                    fullWidth
                    margin="none"
                    value={nameInput.value}
                    onChange={(e) => nameInput.onChange(e.target.value)}
                    error={!!nameError}
                    helperText={nameError}
                    disabled={saving}
                    sx={{ mb: PAGE_SPACING.PROFILE.FIELD_BOTTOM }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ py: 1 }}>
                    {displayData?.name || '-'}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  소속
                </Typography>
                {isEditing ? (
                  <TextField
                    id="profile-affiliation-input"
                    label="소속"
                    fullWidth
                    margin="none"
                    value={affiliationInput.value}
                    onChange={(e) => affiliationInput.onChange(e.target.value)}
                    disabled={saving}
                    sx={{ mb: PAGE_SPACING.PROFILE.FIELD_BOTTOM }}
                  />
                ) : (
                  <Typography variant="body1" sx={{ py: 1 }}>
                    {(displayData as any)?.affiliation || '-'}
                  </Typography>
                )}
              </Grid>

              {/* <Grid item xs={12}>
                <Divider sx={{ my: 2, borderColor: colors.primary }} />
              </Grid> */}

              {showLoginId && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    이메일(로그인 ID)
                  </Typography>
                  <Typography variant="body1" sx={{ py: 1 }}>
                    {(displayData as any)?.loginId || (displayData as any)?.email || '-'}
                  </Typography>
                </Grid>
              )}

              {showRole && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    역할
                  </Typography>
                  <Typography variant="body1" sx={{ py: 1 }}>
                    {displayData?.role || '-'}
                  </Typography>
                </Grid>
              )}

              {!showLoginId && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    이메일
                  </Typography>
                  <Typography variant="body1" sx={{ py: 1 }}>
                    {(displayData as any)?.email || '-'}
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  가입일
                </Typography>
                <Typography variant="body1" sx={{ py: 1 }}>
                  {(displayData as any)?.createdAt ? new Date((displayData as any).createdAt).toLocaleDateString() : '-'}
                </Typography>
              </Grid>
            </Grid>
          </ThemedCard>
        </Grid>
      </Grid>

      {/* 비밀번호 변경 모달 */}
      <Dialog 
        open={passwordModalOpen} 
        onClose={() => setPasswordModalOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1.5 }}>
          비밀번호 변경
          <Box sx={{ mt: 1, height: 2, background: (theme)=>`linear-gradient(90deg, ${theme.palette.primary.main}99, ${theme.palette.primary.main}33, ${theme.palette.primary.main}99)`, borderRadius: 1 }} />
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ pt: 1 }}>
            {passwordError && (
              <Alert severity="error" sx={{ mb: PAGE_SPACING.PROFILE.FIELD_BOTTOM }} onClose={() => setPasswordError(undefined)}>
                {passwordError}
              </Alert>
            )}
            <TextField
              fullWidth
              type="password"
              label="현재 비밀번호"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              margin="none"
              sx={{ mb: PAGE_SPACING.PROFILE.FIELD_BOTTOM }}
            />
            <TextField
              fullWidth
              type="password"
              label="새 비밀번호"
              value={passwordValidation.password}
              onChange={(e) => passwordValidation.setPassword(e.target.value)}
              error={!!passwordValidation.passwordError}
              helperText={passwordValidation.passwordError}
              margin="none"
              sx={{ mb: PAGE_SPACING.PROFILE.FIELD_BOTTOM }}
            />
            <TextField
              fullWidth
              type="password"
              label="새 비밀번호 확인"
              value={passwordValidation.confirmPassword}
              onChange={(e) => passwordValidation.setConfirmPassword(e.target.value)}
              error={!!passwordValidation.confirmPasswordError}
              helperText={passwordValidation.confirmPasswordError}
              margin="none"
              sx={{ mb: PAGE_SPACING.PROFILE.FIELD_BOTTOM }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <ThemedButton 
            
            variant="outlined"
            onClick={() => setPasswordModalOpen(false)} 
            disabled={changingPassword}
            buttonSize="cta"
          >
            취소
          </ThemedButton>
          <ThemedButton 
            
            variant="primary"
            onClick={handleChangePassword} 
            disabled={changingPassword || !passwordValidation.isValid}
            buttonSize="cta"
          >
            {changingPassword ? <CircularProgress size={20} sx={{ color: 'white' }} /> : '변경'}
          </ThemedButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 