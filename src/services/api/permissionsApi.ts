import apiClient from './client';
import type { 
  Permission, 
  CreatePermissionRequest, 
  UpdatePermissionRequest,
  PermissionModule,
} from './types/api';

// ============================================================================
// PERMISSIONS ENDPOINTS (/api/v1/permissions)
// ============================================================================

export const getPermissions = async (): Promise<Permission[]> => {
  const res = await apiClient.get('/api/v1/permissions');
  return Array.isArray(res.data) ? res.data : (res.data?.permissions || res.data?.data || []);
};

export const createPermission = async (payload: CreatePermissionRequest): Promise<Permission> => {
  const res = await apiClient.post<Permission>('/api/v1/permissions', payload);
  return res.data?.data || res.data;
};

export const getPermission = async (permissionId: string): Promise<Permission> => {
  const res = await apiClient.get<Permission>(`/api/v1/permissions/${permissionId}`);
  return res.data?.data || res.data;
};

export const updatePermission = async (permissionId: string, payload: UpdatePermissionRequest): Promise<Permission> => {
  const res = await apiClient.put<Permission>(`/api/v1/permissions/${permissionId}`, payload);
  return res.data?.data || res.data;
};

export const patchPermission = async (permissionId: string, payload: Partial<UpdatePermissionRequest>): Promise<Permission> => {
  const res = await apiClient.patch<Permission>(`/api/v1/permissions/${permissionId}`, payload);
  return res.data?.data || res.data;
};

export const deletePermission = async (permissionId: string): Promise<{ message: string }> => {
  const res = await apiClient.delete(`/api/v1/permissions/${permissionId}`);
  return res.data;
};

export const getPermissionModules = async (): Promise<PermissionModule[]> => {
  const res = await apiClient.get<PermissionModule[]>('/api/v1/permissions/modules');
  return Array.isArray(res.data) ? res.data : (res.data?.modules || res.data?.data || []);
};
