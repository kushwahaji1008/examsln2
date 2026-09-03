import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, FileText, CheckCircle2, Search, BarChart } from 'lucide-react';
import apiClient from '@/services/api/client';

export default function TeacherResults() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/v1/results');
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch results.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: any) => {
    const s = String(status).toLowerCase();
    if (s === 'published' || status === 2) return <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Published</span>;
    if (s === 'pending' || status === 0) return <span className="bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full text-xs font-bold">Pending Review</span>;
    return <span className="bg-secondary text-muted-foreground px-2 py-1 rounded-full text-xs font-bold">{status}</span>;
  };

  const filtered = results.filter(r => 
    r.examTitle?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8 font-sans pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Results & Grading</h1>
          <p className="mt-2 text-sm text-muted-foreground">Review student exam submissions and publish final grades.</p>
        </div>
        <Link 
          to="/teacher/analytics" 
          className="inline-flex items-center justify-center gap-2 bg-secondary text-foreground px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-secondary/80 transition-all shadow-sm"
        >
          <BarChart className="w-4 h-4" />
          View Overall Analytics
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by student or exam..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center p-12 bg-card border border-dashed border-border rounded-3xl">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold">No results found</h3>
          <p className="text-sm text-muted-foreground mt-2">When students submit exams, their results will appear here for grading.</p>
        </div>
      ) : (
        <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/30 border-b border-border/50 text-muted-foreground">
                <tr>
                  <th className="p-4 font-semibold">Student</th>
                  <th className="p-4 font-semibold">Exam</th>
                  <th className="p-4 font-semibold">Score</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map(result => (
                  <tr key={result.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-semibold text-foreground">{result.userName || 'Student User'}</td>
                    <td className="p-4 text-muted-foreground">{result.examTitle || 'Exam Name'}</td>
                    <td className="p-4 font-bold text-primary">{result.score || 0} / {result.totalMarks || 100}</td>
                    <td className="p-4">{getStatusBadge(result.status)}</td>
                    <td className="p-4 text-right">
                      <Link 
                        to={`/teacher/results/${result.id}`}
                        className="text-primary font-bold hover:underline"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
