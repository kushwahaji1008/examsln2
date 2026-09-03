import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, KeyRound, Loader2, CheckCircle2 } from 'lucide-react';
import { resetPassword } from './services/authService';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Pre-fill email if they came from the Forgot Password screen
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      setMessage({ type: 'error', text: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.' });
      setLoading(false);
      return;
    }

    try {
      await resetPassword({ email, otp, newPassword });
      setMessage({ type: 'success', text: 'Password reset successfully! You can now log in.' });
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to reset password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900/90 border border-border/10 p-8 shadow-2xl backdrop-blur-xl">
        <h2 className="text-3xl font-bold text-primary-foreground tracking-tight mb-2">Create New Password</h2>
        <p className="text-sm text-slate-400 mb-8">Enter the OTP sent to your email and your new secure password.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-11 pr-4 py-3.5 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">6-Digit OTP</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="text" required maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-11 pr-4 py-3.5 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 tracking-widest font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-11 pr-4 py-3.5 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
            {newPassword.length > 0 && (
              <div className="flex gap-1 mt-1.5">
                {[1, 2, 3, 4].map((level) => {
                  let score = 0;
                  if (newPassword.length >= 8) score += 1;
                  if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) score += 1;
                  if (/[0-9]/.test(newPassword)) score += 1;
                  if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;
                  
                  let bg = 'bg-slate-800';
                  if (score >= level) {
                    if (score <= 1) bg = 'bg-rose-500';
                    else if (score === 2) bg = 'bg-amber-400';
                    else if (score === 3) bg = 'bg-emerald-400';
                    else bg = 'bg-emerald-500 text-emerald-100';
                  }
                  return <div key={level} className={`h-1.5 flex-1 rounded-full ${bg} transition-colors duration-300`} />
                })}
              </div>
            )}
            <p className="text-[10px] text-slate-500">Must contain at least 8 characters, one uppercase, one number, and one symbol.</p>
          </div>

          {message && (
            <div className={`flex items-center gap-2 rounded-xl p-3.5 text-xs font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {message.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
              {message.text}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-sky-500 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-sky-400 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Remembered your password? <Link to="/login" className="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-4">Sign in</Link>
        </div>
      </div>
    </div>
  );
}