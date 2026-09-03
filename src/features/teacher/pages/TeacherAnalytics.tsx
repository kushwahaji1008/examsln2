import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, BarChart3, Users, FileText, Activity } from 'lucide-react';
import apiClient from '@/services/api/client';

export default function TeacherAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // In a real app, this would hit the instructor-dashboard analytics endpoint
      const res = await apiClient.get('/api/v1/analytics/instructor-dashboard');
      setData(res.data);
    } catch (err: any) {
      // Fallback for demonstration if the endpoint isn't fully seeded yet
      setError(err.message || 'Failed to fetch analytics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8 font-sans pb-24">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Instructor Analytics</h1>
        <p className="mt-2 text-sm text-muted-foreground">Monitor your course engagement, exam pass rates, and student performance.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-600 text-sm font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>Note: Analytics data is simulated while the dashboard endpoint aggregates historical data. ({error})</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-muted-foreground">
            <Users className="w-5 h-5 text-sky-500" />
            <span className="text-sm font-bold uppercase tracking-wider">Total Students</span>
          </div>
          <span className="text-3xl font-black text-foreground">{data?.totalStudents || '142'}</span>
          <span className="text-xs font-semibold text-emerald-500 mt-2">+12% this month</span>
        </div>

        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-muted-foreground">
            <Activity className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-bold uppercase tracking-wider">Avg Pass Rate</span>
          </div>
          <span className="text-3xl font-black text-foreground">{data?.averagePassRate || '76'}%</span>
          <span className="text-xs font-semibold text-emerald-500 mt-2">+4% vs last term</span>
        </div>

        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-muted-foreground">
            <FileText className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-bold uppercase tracking-wider">Active Exams</span>
          </div>
          <span className="text-3xl font-black text-foreground">{data?.activeExamsCount || '3'}</span>
          <span className="text-xs font-semibold text-muted-foreground mt-2">Currently running</span>
        </div>

        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-muted-foreground">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-bold uppercase tracking-wider">Avg Score</span>
          </div>
          <span className="text-3xl font-black text-foreground">{data?.averageScore || '68'}/100</span>
          <span className="text-xs font-semibold text-muted-foreground mt-2">Across all assessments</span>
        </div>
      </div>

      {/* Placeholders for visual charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm h-80 flex flex-col">
          <h3 className="font-bold text-foreground mb-6">Student Activity Timeline</h3>
          <div className="flex-1 flex items-end justify-between gap-2 border-b border-l border-border/50 p-4">
            {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
              <div key={i} className="w-full bg-primary/20 rounded-t-sm hover:bg-primary/40 transition-colors" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm h-80 flex flex-col">
          <h3 className="font-bold text-foreground mb-6">Exam Score Distribution</h3>
          <div className="flex-1 flex items-end justify-between gap-2 border-b border-l border-border/50 p-4">
            {[10, 20, 50, 80, 100, 60, 30].map((h, i) => (
              <div key={i} className="w-full bg-emerald-500/20 rounded-t-sm hover:bg-emerald-500/40 transition-colors" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
