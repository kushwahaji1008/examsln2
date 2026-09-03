import { useEffect, useState } from 'react';
import apiClient from '@/services/api/client';
import PageHeader from '@/components/ui/PageHeader';
import { Bell, Loader2 } from 'lucide-react';

export default function MyNotifications() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/notifications/my-notifications')
      .then(r => setItems(r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto font-sans text-slate-100 pb-12">
      <PageHeader title="My Notifications" subtitle="Real-time alerts, system updates, and exam results." />

      {loading ? (
        <div className="flex items-center justify-center py-20 text-sky-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
          <Bell className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <p className="font-semibold text-slate-300">All caught up!</p>
          <p className="text-sm text-slate-500 mt-1">No unread notifications at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <div key={n.id} className="rounded-2xl border border-border/10 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl flex items-start gap-4 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-base font-bold text-slate-100">{n.title}</h4>
                  <span className="text-xs text-slate-500">{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Just now'}</span>
                </div>
                {n.body && <p className="text-sm text-slate-300 mt-1">{n.body}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
