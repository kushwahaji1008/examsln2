import React from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Eye, Search } from 'lucide-react';

export default function MyAttempts() {
  const navigate = useNavigate();

  const attempts = [
    { id: 'a1', examTitle: 'System Architecture Midterm', date: '2026-08-01', score: 85, status: 'Graded', duration: '84m 12s' },
    { id: 'a2', examTitle: 'React Hooks Quiz', date: '2026-07-28', score: 92, status: 'Graded', duration: '15m 00s' },
    { id: 'a3', examTitle: 'Data Structures Final', date: '2026-07-20', status: 'Pending Review', duration: '120m 00s' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8 font-sans text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground flex items-center gap-3">
            <History className="h-8 w-8 text-sky-500" />
            Attempt History
          </h1>
          <p className="mt-2 text-sm text-slate-400">A complete log of all your submitted assessments.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search attempts..." 
            className="w-full sm:w-64 rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2 text-sm text-primary-foreground outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-border/10 bg-slate-900/80 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-xs uppercase text-slate-500 border-b border-border/5">
              <tr>
                <th className="px-6 py-4 font-semibold">Assessment</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Time Taken</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Score</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/5">
              {attempts.map((attempt) => (
                <tr key={attempt.attemptId} className="hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4 font-bold text-primary-foreground">{attempt.examTitle}</td>
                  <td className="px-6 py-4">{attempt.date}</td>
                  <td className="px-6 py-4">{attempt.duration}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                      attempt.status === 'Graded' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {attempt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-primary-foreground">
                    {attempt.score !== undefined ? `${attempt.score}%` : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => navigate(`/student/results/${attempt.attemptId}`)}
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-sky-500 hover:text-primary-foreground transition"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}