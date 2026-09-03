import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, PlayCircle, Calendar, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import apiClient from '@/services/api/client';

export default function Exams() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'active' | 'past'>('upcoming');
  const [exams, setExams] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchExamsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [allExamsRes, attemptsRes] = await Promise.all([
          apiClient.get('/api/v1/exams').catch(() => ({ data: [] })),
          apiClient.get('/api/v1/attempts').catch(() => ({ data: [] })),
        ]);

        if (!isMounted) return;

        setExams(Array.isArray(allExamsRes.data) ? allExamsRes.data : []);
        setAttempts(Array.isArray(attemptsRes.data) ? attemptsRes.data : []);
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load exams.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchExamsData();

    return () => {
      isMounted = false;
    };
  }, []);

  const now = new Date();

  // Partition exams based on schedule and completion
  const completedExamIds = new Set(attempts.map(a => a.examId));

  const upcomingList = exams.filter(e => {
    if (completedExamIds.has(e.id)) return false;
    if (!e.scheduledStartTime) return true;
    return new Date(e.scheduledStartTime) > now;
  });

  const activeList = exams.filter(e => {
    if (completedExamIds.has(e.id)) return false;
    if (!e.scheduledStartTime) return true;
    const start = new Date(e.scheduledStartTime);
    const end = e.scheduledEndTime ? new Date(e.scheduledEndTime) : new Date(start.getTime() + (e.durationMinutes || 60) * 60000);
    return start <= now && now <= end;
  });

  const pastList = attempts.map(att => {
    const matchedExam = exams.find(e => e.id === att.examId);
    return {
      id: att.id,
      examId: att.examId,
      title: att.examTitle || matchedExam?.title || 'Completed Exam',
      date: att.submittedAt || att.startTime || new Date().toISOString(),
      duration: matchedExam?.durationMinutes || 60,
      marks: matchedExam?.totalMarks || 100,
      score: att.score ?? 0,
      status: 'past'
    };
  });

  const getDisplayedExams = () => {
    if (activeTab === 'upcoming') {
      return upcomingList.map(e => ({
        id: e.id,
        title: e.title,
        status: 'upcoming',
        date: e.scheduledStartTime || new Date().toISOString(),
        duration: e.durationMinutes || 60,
        marks: e.totalMarks || 100,
      }));
    }
    if (activeTab === 'active') {
      return (activeList.length > 0 ? activeList : exams.filter(e => !completedExamIds.has(e.id))).map(e => ({
        id: e.id,
        title: e.title,
        status: 'active',
        date: e.scheduledStartTime || new Date().toISOString(),
        duration: e.durationMinutes || 60,
        marks: e.totalMarks || 100,
      }));
    }
    return pastList;
  };

  const filteredExams = getDisplayedExams();

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8 font-sans text-slate-100 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground">My Exams</h1>
        <p className="mt-2 text-sm text-slate-400">Manage your upcoming assessments and view past attempt records.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 rounded-2xl bg-slate-900/80 p-1 border border-border/10 w-fit backdrop-blur-xl">
        {(['upcoming', 'active', 'past'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'bg-sky-500 text-primary-foreground shadow-lg shadow-sky-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-sky-400">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        /* Grid List */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExams.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-500 rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-8">
              <FileText className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p className="text-base font-bold text-slate-300">No {activeTab} exams found</p>
              <p className="text-xs text-slate-500 mt-1">Check back later or explore available courses.</p>
            </div>
          ) : (
            filteredExams.map((exam) => (
              <div key={exam.examId} className="flex flex-col justify-between rounded-3xl border border-border/10 bg-slate-900/80 p-6 backdrop-blur-xl transition hover:border-sky-500/30 shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      <FileText className="h-5 w-5" />
                    </div>
                    {exam.status === 'active' && (
                      <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 animate-pulse">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" /> Available Now
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-primary-foreground mb-2 line-clamp-1">{exam.title}</h3>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="h-4 w-4" />
                      {new Date(exam.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock className="h-4 w-4" />
                      {exam.duration} Minutes • {exam.marks} Marks
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border/5">
                  {exam.status === 'active' ? (
                    <button 
                      onClick={() => navigate(`/student/exams/${exam.examId}`)} 
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-500 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-sky-400 shadow-lg shadow-sky-500/20"
                    >
                      <PlayCircle className="h-4 w-4" /> View / Start Exam
                    </button>
                  ) : exam.status === 'upcoming' ? (
                    <button 
                      onClick={() => navigate(`/student/exams/${exam.examId}`)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition border border-border/10"
                    >
                      <Clock className="h-4 w-4 text-sky-400" /> View Schedule
                    </button>
                  ) : (
                    <button 
                      onClick={() => navigate(`/attempts/${exam.examId}`)} 
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 border border-border/5"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" /> View Result ({exam.score}%)
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}