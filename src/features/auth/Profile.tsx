import React, { useState, useMemo } from 'react';
import {
  User as UserIcon,
  Mail,
  KeyRound,
  QrCode,
  Laptop,
  Activity,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import PageHeader from '@/components/ui/PageHeader';

import ProfileGeneralTab from './components/ProfileGeneralTab';
import ProfileSecurityTab from './components/ProfileSecurityTab';
import ProfileEmailPhoneTab from './components/ProfileEmailPhoneTab';
import ProfileMfaTab from './components/ProfileMfaTab';
import ProfileSessionsTab from './components/ProfileSessionsTab';
import ProfileActivityTab from './components/ProfileActivityTab';
import ProfilePreferencesTab from './components/ProfilePreferencesTab';
import { Settings } from 'lucide-react';

// Strict numeric role definitions matching system schema
const ROLE_LABELS: Record<number | string, { label: string; color: string }> = {
  0: { label: 'Student', color: 'bg-emerald-100 border-emerald-200 text-emerald-700' },
  1: { label: 'Teacher', color: 'bg-indigo-100 border-indigo-200 text-indigo-700' },
  2: { label: 'Admin', color: 'bg-rose-100 border-rose-200 text-rose-700' },
  3: { label: 'SuperAdmin', color: 'bg-amber-100 border-amber-200 text-amber-700' },
  Student: { label: 'Student', color: 'bg-emerald-100 border-emerald-200 text-emerald-700' },
  Teacher: { label: 'Teacher', color: 'bg-indigo-100 border-indigo-200 text-indigo-700' },
  Admin: { label: 'Admin', color: 'bg-rose-100 border-rose-200 text-rose-700' },
  SuperAdmin: { label: 'SuperAdmin', color: 'bg-amber-100 border-amber-200 text-amber-700' },
};

function getRoleInfo(role?: number | string) {
  if (role === undefined || role === null) {
    return { label: 'User', color: 'bg-secondary border-border text-muted-foreground' };
  }
  return ROLE_LABELS[role] ?? { label: String(role), color: 'bg-secondary border-border text-muted-foreground' };
}

type TabType = 'general' | 'security' | 'email-phone' | 'mfa' | 'sessions' | 'activity' | 'preferences';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('general');

  const roleInfo = useMemo(() => getRoleInfo(user?.role), [user?.role]);

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'general', label: 'Profile Details', icon: UserIcon },
    { id: 'security', label: 'Security & Password', icon: KeyRound },
    { id: 'email-phone', label: 'Email & Phone', icon: Mail },
    { id: 'mfa', label: 'Two-Factor (2FA)', icon: QrCode },
    { id: 'sessions', label: 'Sessions & Devices', icon: Laptop },
    { id: 'activity', label: 'Activity Logs', icon: Activity },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  return (
    <div className="space-y-8 font-sans text-foreground pb-16 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Account & Security Center"
        subtitle="Manage your identity, authentication credentials, MFA, and active sessions."
      />

      {/* User Hero Banner */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-3xl bg-secondary p-0.5 shadow-sm border border-border">
              <div className="h-full w-full rounded-[22px] bg-secondary flex items-center justify-center text-2xl font-bold text-muted-foreground">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-foreground">{user?.fullName || 'User Profile'}</h2>
                <span className={`rounded-full border px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${roleInfo.color}`}>
                  {roleInfo.label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 border-border pt-4 sm:pt-0">
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground block">Account Status</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active & Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-secondary border border-border no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition duration-200 ${
                isActive
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div className="transition-all duration-300">
        {activeTab === 'general' && <ProfileGeneralTab user={user} onRefresh={() => refreshUser?.()} />}
        {activeTab === 'security' && <ProfileSecurityTab />}
        {activeTab === 'email-phone' && <ProfileEmailPhoneTab user={user} onRefresh={() => refreshUser?.()} />}
        {activeTab === 'mfa' && <ProfileMfaTab />}
        {activeTab === 'sessions' && <ProfileSessionsTab />}
        {activeTab === 'activity' && <ProfileActivityTab />}
        {activeTab === 'preferences' && <ProfilePreferencesTab />}
      </div>
    </div>
  );
}
