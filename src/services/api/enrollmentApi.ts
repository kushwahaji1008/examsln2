import apiClient from './client';
import type { Course } from './types/api';

export const getMyEnrolledCourses = async (): Promise<Course[]> => {
  const res = await apiClient.get<Course[]>('/v1/Enrollment/my-courses');
  return res.data?.data || res.data;
};
