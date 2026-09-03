import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Video, Calendar, User, ArrowRight, Loader2, AlertCircle, Plus } from 'lucide-react';
import apiClient from '@/services/api/client';

export default function TeacherLiveClasses() {
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/api/v1/videos/live/upcoming');
      setLiveClasses(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load live sessions.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartClass = async (id: string) => {
    try {
      await apiClient.post(`/api/v1/videos/live/${id}/start`);
      fetchLiveClasses();
    } catch(err: any) {
      alert("Failed to start class: " + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8 font-sans pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Live Classes</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage and broadcast interactive sessions.</p>
        </div>
        <button 
          onClick={() => alert('New Live Class modal coming soon!')}
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Schedule Live Class
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : liveClasses.length === 0 ? (
        <div className="text-center p-12 bg-card border border-dashed border-border rounded-3xl">
          <Video className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold">No upcoming classes</h3>
          <p className="text-sm text-muted-foreground mt-2">Schedule a live class to interact with students in real-time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveClasses.map((session) => (
            <div key={session.id} className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm flex flex-col hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-4 text-muted-foreground">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold tracking-wider">{new Date(session.scheduledStartTime).toLocaleString()}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{session.title}</h3>
              <p className="text-sm text-muted-foreground flex-1 mb-6">{session.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-muted-foreground">
                  {session.status || 'SCHEDULED'}
                </span>
                {session.status !== 'ACTIVE' ? (
                  <button 
                    onClick={() => handleStartClass(session.id)}
                    className="inline-flex items-center justify-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-sm"
                  >
                    Start Broadcast
                  </button>
                ) : (
                  <button className="inline-flex items-center justify-center gap-2 bg-destructive text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-destructive/90 transition-all shadow-sm">
                    End Class
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
