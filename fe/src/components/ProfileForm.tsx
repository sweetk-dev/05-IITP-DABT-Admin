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
import { getThemeColors, themeStyles } from '../theme';
import type { ThemeType } from '../theme';
import PageTitle from './common/PageTitle';
import ThemedButton from './common/ThemedButton';
import ThemedCard from './common/ThemedCard';

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
  error: string | null;
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
  const [editData, setEditData] = useState({ name: '', affiliation: '' });
  const [saving, setSaving] = useState(false);
  
  // 비밀번호 변경 모달 상태
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // 비밀번호 확인 검증
  const passwordConfirmError = passwordData.newPassword && passwordData.confirmPassword && 
    passwordData.newPassword !== passwordData.confirmPassword ? '새 비밀번호가 일치하지 않습니다.' : null;

  // 프로필 데이터가 변경되면 편집 데이터 초기화
  useEffect(() => {
    if (profileData) {
      setEditData({
        name: profileData.name || '',
        affiliation: profileData.affiliation || ''
      });
    }
  }, [profileData]);

  // 편집 모드 시작
  const handleStartEdit = () => {
    setEditData({
      name: profileData?.name || '',
      affiliation: profileData?.affiliation || ''
    });
    setIsEditing(true);
  };

  // 정보 변경 저장
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await onSaveProfile(editData);
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
    } finally {
      setSaving(false);
    }
  };

  // 편집 취소
  const handleCancelEdit = () => {
    setEditData({
      name: profileData?.name || '',
      affiliation: profileData?.affiliation || ''
    });
    setIsEditing(false);
  };

  // 비밀번호 변경
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setChangingPassword(true);
    setPasswordError(null);
    try {
      await onChangePassword(passwordData);
      setPasswordModalOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
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
          backgroundColor: colors.background
        }}
      >
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  const displayData = profileData;

  return (
    <Box 
      id="profile-page" 
      sx={{ 
        p: 4, 
        backgroundColor: colors.background,
        minHeight: '100vh',
        borderTop: `1px solid ${colors.border}`
      }}
    >
      <PageTitle title={title} theme={theme} />
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={onCloseError}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* 프로필 이미지 및 기본 정보 */}
        <Grid item xs={12} md={4}>
          <ThemedCard theme={theme} sx={{ p: 4, textAlign: 'center', height: 'fit-content' }}>
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
                    theme={theme}
                    variant="primary"
                    startIcon={<EditIcon />}
                    onClick={handleStartEdit}
                    id="edit-profile-btn"
                    fullWidth
                  >
                    정보 변경
                  </ThemedButton>
                  <ThemedButton
                    theme={theme}
                    variant="outlined"
                    startIcon={<LockIcon />}
                    onClick={() => setPasswordModalOpen(true)}
                    id="change-password-btn"
                    fullWidth
                  >
                    비밀번호 변경
                  </ThemedButton>
                </>
              ) : (
                <>
                  <ThemedButton
                    theme={theme}
                    variant="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                    disabled={saving}
                    id="save-profile-btn"
                    fullWidth
                  >
                    {saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : '저장'}
                  </ThemedButton>
                  <ThemedButton
                    theme={theme}
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancelEdit}
                    disabled={saving}
                    id="cancel-edit-btn"
                    fullWidth
                  >
                    취소
                  </ThemedButton>
                </>
              )}
            </Box>
          </ThemedCard>
        </Grid>

        {/* 상세 정보 */}
        <Grid item xs={12} md={8}>
          <ThemedCard theme={theme} sx={{ p: 4 }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                mb: 3,
                color: colors.primary,
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
                    fullWidth
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    size="small"
                    placeholder="이름을 입력하세요"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: colors.primary,
                        },
                      },
                    }}
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
                    fullWidth
                    value={editData.affiliation}
                    onChange={(e) => setEditData(prev => ({ ...prev, affiliation: e.target.value }))}
                    size="small"
                    placeholder="소속을 입력하세요"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: colors.primary,
                        },
                      },
                    }}
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
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ color: colors.primary, fontWeight: 600 }}>
          비밀번호 변경
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setPasswordError(null)}>
                {passwordError}
              </Alert>
            )}
            <TextField
              fullWidth
              type="password"
              label="현재 비밀번호"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="새 비밀번호"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="새 비밀번호 확인"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              error={!!passwordConfirmError}
              helperText={passwordConfirmError}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <ThemedButton 
            theme={theme}
            variant="outlined"
            onClick={() => setPasswordModalOpen(false)} 
            disabled={changingPassword}
          >
            취소
          </ThemedButton>
          <ThemedButton 
            theme={theme}
            variant="primary"
            onClick={handleChangePassword} 
            disabled={changingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || !!passwordConfirmError}
          >
            {changingPassword ? <CircularProgress size={20} sx={{ color: 'white' }} /> : '변경'}
          </ThemedButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 