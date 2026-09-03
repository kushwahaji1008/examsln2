import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ChevronRight, CheckCircle2, XCircle, Loader2, AlertCircle, Award } from 'lucide-react';
import apiClient from '@/services/api/client';

export default function Results() {
  const navigate = useNavigate();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClient.get('/api/v1/attempts');
        if (isMounted) {
          setResults(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load test results.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8 font-sans text-slate-100 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground">My Results</h1>
        <p className="mt-2 text-sm text-slate-400">Review your past performance and analytical breakdowns.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-sky-400">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
          <Award className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <h3 className="text-lg font-bold text-primary-foreground mb-1">No exam results yet</h3>
          <p className="text-sm text-slate-500">Take an exam to view your score breakdown and performance analytics here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {results.map((result) => {
            const score = result.score ?? 0;
            const isPassing = score >= (result.passingScore ?? 50);
            const dateStr = result.submittedAt || result.createdAt 
              ? new Date(result.submittedAt || result.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'Completed';

            return (
              <div 
                key={result.id} 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-2xl border border-border/10 bg-slate-900/80 p-5 backdrop-blur-xl transition hover:bg-slate-800/80 shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${
                    isPassing ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {isPassing ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary-foreground">{result.examTitle || 'Course Exam Attempt'}</h3>
                    <p className="text-sm text-slate-400 mt-1">Submitted on {dateStr}</p>
                  </div>
                </div>

                <div className="flex w-full sm:w-auto items-center justify-between gap-8 border-t border-border/5 sm:border-0 pt-4 sm:pt-0">
                  <div className="text-center">
                    <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Score</div>
                    <div className={`text-xl font-bold ${isPassing ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {score}%
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/attempts/${result.id}`)}
                    className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-sky-500 px-5 py-2.5 text-sm font-semibold text-primary-foreground transition shadow-md"
                  >
                    <BarChart3 className="h-4 w-4" /> Review Breakdown <ChevronRight className="h-4 w-4 hidden sm:block" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}