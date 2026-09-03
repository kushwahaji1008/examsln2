import apiClient from './client';
import type { 
  UserAdminListItem, 
  CreateUserAdminRequest, 
  UpdateUserAdminRequest,
  AuthSession,
  UserActivityLogItem,
  AuditLog,
  UserRole,
} from './types/api';

// ============================================================================
// USER ADMINISTRATION ENDPOINTS (/api/v1/users)
// ============================================================================

export interface UserQueryParams {
  Page?: number;
  PageSize?: number;
  SearchQuery?: string;
  Role?: UserRole;
  IsActive?: boolean;
}

export const getUsers = async (params?: UserQueryParams): Promise<UserAdminListItem[]> => {
  const res = await apiClient.get('/api/v1/users', { params });
  return Array.isArray(res.data) ? res.data : (res.data?.users || res.data?.data || []);
};

export const createUser = async (payload: CreateUserAdminRequest): Promise<UserAdminListItem> => {
  const res = await apiClient.post<UserAdminListItem>('/api/v1/users', payload);
  return res.data?.data || res.data;
};

export const getUser = async (userId: string): Promise<UserAdminListItem> => {
  const res = await apiClient.get<UserAdminListItem>(`/api/v1/users/${userId}`);
  return res.data?.data || res.data;
};

export const updateUser = async (userId: string, payload: UpdateUserAdminRequest): Promise<UserAdminListItem> => {
  const res = await apiClient.put<UserAdminListItem>(`/api/v1/users/${userId}`, payload);
  return res.data?.data || res.data;
};

export const patchUser = async (userId: string, payload: Partial<UpdateUserAdminRequest>): Promise<UserAdminListItem> => {
  const res = await apiClient.patch<UserAdminListItem>(`/api/v1/users/${userId}`, payload);
  return res.data?.data || res.data;
};

export const deleteUser = async (userId: string): Promise<{ message: string }> => {
  const res = await apiClient.delete(`/api/v1/users/${userId}`);
  return res.data;
};

export const activateUser = async (userId: string): Promise<{ message: string; user?: UserAdminListItem }> => {
  const res = await apiClient.post(`/api/v1/users/${userId}/activate`);
  return res.data;
};

export const deactivateUser = async (userId: string): Promise<{ message: string; user?: UserAdminListItem }> => {
  const res = await apiClient.post(`/api/v1/users/${userId}/deactivate`);
  return res.data;
};

export const lockUser = async (userId: string, reason?: string): Promise<{ message: string }> => {
  const res = await apiClient.post(`/api/v1/users/${userId}/lock`, { reason });
  return res.data;
};

export const unlockUser = async (userId: string): Promise<{ message: string }> => {
  const res = await apiClient.post(`/api/v1/users/${userId}/unlock`);
  return res.data;
};

export const forcePasswordReset = async (userId: string): Promise<{ message: string; temporaryPassword?: string }> => {
  const res = await apiClient.post(`/api/v1/users/${userId}/force-password-reset`);
  return res.data;
};

export const verifyUserEmail = async (userId: string): Promise<{ message: string }> => {
  const res = await apiClient.post(`/api/v1/users/${userId}/verify-email`);
  return res.data;
};

export const resetUserMfa = async (userId: string): Promise<{ message: string }> => {
  const res = await apiClient.post(`/api/v1/users/${userId}/reset-mfa`);
  return res.data;
};

export const revokeUserSessions = async (userId: string): Promise<{ message: string }> => {
  const res = await apiClient.post(`/api/v1/users/${userId}/revoke-sessions`);
  return res.data;
};

export const getUserSessions = async (userId: string): Promise<AuthSession[]> => {
  const res = await apiClient.get<AuthSession[]>(`/api/v1/users/${userId}/sessions`);
  return Array.isArray(res.data) ? res.data : [];
};

export const getUserActivity = async (userId: string): Promise<UserActivityLogItem[]> => {
  const res = await apiClient.get<UserActivityLogItem[]>(`/api/v1/users/${userId}/activity`);
  return Array.isArray(res.data) ? res.data : [];
};

export const getUserAuditLogs = async (userId: string): Promise<AuditLog[]> => {
  const res = await apiClient.get<AuditLog[]>(`/api/v1/audit-security/users/${userId}/audit-logs`);
  return Array.isArray(res.data) ? res.data : [];
};
