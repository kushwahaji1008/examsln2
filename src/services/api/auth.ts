import apiClient from './client';
import type { AxiosResponse } from 'axios';
import type { 
  AuthResponse, 
  LoginPayload, 
  RegisterPayload, 
  User 
} from '@/features/auth/types/auth';

export const login = (data: LoginPayload): Promise<AxiosResponse<AuthResponse>> => {
  return apiClient.post<AuthResponse>('/auth/login', data);
};

export const register = (data: RegisterPayload): Promise<AxiosResponse<AuthResponse | void>> => {
  return apiClient.post('/auth/register', data);
};

export const me = (): Promise<AxiosResponse<User>> => {
  return apiClient.get<User>('/auth/me');
};