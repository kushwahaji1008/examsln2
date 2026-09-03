import apiClient from '@/services/api/client';

export const createExam = async (payload: any) => {
  const res = await apiClient.post('/exams', payload);
  return res.data;
};

export const listExams = async () => {
  const res = await apiClient.get('/exams');
  return res.data;
};

export const getExam = async (examId: string) => {
  const res = await apiClient.get(`/exams/${examId}`);
  return res.data;
};

export const updateExam = async (examId: string, payload: any) => {
  const res = await apiClient.put(`/exams/${examId}`, payload);
  return res.data;
};

export const deleteExam = async (examId: string) => {
  const res = await apiClient.delete(`/exams/${examId}`);
  return res.data;
};

export const examSchedule = async (examId: string, payload: any) => {
  const res = await apiClient.post(`/exams/${examId}/schedule`, payload);
  return res.data;
};

export const activateExam = async (examId: string) => {
  const res = await apiClient.post(`/exams/${examId}/activate`);
  return res.data;
};

export const completeExam = async (examId: string) => {
  const res = await apiClient.post(`/exams/${examId}/complete`);
  return res.data;
};

export const listUpcomingExams = async () => {
  const res = await apiClient.get('/exams/upcoming');
  return res.data;
};

export const listActiveExams = async () => {
  const res = await apiClient.get('/exams/active');
  return res.data;
};

export const examsHealth = async () => {
  const res = await apiClient.get('/exams/health');
  return res.data;
};
