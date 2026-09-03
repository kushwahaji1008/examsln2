import apiClient from './client';
import type {
  Certificate,
  GenerateCertificateRequest,
} from './types/api';

// ============================================================================
// CERTIFICATES SERVICE (/api/v1/certificates)
// ============================================================================

export const getCertificates = async (): Promise<Certificate[]> => {
  const res = await apiClient.get('/api/v1/certificates');
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const getCertificateById = async (certificateId: string): Promise<Certificate> => {
  const res = await apiClient.get(`/api/v1/certificates/${certificateId}`);
  return res.data?.data || res.data;
};

export const generateCertificate = async (payload: GenerateCertificateRequest): Promise<Certificate> => {
  const res = await apiClient.post<Certificate>('/api/v1/certificates/generate', payload);
  return res.data?.data || res.data;
};

export const downloadCertificate = async (certificateId: string): Promise<Blob> => {
  const res = await apiClient.get(`/api/v1/certificates/${certificateId}/download`, {
    responseType: 'blob',
  });
  return res.data;
};

export const verifyCertificateByCode = async (certificateCode: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/certificates/${encodeURIComponent(certificateCode)}/verify`);
  return res.data?.data || res.data;
};
