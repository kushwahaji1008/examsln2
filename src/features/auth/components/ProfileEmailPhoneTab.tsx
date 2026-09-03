import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Phone, CheckCircle2, AlertTriangle, Loader2, ArrowRight, RefreshCw, Trash2, Send } from 'lucide-react';
import { authApi } from '@/services/api';

interface Props {
  user: any;
  onRefresh: () => void;
}

export default function ProfileEmailPhoneTab({ user, onRefresh }: Props) {
  // Email states
  const [newEmail, setNewEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [emailStep, setEmailStep] = useState<'idle' | 'otp_sent'>('idle');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Phone states
  const [phone, setPhone] = useState(user?.phone || '');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneStep, setPhoneStep] = useState<'idle' | 'otp_sent'>('idle');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Email handlers
  const handleRequestEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailMessage(null);
    try {
      await authApi.changeEmail(newEmail.trim());
      setEmailStep('otp_sent');
      setEmailMessage({ type: 'success', text: `Verification code sent to ${newEmail}. Please enter the OTP to confirm.` });
      toast.success('Verification code sent!');
    } catch (err: any) {
      setEmailMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to request email change.' });
      toast.error('Failed to request email change.');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleVerifyEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailMessage(null);
    try {
      await authApi.verifyEmailChange(emailOtp.trim());
      setEmailMessage({ type: 'success', text: 'Email changed and verified successfully!' });
      toast.success('Email changed successfully!');
      setEmailStep('idle');
      setNewEmail('');
      setEmailOtp('');
      onRefresh();
    } catch (err: any) {
      setEmailMessage({ type: 'error', text: err?.response?.data?.message || 'Invalid or expired OTP.' });
      toast.error('Invalid OTP');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleResendEmailOtp = async () => {
    setEmailLoading(true);
    try {
      await authApi.resendEmailVerification();
      setEmailMessage({ type: 'success', text: 'Verification email resent!' });
      toast.success('Verification email resent!');
    } catch (err: any) {
      setEmailMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to resend code.' });
      toast.error('Failed to resend code.');
    } finally {
      setEmailLoading(false);
    }
  };

  // Phone handlers
  const handleAddOrChangePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneLoading(true);
    setPhoneMessage(null);
    try {
      if (user?.phone) {
        await authApi.changePhone(phone.trim());
      } else {
        await authApi.addPhone(phone.trim());
      }
      setPhoneStep('otp_sent');
      setPhoneMessage({ type: 'success', text: `Verification OTP sent to ${phone}. Enter code below.` });
      toast.success('OTP sent successfully!');
    } catch (err: any) {
      setPhoneMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to register phone number.' });
      toast.error('Failed to register phone number.');
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVerifyPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneLoading(true);
    setPhoneMessage(null);
    try {
      await authApi.verifyPhone(phoneOtp.trim());
      setPhoneMessage({ type: 'success', text: 'Phone number verified successfully!' });
      toast.success('Phone verified!');
      setPhoneStep('idle');
      setPhoneOtp('');
      onRefresh();
    } catch (err: any) {
      setPhoneMessage({ type: 'error', text: err?.response?.data?.message || 'Invalid phone verification code.' });
      toast.error('Invalid OTP');
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleDeletePhone = async () => {
    if (!confirm('Are you sure you want to remove your phone number?')) return;
    setPhoneLoading(true);
    try {
      await authApi.deletePhone();
      setPhoneMessage({ type: 'success', text: 'Phone number removed.' });
      toast.success('Phone removed!');
      setPhone('');
      setPhoneStep('idle');
      onRefresh();
    } catch (err: any) {
      setPhoneMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to remove phone number.' });
      toast.error('Failed to remove phone number.');
    } finally {
      setPhoneLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Email Management Card */}
      <div className="rounded-3xl border border-border bg-card shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-primary">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Email Address Management</h3>
              <p className="text-xs text-muted-foreground">Current active email: <span className="font-semibold text-foreground">{user?.email}</span></p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-100 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-600">
            Verified
          </span>
        </div>

        {emailMessage && (
          <div className={`p-4 rounded-2xl border flex items-center gap-3 text-sm ${
            emailMessage.type === 'success' ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-destructive/10 border-destructive/20 text-destructive'
          }`}>
            {emailMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
            <p>{emailMessage.text}</p>
          </div>
        )}

        {emailStep === 'idle' ? (
          <form onSubmit={handleRequestEmailChange} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Change to New Email</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="new.email@example.com"
                    className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={emailLoading || !newEmail}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold  hover:bg-primary/90 transition   disabled:opacity-50"
                >
                  {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send Verification
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyEmailChange} className="space-y-4">
            <div className="rounded-2xl border border-primary/20 bg-sky-950/20 p-4">
              <p className="text-xs text-sky-300">
                A 6-digit confirmation code was dispatched to <strong>{newEmail}</strong>. Enter it below to complete the transfer.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                maxLength={6}
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full sm:w-64 tracking-widest text-center text-lg font-mono rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              />
              <button
                type="submit"
                disabled={emailLoading || emailOtp.length < 4}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold  hover:bg-emerald-400 transition  shadow-emerald-500/20 disabled:opacity-50"
              >
                {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Confirm Change
              </button>
              <button
                type="button"
                onClick={handleResendEmailOtp}
                disabled={emailLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-slate-950 px-4 py-3 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Resend OTP
              </button>
              <button
                type="button"
                onClick={() => setEmailStep('idle')}
                className="px-4 py-3 text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Phone Number Management Card */}
      <div className="rounded-3xl border border-border bg-card shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary text-primary-foreground/10 border border-primary/20 text-primary">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Phone Verification & SMS Security</h3>
              <p className="text-xs text-muted-foreground">
                {user?.phone ? `Current number: ${user.phone}` : 'No mobile number linked yet.'}
              </p>
            </div>
          </div>
          {user?.phone && (
            <button
              type="button"
              onClick={handleDeletePhone}
              disabled={phoneLoading}
              className="inline-flex items-center gap-1.5 rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive hover:bg-destructive/20 transition"
            >
              <Trash2 className="w-3 h-3" />
              Remove
            </button>
          )}
        </div>

        {phoneMessage && (
          <div className={`p-4 rounded-2xl border flex items-center gap-3 text-sm ${
            phoneMessage.type === 'success' ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-destructive/10 border-destructive/20 text-destructive'
          }`}>
            {phoneMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
            <p>{phoneMessage.text}</p>
          </div>
        )}

        {phoneStep === 'idle' ? (
          <form onSubmit={handleAddOrChangePhone} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {user?.phone ? 'Update Phone Number' : 'Add Phone Number'}
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={phoneLoading || !phone}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold  hover:bg-primary/90 transition   disabled:opacity-50"
                >
                  {phoneLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  {user?.phone ? 'Update & Verify' : 'Link Phone'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyPhone} className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-950/20 p-4">
              <p className="text-xs text-emerald-700">
                We texted an SMS OTP to <strong>{phone}</strong>. Enter it to verify ownership.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                maxLength={6}
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value)}
                placeholder="6-digit SMS OTP"
                className="w-full sm:w-64 tracking-widest text-center text-lg font-mono rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              />
              <button
                type="submit"
                disabled={phoneLoading || phoneOtp.length < 4}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold  hover:bg-emerald-400 transition  shadow-emerald-500/20 disabled:opacity-50"
              >
                {phoneLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Verify Code
              </button>
              <button
                type="button"
                onClick={async () => {
                  setPhoneLoading(true);
                  try {
                    await authApi.resendPhoneOtp();
                    setPhoneMessage({ type: 'success', text: 'SMS OTP resent!' });
      toast.success('SMS OTP resent!');
                  } catch {
                    setPhoneMessage({ type: 'error', text: 'Failed to resend SMS.' });
      toast.error('Failed to resend SMS.');
                  } finally {
                    setPhoneLoading(false);
                  }
                }}
                disabled={phoneLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-slate-950 px-4 py-3 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Resend SMS
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
