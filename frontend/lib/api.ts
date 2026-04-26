import axios from 'axios';
import { Expense } from '@/types/expense';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getExpenses(): Promise<Expense[]> {
  const response = await api.get('/expenses/');
  return response.data;
}

export async function getExpense(id: string): Promise<Expense> {
  const response = await api.get(`/expenses/${id}`);
  return response.data;
}

export async function createExpense(data: Partial<Expense>): Promise<Expense> {
  const response = await api.post('/expenses/', data);
  return response.data;
}

export async function updateExpense(id: string, data: Partial<Expense>): Promise<Expense> {
  const response = await api.put(`/expenses/${id}`, data);
  return response.data;
}

export async function deleteExpense(id: string): Promise<void> {
  await api.delete(`/expenses/${id}`);
}

export default api;
