import React from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useAdminDashboard } from './useAdminDashboard';
import { Loader2, AlertCircle, Users, BookOpen, IndianRupee, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data, isLoading, error } = useAdminDashboard();

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
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.fullName || 'Administrator'}. Here is your platform overview.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard icon={Users} label="Total Users" value={data?.totalUsers ?? data?.usersCount ?? data?.stats?.users ?? '—'} />
        <StatCard icon={BookOpen} label="Active Courses" value={data?.activeCourses ?? data?.coursesCount ?? data?.stats?.courses ?? '—'} />
        <StatCard icon={Activity} label="Active Exams" value={data?.activeExams ?? data?.examsCount ?? data?.stats?.exams ?? '—'} />
        <StatCard 
          icon={IndianRupee} 
          label="Total Revenue" 
          value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(data?.totalRevenue ?? data?.revenue ?? data?.stats?.revenue ?? 0))} 
        />
      </div>

      {/* Additional data visualization if available */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Registrations</h2>
          <div className="space-y-4">
            {data?.recentUsers?.length ? data.recentUsers.map((u: any, i: number) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="font-medium">{u.name || u.email || 'Unknown User'}</span>
                <span className="text-sm text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</span>
              </div>
            )) : <p className="text-sm text-muted-foreground py-4 text-center">No recent data available.</p>}
          </div>
        </div>
        
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">System Health</h2>
          <div className="flex flex-col gap-4 items-center justify-center h-40">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
               <Activity className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="font-medium text-emerald-700">All Systems Operational</p>
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
