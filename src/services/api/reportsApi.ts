import apiClient from './client';
import type {
  CreateReportRequest,
  AnalyticsReport,
} from './types/api';

// ============================================================================
// REPORTS SERVICE (/api/v1/analytics/reports)
// ============================================================================

export const createReport = async (payload: CreateReportRequest): Promise<AnalyticsReport> => {
  const res = await apiClient.post('/api/v1/analytics/reports', payload);
  return res.data?.data || res.data;
};

export const getReports = async (): Promise<AnalyticsReport[]> => {
  const res = await apiClient.get('/api/v1/analytics/reports');
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const getReportById = async (reportId: string): Promise<AnalyticsReport> => {
  const res = await apiClient.get(`/api/v1/analytics/reports/${reportId}`);
  return res.data?.data || res.data;
};

export const deleteReport = async (reportId: string): Promise<any> => {
  const res = await apiClient.delete(`/api/v1/analytics/reports/${reportId}`);
  return res.data;
};

export const generateReport = async (reportId: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/analytics/reports/${reportId}/generate`);
  return res.data?.data || res.data;
};

export const downloadReport = async (reportId: string): Promise<Blob> => {
  const res = await apiClient.get(`/api/v1/analytics/reports/${reportId}/download`, {
    responseType: 'blob',
  });
  return res.data;
};
