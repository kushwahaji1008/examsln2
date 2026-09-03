import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, ShieldAlert, Bell, Loader2 } from 'lucide-react';
import apiClient from '@/services/api/client';

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/notifications/my-notifications');
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await apiClient.post('/notifications/mark-all-as-read').catch(() => {});
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  const getIcon = (type?: string) => {
    if (type?.toLowerCase().includes('exam')) return <BookOpen className="w-5 h-5" />;
    if (type?.toLowerCase().includes('grade') || type?.toLowerCase().includes('result')) return <CheckCircle2 className="w-5 h-5" />;
    if (type?.toLowerCase().includes('alert') || type?.toLowerCase().includes('system')) return <ShieldAlert className="w-5 h-5" />;
    return <Bell className="w-5 h-5" />;
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-border/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-primary-foreground tracking-tight">Notifications</h1>
          <p className="text-sm text-slate-400 mt-1">Stay updated on your exams, results, and system alerts.</p>
        </div>
        {notifications.length > 0 && (
          <button 
            onClick={handleMarkAllRead} 
            className="text-sm text-sky-400 hover:text-sky-300 font-semibold transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-sky-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
          <Bell className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <p className="font-semibold text-slate-300">All caught up!</p>
          <p className="text-sm text-slate-500 mt-1">No notifications at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => {
            const isUnread = notif.isRead === false;
            return (
              <div 
                key={notif.id} 
                className={`flex gap-4 p-5 rounded-2xl border transition-all ${
                  isUnread 
                    ? 'bg-slate-900/80 border-sky-500/30 shadow-lg shadow-sky-500/5' 
                    : 'bg-slate-900/40 border-border/5 opacity-75'
                }`}
              >
                <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {getIcon(notif.type || notif.title)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-bold ${isUnread ? 'text-primary-foreground' : 'text-slate-300'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs text-slate-500">
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{notif.body || notif.message}</p>
                </div>
                {isUnread && <div className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}