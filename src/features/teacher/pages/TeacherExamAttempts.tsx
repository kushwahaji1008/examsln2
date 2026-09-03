import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Loader2, ArrowLeft, AlertCircle, Play, Square, RefreshCcw, 
  Clock, ShieldAlert, CheckCircle2, XCircle
} from 'lucide-react';
import { 
  getExamAttempts, 
  forceSubmitAttempt, 
  terminateAttempt, 
  grantExtraTime,
  reopenAttempt
} from '@/services/api/attemptsApi';
import { getExam } from '@/services/api/examsApi';
import type { ExamAttempt, Exam } from '@/services/api/types/api';

export default function TeacherExamAttempts() {
  const { examId } = useParams();
  const [exam, setExam] = useState<Exam | null>(null);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!examId) return;
    fetchData();
  }, [examId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [examData, attemptsData] = await Promise.all([
        getExam(examId!),
        getExamAttempts(examId!)
      ]);
      setExam(examData);
      setAttempts(attemptsData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch attempts.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = async (attemptId: string, actionName: string, actionFn: () => Promise<any>) => {
    if (!window.confirm(`Are you sure you want to ${actionName} this attempt?`)) return;
    setActionLoading(attemptId);
    try {
      await actionFn();
      showToast(`Successfully performed: ${actionName}`);
      await fetchData(); // refresh list
    } catch (err: any) {
      setError(err.message || `Failed to ${actionName}`);
    } finally {
      setActionLoading(null);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds && seconds !== 0) return 'N/A';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold">Exam Not Found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8 font-sans pb-24">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-50 text-emerald-700 font-semibold text-sm px-4 py-3 rounded-2xl border border-emerald-200 shadow-xl animate-in fade-in slide-in-from-bottom-4">
          <span>{toast}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <Link to={`/teacher/exams/${examId}`} className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Exam Details
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Attempts: {exam.title}</h1>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Manage student sessions, force submit exams, and grant extra time.</p>
        </div>
        <button 
          onClick={fetchData}
          className="px-4 py-2 bg-secondary text-foreground rounded-xl text-sm font-semibold hover:bg-secondary/80 flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Attempts List */}
      <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
        {attempts.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-bold">No Attempts Yet</h3>
            <p className="text-sm mt-1">Students have not started this exam.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/30 text-xs uppercase font-bold text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">Student / ID</th>
                  <th className="px-6 py-4 whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 whitespace-nowrap">Time Left</th>
                  <th className="px-6 py-4 whitespace-nowrap">Score</th>
                  <th className="px-6 py-4 whitespace-nowrap">Started At</th>
                  <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {attempts.map((attempt) => {
                  const attId = attempt.attemptId;
                  const isActive = attempt.status === 'Started' || attempt.status === 'InProgress' || attempt.status === 'Paused';
                  const isSubmitted = attempt.status === 'Submitted' || attempt.status === 'ForceSubmitted';
                  
                  return (
                    <tr key={attId} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{attempt.userId}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">{attId.substring(0,8)}...</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${
                          isActive ? 'bg-blue-500/10 text-blue-500' : 
                          isSubmitted ? 'bg-emerald-500/10 text-emerald-500' :
                          'bg-rose-500/10 text-rose-500'
                        }`}>
                          {isActive && <Play className="w-3 h-3 fill-current" />}
                          {isSubmitted && <CheckCircle2 className="w-3 h-3" />}
                          {(attempt.status === 'Terminated' || attempt.status === 'Invalidated') && <XCircle className="w-3 h-3" />}
                          {attempt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-muted-foreground">
                        {formatTime(attempt.remainingSeconds)}
                      </td>
                      <td className="px-6 py-4 font-bold text-foreground">
                        {attempt.totalMarksScored !== undefined ? `${attempt.totalMarksScored} / ${attempt.totalMarksPossible || '-'}` : 'Pending'}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {new Date(attempt.startedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {actionLoading === attId ? (
                          <span className="inline-flex items-center text-primary text-xs font-bold">
                            <Loader2 className="w-4 h-4 animate-spin mr-1" /> Processing...
                          </span>
                        ) : (
                          <>
                            {isActive && (
                              <>
                                <button 
                                  onClick={() => handleAction(attId, 'Add 15 Mins', () => grantExtraTime(attId, { additionalMinutes: 15, reason: 'Teacher granted' }))}
                                  className="px-3 py-1.5 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 text-xs font-bold rounded-lg transition-colors"
                                >
                                  +15m
                                </button>
                                <button 
                                  onClick={() => handleAction(attId, 'Force Submit', () => forceSubmitAttempt(attId))}
                                  className="px-3 py-1.5 bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 text-xs font-bold rounded-lg transition-colors"
                                >
                                  Submit
                                </button>
                                <button 
                                  onClick={() => handleAction(attId, 'Terminate', () => terminateAttempt(attId))}
                                  className="px-3 py-1.5 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 text-xs font-bold rounded-lg transition-colors"
                                >
                                  <ShieldAlert className="w-3.5 h-3.5 inline mr-1"/>
                                  End
                                </button>
                              </>
                            )}
                            {isSubmitted && (
                              <button 
                                onClick={() => handleAction(attId, 'Reopen', () => reopenAttempt(attId))}
                                className="px-3 py-1.5 bg-secondary text-foreground hover:bg-secondary/80 text-xs font-bold rounded-lg transition-colors"
                              >
                                Reopen
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
