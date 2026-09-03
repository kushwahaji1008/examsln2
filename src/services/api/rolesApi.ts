import apiClient from './client';
import type { 
  Role, 
  CreateRoleRequest, 
  UpdateRoleRequest, 
  Permission,
  AssignPermissionsRequest,
} from './types/api';

// ============================================================================
// ROLES & RBAC ENDPOINTS (/api/v1/roles)
// ============================================================================

export const getRoles = async (): Promise<Role[]> => {
  const res = await apiClient.get('/api/v1/roles');
  return Array.isArray(res.data) ? res.data : (res.data?.roles || res.data?.data || []);
};

export const createRole = async (payload: CreateRoleRequest): Promise<Role> => {
  const res = await apiClient.post<Role>('/api/v1/roles', payload);
  return res.data?.data || res.data;
};

export const getRole = async (roleId: string): Promise<Role> => {
  const res = await apiClient.get<Role>(`/api/v1/roles/${roleId}`);
  return res.data?.data || res.data;
};

export const updateRole = async (roleId: string, payload: UpdateRoleRequest): Promise<Role> => {
  const res = await apiClient.put<Role>(`/api/v1/roles/${roleId}`, payload);
  return res.data?.data || res.data;
};

export const patchRole = async (roleId: string, payload: Partial<UpdateRoleRequest>): Promise<Role> => {
  const res = await apiClient.patch<Role>(`/api/v1/roles/${roleId}`, payload);
  return res.data?.data || res.data;
};

export const deleteRole = async (roleId: string): Promise<{ message: string }> => {
  const res = await apiClient.delete(`/api/v1/roles/${roleId}`);
  return res.data;
};

export const assignRoleToUser = async (roleId: string, userId: string): Promise<{ message: string }> => {
  const res = await apiClient.post(`/api/v1/roles/${roleId}/users/${userId}`);
  return res.data;
};

export const removeRoleFromUser = async (roleId: string, userId: string): Promise<{ message: string }> => {
  const res = await apiClient.delete(`/api/v1/roles/${roleId}/users/${userId}`);
  return res.data;
};

export const getRolePermissions = async (roleId: string): Promise<Permission[]> => {
  const res = await apiClient.get<Permission[]>(`/api/v1/roles/${roleId}/permissions`);
  return Array.isArray(res.data) ? res.data : (res.data?.permissions || res.data?.data || []);
};

export const assignPermissionsToRole = async (roleId: string, payload: AssignPermissionsRequest | string[]): Promise<{ message: string }> => {
  const body = Array.isArray(payload) ? { permissionIds: payload } : payload;
  const res = await apiClient.post(`/api/v1/roles/${roleId}/permissions`, body);
  return res.data;
};

export const removePermissionFromRole = async (roleId: string, permissionId: string): Promise<{ message: string }> => {
  const res = await apiClient.delete(`/api/v1/roles/${roleId}/permissions/${permissionId}`);
  return res.data;
};
