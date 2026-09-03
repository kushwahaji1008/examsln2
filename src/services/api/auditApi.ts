import apiClient from './client';
import type { 
  AuditLog, 
  AuditLogFilterRequest, 
  AuditStatistics, 
  SecurityAlert, 
  SecurityMetrics,
  IpRule,
  CreateIpRuleRequest,
} from './types/api';

// ============================================================================
// AUDIT & SECURITY ENDPOINTS (/api/v1/audit-security)
// ============================================================================

export const getAuditLogs = async (params?: AuditLogFilterRequest): Promise<AuditLog[]> => {
  const res = await apiClient.get('/api/v1/audit-security/logs', { params });
  return Array.isArray(res.data) ? res.data : (res.data?.logs || res.data?.data || []);
};

export const getAuditStatistics = async (): Promise<AuditStatistics> => {
  const res = await apiClient.get<AuditStatistics>('/api/v1/audit-security/statistics');
  return res.data?.data || res.data;
};

export const getSecurityMetrics = async (): Promise<SecurityMetrics> => {
  const res = await apiClient.get<SecurityMetrics>('/api/v1/audit-security/security/metrics');
  return res.data?.data || res.data;
};

export const getSecurityAlerts = async (): Promise<SecurityAlert[]> => {
  const res = await apiClient.get<SecurityAlert[]>('/api/v1/audit-security/security/alerts');
  return Array.isArray(res.data) ? res.data : (res.data?.alerts || res.data?.data || []);
};

export const dismissSecurityAlert = async (alertId: string): Promise<{ message: string }> => {
  const res = await apiClient.post(`/api/v1/audit-security/security/alerts/${alertId}/dismiss`);
  return res.data;
};

export const getIpRules = async (): Promise<IpRule[]> => {
  const res = await apiClient.get<IpRule[]>('/api/v1/audit-security/ip-rules');
  return Array.isArray(res.data) ? res.data : (res.data?.rules || res.data?.data || []);
};

export const createIpRule = async (payload: CreateIpRuleRequest): Promise<IpRule> => {
  const res = await apiClient.post<IpRule>('/api/v1/audit-security/ip-rules', payload);
  return res.data?.data || res.data;
};

export const deleteIpRule = async (ruleId: string): Promise<{ message: string }> => {
  const res = await apiClient.delete(`/api/v1/audit-security/ip-rules/${ruleId}`);
  return res.data;
};
