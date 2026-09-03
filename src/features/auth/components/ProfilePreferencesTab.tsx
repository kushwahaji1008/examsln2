import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Bell, Smartphone, Mail, Clock, Save, Loader2, CheckCircle2 } from 'lucide-react';

const Toggle = ({ label, desc, checked, onChange }: any) => (
  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-primary/30 transition">
    <div>
      <h4 className="font-semibold text-sm text-foreground">{label}</h4>
      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
    </div>
    <button 
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-primary' : 'bg-secondary border border-border'}`}
    >
      <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  </div>
);

export default function ProfilePreferencesTab() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [prefs, setPrefs] = useState({
    emailExams: true,
    emailCourses: true,
    emailPromos: false,
    pushExams: true,
    pushMessages: true,
    smsAlerts: false,
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00'
  });

  const handleSave = () => {
    setLoading(true);
    setSuccess(false);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast.success('Preferences saved successfully!');
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };



  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-8">
        
        {/* Email Notifications */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Email Notifications</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle 
              label="Exam Reminders" 
              desc="Get notified 24h before an exam."
              checked={prefs.emailExams}
              onChange={(val: boolean) => setPrefs({...prefs, emailExams: val})}
            />
            <Toggle 
              label="Course Updates" 
              desc="New curriculum or announcements."
              checked={prefs.emailCourses}
              onChange={(val: boolean) => setPrefs({...prefs, emailCourses: val})}
            />
            <Toggle 
              label="Promotions" 
              desc="Weekly newsletters and offers."
              checked={prefs.emailPromos}
              onChange={(val: boolean) => setPrefs({...prefs, emailPromos: val})}
            />
          </div>
        </section>

        {/* Push & SMS Notifications */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Push & SMS</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle 
              label="Push: Exam Alerts" 
              desc="Real-time alerts for active exams."
              checked={prefs.pushExams}
              onChange={(val: boolean) => setPrefs({...prefs, pushExams: val})}
            />
            <Toggle 
              label="Push: Direct Messages" 
              desc="When instructor replies to Q&A."
              checked={prefs.pushMessages}
              onChange={(val: boolean) => setPrefs({...prefs, pushMessages: val})}
            />
            <Toggle 
              label="SMS Alerts" 
              desc="Critical security and schedule changes."
              checked={prefs.smsAlerts}
              onChange={(val: boolean) => setPrefs({...prefs, smsAlerts: val})}
            />
          </div>
        </section>

        {/* Quiet Hours */}
        <section className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Quiet Hours</h3>
            </div>
            <button 
              onClick={() => setPrefs({...prefs, quietHoursEnabled: !prefs.quietHoursEnabled})}
              className={`w-11 h-6 rounded-full transition-colors relative ${prefs.quietHoursEnabled ? 'bg-primary' : 'bg-secondary border border-border'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${prefs.quietHoursEnabled ? 'translate-x-5' : ''}`} />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Mute all push and email notifications during this time window.</p>
          
          <div className={`grid grid-cols-2 gap-4 max-w-sm transition-opacity ${!prefs.quietHoursEnabled && 'opacity-50 pointer-events-none'}`}>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Start Time</label>
              <input 
                type="time" 
                value={prefs.quietHoursStart}
                onChange={(e) => setPrefs({...prefs, quietHoursStart: e.target.value})}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">End Time</label>
              <input 
                type="time" 
                value={prefs.quietHoursEnd}
                onChange={(e) => setPrefs({...prefs, quietHoursEnd: e.target.value})}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </section>
        
        {/* Footer Actions */}
        <div className="flex justify-end pt-4 border-t border-border">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition shadow-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (success ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />)}
            {success ? 'Saved' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}
