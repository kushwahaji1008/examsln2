import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Calendar, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import apiClient from '@/services/api/client';

export default function LiveClasses() {
  const navigate = useNavigate();
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLiveClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClient.get('/api/v1/videos/live/upcoming');
        if (isMounted) {
          setLiveClasses(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load live sessions.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLiveClasses();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8 font-sans text-slate-100 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground">Live Classes</h1>
        <p className="mt-2 text-sm text-slate-400">Join interactive sessions, workshops, and expert-led webinars.</p>
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
      ) : liveClasses.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
          <Video className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <h3 className="text-lg font-bold text-primary-foreground mb-1">No live classes scheduled</h3>
          <p className="text-sm text-slate-500">Upcoming live workshops and Q&A sessions will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {liveClasses.map((session) => {
            const isLive = session.status === 'live' || session.isLive === true;
            const startTimeStr = session.scheduledStartTime
              ? new Date(session.scheduledStartTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
              : 'Upcoming';

            return (
              <div key={session.id} className="flex flex-col sm:flex-row gap-6 rounded-3xl border border-border/10 bg-slate-900/80 p-6 backdrop-blur-xl shadow-lg hover:border-sky-500/30 transition">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                  <Video className="h-8 w-8 text-indigo-400" />
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {isLive ? (
                        <span className="flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-400 border border-rose-500/20 animate-pulse">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" /> Live Now
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-border/5">
                          Scheduled
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-primary-foreground">{session.title}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2"><User className="h-4 w-4 text-sky-400" /> {session.instructorName || session.instructor || 'Instructor'}</div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" /> {startTimeStr}</div>
                  </div>

                  <button 
                    disabled={!isLive && !session.meetingUrl}
                    onClick={() => {
                      navigate(`/student/live/${session.id}`);
                    }}
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition ${
                      isLive || session.meetingUrl
                        ? 'bg-indigo-500 text-primary-foreground hover:bg-indigo-400 shadow-lg shadow-indigo-500/20 cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isLive ? 'Join Live Room' : 'Opens at Scheduled Time'} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}