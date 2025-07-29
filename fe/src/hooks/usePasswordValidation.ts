import { useState, useEffect } from 'react';
import { isValidPassword } from '@iitp-dabt/common';

interface PasswordValidationState {
  password: string;
  confirmPassword: string;
  passwordError: string;
  confirmPasswordError: string;
  isValid: boolean;
}

interface UsePasswordValidationOptions {
  requireCurrentPassword?: boolean;
  currentPassword?: string;
  currentPasswordError?: string;
}

export function usePasswordValidation(options: UsePasswordValidationOptions = {}) {
  const [state, setState] = useState<PasswordValidationState>({
    password: '',
    confirmPassword: '',
    passwordError: '',
    confirmPasswordError: '',
    isValid: false
  });

  // 비밀번호 실시간 검증
  useEffect(() => {
    let passwordError = '';
    if (state.password) {
      if (!isValidPassword(state.password)) {
        passwordError = '비밀번호는 영문, 숫자, 특수문자 포함 8자리 이상이어야 합니다.';
      }
    }

    setState(prev => ({
      ...prev,
      passwordError,
      isValid: !passwordError && !prev.confirmPasswordError && 
        (options.requireCurrentPassword ? !!options.currentPassword : true) &&
        (options.currentPasswordError ? false : true)
    }));
  }, [state.password, options.currentPassword, options.currentPasswordError]);

  // 비밀번호 확인 실시간 검증
  useEffect(() => {
    let confirmPasswordError = '';
    if (state.confirmPassword) {
      if (state.password !== state.confirmPassword) {
        confirmPasswordError = '비밀번호가 일치하지 않습니다.';
      }
    }

    setState(prev => ({
      ...prev,
      confirmPasswordError,
      isValid: !prev.passwordError && !confirmPasswordError &&
        (options.requireCurrentPassword ? !!options.currentPassword : true) &&
        (options.currentPasswordError ? false : true)
    }));
  }, [state.password, state.confirmPassword, options.currentPassword, options.currentPasswordError]);

  const setPassword = (password: string) => {
    setState(prev => ({ ...prev, password }));
  };

  const setConfirmPassword = (confirmPassword: string) => {
    setState(prev => ({ ...prev, confirmPassword }));
  };

  const reset = () => {
    setState({
      password: '',
      confirmPassword: '',
      passwordError: '',
      confirmPasswordError: '',
      isValid: false
    });
  };

  return {
    ...state,
    setPassword,
    setConfirmPassword,
    reset
  };
} 