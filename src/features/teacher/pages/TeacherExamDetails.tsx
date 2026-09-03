import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Loader2, ArrowLeft, BarChart, Settings, Trash2, 
  Globe, Lock, PlayCircle, Eye, AlertCircle, Copy, Clock, Play
} from 'lucide-react';
import { 
  getExam, 
  publishExam, 
  unpublishExam, 
  deleteExam,
  activateExam,
  deactivateExam,
  archiveExam,
  restoreExam,
  duplicateExam,
  getExamStatistics
} from '@/services/api/examsApi';
import type { Exam } from '@/services/api/types/api';

export default function TeacherExamDetails() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!examId) return;
    Promise.all([
      getExam(examId).catch(() => null),
      getExamStatistics(examId).catch(() => null)
    ]).then(([examData, statsData]) => {
      setExam(examData);
      setStats(statsData);
      setLoading(false);
    });
  }, [examId]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handlePublishToggle = async () => {
    if (!exam || !examId) return;
    setActionLoading(true);
    try {
      if (exam.status === 'Published' || exam.status === 'Active') {
        await unpublishExam(examId);
        setExam({ ...exam, status: 'Draft' });
        showToast('Exam unpublished');
      } else {
        await publishExam(examId);
        setExam({ ...exam, status: 'Published' });
        showToast('Exam published');
      }
    } catch (err) {
      setError('Failed to update exam status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivateToggle = async () => {
    if (!exam || !examId) return;
    setActionLoading(true);
    try {
      if (exam.status === 'Active') {
        await deactivateExam(examId);
        setExam({ ...exam, status: 'Published' });
        showToast('Exam deactivated');
      } else {
        await activateExam(examId);
        setExam({ ...exam, status: 'Active' });
        showToast('Exam activated');
      }
    } catch (err) {
      setError('Failed to update exam activation status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchiveToggle = async () => {
    if (!exam || !examId) return;
    setActionLoading(true);
    try {
      if (exam.status === 'Archived') {
        await restoreExam(examId);
        setExam({ ...exam, status: 'Draft' });
        showToast('Exam restored');
      } else {
        await archiveExam(examId);
        setExam({ ...exam, status: 'Archived' });
        showToast('Exam archived');
      }
    } catch (err) {
      setError('Failed to archive/restore exam.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDuplicate = async () => {
    if (!examId) return;
    setActionLoading(true);
    try {
      const newExam = await duplicateExam(examId, { title: `${exam?.title} (Copy)` });
      navigate(`/teacher/exams/${newExam.id || newExam.examId}`);
      showToast('Exam duplicated');
    } catch (err) {
      setError('Failed to duplicate exam.');
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!examId) return;
    if (!window.confirm("Are you sure you want to delete this exam? This action is irreversible.")) return;
    
    setActionLoading(true);
    try {
      await deleteExam(examId);
      navigate('/teacher/exams', { replace: true });
    } catch (err) {
      setError('Failed to delete exam.');
      setActionLoading(false);
    }
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
        <p className="text-muted-foreground mt-2">The exam you are looking for does not exist or you do not have permission to view it.</p>
        <Link to="/teacher/exams" className="mt-6 text-primary hover:underline font-semibold">Back to Exams</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8 font-sans pb-24">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-50 text-emerald-700 font-semibold text-sm px-4 py-3 rounded-2xl border border-emerald-200 shadow-xl animate-in fade-in slide-in-from-bottom-4">
          <span>{toast}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <Link to="/teacher/exams" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Exams
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{exam.title}</h1>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              exam.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500' : 
              exam.status === 'Active' ? 'bg-blue-500/10 text-blue-500' :
              exam.status === 'Archived' ? 'bg-gray-500/10 text-gray-500' :
              'bg-amber-500/10 text-amber-500'
            }`}>
              {exam.status || 'Draft'}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {exam.status !== 'Archived' && (
            <>
              <button 
                onClick={handlePublishToggle}
                disabled={actionLoading || exam.status === 'Active'}
                className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                  exam.status === 'Published' 
                  ? 'bg-secondary text-foreground hover:bg-secondary/80' 
                  : 'bg-emerald-500 text-emerald-50 hover:bg-emerald-600'
                }`}
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  exam.status === 'Published' ? <><Lock className="w-4 h-4"/> Unpublish</> : <><Globe className="w-4 h-4"/> Publish</>
                )}
              </button>
              
              {exam.status === 'Published' || exam.status === 'Active' ? (
                <button 
                  onClick={handleActivateToggle}
                  disabled={actionLoading}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                    exam.status === 'Active' 
                    ? 'bg-secondary text-foreground hover:bg-secondary/80' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                  }`}
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    exam.status === 'Active' ? <><Clock className="w-4 h-4"/> Deactivate</> : <><Play className="w-4 h-4"/> Activate Now</>
                  )}
                </button>
              ) : null}
            </>
          )}

          <button 
            onClick={handleDuplicate}
            disabled={actionLoading}
            className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all bg-secondary text-foreground hover:bg-secondary/80"
          >
            <Copy className="w-4 h-4" /> Clone
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details & Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Exam Configuration
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</label>
                <div className="mt-1 text-foreground font-medium">{exam.title}</div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</label>
                <div className="mt-1 text-sm text-foreground/80 leading-relaxed">{exam.description || 'No description provided.'}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Duration</label>
                  <div className="mt-1 font-medium flex items-center gap-1"><Clock className="w-4 h-4 text-muted-foreground" /> {exam.durationMinutes} mins</div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</label>
                  <div className="mt-1 font-medium capitalize">{exam.type || 'Standard'}</div>
                </div>
              </div>
            </div>
            
            {/* Action Bar inside details */}
            <div className="mt-8 pt-6 border-t border-border flex gap-3">
              <button disabled className="px-4 py-2 bg-secondary text-foreground text-sm font-semibold rounded-xl opacity-50 cursor-not-allowed">
                Edit Details
              </button>
              <button disabled className="px-4 py-2 bg-secondary text-foreground text-sm font-semibold rounded-xl opacity-50 cursor-not-allowed">
                Manage Questions
              </button>
            </div>
          </div>
          
        </div>

        {/* Right Column: Analytics & Danger Zone */}
        <div className="space-y-8">
          {stats && (
            <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BarChart className="w-5 h-5 text-primary" />
                Performance Stats
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/50">
                  <span className="text-sm text-muted-foreground font-semibold">Total Attempts</span>
                  <span className="font-bold text-foreground">{stats.totalAttempts || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/50">
                  <span className="text-sm text-muted-foreground font-semibold">Average Score</span>
                  <span className="font-bold text-foreground">{stats.averageScore?.toFixed(1) || '0.0'}%</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/50">
                  <span className="text-sm text-muted-foreground font-semibold">Pass Rate</span>
                  <span className="font-bold text-emerald-500">{stats.passRate?.toFixed(1) || '0.0'}%</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Submissions & Attempts
            </h2>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Monitor active sessions, review submitted exams, and manage extra time limits.
            </p>
            <div className="space-y-3">
              <Link 
                to={`/teacher/exams/${examId}/attempts`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
              >
                Manage Attempts
              </Link>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-muted-foreground" />
              Advanced
            </h2>
            <div className="space-y-3">
              <button 
                onClick={handleArchiveToggle}
                disabled={actionLoading}
                className="w-full px-4 py-2 bg-secondary text-foreground text-sm font-semibold rounded-xl hover:bg-secondary/80 transition-colors"
              >
                {exam.status === 'Archived' ? 'Restore Exam' : 'Archive Exam'}
              </button>
            </div>
          </div>

          <div className="bg-destructive/5 border border-destructive/20 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-destructive mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </h2>
            <p className="text-xs text-destructive/80 mb-4 leading-relaxed">
              Once you delete an exam, there is no going back. All attempts and statistics will be permanently erased.
            </p>
            <button 
              onClick={handleDelete}
              disabled={actionLoading}
              className="w-full px-4 py-2.5 bg-destructive text-destructive-foreground text-sm font-semibold rounded-xl hover:bg-destructive/90 transition-colors"
            >
              {actionLoading ? 'Deleting...' : 'Delete Exam'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
