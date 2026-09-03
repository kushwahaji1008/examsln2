import apiClient from './client';
import type {
  StartProctoringRequest,
  ReportViolationRequest,
  SubmitSnapshotRequest,
  ProctoringSession,
} from './types/api';

// ============================================================================
// PROCTORING SERVICE (/api/v1/proctoring)
// ============================================================================

export const startProctoring = async (payload: StartProctoringRequest): Promise<ProctoringSession> => {
  const res = await apiClient.post('/api/v1/proctoring/start', payload);
  return res.data?.data || res.data;
};

export const getProctoringSession = async (sessionId: string): Promise<ProctoringSession> => {
  const res = await apiClient.get(`/api/v1/proctoring/session/${sessionId}`);
  return res.data?.data || res.data;
};

export const endProctoringSession = async (sessionId: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/proctoring/session/${sessionId}/end`);
  return res.data?.data || res.data;
};

export const getAttemptProctoring = async (attemptId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/proctoring/attempt/${attemptId}`);
  return res.data?.data || res.data;
};

export const getExamProctoringSessions = async (examId: string): Promise<ProctoringSession[]> => {
  const res = await apiClient.get(`/api/v1/proctoring/exam/${examId}/sessions`);
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const reportViolation = async (payload: ReportViolationRequest): Promise<any> => {
  const res = await apiClient.post('/api/v1/proctoring/violation', payload);
  return res.data?.data || res.data;
};

export const submitSnapshot = async (payload: SubmitSnapshotRequest): Promise<any> => {
  const res = await apiClient.post('/api/v1/proctoring/snapshot', payload);
  return res.data?.data || res.data;
};

export const checkProctoringHealth = async (): Promise<any> => {
  const res = await apiClient.get('/api/v1/proctoring/health');
  return res.data;
};
