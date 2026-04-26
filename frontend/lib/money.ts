import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function signIn(username: string, password: string) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password,
    });
    localStorage.setItem('token', response.data.access_token);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || 'Sign in failed',
    };
  }
}

export async function signUp(data: {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}) {
  try {
    await axios.post(`${API_BASE_URL}/auth/register`, data);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || 'Sign up failed',
    };
  }
}

export function logout() {
  localStorage.removeItem('token');
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem('token');
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}
