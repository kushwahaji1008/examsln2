import React, { useState } from 'react';
import { User as UserIcon, Mail, Phone, FileText, Save, Loader2, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { authApi } from '@/services/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

interface Props {
  user: any;
  onRefresh: () => void;
}

export default function ProfileGeneralTab({ user, onRefresh }: Props) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await authApi.updateMyProfile({
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
        bio: bio.trim(),
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      onRefresh();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err?.response?.data?.message || 'Failed to update profile. Please try again.',
      });
      toast.error('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await authApi.deleteMe();
      await logout();
      navigate('/login');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete account.');
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="space-y-8">
      {message && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-sm ${
          message.type === 'success' 
            ? 'bg-emerald-100 border-emerald-200 text-emerald-700' 
            : 'bg-destructive/10 border-destructive/20 text-destructive'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
          <p>{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-3xl border border-border bg-card shadow-sm p-6 md:p-8 space-y-6">
        <div className="border-b border-border pb-4">
          <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
          <p className="text-sm text-muted-foreground">Update your public identity and profile bio.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                placeholder="Your Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Primary Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full rounded-xl border border-border bg-secondary pl-11 pr-4 py-3 text-sm text-muted-foreground outline-none cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">To change your email address, use the Email & Phone tab.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact Phone</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account ID</label>
            <input
              type="text"
              disabled
              value={user?.userId || '—'}
              className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-muted-foreground outline-none cursor-not-allowed font-mono text-xs"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bio / About You</label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 w-4 h-4 text-muted-foreground" />
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition resize-none"
              placeholder="Tell us a little bit about your academic or professional background..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold  hover:bg-primary/90 transition   disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-3 text-destructive">
          <AlertTriangle className="w-5 h-5" />
          <h4 className="font-semibold text-destructive">Danger Zone</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Deleting your account will permanently wipe your profile, attempts, enrolled courses, and revoke all active sessions. This action cannot be undone.
        </p>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/10 px-5 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/20 transition"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-destructive/20 bg-card p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 text-destructive">
              <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Delete Account</h3>
                <p className="text-xs text-muted-foreground">Are you sure you want to proceed?</p>
              </div>
            </div>
            <p className="text-sm text-foreground">
              This will permanently delete your account data and revoke access to all exams and courses.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:bg-secondary transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteAccount}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-destructive text-sm font-semibold text-white hover:bg-destructive/90 transition   disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
