import apiClient from '@/services/api/client';
import type { StartExamRequest, SubmitAnswerRequest, SubmitExamRequest } from './types';

export const startAttempt = async (payload: StartExamRequest) => {
  const res = await apiClient.post('/attempts/start', payload);
  return res.data;
};

export const getAttempt = async (attemptId: string) => {
  const res = await apiClient.get(`/attempts/${attemptId}`);
  return res.data;
};

export const isExamActive = async (examId: string) => {
  const res = await apiClient.get(`/attempts/exam/${examId}/active`);
  return res.data;
};

export const getMyAttempts = async () => {
  const res = await apiClient.get('/attempts/student/my-attempts');
  return res.data;
};

export const getExamAttempts = async (examId: string) => {
  const res = await apiClient.get(`/attempts/exam/${examId}/all`);
  return res.data;
};

export const submitAnswer = async (attemptId: string, payload: SubmitAnswerRequest) => {
  const res = await apiClient.post(`/attempts/${attemptId}/answer`, payload);
  return res.data;
};

export const flagQuestion = async (attemptId: string, questionId: string, flagged = true) => {
  const res = await apiClient.post(`/attempts/${attemptId}/flag/${questionId}?flagged=${flagged}`);
  return res.data;
};

export const logActivity = async (attemptId: string, payload: any) => {
  const res = await apiClient.post(`/attempts/${attemptId}/log`, payload);
  return res.data;
};

export const submitExam = async (payload: SubmitExamRequest) => {
  const res = await apiClient.post('/attempts/submit', payload);
  return res.data;
};

export const attemptsHealth = async () => {
  const res = await apiClient.get('/attempts/health');
  return res.data;
};
