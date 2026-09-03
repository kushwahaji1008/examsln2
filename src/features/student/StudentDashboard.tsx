import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, PlayCircle, BookOpen, Layers, CheckCircle2, Clock, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useStudentDashboard } from './useStudentDashboard';
import { getWalletBalance } from '@/services/api/walletApi';
import { Link, useNavigate } from 'react-router-dom';

// Component Imports
import ContinueLearning from './components/ContinueLearning';
import StatsCards from './components/StatsCards';
import RecentActivity from './components/RecentActivity';
import RecommendedCourses from './components/RecommendedCourses';
import ScheduleCard from './components/ScheduleCard';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: dashboardData, isLoading, error } = useStudentDashboard();
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    getWalletBalance().then(setWalletBalance).catch(() => {});
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const greeting = 'Welcome back';
  const firstName = user?.fullName?.split(' ')[0] || 'Student';

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8 font-sans text-foreground pb-16">
      
      {/* Top: Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {greeting}, {firstName}.
          </h1>
          <p className="mt-2 text-muted-foreground italic font-medium">
            "The beautiful thing about learning is that no one can take it away from you."
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-600 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Row 1: Continue Learning card and Stats */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ContinueLearning course={dashboardData?.activeCourse} />
        </div>
        <div className="lg:col-span-4">
          <StatsCards
            walletBalance={walletBalance}
            totalEnrolled={dashboardData?.stats.activeCourses ?? 0}
            unreadNotifications={3}
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: My Courses with Progress */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Enrolled Courses</h2>
            <Link to="/student/courses?tab=enrolled" className="text-sm font-semibold text-primary hover:underline">
              View All
            </Link>
          </div>
          
          {dashboardData?.enrolledCourses && dashboardData.enrolledCourses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {dashboardData.enrolledCourses.slice(0, 4).map((course: any) => {
                const progress = course.progressPercentage || 0;
                
                return (
                  <div key={course.courseId || course.id} className="flex flex-col h-full rounded-2xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-md">
                    <div className="relative h-32 w-full bg-secondary flex-shrink-0">
                      <img
                        src={course.thumbnailUrl || "/IMG-20260825-WA6378.jpg"}
                        alt={course.courseTitle || course.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/IMG-20260825-WA6378.jpg";
                        }}
                      />
                      {progress === 100 && (
                        <div className="absolute top-3 right-3">
                           <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 shadow-sm flex items-center gap-1 border border-emerald-100">
                             <CheckCircle2 className="w-3 h-3" /> Completed
                           </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-bold text-base text-foreground line-clamp-2 leading-snug">
                          {course.courseTitle || course.title}
                        </h3>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`} 
                            style={{ width: `${progress}%` }} 
                          />
                        </div>
                      </div>

                      <Link
                        to={`/student/courses/${course.courseId || course.id}`}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-sm transition-colors"
                      >
                        <PlayCircle className="w-4 h-4" /> 
                        {progress === 0 ? 'Start Course' : progress === 100 ? 'Review Course' : 'Continue'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-3xl border border-dashed border-border bg-card text-center">
              <p className="text-muted-foreground">You are not enrolled in any courses yet.</p>
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Exam Schedules */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Upcoming Exams</h2>
            <Link to="/student/exams" className="text-sm font-semibold text-primary hover:underline">
              View Schedule
            </Link>
          </div>
          
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm h-[calc(100%-2rem)]">
            {(!dashboardData?.upcomingExams || dashboardData.upcomingExams.length === 0) ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-500/50 mb-3" />
                <p className="text-sm font-semibold text-foreground">You're all caught up!</p>
                <p className="text-xs text-muted-foreground mt-1">No pending exams scheduled.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.upcomingExams.map((exam: any) => (
                  <div 
                    key={exam.id || exam.examId}
                    className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-secondary/50 p-4 transition-all hover:shadow-sm hover:border-primary/50"
                  >
                    <div>
                      <h3 className="font-semibold text-foreground line-clamp-1">{exam.title}</h3>
                      <div className="mt-2 flex flex-col gap-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          <span className="font-medium text-foreground">
                            {new Date(exam.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {new Date(exam.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} • {exam.duration} mins
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/student/exams/${exam.id || exam.examId}`)}
                      className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-background border border-border py-2 text-sm font-semibold text-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary"
                    >
                      <span>View Exam Details</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Recent PDFs and Recommended Videos */}
      <div className="grid gap-6 lg:grid-cols-12 border-t border-border pt-8">
        <div className="lg:col-span-4">
          <RecentActivity activities={dashboardData?.recentActivity} />
        </div>
        <div className="lg:col-span-8">
          <RecommendedCourses courses={dashboardData?.recommended} />
        </div>
      </div>

    </div>
  );
}
