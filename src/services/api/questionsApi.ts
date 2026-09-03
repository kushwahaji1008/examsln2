import apiClient from './client';
import type {
  CreateQuestionRequest,
  Question,
  OptionRequest,
  ReviewCommentRequest,
  QuestionCategory,
  Subject,
  Topic,
  Difficulty,
  QuestionTag,
} from './types/api';

// ============================================================================
// QUESTION BANK SERVICE (/api/v1/questions)
// ============================================================================

export interface QuestionQueryParams {
  categoryId?: string;
  difficultyId?: string;
  subjectId?: string;
  topicId?: string;
  search?: string;
}

export const getQuestions = async (params?: QuestionQueryParams): Promise<Question[]> => {
  const res = await apiClient.get('/api/v1/questions', { params });
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const createQuestion = async (payload: CreateQuestionRequest): Promise<Question> => {
  const res = await apiClient.post<Question>('/api/v1/questions', payload);
  return res.data?.data || res.data;
};

export const getQuestionById = async (questionId: string): Promise<Question> => {
  const res = await apiClient.get<Question>(`/api/v1/questions/${questionId}`);
  return res.data?.data || res.data;
};

export const updateQuestion = async (questionId: string, payload: Question): Promise<Question> => {
  const res = await apiClient.put<Question>(`/api/v1/questions/${questionId}`, payload);
  return res.data?.data || res.data;
};

export const patchQuestion = async (questionId: string, payload: Partial<CreateQuestionRequest>): Promise<Question> => {
  const res = await apiClient.patch<Question>(`/api/v1/questions/${questionId}`, payload);
  return res.data?.data || res.data;
};

export const deleteQuestion = async (questionId: string): Promise<{ success: boolean; message?: string }> => {
  const res = await apiClient.delete(`/api/v1/questions/${questionId}`);
  return res.data;
};

export const publishQuestion = async (questionId: string): Promise<Question> => {
  const res = await apiClient.post(`/api/v1/questions/${questionId}/publish`);
  return res.data?.data || res.data;
};

export const unpublishQuestion = async (questionId: string): Promise<Question> => {
  const res = await apiClient.post(`/api/v1/questions/${questionId}/unpublish`);
  return res.data?.data || res.data;
};

export const archiveQuestion = async (questionId: string): Promise<Question> => {
  const res = await apiClient.post(`/api/v1/questions/${questionId}/archive`);
  return res.data?.data || res.data;
};

export const restoreQuestion = async (questionId: string): Promise<Question> => {
  const res = await apiClient.post(`/api/v1/questions/${questionId}/restore`);
  return res.data?.data || res.data;
};

export const duplicateQuestion = async (questionId: string): Promise<Question> => {
  const res = await apiClient.post(`/api/v1/questions/${questionId}/duplicate`);
  return res.data?.data || res.data;
};

// ----------------------------------------------------------------------------
// QUESTION VERSIONS
// ----------------------------------------------------------------------------

export const getQuestionVersions = async (questionId: string): Promise<any[]> => {
  const res = await apiClient.get(`/api/v1/questions/${questionId}/versions`);
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const createQuestionVersion = async (questionId: string, payload: any): Promise<any> => {
  const res = await apiClient.post(`/api/v1/questions/${questionId}/versions`, payload);
  return res.data?.data || res.data;
};

export const getQuestionVersionById = async (questionId: string, versionId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/questions/${questionId}/versions/${versionId}`);
  return res.data?.data || res.data;
};

export const restoreQuestionVersion = async (questionId: string, versionId: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/questions/${questionId}/versions/${versionId}/restore`);
  return res.data?.data || res.data;
};

// ----------------------------------------------------------------------------
// OPTIONS
// ----------------------------------------------------------------------------

export const getQuestionOptions = async (questionId: string): Promise<any[]> => {
  const res = await apiClient.get(`/api/v1/questions/${questionId}/options`);
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const addQuestionOption = async (questionId: string, payload: OptionRequest): Promise<any> => {
  const res = await apiClient.post(`/api/v1/questions/${questionId}/options`, payload);
  return res.data?.data || res.data;
};

export const updateQuestionOption = async (questionId: string, optionId: string, payload: OptionRequest): Promise<any> => {
  const res = await apiClient.put(`/api/v1/questions/${questionId}/options/${optionId}`, payload);
  return res.data?.data || res.data;
};

export const deleteQuestionOption = async (questionId: string, optionId: string): Promise<{ success: boolean }> => {
  const res = await apiClient.delete(`/api/v1/questions/${questionId}/options/${optionId}`);
  return res.data;
};

// ----------------------------------------------------------------------------
// REVIEW WORKFLOW
// ----------------------------------------------------------------------------

export const getReviewQueue = async (): Promise<Question[]> => {
  const res = await apiClient.get('/api/v1/questions/review-queue');
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const submitQuestionForReview = async (questionId: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/questions/${questionId}/submit-review`);
  return res.data?.data || res.data;
};

export const approveQuestion = async (questionId: string, payload?: ReviewCommentRequest): Promise<any> => {
  const res = await apiClient.post(`/api/v1/questions/${questionId}/approve`, payload || {});
  return res.data?.data || res.data;
};

export const rejectQuestion = async (questionId: string, payload?: ReviewCommentRequest): Promise<any> => {
  const res = await apiClient.post(`/api/v1/questions/${questionId}/reject`, payload || {});
  return res.data?.data || res.data;
};

// ----------------------------------------------------------------------------
// BULK & IMPORT/EXPORT
// ----------------------------------------------------------------------------

export const createQuestionsBulk = async (items: string[]): Promise<any> => {
  const res = await apiClient.post('/api/v1/questions/bulk', items);
  return res.data;
};

export const importQuestions = async (payload: any): Promise<any> => {
  const res = await apiClient.post('/api/v1/questions/import', payload);
  return res.data;
};

export const exportQuestions = async (payload: any): Promise<any> => {
  const res = await apiClient.post('/api/v1/questions/export', payload);
  return res.data;
};

export const bulkPublishQuestions = async (questionIds: string[]): Promise<any> => {
  const res = await apiClient.post('/api/v1/questions/bulk-publish', questionIds);
  return res.data;
};

export const bulkArchiveQuestions = async (questionIds: string[]): Promise<any> => {
  const res = await apiClient.post('/api/v1/questions/bulk-archive', questionIds);
  return res.data;
};

export const bulkDeleteQuestions = async (questionIds: string[]): Promise<any> => {
  const res = await apiClient.post('/api/v1/questions/bulk-delete', questionIds);
  return res.data;
};

// ----------------------------------------------------------------------------
// TAXONOMIES (Categories, Subjects, Topics, Difficulties, Tags)
// ----------------------------------------------------------------------------

export const getQuestionCategories = async (): Promise<QuestionCategory[]> => {
  const res = await apiClient.get('/api/v1/question-categories');
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const createQuestionCategory = async (payload: Partial<QuestionCategory>): Promise<QuestionCategory> => {
  const res = await apiClient.post('/api/v1/question-categories', payload);
  return res.data?.data || res.data;
};

export const getQuestionCategoryById = async (categoryId: string): Promise<QuestionCategory> => {
  const res = await apiClient.get(`/api/v1/question-categories/${categoryId}`);
  return res.data?.data || res.data;
};

export const updateQuestionCategory = async (categoryId: string, payload: Partial<QuestionCategory>): Promise<QuestionCategory> => {
  const res = await apiClient.put(`/api/v1/question-categories/${categoryId}`, payload);
  return res.data?.data || res.data;
};

export const deleteQuestionCategory = async (categoryId: string): Promise<any> => {
  const res = await apiClient.delete(`/api/v1/question-categories/${categoryId}`);
  return res.data;
};

export const getSubjects = async (): Promise<Subject[]> => {
  const res = await apiClient.get('/api/v1/subjects');
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const createSubject = async (payload: Partial<Subject>): Promise<Subject> => {
  const res = await apiClient.post('/api/v1/subjects', payload);
  return res.data?.data || res.data;
};

export const getSubjectById = async (subjectId: string): Promise<Subject> => {
  const res = await apiClient.get(`/api/v1/subjects/${subjectId}`);
  return res.data?.data || res.data;
};

export const updateSubject = async (subjectId: string, payload: Partial<Subject>): Promise<Subject> => {
  const res = await apiClient.put(`/api/v1/subjects/${subjectId}`, payload);
  return res.data?.data || res.data;
};

export const deleteSubject = async (subjectId: string): Promise<any> => {
  const res = await apiClient.delete(`/api/v1/subjects/${subjectId}`);
  return res.data;
};

export const getTopics = async (): Promise<Topic[]> => {
  const res = await apiClient.get('/api/v1/topics');
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const createTopic = async (payload: Partial<Topic>): Promise<Topic> => {
  const res = await apiClient.post('/api/v1/topics', payload);
  return res.data?.data || res.data;
};

export const getTopicById = async (topicId: string): Promise<Topic> => {
  const res = await apiClient.get(`/api/v1/topics/${topicId}`);
  return res.data?.data || res.data;
};

export const updateTopic = async (topicId: string, payload: Partial<Topic>): Promise<Topic> => {
  const res = await apiClient.put(`/api/v1/topics/${topicId}`, payload);
  return res.data?.data || res.data;
};

export const deleteTopic = async (topicId: string): Promise<any> => {
  const res = await apiClient.delete(`/api/v1/topics/${topicId}`);
  return res.data;
};

export const getDifficulties = async (): Promise<Difficulty[]> => {
  const res = await apiClient.get('/api/v1/difficulties');
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const createDifficulty = async (payload: Partial<Difficulty>): Promise<Difficulty> => {
  const res = await apiClient.post('/api/v1/difficulties', payload);
  return res.data?.data || res.data;
};

export const updateDifficulty = async (difficultyId: string, payload: Partial<Difficulty>): Promise<Difficulty> => {
  const res = await apiClient.put(`/api/v1/difficulties/${difficultyId}`, payload);
  return res.data?.data || res.data;
};

export const deleteDifficulty = async (difficultyId: string): Promise<any> => {
  const res = await apiClient.delete(`/api/v1/difficulties/${difficultyId}`);
  return res.data;
};

export const getTags = async (): Promise<QuestionTag[]> => {
  const res = await apiClient.get('/api/v1/tags');
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const createTag = async (payload: Partial<QuestionTag>): Promise<QuestionTag> => {
  const res = await apiClient.post('/api/v1/tags', payload);
  return res.data?.data || res.data;
};

export const updateTag = async (tagId: string, payload: Partial<QuestionTag>): Promise<QuestionTag> => {
  const res = await apiClient.put(`/api/v1/tags/${tagId}`, payload);
  return res.data?.data || res.data;
};

export const deleteTag = async (tagId: string): Promise<any> => {
  const res = await apiClient.delete(`/api/v1/tags/${tagId}`);
  return res.data;
};
