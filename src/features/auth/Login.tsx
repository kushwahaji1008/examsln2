import React, { useState } from 'react';
import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { loginUser } from '@/features/auth/services/authService';
import { challengeMfa, verifyMfaRecoveryCode } from "@/services/api/authApi";


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mfaChallenge, setMfaChallenge] = useState<{ userId: string } | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [recoveryMode, setRecoveryMode] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  // If already authenticated, redirect immediately based on strictly casted role
  if (user) {
    if (from) return <Navigate to={from} replace />;
    
    const roleVal = Number(user.role);
    if (roleVal === 2) return <Navigate to="/admin" replace />;
    if (roleVal === 1) return <Navigate to="/teacher" replace />;
    return <Navigate to="/student" replace />;
  }

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!mfaCode) {
      setError("Please enter your verification code.");
      return;
    }
    setLoading(true);
    try {
      const reqPayload = { userId: mfaChallenge?.userId || "", code: mfaCode };
      const data = recoveryMode ? await verifyMfaRecoveryCode(reqPayload) : await challengeMfa(reqPayload);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      await login(data.user, data.token, data.refreshToken);
      
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
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      
      // 1. CRITICAL FIX: Persist to localStorage immediately so the Dashboard can read it
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // 2. Update the React Context state
      // (If your login function is async, you might need to await it)
      await login(data.user, data.token);

      // 3. STRICT ROUTING: Force it to a Number to guarantee our 0, 1, 2 rule works safely
      const roleVal = Number(data.user.role);
      
      if (roleVal === 1 && data.user.isApproved === false) {
        localStorage.clear();
        setError('Your account is pending admin approval. You will receive an email once your account is activated.');
        return;
      }
      
      if (from) {
        navigate(from, { replace: true });
        return;
      }
      
// Subdomain routing for Teachers vs Students      const isTeacherDomain = window.location.hostname.startsWith('teacher.');      if (roleVal === 1 || data.user.role === 'Teacher') {        if (isTeacherDomain) {          navigate('/teacher', { replace: true });        } else {          const isDev = window.location.hostname === 'localhost' || window.location.hostname.includes('ais-dev');          if (isDev) {            console.warn('In dev/preview environment, subdomain routing is simulated.');            navigate('/teacher', { replace: true });          } else {            const targetUrl = window.location.protocol + '//teacher.' + window.location.host + '/auth-sync#token=' + data.token + '&refreshToken=' + (data.refreshToken || '');            window.location.href = targetUrl;          }        }        return;      } else {        if (isTeacherDomain) {          const targetUrl = window.location.protocol + '//' + window.location.host.replace('teacher.', '') + '/auth-sync#token=' + data.token + '&refreshToken=' + (data.refreshToken || '');          window.location.href = targetUrl;          return;        }      }
      // Default fallback is Student
      navigate('/student', { replace: true });
      
    } catch (err: any) {
      if (err?.response?.data?.requiresMfa || err?.response?.data?.message?.includes("MFA")) {
        setMfaChallenge({ userId: err?.response?.data?.userId || "" });
        setError(null);
        return;
      }

      setError(
        err?.response?.data?.message || 'Login failed. Please verify your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Hero Visual Card */}
        <div className="lg:col-span-7 hidden lg:flex flex-col justify-between rounded-3xl bg-card p-12 ring-1 ring-border/50 min-h-[640px]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              {window.location.hostname.startsWith('teacher.') ? <span>Teacher Portal</span> : <span>Student Portal</span>}
            </div>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-foreground">
              Master your learning journey with <span className="text-primary">real-time insights</span>.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              Access your personalized portal for adaptive exam taking, live class participation, and automated performance analytics.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="rounded-2xl bg-secondary border border-border/50 p-5">
              <div className="flex items-center gap-3 text-primary mb-2">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-semibold text-foreground">Secure Platform</span>
              </div>
              <p className="text-xs text-muted-foreground leading-5">Automated detection ensuring complete integrity during online exams.</p>
            </div>
            <div className="rounded-2xl bg-secondary border border-border/50 p-5">
              <div className="flex items-center gap-3 text-primary mb-2">
                <Zap className="w-5 h-5" />
                <span className="font-semibold text-foreground">Instant Feedback</span>
              </div>
              <p className="text-xs text-muted-foreground leading-5">Receive instant score reports and question explanations right after submission.</p>
            </div>
          </div>
        </div>

        {/* Right Authentication Form */}
        <div className="lg:col-span-5 w-full rounded-3xl bg-card border border-border/50 p-8 sm:p-10 shadow-lg">
          
          {!mfaChallenge ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground tracking-tight">Sign In</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter your credentials to access your account.
                </p>
              </div>
              <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <a href="/forgot-password" className="text-xs font-medium text-primary hover:text-primary/80 transition">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background pl-11 pr-11 py-3.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  aria-label="Toggle Password Visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3.5 text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground tracking-tight">Two-Factor Authentication</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {recoveryMode ? 'Enter one of your 10-digit recovery codes.' : 'Enter the 6-digit code from your authenticator app.'}
                </p>
              </div>
              <form onSubmit={handleMfaSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {recoveryMode ? 'Recovery Code' : 'Authentication Code'}
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value.replace(/D/g, ''))}
                      className="w-full rounded-xl border border-border bg-secondary/50 px-12 py-3.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder={recoveryMode ? 'e.g. 1234567890' : 'e.g. 123456'}
                      maxLength={recoveryMode ? 10 : 6}
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || (recoveryMode ? mfaCode.length !== 10 : mfaCode.length !== 6)}
                  className="group w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Verify <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryMode(!recoveryMode);
                      setMfaCode('');
                      setError(null);
                    }}
                    className="text-sm text-sky-400 hover:underline"
                  >
                    {recoveryMode ? 'Use Authenticator App Instead' : 'Use a Recovery Code'}
                  </button>
                </div>
              </form>
            </>
          )}


          {/* Registration Redirect */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition underline underline-offset-4">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}