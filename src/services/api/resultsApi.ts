import apiClient from './client';
import type {
  ExamResult,
  GradeQuestionRequest,
  OverrideGradeRequest,
  BulkPublishRequest,
  ExportFilterRequest,
  LeaderboardEntry,
} from './types/api';

// ============================================================================
// RESULTS & RESULT QUERIES SERVICE (/api/v1/results & /api/v1/queries)
// ============================================================================

export const getResults = async (params?: any): Promise<ExamResult[]> => {
  const res = await apiClient.get('/api/v1/results', { params });
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const getResultById = async (resultId: string): Promise<ExamResult> => {
  const res = await apiClient.get(`/api/v1/results/${resultId}`);
  return res.data?.data || res.data;
};

export const calculateResult = async (resultId: string): Promise<ExamResult> => {
  const res = await apiClient.post(`/api/v1/results/${resultId}/calculate`);
  return res.data?.data || res.data;
};

export const recalculateResult = async (resultId: string): Promise<ExamResult> => {
  const res = await apiClient.post(`/api/v1/results/${resultId}/recalculate`);
  return res.data?.data || res.data;
};

export const finalizeResult = async (resultId: string): Promise<ExamResult> => {
  const res = await apiClient.post(`/api/v1/results/${resultId}/finalize`);
  return res.data?.data || res.data;
};

export const unfinalizeResult = async (resultId: string): Promise<ExamResult> => {
  const res = await apiClient.post(`/api/v1/results/${resultId}/unfinalize`);
  return res.data?.data || res.data;
};

export const publishResult = async (resultId: string): Promise<ExamResult> => {
  const res = await apiClient.post(`/api/v1/results/${resultId}/publish`);
  return res.data?.data || res.data;
};

export const unpublishResult = async (resultId: string): Promise<ExamResult> => {
  const res = await apiClient.post(`/api/v1/results/${resultId}/unpublish`);
  return res.data?.data || res.data;
};

export const bulkPublishResults = async (payload: BulkPublishRequest): Promise<any> => {
  const res = await apiClient.post('/api/v1/results/bulk-publish', payload);
  return res.data;
};

export const getManualGradingQueue = async (resultId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/results/${resultId}/manual-grading`);
  return res.data?.data || res.data;
};

export const gradeEntireResult = async (resultId: string, payload?: any): Promise<any> => {
  const res = await apiClient.post(`/api/v1/results/${resultId}/grade`, payload || {});
  return res.data?.data || res.data;
};

export const gradeResultQuestion = async (resultId: string, questionId: string, payload: GradeQuestionRequest): Promise<any> => {
  const res = await apiClient.put(`/api/v1/results/${resultId}/questions/${questionId}/grade`, payload);
  return res.data?.data || res.data;
};

export const overrideResultQuestionGrade = async (resultId: string, questionId: string, payload: OverrideGradeRequest): Promise<any> => {
  const res = await apiClient.post(`/api/v1/results/${resultId}/questions/${questionId}/override`, payload);
  return res.data?.data || res.data;
};

export const getResultReport = async (resultId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/results/${resultId}/report`);
  return res.data?.data || res.data;
};

export const getResultBreakdown = async (resultId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/results/${resultId}/breakdown`);
  return res.data?.data || res.data;
};

export const getResultRank = async (resultId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/results/${resultId}/rank`);
  return res.data?.data || res.data;
};

// ----------------------------------------------------------------------------
// EXPORTS
// ----------------------------------------------------------------------------

export const exportResults = async (payload: ExportFilterRequest): Promise<any> => {
  const res = await apiClient.post('/api/v1/results/export', payload);
  return res.data;
};

export const exportResultsCsv = async (payload: ExportFilterRequest): Promise<any> => {
  const res = await apiClient.post('/api/v1/results/export/csv', payload, { responseType: 'blob' });
  return res.data;
};

export const exportResultsExcel = async (payload: ExportFilterRequest): Promise<any> => {
  const res = await apiClient.post('/api/v1/results/export/excel', payload, { responseType: 'blob' });
  return res.data;
};

export const exportResultsPdf = async (payload: ExportFilterRequest): Promise<any> => {
  const res = await apiClient.post('/api/v1/results/export/pdf', payload, { responseType: 'blob' });
  return res.data;
};

// ----------------------------------------------------------------------------
// RESULT QUERIES (/api/v1/queries/...)
// ----------------------------------------------------------------------------

export const getUserResults = async (userId: string): Promise<ExamResult[]> => {
  const res = await apiClient.get(`/api/v1/queries/users/${userId}/results`);
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const getUserCertificates = async (userId: string): Promise<any[]> => {
  const res = await apiClient.get(`/api/v1/queries/users/${userId}/certificates`);
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const getExamResults = async (examId: string): Promise<ExamResult[]> => {
  const res = await apiClient.get(`/api/v1/queries/exams/${examId}/results`);
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const getExamRanking = async (examId: string): Promise<LeaderboardEntry[]> => {
  const res = await apiClient.get(`/api/v1/queries/exams/${examId}/ranking`);
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const getExamLeaderboard = async (examId: string): Promise<LeaderboardEntry[]> => {
  const res = await apiClient.get(`/api/v1/queries/exams/${examId}/leaderboard`);
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const getAttemptResult = async (attemptId: string): Promise<ExamResult> => {
  const res = await apiClient.get(`/api/v1/queries/attempts/${attemptId}/result`);
  return res.data?.data || res.data;
};
