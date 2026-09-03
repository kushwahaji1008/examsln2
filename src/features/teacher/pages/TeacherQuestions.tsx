import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Loader2, Plus, Search, Filter, AlertCircle, PlayCircle, Clock, CheckCircle2,
  FileText, Code, CheckSquare, List
} from 'lucide-react';
import { getQuestions } from '@/services/api/questionsApi';
import type { Question } from '@/services/api/types/api';

export default function TeacherQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await getQuestions();
      setQuestions(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch questions.');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: any) => {
    if (type === 'Code' || type === 5) return <Code className="w-4 h-4" />;
    if (type === 'MultipleChoice' || type === 0) return <CheckSquare className="w-4 h-4" />;
    if (type === 'MultipleResponse' || type === 1) return <List className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const getStatusBadge = (status: any) => {
    const s = String(status).toLowerCase();
    if (s === 'published' || status === 4) return <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full text-xs font-bold">Published</span>;
    if (s === 'draft' || status === 0) return <span className="bg-slate-500/10 text-slate-500 px-2 py-1 rounded-full text-xs font-bold">Draft</span>;
    if (s === 'in_review' || status === 1) return <span className="bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full text-xs font-bold">In Review</span>;
    return <span className="bg-secondary text-muted-foreground px-2 py-1 rounded-full text-xs font-bold">{status}</span>;
  };

  const filteredQuestions = questions.filter(q => 
    q.questionText?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8 font-sans pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Question Bank</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage your repository of questions, code challenges, and essays.</p>
        </div>
        <Link 
          to="/teacher/questions/new" 
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Question
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search questions by text..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-xl text-sm font-bold hover:bg-secondary/80 transition-colors border border-border">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center p-12 bg-card border border-dashed border-border rounded-3xl">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold">No questions found</h3>
          <p className="text-sm text-muted-foreground mt-2">Get started by creating a new question.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((question) => {
            const qId = question.questionId;
            return (
              <div key={qId} className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-border transition-all flex flex-col relative group">
                <div className="flex items-start justify-between mb-4">
                  {getStatusBadge(question.status)}
                  <span className="text-xs font-bold text-muted-foreground bg-secondary px-2 py-1 rounded-lg flex items-center gap-1.5">
                    {getTypeIcon(question.type)}
                    {question.type === 0 ? 'MCQ' : question.type === 5 ? 'Code' : 'Subjective'}
                  </span>
                </div>
                
                <h3 className="font-bold text-base leading-snug text-foreground mb-4 line-clamp-3">
                  {question.questionText}
                </h3>
                
                <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>Marks: {question.marks}</span>
                  {question.negativeMarks ? (
                    <span className="text-rose-500">Neg: {question.negativeMarks}</span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
