import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, Clock, CheckCircle2, ChevronLeft, PlayCircle, Loader2, AlertCircle } from 'lucide-react';
import apiClient from '@/services/api/client';
import { startExam } from '@/services/api/attemptsApi';

export default function ExamDetails() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const handleStartExam = async () => {
    try {
      setStarting(true);
      setError(null);
      const attempt = await startExam({ examId: examId! });
      navigate(`/student/attempts/${attempt.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to start exam.');
      setStarting(false);
    }
  };

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClient.get(`/exams/${examId}`);
        setExam(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load exam details.');
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      fetchExam();
    }
  }, [examId]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8 font-sans text-slate-100">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-primary-foreground transition"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Exams
        </button>
        <div className="flex items-center gap-3 p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-400 text-sm">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <span>{error || 'Exam details not found.'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 sm:p-6 lg:p-8 font-sans text-slate-100">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-primary-foreground transition"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Exams
      </button>

      <div className="rounded-3xl border border-border/10 bg-slate-900/80 p-8 backdrop-blur-xl shadow-2xl">
        <div className="mb-8 border-b border-border/10 pb-8">
          <h1 className="text-3xl font-extrabold text-primary-foreground mb-4">{exam.title}</h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-2xl">{exam.description || 'Comprehensive evaluation covering all core course topics and competencies.'}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 mb-10">
          <div className="rounded-2xl bg-slate-950/50 p-5 border border-border/5">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Duration</div>
            <div className="text-2xl font-bold text-primary-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-sky-400" /> {exam.durationMinutes || 60} min
            </div>
          </div>
          <div className="rounded-2xl bg-slate-950/50 p-5 border border-border/5">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Total Marks</div>
            <div className="text-2xl font-bold text-primary-foreground flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" /> {exam.totalMarks || 100}
            </div>
          </div>
          <div className="rounded-2xl bg-slate-950/50 p-5 border border-border/5">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Passing Marks</div>
            <div className="text-2xl font-bold text-primary-foreground">{exam.passingMarks || Math.round((exam.totalMarks || 100) * 0.5)}</div>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <h3 className="text-lg font-bold text-primary-foreground">Instructions & Rules</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-sky-500 shrink-0" />
              Ensure you have a stable internet connection before starting.
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-sky-500 shrink-0" />
              Do not refresh the page or navigate away once the exam begins.
            </li>
            {(exam.proctored || exam.isProctored) && (
              <li className="flex items-start gap-3 text-rose-300 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                This is a proctored exam. Tab switching, screen sharing, and exiting full-screen mode are monitored and will be logged as violations.
              </li>
            )}
          </ul>
        </div>

        <button 
          onClick={handleStartExam}
          disabled={starting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-8 py-4 text-base font-bold text-primary-foreground transition hover:bg-sky-400 shadow-lg shadow-sky-500/25"
        >
          {starting ? <><Loader2 className="w-5 h-5 animate-spin"/> Starting...</> : <><PlayCircle className="h-5 w-5" /> Start Assessment Now</>}
        </button>
      </div>
    </div>
  );
}