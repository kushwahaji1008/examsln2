import apiClient from './client';
import type { 
  Course, CreateCourseRequest, CourseOverviewDto, StudentDashboardCourseDto, CourseAccessDto, CourseStatsDto
} from './types/api';

// ==========================================
// 1. CORE CRUD & LIFECYCLE
// ==========================================

export const getAllCourses = async (): Promise<Course[]> => {
  const res = await apiClient.get<Course[]>('/api/v1/courses');
  return res.data;
};

export const createCourse = async (request: CreateCourseRequest): Promise<Course> => {
  const res = await apiClient.post<Course>('/api/v1/courses', request);
  return res.data;
};

export const getCourseById = async (courseId: string): Promise<Course | null> => {
  try {
    const res = await apiClient.get<Course>(`/api/v1/courses/${courseId}`);
    return res.data;
  } catch (error: any) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
};

export const updateCourse = async (courseId: string, request: Partial<Course>): Promise<{ message: string }> => {
  const res = await apiClient.patch<{ message: string }>(`/api/v1/courses/${courseId}`, request);
  return res.data;
};

export const deleteCourse = async (courseId: string): Promise<{ message: string }> => {
  const res = await apiClient.delete<{ message: string }>(`/api/v1/courses/${courseId}`);
  return res.data;
};

export const publishCourse = async (courseId: string): Promise<{ message: string }> => {
  const res = await apiClient.post<{ message: string }>(`/api/v1/courses/${courseId}/publish`);
  return res.data;
};

export const unpublishCourse = async (courseId: string): Promise<{ message: string }> => {
  const res = await apiClient.post<{ message: string }>(`/api/v1/courses/${courseId}/unpublish`);
  return res.data;
};

// ==========================================
// 2. DISCOVERY (Public)
// ==========================================

export const getFeaturedCourses = async (): Promise<Course[]> => {
  const res = await apiClient.get<{ courses: Course[] }>('/api/v1/courses/featured');
  return res.data.courses;
};

export const getPopularCourses = async (): Promise<Course[]> => {
  const res = await apiClient.get<{ courses: Course[] }>('/api/v1/courses/popular');
  return res.data.courses;
};

export const getRecommendedCourses = async (): Promise<Course[]> => {
  const res = await apiClient.get<{ courses: Course[] }>('/api/v1/courses/recommended');
  return res.data.courses;
};

export const searchCourses = async (query: string): Promise<{ results: Course[]; query: string }> => {
  const res = await apiClient.get<{ results: Course[]; query: string }>(`/api/v1/courses/search?query=${encodeURIComponent(query)}`);
  return res.data;
};

// ==========================================
// 3. STUDENT PORTAL
// ==========================================

export const getCourseOverview = async (courseId: string): Promise<any> => {
  const res = await apiClient.get<any>(`/api/v1/courses/${courseId}/overview`);
  return res.data;
};

export const getStudentDashboard = async (courseId: string): Promise<any> => {
  const res = await apiClient.get<any>(`/api/v1/courses/${courseId}/dashboard`);
  return res.data;
};

export const checkCourseAccess = async (courseId: string): Promise<any> => {
  const res = await apiClient.get<any>(`/api/v1/courses/${courseId}/access`);
  return res.data;
};

// ==========================================
// 4. ADMIN & ANALYTICS
// ==========================================

export const getCourseStats = async (courseId: string): Promise<any> => {
  const res = await apiClient.get<any>(`/api/v1/courses/${courseId}/stats`);
  return res.data;
};

export const createCurriculumItem = async (courseId: string, sectionId: string, payload: any): Promise<any> => {
  const res = await apiClient.post(`/api/v1/courses/${courseId}/sections/${sectionId}/items`, payload);
  return res.data;
};
export const deleteCurriculumItem = async (courseId: string, sectionId: string, itemId: string): Promise<any> => {
  const res = await apiClient.delete(`/api/v1/courses/${courseId}/sections/${sectionId}/items/${itemId}`);
  return res.data;
};
