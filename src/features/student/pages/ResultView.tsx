import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAttemptById, getAttemptQuestions } from '@/services/api/attemptsApi';
import { Loader2, AlertCircle } from 'lucide-react';
import { ArrowLeft, CheckCircle2, XCircle, Award, Target, Clock, BarChart3, Download, SearchCheck } from 'lucide-react';

export default function ResultView() {
  const { attemptId } = useParams();
  const [activeTab, setActiveTab] = useState<'summary' | 'review' | 'certificate'>('summary');

  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!attemptId) return;
        const [att, qs] = await Promise.all([
          getAttemptById(attemptId),
          getAttemptQuestions(attemptId)
        ]);
        if (isMounted) {
          setAttempt(att);
          setQuestions(qs);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load result.');
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [attemptId]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="flex items-center gap-3 p-6 bg-destructive/10 border border-destructive/20 rounded-3xl text-destructive text-sm">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <span>{error || 'Attempt not found.'}</span>
        </div>
      </div>
    );
  }

  const score = attempt.totalMarksScored != null && attempt.totalMarksPossible != null && attempt.totalMarksPossible > 0
    ? Math.round((attempt.totalMarksScored / attempt.totalMarksPossible) * 100)
    : 0;
  
  const isPassing = attempt.passed || score >= 50; // default pass is 50% if not specified

  const totalCorrect = questions.filter(q => q.isCorrect).length;
  const totalIncorrect = questions.filter(q => !q.isCorrect && q.userAnswerwer).length;
  const unattempted = questions.filter(q => !q.userAnswerwer).length;

  const durationSec = attempt.submittedAt && attempt.startedAt 
    ? Math.floor((new Date(attempt.submittedAt).getTime() - new Date(attempt.startedAt).getTime()) / 1000)
    : 0;
  
  const timeTaken = durationSec > 0 
    ? `${Math.floor(durationSec / 60)}m ${durationSec % 60}s`
    : 'N/A';

  const metrics = [
    { label: 'Total Correct', value: totalCorrect, color: 'text-emerald-500' },
    { label: 'Total Incorrect', value: totalIncorrect, color: 'text-rose-500' },
    { label: 'Unattempted', value: unattempted, color: 'text-amber-500' },
    { label: 'Time Taken', value: timeTaken, color: 'text-sky-500' },
  ];


  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8 font-sans text-foreground pb-12">
      <Link to="/student/results" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Results
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Assessment Results</h1>
          <p className="mt-1 text-sm text-muted-foreground">ID: {attemptId}</p>
        </div>
        <div className="flex bg-secondary p-1 rounded-xl w-full md:w-auto">
          {['summary', 'review', 'certificate'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 md:w-32 py-2 text-sm font-semibold rounded-lg capitalize transition-all ${
                activeTab === tab ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'summary' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          {/* Hero Circular Gauge */}
          <div className="rounded-3xl border border-border bg-card p-12 flex flex-col items-center justify-center shadow-sm">
            <div className="relative w-48 h-48 rounded-full border-[12px] border-secondary flex items-center justify-center mb-6">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="96" cy="96" r="84" fill="none"
                  stroke={isPassing ? '#10b981' : '#f43f5e'}
                  strokeWidth="12"
                  strokeDasharray="527"
                  strokeDashoffset={527 - (527 * score) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="text-center">
                <div className="text-5xl font-black text-foreground">{score}%</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Score</div>
              </div>
            </div>
            
            <div className={`px-6 py-2 rounded-full font-bold text-lg flex items-center gap-2 ${
              isPassing ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
            }`}>
              {isPassing ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
              {isPassing ? 'PASSED' : 'FAILED'}
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((m, idx) => (
              <div key={idx} className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
                <div className={`text-3xl font-black ${m.color} mb-1`}>{m.value}</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{m.label}</div>
              </div>
            ))}
          </div>
          
          {/* Leaderboard Stub */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Leaderboard Ranking</h3>
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</div>
                <span className="font-semibold text-foreground">You (Current User)</span>
              </div>
              <span className="font-bold text-primary">{score}%</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'review' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2"><SearchCheck className="w-5 h-5 text-primary" /> Topic Analysis</h3>
            <p className="text-sm text-muted-foreground">Detailed breakdown of your strengths and weaknesses.</p>
            {/* Stub for Radar Chart */}
            <div className="h-48 mt-6 bg-secondary/30 rounded-xl border border-border flex items-center justify-center text-muted-foreground font-medium text-sm">
              [Radar Chart Visualization: Performance by Topic]
            </div>
          </div>

          <h3 className="text-lg font-bold text-foreground mt-8 mb-4">Question Review</h3>
          {questions.map((q, idx) => (
            <div key={q.id || q.questionId || idx} className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  {q.isCorrect ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-rose-500" />}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-lg mb-4">Q{idx + 1}. {q.questionText || q.text}</h4>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-24 text-muted-foreground font-semibold">Your Answer:</span>
                      <span className={`px-3 py-1 rounded-lg font-medium ${q.isCorrect ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                        {q.userAnswer}
                      </span>
                    </div>
                    {!q.isCorrect && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-24 text-muted-foreground font-semibold">Correct:</span>
                        <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 font-medium">
                          {q.correctAnswer || (q.correctOptions && q.correctOptions.join(', ')) || 'N/A'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-secondary/50 rounded-xl border border-border text-sm text-foreground">
                    <span className="font-bold mb-1 block">Explanation:</span>
                    {q.explanation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'certificate' && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-sm text-center space-y-8 max-w-4xl mx-auto">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
              <Award className="w-10 h-10" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-foreground tracking-tight">Certificate of Achievement</h2>
              <p className="text-muted-foreground text-lg">This is proudly presented to</p>
              <h3 className="text-3xl font-bold text-primary border-b-2 border-primary pb-2 inline-block px-8">Current Student</h3>
              <p className="text-muted-foreground text-lg">for successfully passing the assessment.</p>
            </div>
            
            <div className="flex justify-center gap-4 pt-8">
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition shadow-sm">
                <Download className="w-5 h-5" /> Download PDF
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-secondary text-foreground font-bold border border-border rounded-xl hover:bg-secondary/80 transition">
                Verify Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
