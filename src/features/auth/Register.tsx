import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  GraduationCap,
  BookOpenCheck,
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useRegister } from './hooks/useRegister';
import { UserRole } from '@/features/auth/types/auth';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  // OpenAPI definition defaults: Instructor = 1, Student = 0
  const [role, setRole] = useState<UserRole>(UserRole.Student);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { executeRegister } = useRegister();

  // Redirect if already authenticated
  if (user) {
    if (user.role === UserRole.Admin) return <Navigate to="/admin" replace />;
    if (user.role === UserRole.Teacher) return <Navigate to="/teacher" replace />;
    return <Navigate to="/student" replace />;
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form Validations
    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const result = await executeRegister({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        role,
      });

      // If the hook returns success: false
      if (result && !result.success) {
        setError(result.error || 'Registration failed. Please check your details.');
        return;
      }

      // 🚀 THE FIX: Registration is successful! The backend has sent the OTP email.
      // Redirect to the Verify Email page and pass the email address along.
      navigate('/verify-email', { state: { email: email.trim() } });

    } catch (err: any) {
      // Catching any unexpected errors or Axios errors thrown by the hook
      setError(err?.response?.data?.message || err?.message || 'Unable to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Hero Visual Card */}
        <div className="lg:col-span-6 hidden lg:flex flex-col justify-between rounded-3xl bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-slate-950/80 p-12 ring-1 ring-border/10 backdrop-blur-2xl min-h-[680px]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Your Account</span>
            </div>

            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-primary-foreground">
              Start your journey with <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">ExamSolution</span>.
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
              Join thousands of students and teachers using adaptive assessment workflows, course delivery systems, and live proctoring.
            </p>
          </div>

          <div className="space-y-3 mt-8">
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Personalized student progress tracking & instant reports</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Full teacher control for question bank and exam creation</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Enterprise-grade security and automated anti-cheat logs</span>
            </div>
          </div>
        </div>

        {/* Right Registration Form */}
        <div className="lg:col-span-6 w-full rounded-3xl bg-slate-900/90 border border-border/10 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-primary-foreground tracking-tight">Register</h2>
            <p className="mt-1.5 text-sm text-slate-400">
              Select your role and enter your details to create an account.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Interactive Role Card Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                I am joining as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole(UserRole.Student)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition duration-200 ${
                    role === UserRole.Student
                      ? 'border-emerald-500 bg-emerald-500/10 text-primary-foreground ring-1 ring-emerald-500'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <GraduationCap className={`w-5 h-5 ${role === UserRole.Student ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div>
                    <div className="text-sm font-semibold">Student</div>
                    <div className="text-[11px] opacity-70">Take exams & learn</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole(UserRole.Teacher)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition duration-200 ${
                    role === UserRole.Teacher
                      ? 'border-emerald-500 bg-emerald-500/10 text-primary-foreground ring-1 ring-emerald-500'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <BookOpenCheck className={`w-5 h-5 ${role === UserRole.Teacher ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div>
                    <div className="text-sm font-semibold">Teacher</div>
                    <div className="text-[11px] opacity-70">Create & manage exams</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-11 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition duration-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-11 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition duration-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-11 pr-11 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition duration-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  aria-label="Toggle Password Visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="flex gap-1 mt-1.5">
                  {[1, 2, 3, 4].map((level) => {
                    let score = 0;
                    if (password.length >= 6) score += 1;
                    if (password.length >= 8 && /[A-Z]/.test(password)) score += 1;
                    if (/[0-9]/.test(password)) score += 1;
                    if (/[^A-Za-z0-9]/.test(password)) score += 1;
                    
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
            </div>

            {/* Phone Field (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Phone Number <span className="text-slate-500 lowercase">(optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-11 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition duration-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-medium text-rose-400">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 px-6 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-emerald-500"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Redirect */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 transition underline underline-offset-4">
              Sign in instead
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}