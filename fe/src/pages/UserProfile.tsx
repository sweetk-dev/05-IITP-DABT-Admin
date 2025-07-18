import { useState } from 'react';
import { Box, TextField, Button, Typography, Stack } from '@mui/material';
import CommonDialog from '../components/CommonDialog';

export default function UserProfile() {
  // Dummy user data (in real app, fetch from API)
  const [email] = useState('user@example.com');
  const [name, setName] = useState('홍길동');
  const [affiliation, setAffiliation] = useState('IITP');
  const [nameEdit, setNameEdit] = useState('홍길동');
  const [affiliationEdit, setAffiliationEdit] = useState('IITP');
  const [editMode, setEditMode] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Password change dialog state
  const [pwDialogOpen, setPwDialogOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPw2, setNewPw2] = useState('');
  const [pwError, setPwError] = useState('');

  const handleSave = () => {
    setName(nameEdit);
    setAffiliation(affiliationEdit);
    setEditMode(false);
    setSuccessMsg('프로필 정보가 저장되었습니다.');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const handlePwDialogClose = () => {
    setPwDialogOpen(false);
    setCurrentPw('');
    setNewPw('');
    setNewPw2('');
    setPwError('');
  };

  const handlePwChange = () => {
    // TODO: 실제 비밀번호 변경 로직
    if (!currentPw || !newPw || !newPw2) {
      setPwError('모든 항목을 입력해 주세요.');
      return;
    }
    if (newPw !== newPw2) {
      setPwError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    setPwError('');
    setPwDialogOpen(false);
    setSuccessMsg('비밀번호가 변경되었습니다.');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  return (
    <Box id="user-profile-page" maxWidth={420} mx="auto" mt={6} p={4} bgcolor="#fff" borderRadius={3} boxShadow={2}>
      <Typography id="user-profile-title" variant="h5" fontWeight="bold" mb={3} align="center">
        내 프로필
      </Typography>
      <Stack spacing={3}>
        <TextField
          id="user-profile-email"
          label="이메일"
          value={email}
          InputProps={{ readOnly: true }}
          fullWidth
          margin="normal"
          helperText="이메일은 변경할 수 없습니다."
        />
        <TextField
          id="user-profile-name"
          label="이름"
          value={editMode ? nameEdit : name}
          onChange={e => setNameEdit(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: !editMode }}
        />
        <TextField
          id="user-profile-affiliation"
          label="소속"
          value={editMode ? affiliationEdit : affiliation}
          onChange={e => setAffiliationEdit(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: !editMode }}
        />
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {!editMode ? (
            <Button id="user-profile-edit-btn" variant="outlined" onClick={() => { setEditMode(true); setNameEdit(name); setAffiliationEdit(affiliation); }}>
              정보 수정
            </Button>
          ) : (
            <>
              <Button id="user-profile-cancel-btn" variant="text" color="secondary" onClick={() => setEditMode(false)}>
                취소
              </Button>
              <Button id="user-profile-save-btn" variant="contained" color="primary" onClick={handleSave}>
                저장
              </Button>
            </>
          )}
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button id="user-profile-change-password-btn" variant="contained" color="primary" onClick={() => setPwDialogOpen(true)}>
            비밀번호 변경
          </Button>
          <Button id="user-profile-change-email-btn" variant="outlined" color="primary" disabled>
            이메일 변경(불가)
          </Button>
        </Stack>
        {successMsg && (
          <Typography id="user-profile-success-msg" color="success.main" align="center">{successMsg}</Typography>
        )}
      </Stack>
      <CommonDialog
        open={pwDialogOpen}
        onClose={handlePwDialogClose}
        title="비밀번호 변경"
        id="user-profile-password-dialog"
        actions={
          <>
            <Button id="pw-dialog-cancel-btn" onClick={handlePwDialogClose}>취소</Button>
            <Button id="pw-dialog-confirm-btn" variant="contained" onClick={handlePwChange}>확인</Button>
          </>
        }
      >
        <Stack spacing={2} mt={1}>
          <TextField
            id="pw-dialog-current"
            label="현재 비밀번호"
            type="password"
            value={currentPw}
            onChange={e => setCurrentPw(e.target.value)}
            fullWidth
            autoFocus
          />
          <TextField
            id="pw-dialog-new"
            label="새 비밀번호"
            type="password"
            value={newPw}
            onChange={e => setNewPw(e.target.value)}
            fullWidth
          />
          <TextField
            id="pw-dialog-new2"
            label="새 비밀번호 확인"
            type="password"
            value={newPw2}
            onChange={e => setNewPw2(e.target.value)}
            fullWidth
          />
          {pwError && <Typography id="pw-dialog-error" color="error" fontSize={14}>{pwError}</Typography>}
        </Stack>
      </CommonDialog>
    </Box>
  );
} 