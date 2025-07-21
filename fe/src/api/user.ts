import { apiFetch } from './api';

export async function checkEmail(email: string) {
  return apiFetch('/user/email/check', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function registerUser(params: { email: string; password: string; name: string; affiliation?: string }) {
  return apiFetch('/user/register', {
    method: 'POST',
    body: JSON.stringify(params),
  });
} 