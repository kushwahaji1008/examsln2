import React from 'react';
import { Settings, RefreshCcw } from 'lucide-react';

export default function Maintenance() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Animated Icon */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-sky-500/20 blur-3xl rounded-full w-32 h-32 mx-auto"></div>
          <div className="relative bg-slate-900 border border-border/10 p-6 rounded-3xl shadow-2xl shadow-sky-500/10">
            <Settings className="w-16 h-16 text-sky-400 animate-[spin_4s_linear_infinite]" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold text-primary-foreground tracking-tight">System Update</h1>
          <p className="text-slate-400 leading-relaxed">
            ExamSolution is currently undergoing scheduled maintenance to improve performance and security. We'll be back online shortly.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-2 text-sm font-medium text-amber-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          Estimated downtime: ~15 minutes
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={handleRefresh}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
          >
            <RefreshCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
        
      </div>
    </div>
  );
}