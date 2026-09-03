import apiClient from './client';
import type {
  Exam,
  CreateExamRequest,
  ExamSettings,
  ExamGrading,
  ExamSection,
  ExamVersionDto,
  ReorderRequest,
  CreateSectionRequest,
  ScheduleRequest,
} from './types/api';

// ============================================================================
// 1. EXAMS CRUD ENDPOINTS (/api/v1/exams)
// ============================================================================

export interface ExamQueryParams {
  search?: string;
  status?: string;
  category?: string;
  courseId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getExams = async (params?: ExamQueryParams): Promise<Exam[]> => {
  const res = await apiClient.get('/api/v1/exams', { params });
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const createExam = async (payload: CreateExamRequest): Promise<Exam> => {
  const res = await apiClient.post<Exam>('/api/v1/exams', payload);
  return res.data?.data || res.data;
};

export const getExam = async (examId: string): Promise<Exam> => {
  const res = await apiClient.get<Exam>(`/api/v1/exams/${examId}`);
  return res.data?.data || res.data;
};

export const updateExam = async (examId: string, payload: Partial<Exam>): Promise<Exam> => {
  const res = await apiClient.put<Exam>(`/api/v1/exams/${examId}`, payload);
  return res.data?.data || res.data;
};

export const patchExam = async (examId: string, payload: Partial<CreateExamRequest>): Promise<Exam> => {
  const res = await apiClient.patch<Exam>(`/api/v1/exams/${examId}`, payload);
  return res.data?.data || res.data;
};

export const deleteExam = async (examId: string): Promise<{ success: boolean; message?: string }> => {
  const res = await apiClient.delete(`/api/v1/exams/${examId}`);
  return res.data;
};

// ============================================================================
// 2. EXAM LIFECYCLE ENDPOINTS (/api/v1/exams/{examId}/...)
// ============================================================================

export const publishExam = async (examId: string): Promise<Exam> => {
  const res = await apiClient.post(`/api/v1/exams/${examId}/publish`);
  return res.data?.data || res.data;
};

export const unpublishExam = async (examId: string): Promise<Exam> => {
  const res = await apiClient.post(`/api/v1/exams/${examId}/unpublish`);
  return res.data?.data || res.data;
};

export const activateExam = async (examId: string): Promise<Exam> => {
  const res = await apiClient.post(`/api/v1/exams/${examId}/activate`);
  return res.data?.data || res.data;
};

export const deactivateExam = async (examId: string): Promise<Exam> => {
  const res = await apiClient.post(`/api/v1/exams/${examId}/deactivate`);
  return res.data?.data || res.data;
};

export const archiveExam = async (examId: string): Promise<Exam> => {
  const res = await apiClient.post(`/api/v1/exams/${examId}/archive`);
  return res.data?.data || res.data;
};

export const restoreExam = async (examId: string): Promise<Exam> => {
  const res = await apiClient.post(`/api/v1/exams/${examId}/restore`);
  return res.data?.data || res.data;
};

export const duplicateExam = async (examId: string, options?: { title?: string }): Promise<Exam> => {
  const res = await apiClient.post(`/api/v1/exams/${examId}/duplicate`, options);
  return res.data?.data || res.data;
};

export const cloneExam = async (examId: string, options?: { newTitle?: string; targetCourseId?: string }): Promise<Exam> => {
  const res = await apiClient.post(`/api/v1/exams/${examId}/clone`, options);
  return res.data?.data || res.data;
};

export const completeExam = async (examId: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/exams/${examId}/complete`);
  return res.data?.data || res.data;
};

export const getUpcomingExams = async (): Promise<Exam[]> => {
  const res = await apiClient.get('/api/v1/exams/upcoming');
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const getActiveExams = async (): Promise<Exam[]> => {
  const res = await apiClient.get('/api/v1/exams/active');
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const checkExamsHealth = async (): Promise<any> => {
  const res = await apiClient.get('/api/v1/exams/health');
  return res.data;
};

// ============================================================================
// 3. EXAM CONFIGURATION & INSTRUCTIONS ENDPOINTS
// ============================================================================

export const getExamSettings = async (examId: string): Promise<ExamSettings> => {
  const res = await apiClient.get<ExamSettings>(`/api/v1/exams/${examId}/settings`);
  return res.data?.data || res.data;
};

export const updateExamSettings = async (examId: string, settings: Partial<ExamSettings>): Promise<ExamSettings> => {
  const res = await apiClient.put<ExamSettings>(`/api/v1/exams/${examId}/settings`, settings);
  return res.data?.data || res.data;
};

export const getExamSchedule = async (examId: string): Promise<ScheduleRequest> => {
  const res = await apiClient.get<ScheduleRequest>(`/api/v1/exams/${examId}/schedule`);
  return res.data?.data || res.data;
};

export const updateExamSchedule = async (examId: string, schedule: ScheduleRequest): Promise<any> => {
  const res = await apiClient.put(`/api/v1/exams/${examId}/schedule`, schedule);
  return res.data?.data || res.data;
};

export const getExamInstructions = async (examId: string): Promise<{ instructionsHtml: string }> => {
  const res = await apiClient.get(`/api/v1/exams/${examId}/instructions`);
  return res.data?.data || res.data;
};

export const updateExamInstructions = async (examId: string, payload: { instructionsHtml: string }): Promise<any> => {
  const res = await apiClient.put(`/api/v1/exams/${examId}/instructions`, payload);
  return res.data?.data || res.data;
};

export const getExamGrading = async (examId: string): Promise<ExamGrading> => {
  const res = await apiClient.get<ExamGrading>(`/api/v1/exams/${examId}/grading`);
  return res.data?.data || res.data;
};

export const updateExamGrading = async (examId: string, grading: Partial<ExamGrading>): Promise<ExamGrading> => {
  const res = await apiClient.put<ExamGrading>(`/api/v1/exams/${examId}/grading`, grading);
  return res.data?.data || res.data;
};

// ============================================================================
// 4. EXAM QUESTIONS ENDPOINTS (/api/v1/exams/{examId}/questions)
// ============================================================================

export const getExamQuestions = async (examId: string): Promise<any[]> => {
  const res = await apiClient.get(`/api/v1/exams/${examId}/questions`);
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const addExamQuestion = async (examId: string, payload: any): Promise<any> => {
  const res = await apiClient.post(`/api/v1/exams/${examId}/questions`, payload);
  return res.data?.data || res.data;
};

export const createExamQuestion = addExamQuestion;

export const updateExamQuestion = async (examId: string, questionId: string, payload: any): Promise<any> => {
  const res = await apiClient.put(`/api/v1/exams/${examId}/questions/${questionId}`, payload);
  return res.data?.data || res.data;
};

export const deleteExamQuestion = async (examId: string, questionId: string): Promise<{ success: boolean }> => {
  const res = await apiClient.delete(`/api/v1/exams/${examId}/questions/${questionId}`);
  return res.data;
};

export const reorderExamQuestions = async (examId: string, questionIds: string[] | ReorderRequest): Promise<any> => {
  const payload = Array.isArray(questionIds) ? { orderedIds: questionIds } : questionIds;
  const res = await apiClient.post(`/api/v1/exams/${examId}/questions/reorder`, payload);
  return res.data?.data || res.data;
};

export const randomizeExamQuestions = async (examId: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/exams/${examId}/questions/randomize`);
  return res.data?.data || res.data;
};

// ============================================================================
// EXAM ANALYTICS CONVENIENCE ENDPOINTS
// ============================================================================

export const getExamStatistics = async (examId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/exams/${examId}`);
  return res.data?.data || res.data;
};

export const getExamPerformance = async (examId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/exams/${examId}/performance`);
  return res.data?.data || res.data;
};

export const getExamCompletion = async (examId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/analytics/exams/${examId}/completion`);
  return res.data?.data || res.data;
};

export const getExamQuestionAnalysis = async (examId: string): Promise<any[]> => {
  const res = await apiClient.get(`/api/v1/analytics/exams/${examId}/questions`);
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

// ============================================================================
// 5. SECTIONS ENDPOINTS (/api/v1/exams/{examId}/sections)
// ============================================================================

export const getExamSections = async (examId: string): Promise<ExamSection[]> => {
  const res = await apiClient.get<ExamSection[]>(`/api/v1/exams/${examId}/sections`);
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const createExamSection = async (examId: string, payload: CreateSectionRequest | Partial<ExamSection>): Promise<ExamSection> => {
  const res = await apiClient.post<ExamSection>(`/api/v1/exams/${examId}/sections`, payload);
  return res.data?.data || res.data;
};

export const getExamSection = async (examId: string, sectionId: string): Promise<ExamSection> => {
  const res = await apiClient.get<ExamSection>(`/api/v1/exams/${examId}/sections/${sectionId}`);
  return res.data?.data || res.data;
};

export const updateExamSection = async (examId: string, sectionId: string, payload: Partial<ExamSection>): Promise<ExamSection> => {
  const res = await apiClient.put<ExamSection>(`/api/v1/exams/${examId}/sections/${sectionId}`, payload);
  return res.data?.data || res.data;
};

export const deleteExamSection = async (examId: string, sectionId: string): Promise<{ success: boolean }> => {
  const res = await apiClient.delete(`/api/v1/exams/${examId}/sections/${sectionId}`);
  return res.data;
};

export const reorderExamSections = async (examId: string, sectionIds: string[] | ReorderRequest): Promise<any> => {
  const payload = Array.isArray(sectionIds) ? { orderedIds: sectionIds } : sectionIds;
  const res = await apiClient.post(`/api/v1/exams/${examId}/sections/reorder`, payload);
  return res.data?.data || res.data;
};

// ============================================================================
// 6. CANDIDATES ENDPOINTS (/api/v1/exams/{examId}/candidates)
// ============================================================================

export const getExamCandidates = async (examId: string): Promise<any[]> => {
  const res = await apiClient.get(`/api/v1/exams/${examId}/candidates`);
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const addExamCandidate = async (examId: string, payload: any): Promise<any> => {
  const res = await apiClient.post(`/api/v1/exams/${examId}/candidates`, payload);
  return res.data?.data || res.data;
};

export const removeExamCandidate = async (examId: string, userId: string): Promise<{ success: boolean }> => {
  const res = await apiClient.delete(`/api/v1/exams/${examId}/candidates/${userId}`);
  return res.data;
};

export const bulkAddExamCandidates = async (examId: string, payload: any): Promise<any> => {
  const res = await apiClient.post(`/api/v1/exams/${examId}/candidates/bulk`, payload);
  return res.data?.data || res.data;
};

export const allowExamCandidate = async (examId: string, userId: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/exams/${examId}/candidates/${userId}/allow`);
  return res.data?.data || res.data;
};

export const blockExamCandidate = async (examId: string, userId: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/exams/${examId}/candidates/${userId}/block`);
  return res.data?.data || res.data;
};

// ============================================================================
// 7. EXAM VERSIONS ENDPOINTS (/api/v1/exams/{examId}/versions)
// ============================================================================

export const getExamVersions = async (examId: string): Promise<ExamVersionDto[]> => {
  const res = await apiClient.get<ExamVersionDto[]>(`/api/v1/exams/${examId}/versions`);
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const createExamVersion = async (examId: string, payload?: any): Promise<any> => {
  const res = await apiClient.post(`/api/v1/exams/${examId}/versions`, payload || {});
  return res.data?.data || res.data;
};

export const getExamVersion = async (examId: string, versionId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/exams/${examId}/versions/${versionId}`);
  return res.data?.data || res.data;
};

export const publishExamVersion = async (examId: string, versionId: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/exams/${examId}/versions/${versionId}/publish`);
  return res.data?.data || res.data;
};

export const restoreExamVersion = async (examId: string, versionId: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/exams/${examId}/versions/${versionId}/restore`);
  return res.data?.data || res.data;
};
