import apiClient from './client';
import type {
  StartExamRequest,
  SubmitAnswerRequest,
  TimerSyncRequest,
  ExtendTimeRequest,
  ActivityLogRequest,
  AttemptNavigationState,
  AttemptTimerState,
  ExamAttempt,
} from './types/api';

// ============================================================================
// EXAM ATTEMPTS SERVICE (/api/v1/attempts)
// ============================================================================

export const getAttempts = async (apiVersion?: string): Promise<ExamAttempt[]> => {
  const res = await apiClient.get('/api/v1/attempts', { params: { 'api-version': apiVersion } });
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const startExam = async (payload: StartExamRequest, apiVersion?: string): Promise<ExamAttempt> => {
  const res = await apiClient.post('/api/v1/attempts', payload, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const getAttemptById = async (attemptId: string, apiVersion?: string): Promise<ExamAttempt> => {
  const res = await apiClient.get(`/api/v1/attempts/${attemptId}`, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const deleteAttempt = async (attemptId: string, apiVersion?: string): Promise<{ success: boolean; message?: string }> => {
  const res = await apiClient.delete(`/api/v1/attempts/${attemptId}`, { params: { 'api-version': apiVersion } });
  return res.data;
};

export const startAttemptSession = async (attemptId: string, apiVersion?: string): Promise<ExamAttempt> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/start`, {}, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const pauseAttempt = async (attemptId: string, apiVersion?: string): Promise<ExamAttempt> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/pause`, {}, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const resumeAttempt = async (attemptId: string, apiVersion?: string): Promise<ExamAttempt> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/resume`, {}, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const submitAttempt = async (attemptId: string, apiVersion?: string): Promise<ExamAttempt> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/submit`, {}, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const forceSubmitAttempt = async (attemptId: string, apiVersion?: string): Promise<ExamAttempt> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/force-submit`, {}, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const terminateAttempt = async (attemptId: string, apiVersion?: string): Promise<ExamAttempt> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/terminate`, {}, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

// ----------------------------------------------------------------------------
// ATTEMPT QUESTIONS & ANSWERS
// ----------------------------------------------------------------------------

export const getAttemptQuestions = async (attemptId: string, apiVersion?: string): Promise<any[]> => {
  const res = await apiClient.get(`/api/v1/attempts/${attemptId}/questions`, { params: { 'api-version': apiVersion } });
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const getAttemptQuestion = async (attemptId: string, questionId: string, apiVersion?: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/attempts/${attemptId}/questions/${questionId}`, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const submitAnswer = async (attemptId: string, questionId: string, payload: SubmitAnswerRequest, apiVersion?: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/questions/${questionId}/answer`, payload, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const updateAnswer = async (attemptId: string, questionId: string, payload: SubmitAnswerRequest, apiVersion?: string): Promise<any> => {
  const res = await apiClient.put(`/api/v1/attempts/${attemptId}/questions/${questionId}/answer`, payload, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const clearAnswer = async (attemptId: string, questionId: string, apiVersion?: string): Promise<any> => {
  const res = await apiClient.delete(`/api/v1/attempts/${attemptId}/questions/${questionId}`, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const nextQuestion = async (attemptId: string, questionId: string, apiVersion?: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/questions/${questionId}/next`, {}, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const previousQuestion = async (attemptId: string, questionId: string, apiVersion?: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/questions/${questionId}/previous`, {}, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const markQuestionForReview = async (attemptId: string, questionId: string, apiVersion?: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/questions/${questionId}/mark-review`, {}, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const unmarkQuestionForReview = async (attemptId: string, questionId: string, apiVersion?: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/questions/${questionId}/unmark-review`, {}, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

// ----------------------------------------------------------------------------
// NAVIGATION & TIMER
// ----------------------------------------------------------------------------

export const getAttemptNavigation = async (attemptId: string, apiVersion?: string): Promise<AttemptNavigationState> => {
  const res = await apiClient.get(`/api/v1/attempts/${attemptId}/navigation`, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const getAttemptTimer = async (attemptId: string, apiVersion?: string): Promise<AttemptTimerState> => {
  const res = await apiClient.get(`/api/v1/attempts/${attemptId}/timer`, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const syncAttemptTimer = async (attemptId: string, payload: TimerSyncRequest, apiVersion?: string): Promise<AttemptTimerState> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/timer/sync`, payload, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const extendAttemptTime = async (attemptId: string, payload: ExtendTimeRequest, apiVersion?: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/extend-time`, payload, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const grantExtraTime = async (attemptId: string, payload: ExtendTimeRequest, apiVersion?: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/grant-extra-time`, payload, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

// ----------------------------------------------------------------------------
// LOGS, EVENTS & RECOVERY
// ----------------------------------------------------------------------------

export const getUserAttempts = async (userId: string, apiVersion?: string): Promise<ExamAttempt[]> => {
  const res = await apiClient.get(`/api/v1/users/${userId}/attempts`, { params: { 'api-version': apiVersion } });
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const getExamAttempts = async (examId: string, apiVersion?: string): Promise<ExamAttempt[]> => {
  const res = await apiClient.get(`/api/v1/exams/${examId}/attempts`, { params: { 'api-version': apiVersion } });
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const getAttemptEvents = async (attemptId: string, apiVersion?: string): Promise<any[]> => {
  const res = await apiClient.get(`/api/v1/attempts/${attemptId}/events`, { params: { 'api-version': apiVersion } });
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const logAttemptActivity = async (attemptId: string, payload: ActivityLogRequest, apiVersion?: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/log`, payload, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const recoverAttempt = async (attemptId: string, apiVersion?: string): Promise<ExamAttempt> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/recover`, {}, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const resumeAttemptSession = async (attemptId: string, apiVersion?: string): Promise<ExamAttempt> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/resume-session`, {}, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const syncAttempt = async (attemptId: string, apiVersion?: string): Promise<ExamAttempt> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/sync`, {}, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const invalidateAttempt = async (attemptId: string, apiVersion?: string): Promise<ExamAttempt> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/invalidate`, {}, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const restoreAttempt = async (attemptId: string, apiVersion?: string): Promise<ExamAttempt> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/restore`, {}, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const reopenAttempt = async (attemptId: string, apiVersion?: string): Promise<ExamAttempt> => {
  const res = await apiClient.post(`/api/v1/attempts/${attemptId}/reopen`, {}, { params: { 'api-version': apiVersion } });
  return res.data?.data || res.data;
};

export const checkAttemptsHealth = async (apiVersion?: string): Promise<any> => {
  const res = await apiClient.get('/api/v1/attempts/health', { params: { 'api-version': apiVersion } });
  return res.data;
};
