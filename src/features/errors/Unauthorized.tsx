import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Icon & Badge */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full w-32 h-32 mx-auto"></div>
          <div className="relative bg-slate-900 border border-border/10 p-6 rounded-full shadow-2xl">
            <ShieldAlert className="w-16 h-16 text-rose-500" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold text-primary-foreground tracking-tight">Access Denied</h1>
          <p className="text-slate-400">
            You do not have the required security clearance to view this page. If you believe this is a mistake, contact your administrator.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-border/10 px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
          >
            <Home className="w-4 h-4" /> Dashboard
          </button>
        </div>
        
      </div>
    </div>
  );
}