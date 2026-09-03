import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { KeyRound, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { verifyOtp, resendOtp } from './services/authService';
import { useAuth } from '@/app/providers/AuthProvider';

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Retrieve the email passed from the Login or Register page
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // If they somehow navigated here without an email, kick them back to login
  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const data = await verifyOtp({ email, otp });
      
      setMessage({ type: 'success', text: 'Email verified successfully! Logging you in...' });
      
      // Automatically log them in since the backend returned the tokens!
      login(data.user, data.token, data.refreshToken);

      // Route them based on their role
      setTimeout(() => {
        const roleVal = Number(data.user.role);
        const isTeacherDomain = window.location.hostname.startsWith("teacher.");
        if (roleVal === 1 || data.user.role === "Teacher") {
          if (isTeacherDomain) {
            navigate("/teacher", { replace: true });
          } else {
            const targetUrl = window.location.protocol + "//teacher." + window.location.host + "/auth-sync#token=" + data.token + "&refreshToken=" + (data.refreshToken || "");
            window.location.href = targetUrl;
          }
          return;
        } else {
          if (isTeacherDomain) {
            const targetUrl = window.location.protocol + "//" + window.location.host.replace("teacher.", "") + "/auth-sync#token=" + data.token + "&refreshToken=" + (data.refreshToken || "");
            window.location.href = targetUrl;
            return;
          }
        }
        navigate("/student", { replace: true });

      }, 1500);

    } catch (err: any) {
      setMessage({ type: 'error', text: err?.response?.data?.message || 'Invalid or expired OTP.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setMessage(null);
    try {
      await resendOtp(email);
      setMessage({ type: 'success', text: 'A new verification code has been sent to your email.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to resend OTP.' });
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) return null; // Prevents flashing before redirect

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900/90 border border-border/10 p-8 shadow-2xl backdrop-blur-xl">
        
        <h2 className="text-3xl font-bold text-primary-foreground tracking-tight mb-2">Verify Your Email</h2>
        <p className="text-sm text-slate-400 mb-8">
          We sent a 6-digit verification code to <span className="font-semibold text-sky-400">{email}</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">6-Digit Code</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="text" 
                required 
                maxLength={6} 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                placeholder="123456"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-11 pr-4 py-3.5 text-lg text-center tracking-[0.5em] text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono"
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
            disabled={loading || otp.length < 6} 
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 py-3.5 px-6 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-sky-400 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify & Continue</span>}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4 text-sm text-slate-400">
          <p>Didn't receive the code?</p>
          <button 
            onClick={handleResend}
            disabled={resendLoading}
            className="text-sky-400 hover:text-sky-300 font-semibold disabled:opacity-50 flex items-center gap-2"
          >
            {resendLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
}