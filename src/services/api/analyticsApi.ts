import apiClient from './client';

// ============================================================================
// ANALYTICS & DASHBOARDS SERVICE (/api/v1/analytics & /api/v1/exams/{examId}...)
// ============================================================================

export const getDashboardAnalytics = async (): Promise<any> => {
  const res = await apiClient.get('/api/v1/analytics/dashboard');
  return res.data?.data || res.data;
};

export const getAdminDashboardAnalytics = async (): Promise<any> => {
  const res = await apiClient.get('/api/v1/analytics/admin-dashboard');
  return res.data?.data || res.data;
};

export const getStudentDashboardAnalytics = async (): Promise<any> => {
  const res = await apiClient.get('/api/v1/analytics/student-dashboard');
  return res.data?.data || res.data;
};

export const getInstructorDashboardAnalytics = async (): Promise<any> => {
  const res = await apiClient.get('/api/v1/analytics/instructor-dashboard');
  return res.data?.data || res.data;
};

// ----------------------------------------------------------------------------
// PLATFORM ANALYTICS
// ----------------------------------------------------------------------------

export const getPlatformAnalytics = async (): Promise<any> => {
  const res = await apiClient.get('/api/v1/analytics/platform');
  return res.data?.data || res.data;
};

export const getPlatformUsersAnalytics = async (): Promise<any> => {
  const res = await apiClient.get('/api/v1/analytics/users');
  return res.data?.data || res.data;
};

export const getPlatformExamsAnalytics = async (): Promise<any> => {
  const res = await apiClient.get('/api/v1/analytics/exams');
  return res.data?.data || res.data;
};

export const getPlatformAttemptsAnalytics = async (): Promise<any> => {
  const res = await apiClient.get('/api/v1/analytics/attempts');
  return res.data?.data || res.data;
};

export const getPlatformRevenueAnalytics = async (): Promise<any> => {
  const res = await apiClient.get('/api/v1/analytics/revenue');
  return res.data?.data || res.data;
};

export const getPlatformActivityAnalytics = async (): Promise<any> => {
  const res = await apiClient.get('/api/v1/analytics/activity');
  return res.data?.data || res.data;
};

// ----------------------------------------------------------------------------
// EXAM ANALYTICS
// ----------------------------------------------------------------------------

export const getExamAnalytics = async (examId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/exams/${examId}`);
  return res.data?.data || res.data;
};

export const getExamPerformanceAnalytics = async (examId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/exams/${examId}/performance`);
  return res.data?.data || res.data;
};

export const getExamCompletionAnalytics = async (examId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/exams/${examId}/completion`);
  return res.data?.data || res.data;
};

export const getExamDropoutAnalytics = async (examId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/exams/${examId}/dropout`);
  return res.data?.data || res.data;
};

export const getExamTimingAnalytics = async (examId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/exams/${examId}/timing`);
  return res.data?.data || res.data;
};

export const getExamQuestionsAnalytics = async (examId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/exams/${examId}/questions`);
  return res.data?.data || res.data;
};

export const getExamDifficultyAnalytics = async (examId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/exams/${examId}/difficulty`);
  return res.data?.data || res.data;
};

export const getExamDistributionAnalytics = async (examId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/exams/${examId}/distribution`);
  return res.data?.data || res.data;
};

// ----------------------------------------------------------------------------
// STUDENT / USER ANALYTICS
// ----------------------------------------------------------------------------

export const getUserAnalytics = async (userId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/users/${userId}`);
  return res.data?.data || res.data;
};

export const getUserPerformanceAnalytics = async (userId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/users/${userId}/performance`);
  return res.data?.data || res.data;
};

export const getUserProgressAnalytics = async (userId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/users/${userId}/progress`);
  return res.data?.data || res.data;
};

export const getUserAccuracyAnalytics = async (userId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/users/${userId}/accuracy`);
  return res.data?.data || res.data;
};

export const getUserAttemptsAnalytics = async (userId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/users/${userId}/attempts`);
  return res.data?.data || res.data;
};

export const getUserTimeSpentAnalytics = async (userId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/users/${userId}/time-spent`);
  return res.data?.data || res.data;
};

export const getUserStrengthsAnalytics = async (userId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/users/${userId}/strengths`);
  return res.data?.data || res.data;
};

export const getUserWeaknessesAnalytics = async (userId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/users/${userId}/weaknesses`);
  return res.data?.data || res.data;
};

// ----------------------------------------------------------------------------
// QUESTION ANALYTICS
// ----------------------------------------------------------------------------

export const getQuestionAnalytics = async (questionId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/questions/${questionId}`);
  return res.data?.data || res.data;
};

export const getQuestionAccuracyAnalytics = async (questionId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/questions/${questionId}/accuracy`);
  return res.data?.data || res.data;
};

export const getQuestionDifficultyAnalytics = async (questionId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/questions/${questionId}/difficulty`);
  return res.data?.data || res.data;
};

export const getQuestionResponsesAnalytics = async (questionId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/questions/${questionId}/responses`);
  return res.data?.data || res.data;
};

export const getQuestionDiscriminationAnalytics = async (questionId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/questions/${questionId}/discrimination`);
  return res.data?.data || res.data;
};
