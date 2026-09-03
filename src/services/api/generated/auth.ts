import apiClient from '@/services/api/client';
import type { RegisterRequest, LoginRequest, UserDto } from './types';

export const register = async (payload: RegisterRequest) => {
  const res = await apiClient.post('/auth/register', payload);
  return res.data;
};

export const login = async (payload: LoginRequest) => {
  const res = await apiClient.post('/auth/login', payload);
  return res.data;
};

export const me = async (): Promise<UserDto> => {
  const res = await apiClient.get('/auth/me');
  return res.data;
};

export const listUsers = async () => {
  const res = await apiClient.get('/auth/users');
  return res.data;
};

export const getUser = async (userId: string) => {
  const res = await apiClient.get(`/auth/users/${userId}`);
  return res.data;
};

export const updateUser = async (userId: string, payload: Partial<UserDto>) => {
  const res = await apiClient.put(`/auth/users/${userId}`, payload);
  return res.data;
};

export const deleteUser = async (userId: string) => {
  const res = await apiClient.delete(`/auth/users/${userId}`);
  return res.data;
};

export const authHealth = async () => {
  const res = await apiClient.get('/auth/health');
  return res.data;
};
