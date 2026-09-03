import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, AlertCircle, CheckCircle2, XCircle, Award, Save } from 'lucide-react';
import apiClient from '@/services/api/client';

export default function TeacherResultReview() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Grading state overrides
  const [grades, setGrades] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!resultId) return;
    fetchData();
  }, [resultId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/api/v1/results/${resultId}`);
      setResult(res.data);
      
      const breakdown = await apiClient.get(`/api/v1/results/${resultId}/breakdown`);
      setQuestions(Array.isArray(breakdown.data) ? breakdown.data : breakdown.data?.questions || []);
      
      // Initialize grades state
      const initialGrades: Record<string, number> = {};
      const qs = Array.isArray(breakdown.data) ? breakdown.data : breakdown.data?.questions || [];
      qs.forEach((q: any) => {
        initialGrades[q.questionId] = q.awardedMarks || 0;
      });
      setGrades(initialGrades);
    } catch (err: any) {
      setError(err.message || 'Failed to load submission details.');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeUpdate = async (questionId: string) => {
    try {
      setActionLoading(true);
      await apiClient.put(`/api/v1/results/${resultId}/questions/${questionId}/grade`, {
        score: grades[questionId] || 0,
        comments: comments[questionId] || ''
      });
      // Optionally show success toast
    } catch (err: any) {
      alert("Failed to update grade: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!window.confirm("Publish these results to the student?")) return;
    try {
      setActionLoading(true);
      await apiClient.post(`/api/v1/results/${resultId}/publish`);
      navigate('/teacher/results');
    } catch (err: any) {
      alert("Failed to publish: " + err.message);
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  if (!result) {
    return <div className="p-8 text-center"><AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" /><h2 className="text-xl font-bold">Result Not Found</h2></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8 font-sans pb-32">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/teacher/results" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Results
          </Link>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Grade Submission</h1>
          <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
            Reviewing <span className="font-bold text-foreground">{result.userName || 'Student User'}</span>'s attempt for <span className="font-bold text-foreground">{result.examTitle || 'Exam'}</span>
          </p>
        </div>
        <button 
          onClick={handlePublish}
          disabled={actionLoading || result.status === 'Published' || result.status === 2}
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
        >
          {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
          {result.status === 'Published' || result.status === 2 ? 'Already Published' : 'Publish Final Grade'}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Overview Card */}
      <div className="bg-card border border-border/50 rounded-3xl p-6 sm:p-8 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Total Score</p>
          <p className="text-4xl font-black mt-2 text-primary">{result.score || 0} <span className="text-xl text-muted-foreground">/ {result.totalMarks || 100}</span></p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Status</p>
          <p className="text-lg font-bold mt-2">{result.status === 'Published' || result.status === 2 ? <span className="text-emerald-500">Published</span> : <span className="text-amber-500">Pending Review</span>}</p>
        </div>
      </div>

      {/* Answers List */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-foreground">Answers Breakdown</h2>
        {questions.length === 0 ? (
          <p className="text-muted-foreground text-sm">No detailed answers available for this result.</p>
        ) : (
          questions.map((q, idx) => (
            <div key={q.questionId || idx} className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm flex flex-col">
              <div className="p-6 border-b border-border/50 bg-secondary/10">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Question {idx + 1}</span>
                  <span className="bg-secondary px-3 py-1 rounded-full text-xs font-bold">{q.type === 'Subjective' ? 'Subjective' : 'Auto-Graded'}</span>
                </div>
                <p className="text-base font-semibold text-foreground">{q.questionText || 'Question text not loaded.'}</p>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-bold text-muted-foreground mb-2">Student's Answer</p>
                  <div className="p-4 bg-secondary/50 rounded-xl text-sm font-medium">
                    {q.studentAnswer || q.textAnswer || q.codeAnswer || <span className="italic text-muted-foreground">No answer provided</span>}
                  </div>
                  {q.correctAnswer && (
                    <div className="mt-4">
                      <p className="text-sm font-bold text-emerald-600 mb-2">Correct Answer</p>
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-xl text-sm font-medium">
                        {q.correctAnswer}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-background border border-border rounded-2xl p-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-foreground">Awarded Marks</label>
                      <span className="text-xs text-muted-foreground font-semibold">Max: {q.maxMarks || 1}</span>
                    </div>
                    <input 
                      type="number" 
                      min="0" 
                      max={q.maxMarks || 100}
                      step="0.5"
                      value={grades[q.questionId] !== undefined ? grades[q.questionId] : (q.awardedMarks || 0)}
                      onChange={(e) => setGrades({ ...grades, [q.questionId]: parseFloat(e.target.value) })}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-lg font-black text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />

                    <div>
                      <label className="text-sm font-bold text-foreground block mb-2">Feedback Comment</label>
                      <textarea 
                        rows={2}
                        placeholder="Optional feedback for the student..."
                        value={comments[q.questionId] || ''}
                        onChange={(e) => setComments({ ...comments, [q.questionId]: e.target.value })}
                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => handleGradeUpdate(q.questionId)}
                    disabled={actionLoading}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
                  >
                    <Save className="w-4 h-4" /> Save Grade
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
