import React from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useTeacherDashboard } from './useTeacherDashboard';
import { Loader2, AlertCircle, BookOpen, Users, Video, Star } from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { data, isLoading, error } = useTeacherDashboard();

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8 font-sans text-foreground pb-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Instructor Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.fullName || 'Instructor'}. Here is how your courses are performing.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard icon={BookOpen} label="My Courses" value={data?.totalCourses ?? data?.coursesCount ?? data?.stats?.courses ?? '—'} />
        <StatCard icon={Users} label="Total Students" value={data?.totalStudents ?? data?.studentsCount ?? data?.stats?.students ?? '—'} />
        <StatCard icon={Video} label="Upcoming Classes" value={data?.upcomingClasses ?? data?.liveSessionsCount ?? data?.stats?.classes ?? '—'} />
        <StatCard icon={Star} label="Average Rating" value={data?.averageRating ?? data?.rating ?? data?.stats?.rating ?? '—'} />
      </div>

      {/* Additional data visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Feedback</h2>
          <div className="space-y-4">
            {data?.recentFeedback?.length ? data.recentFeedback.map((f: any, i: number) => (
              <div key={i} className="flex justify-between items-start py-3 border-b border-border last:border-0">
                <div>
                  <span className="font-medium">{f.courseName || 'Course'}</span>
                  <p className="text-sm text-muted-foreground mt-1">{f.comment || 'No comment provided'}</p>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-semibold">{f.rating}</span>
                </div>
              </div>
            )) : <p className="text-sm text-muted-foreground py-4 text-center">No recent feedback.</p>}
          </div>
        </div>
        
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Active Courses Performance</h2>
          <div className="space-y-4">
            {data?.topCourses?.length ? data.topCourses.map((c: any, i: number) => (
              <div key={i} className="py-2">
                 <div className="flex justify-between text-sm mb-1">
                   <span className="font-medium">{c.title}</span>
                   <span className="text-muted-foreground">{c.students} students</span>
                 </div>
                 <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                   <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (c.students / (data?.totalStudents || 1)) * 100)}%` }} />
                 </div>
              </div>
            )) : <p className="text-sm text-muted-foreground py-4 text-center">No active courses data.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition hover:shadow-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      </div>
    </div>
  );
}
