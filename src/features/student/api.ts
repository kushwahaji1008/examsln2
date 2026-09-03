import api from "@/services/api";

export const fetchCourses = async () => {
  const res = await api.get("/api/v1/videos/courses");
  return res.data;
};

export const fetchStudentExams = async () => {
  const res = await api.get("/api/v1/exams/upcoming");
  return res.data;
};

export const fetchMyAttempts = async () => {
  const res = await api.get("/api/v1/attempts/student/my-attempts");
  return res.data;
};
