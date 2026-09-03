import { useState, useEffect } from 'react';
import api from '@/services/api/client'; // Your Axios instance

// Define the shape of the data the dashboard expects
export interface DashboardData {
  stats: {
    activeCourses: number;
    completedExams: number;
    averageScore: number;
  };
  activeCourse: any | null;
  enrolledCourses: any[];
  schedule: any[];
  upcomingExams: any[];
  recentActivity: any[];
  recommended: any[];
}

export function useStudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all required data in parallel for maximum performance
        const [
          coursesRes,
          upcomingExamsRes,
          attemptsRes,
          liveClassesRes,
          catalogRes
        ] = await Promise.all([
          api.get('/api/v1/videos/progress/my-courses').catch(() => ({ data: [] })),
          api.get('/api/v1/exams/upcoming').catch(() => ({ data: [] })),
          api.get('/api/v1/attempts').catch(() => ({ data: [] })),
          api.get('/api/v1/videos/live/upcoming').catch(() => ({ data: [] })),
          api.get('/api/v1/videos/courses').catch(() => ({ data: [] })) // For recommendations
        ]);

        if (!isMounted) return;

        // Safely extract data arrays
        const myCourses = coursesRes.data || [];
        const upcomingExams = upcomingExamsRes.data || [];
        const myAttempts = attemptsRes.data || [];
        const upcomingLiveClasses = liveClassesRes.data || [];
        const catalog = catalogRes.data || [];

        // Calculate average score safely
        const validScores = myAttempts.filter((a: any) => a.score !== undefined);
        const avgScore = validScores.length > 0 
          ? Math.round(validScores.reduce((acc: number, curr: any) => acc + curr.score, 0) / validScores.length)
          : 0;

        // Map Backend Data to Frontend UI Models
        const mappedData: DashboardData = {
          stats: {
            activeCourses: myCourses.length,
            completedExams: myAttempts.length,
            averageScore: avgScore,
          },
          // Grab the most recently accessed course
          activeCourse: myCourses.length > 0 ? {
            id: myCourses[0].courseId || myCourses[0].id,
            title: myCourses[0].courseTitle || myCourses[0].title || 'Active Course',
            currentChapter: 'Resume Learning',
            progressPercentage: myCourses[0].progressPercentage || 0,
            timeLeft: 'Continue',
          } : null,
          
          enrolledCourses: myCourses,

          // Map Live Classes to Schedule Format
          schedule: upcomingLiveClasses.slice(0, 3).map((lc: any) => ({
            id: lc.id,
            title: lc.title || 'Live Session',
            type: 'live-class',
            time: new Date(lc.scheduledStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            instructor: lc.instructorName
          })),

          // Map Upcoming Exams
          upcomingExams: upcomingExams.slice(0, 3).map((e: any) => ({
            id: e.id,
            title: e.title,
            date: e.scheduledStartTime,
            duration: e.durationMinutes
          })),

          // Map Attempts to Recent Activity
          recentActivity: myAttempts.slice(0, 4).map((a: any) => ({
            id: a.id,
            title: a.examTitle || 'Exam Attempt',
            type: 'exam',
            timestamp: new Date(a.submittedAt || a.startTime).toLocaleDateString(),
            score: a.score
          })),

          // Pick 3 generic courses for recommendations
          recommended: catalog.slice(0, 3).map((c: any) => ({
            id: c.id,
            title: c.title,
            instructor: c.instructorName || 'Platform Instructor',
            rating: c.averageRating || 4.5,
            students: c.totalStudentsEnrolled || 0,
            thumbnailUrl: c.thumbnailUrl
          }))
        };

        setData(mappedData);
      } catch {
        if (isMounted) setError('Failed to load dashboard data. Please try again later.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
}