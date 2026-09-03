import apiClient from '@/services/api/client';

export const createQuestion = async (payload: any) => {
  const res = await apiClient.post('/questions', payload);
  return res.data;
};

export const listQuestions = async (params?: any) => {
  const res = await apiClient.get('/questions', { params });
  return res.data;
};

export const getQuestion = async (questionId: string) => {
  const res = await apiClient.get(`/questions/${questionId}`);
  return res.data;
};

export const updateQuestion = async (questionId: string, payload: any) => {
  const res = await apiClient.put(`/questions/${questionId}`, payload);
  return res.data;
};

export const deleteQuestion = async (questionId: string) => {
  const res = await apiClient.delete(`/questions/${questionId}`);
  return res.data;
};

export const questionsHealth = async () => {
  const res = await apiClient.get('/questions/health');
  return res.data;
};
