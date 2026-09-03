import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { forgotPassword } from './services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await forgotPassword(email);
      setMessage({ type: 'success', text: 'OTP sent! Please check your email to reset your password.' });
      // Redirect to Reset Password page after 2 seconds, passing the email via state
      setTimeout(() => navigate('/reset-password', { state: { email } }), 2500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to send OTP.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900/90 border border-border/10 p-8 shadow-2xl backdrop-blur-xl">
        
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-sky-400 transition mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>

        <h2 className="text-3xl font-bold text-primary-foreground tracking-tight mb-2">Forgot Password</h2>
        <p className="text-sm text-slate-400 mb-8">
          Enter your registered email address and we'll send you an OTP to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-11 pr-4 py-3.5 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {message && (
            <div className={`flex items-center gap-2 rounded-xl p-3.5 text-xs font-medium ${
              message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {message.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 py-3.5 px-6 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-sky-400 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Reset OTP</span>}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}