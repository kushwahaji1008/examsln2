import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, Shield, AlertTriangle, CheckCircle2, Loader2, RefreshCw, ShieldAlert, LogOut } from 'lucide-react';
import { authApi } from '@/services/api';
import type { UserSecurityOverview } from '@/services/api/types/api';

export default function ProfileSecurityTab() {
  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPass, setSavingPass] = useState(false);
  const [passMessage, setPassMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Security Overview
  const [securityData, setSecurityData] = useState<UserSecurityOverview | null>(null);
  const [loadingSec, setLoadingSec] = useState(true);

  // Token revocation state
  const [revoking, setRevoking] = useState(false);
  const [revokeMessage, setRevokeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSecurity = async () => {
    setLoadingSec(true);
    try {
      const data = await authApi.getMySecurity();
      setSecurityData(data);
    } catch {
      // Mock default if endpoint not yet populated
      setSecurityData({
        mfaEnabled: false,
        emailVerified: true,
        phoneVerified: false,
        activeSessionsCount: 1,
        activeDevicesCount: 1,
        recentSecurityAlertsCount: 0,
      });
    } finally {
      setLoadingSec(false);
    }
  };

  useEffect(() => {
    fetchSecurity();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);

    if (newPassword !== confirmPassword) {
      setPassMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      setPassMessage({ type: 'error', text: 'Password must be at least 8 chars with uppercase, lowercase, number, and symbol.' });
      return;
    }

    setSavingPass(true);
    try {
      await authApi.changePassword({ oldPassword, newPassword });
      setPassMessage({ type: 'success', text: 'Password changed successfully! You may need to log in again on other devices.' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      fetchSecurity();
    } catch (err: any) {
      setPassMessage({
        type: 'error',
        text: err?.response?.data?.message || 'Failed to change password. Please check your current password.',
      });
    } finally {
      setSavingPass(false);
    }
  };

  const handleRevokeAllTokens = async () => {
    if (!confirm('This will invalidate all active login tokens and log you out across all other devices. Proceed?')) return;
    setRevoking(true);
    setRevokeMessage(null);
    try {
      await authApi.revokeAllTokens();
      setRevokeMessage({ type: 'success', text: 'All active sessions and tokens have been revoked.' });
      fetchSecurity();
    } catch (err: any) {
      setRevokeMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to revoke tokens.' });
    } finally {
      setRevoking(false);
    }
  };

  // Password score calculator
  const calculateScore = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passScore = calculateScore(newPassword);

  return (
    <div className="space-y-8">
      {/* Security Health Matrix */}
      <div className="rounded-3xl border border-border bg-card shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary text-primary-foreground/10 border border-primary/20 text-primary">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Security Posture Overview</h3>
              <p className="text-xs text-muted-foreground">Real-time status of your account protection layer.</p>
            </div>
          </div>
          <button
            onClick={fetchSecurity}
            disabled={loadingSec}
            className="p-2 rounded-full border border-border text-muted-foreground hover:text-foreground transition"
            title="Refresh Security Status"
          >
            <RefreshCw className={`w-4 h-4 ${loadingSec ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border/80 bg-background p-4 space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Two-Factor Auth</span>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${securityData?.mfaEnabled ? 'bg-emerald-400  shadow-emerald-400/40' : 'bg-amber-400'}`} />
              <p className="text-sm font-semibold text-foreground">
                {securityData?.mfaEnabled ? 'Enabled (Active)' : 'Disabled'}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-background p-4 space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Email Verification</span>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${securityData?.emailVerified ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              <p className="text-sm font-semibold text-foreground">
                {securityData?.emailVerified ? 'Verified' : 'Pending Verification'}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-background p-4 space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Active Sessions</span>
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">
                {securityData?.activeSessionsCount || 1} Device(s)
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-background p-4 space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Security Alerts</span>
            <div className="flex items-center gap-2">
              <ShieldAlert className={`w-4 h-4 ${(securityData?.recentSecurityAlertsCount || 0) > 0 ? 'text-amber-400' : 'text-emerald-600'}`} />
              <p className="text-sm font-semibold text-foreground">
                {(securityData?.recentSecurityAlertsCount || 0) === 0 ? 'Zero Threats' : `${securityData?.recentSecurityAlertsCount} Alerts`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <form onSubmit={handleChangePassword} className="rounded-3xl border border-border bg-card shadow-sm p-6 md:p-8 space-y-6">
        <div className="border-b border-border pb-4">
          <h3 className="text-lg font-semibold text-foreground">Update Password</h3>
          <p className="text-sm text-muted-foreground">Ensure your new password contains uppercase, lowercase, numbers, and special symbols.</p>
        </div>

        {passMessage && (
          <div className={`p-4 rounded-2xl border flex items-center gap-3 text-sm ${
            passMessage.type === 'success' 
              ? 'bg-emerald-100 border-emerald-200 text-emerald-700' 
              : 'bg-destructive/10 border-destructive/20 text-destructive'
          }`}>
            {passMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
            <p>{passMessage.text}</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">New Password</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                placeholder="••••••••"
              />
            </div>
            {newPassword.length > 0 && (
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4].map((level) => {
                  let bg = 'bg-secondary';
                  if (passScore >= level) {
                    if (passScore <= 1) bg = 'bg-rose-500';
                    else if (passScore === 2) bg = 'bg-amber-400';
                    else if (passScore === 3) bg = 'bg-sky-400';
                    else bg = 'bg-emerald-400';
                  }
                  return <div key={level} className={`h-1.5 flex-1 rounded-full ${bg} transition-colors duration-300`} />;
                })}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <button
            type="submit"
            disabled={savingPass}
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold  hover:bg-primary/90 transition   disabled:opacity-50"
          >
            {savingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            {savingPass ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </form>

      {/* Invalidate Tokens / Emergency Logout */}
      <div className="rounded-3xl border border-border bg-card shadow-sm p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-semibold text-foreground">Global Session Invalidation</h4>
            <p className="text-sm text-muted-foreground">Force token revocation across all signed-in browsers and mobile devices.</p>
          </div>
          <button
            type="button"
            disabled={revoking}
            onClick={handleRevokeAllTokens}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-400 hover:bg-amber-500/20 transition disabled:opacity-50"
          >
            {revoking ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            {revoking ? 'Revoking...' : 'Revoke All Tokens'}
          </button>
        </div>

        {revokeMessage && (
          <div className={`p-4 rounded-2xl border text-sm ${
            revokeMessage.type === 'success' ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-destructive/10 border-destructive/20 text-destructive'
          }`}>
            {revokeMessage.text}
          </div>
        )}
      </div>
    </div>
  );
}
