import apiClient from './client';
import type {
  VideoClassesCourse,
  Lesson,
  LiveClass,
  Chapter,
  ProgressUpdate,
  AddNoteRequest,
  AddBookmarkRequest,
  AddCommentRequest,
  EndLiveClassRequest,
  RateCourseRequest,
} from './types/api';

// ============================================================================
// VIDEO CLASSES & LIVE SESSIONS SERVICE (/api/v1/videos)
// ============================================================================

export interface VideoCourseQueryParams {
  status?: string | number;
  category?: string | number;
  query?: string;
}

export const getVideoCourses = async (params?: VideoCourseQueryParams): Promise<VideoClassesCourse[]> => {
  const res = await apiClient.get('/api/v1/videos/courses', { params });
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const createVideoCourse = async (payload: Partial<VideoClassesCourse>): Promise<VideoClassesCourse> => {
  const res = await apiClient.post<VideoClassesCourse>('/api/v1/videos/courses', payload);
  return res.data?.data || res.data;
};

export const getVideoCourseById = async (courseId: string): Promise<VideoClassesCourse> => {
  const res = await apiClient.get<VideoClassesCourse>(`/api/v1/videos/courses/${courseId}`);
  return res.data?.data || res.data;
};

export const updateVideoCourse = async (courseId: string, payload: Partial<VideoClassesCourse>): Promise<VideoClassesCourse> => {
  const res = await apiClient.put<VideoClassesCourse>(`/api/v1/videos/courses/${courseId}`, payload);
  return res.data?.data || res.data;
};

export const deleteVideoCourse = async (courseId: string): Promise<any> => {
  const res = await apiClient.delete(`/api/v1/videos/courses/${courseId}`);
  return res.data;
};

export const publishVideoCourse = async (courseId: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/videos/courses/${courseId}/publish`);
  return res.data?.data || res.data;
};

export const enrollInVideoCourse = async (courseId: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/videos/courses/${courseId}/enroll`);
  return res.data?.data || res.data;
};

export const getVideoCourseChapters = async (courseId: string): Promise<Chapter[]> => {
  const res = await apiClient.get(`/api/v1/videos/courses/${courseId}/chapters`);
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const createVideoCourseChapter = async (courseId: string, payload: Partial<Chapter>): Promise<Chapter> => {
  const res = await apiClient.post(`/api/v1/videos/courses/${courseId}/chapters`, payload);
  return res.data?.data || res.data;
};

export const searchVideoCourses = async (query: string): Promise<VideoClassesCourse[]> => {
  const res = await apiClient.get('/api/v1/videos/courses/search', { params: { query } });
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const checkVideoCoursesHealth = async (): Promise<any> => {
  const res = await apiClient.get('/api/v1/videos/courses/health');
  return res.data;
};

// ----------------------------------------------------------------------------
// LESSONS
// ----------------------------------------------------------------------------

export const createLesson = async (payload: Lesson): Promise<Lesson> => {
  const res = await apiClient.post('/api/v1/videos/lessons', payload);
  return res.data?.data || res.data;
};

export const getLessonById = async (lessonId: string): Promise<Lesson> => {
  const res = await apiClient.get(`/api/v1/videos/lessons/${lessonId}`);
  return res.data?.data || res.data;
};

export const updateLessonProgress = async (lessonId: string, payload: ProgressUpdate): Promise<any> => {
  const res = await apiClient.post(`/api/v1/videos/lessons/${lessonId}/progress`, payload);
  return res.data;
};

export const addLessonNote = async (lessonId: string, payload: AddNoteRequest): Promise<any> => {
  const res = await apiClient.post(`/api/v1/videos/lessons/${lessonId}/notes`, payload);
  return res.data;
};

export const addLessonBookmark = async (lessonId: string, payload: AddBookmarkRequest): Promise<any> => {
  const res = await apiClient.post(`/api/v1/videos/lessons/${lessonId}/bookmarks`, payload);
  return res.data;
};

export const getLessonComments = async (lessonId: string): Promise<any[]> => {
  const res = await apiClient.get(`/api/v1/videos/lessons/${lessonId}/comments`);
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const addLessonComment = async (lessonId: string, payload: AddCommentRequest): Promise<any> => {
  const res = await apiClient.post(`/api/v1/videos/lessons/${lessonId}/comments`, payload);
  return res.data;
};

// ----------------------------------------------------------------------------
// LIVE CLASSES
// ----------------------------------------------------------------------------

export const createLiveClass = async (payload: LiveClass): Promise<LiveClass> => {
  const res = await apiClient.post('/api/v1/videos/live', payload);
  return res.data?.data || res.data;
};

export const getLiveClassById = async (liveClassId: string): Promise<LiveClass> => {
  const res = await apiClient.get(`/api/v1/videos/live/${liveClassId}`);
  return res.data?.data || res.data;
};

export const getUpcomingLiveClasses = async (): Promise<LiveClass[]> => {
  const res = await apiClient.get('/api/v1/videos/live/upcoming');
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const getActiveLiveClasses = async (): Promise<LiveClass[]> => {
  const res = await apiClient.get('/api/v1/videos/live/active');
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const startLiveClass = async (liveClassId: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/videos/live/${liveClassId}/start`);
  return res.data;
};

export const endLiveClass = async (liveClassId: string, payload?: EndLiveClassRequest): Promise<any> => {
  const res = await apiClient.post(`/api/v1/videos/live/${liveClassId}/end`, payload || {});
  return res.data;
};

export const joinLiveClass = async (liveClassId: string): Promise<any> => {
  const res = await apiClient.post(`/api/v1/videos/live/${liveClassId}/join`);
  return res.data;
};

// ----------------------------------------------------------------------------
// PROGRESS & RATINGS
// ----------------------------------------------------------------------------

export const getMyCoursesProgress = async (): Promise<any[]> => {
  const res = await apiClient.get('/api/v1/videos/progress/my-courses');
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const getCourseProgress = async (courseId: string): Promise<any> => {
  const res = await apiClient.get(`/api/v1/videos/progress/course/${courseId}`);
  return res.data?.data || res.data;
};

export const rateCourse = async (courseId: string, payload: RateCourseRequest): Promise<any> => {
  const res = await apiClient.post(`/api/v1/videos/progress/course/${courseId}/rate`, payload);
  return res.data;
};
