import { Box, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FloatingLogo } from '../components/AppBarCommon';
import { isValidEmail } from '../utils/validation';
import LoginForm from '../components/LoginForm';

export default function Login() {
  return (
    <Box id="login-page" minHeight="80vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f5f5">
      <LoginForm showRegisterButton={true} />
      <FloatingLogo id="login-logo2-floating" width={240} />
    </Box>
  );
} 