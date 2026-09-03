import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Video, FileText, Loader2, AlertCircle } from 'lucide-react';
import apiClient from '@/services/api/client';

export default function Schedule() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSchedule = async () => {
      try {
        setLoading(true);
        setError(null);
        const [liveRes, examsRes] = await Promise.all([
          apiClient.get('/api/v1/videos/live/upcoming').catch(() => ({ data: [] })),
          apiClient.get('/exams').catch(() => ({ data: [] })),
        ]);

        if (!isMounted) return;

        const liveList = Array.isArray(liveRes.data) ? liveRes.data : [];
        const examsList = Array.isArray(examsRes.data) ? examsRes.data : [];

        const combined: any[] = [
          ...liveList.map(item => ({
            id: `live-${item.itemId}`,
            title: item.title,
            type: 'class',
            date: item.scheduledStartTime || new Date().toISOString(),
            time: item.scheduledStartTime 
              ? new Date(item.scheduledStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'TBD'
          })),
          ...examsList.map(item => ({
            id: `exam-${item.itemId}`,
            title: item.title,
            type: 'exam',
            date: item.scheduledStartTime || new Date().toISOString(),
            time: item.scheduledStartTime 
              ? new Date(item.scheduledStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Flexible'
          }))
        ];

        // Group by Date label
        const groupsMap: { [key: string]: any[] } = {};
        const todayStr = new Date().toDateString();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toDateString();

        combined.forEach(event => {
          const evDate = new Date(event.date);
          const evDateStr = evDate.toDateString();
          let groupLabel = evDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          if (evDateStr === todayStr) groupLabel = 'Today';
          else if (evDateStr === tomorrowStr) groupLabel = 'Tomorrow';

          if (!groupsMap[groupLabel]) {
            groupsMap[groupLabel] = [];
          }
          groupsMap[groupLabel].push(event);
        });

        const groupsArray = Object.keys(groupsMap).map((label, index) => ({
          id: String(index),
          date: label,
          items: groupsMap[label]
        }));

        setEvents(groupsArray);
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load schedule.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSchedule();

    return () => {
      isMounted = false;
    };
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'class': return <Video className="h-4 w-4 text-indigo-400" />;
      case 'exam': return <FileText className="h-4 w-4 text-emerald-400" />;
      default: return <Clock className="h-4 w-4 text-rose-400" />;
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 sm:p-6 lg:p-8 font-sans text-slate-100 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground">Schedule</h1>
        <p className="mt-2 text-sm text-slate-400">Track all your upcoming classes, commitments, and exam deadlines.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-sky-400">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <h3 className="text-lg font-bold text-primary-foreground mb-1">No scheduled events</h3>
          <p className="text-sm text-slate-500">Your upcoming classes and exam calendar are clear right now.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {events.map((group) => (
            <div key={group.id} className="relative">
              <div className="sticky top-0 z-10 flex items-center gap-3 py-2 bg-slate-950/80 backdrop-blur-md">
                <Calendar className="h-5 w-5 text-sky-400" />
                <h2 className="text-lg font-bold text-primary-foreground">{group.date}</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent ml-2" />
              </div>

              <div className="mt-4 space-y-4 pl-8 border-l border-slate-800 ml-2.5">
                {group.items.map((item: any) => (
                  <div key={item.itemId} className="relative rounded-2xl border border-border/10 bg-slate-900/80 p-5 transition hover:bg-slate-800/80 shadow-md">
                    {/* Timeline dot */}
                    <div className="absolute -left-[3.25rem] top-6 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 border border-slate-700">
                      {getIcon(item.type)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-200">{item.title}</h3>
                        <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mt-1">{item.type}</p>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-1.5 text-sm font-semibold text-slate-300 border border-border/5">
                        <Clock className="h-3.5 w-3.5 text-slate-500" /> {item.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}