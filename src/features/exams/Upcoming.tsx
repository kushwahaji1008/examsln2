import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { genExams } from '@/services/api/generated';
import PageHeader from '@/components/ui/PageHeader';
import { Calendar, Clock, ArrowRight, Loader2 } from 'lucide-react';

export default function UpcomingExams() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    genExams.listUpcomingExams()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans text-slate-100 pb-12">
      <PageHeader title="Upcoming Exams" subtitle="Scheduled exams that will start soon." />

      {loading ? (
        <div className="flex items-center justify-center py-20 text-sky-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <p className="font-semibold text-slate-300">No upcoming exams found.</p>
          <p className="text-sm text-slate-500 mt-1">Check back later or explore available practice tests.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((exam) => (
            <div key={exam.examId} className="rounded-2xl border border-border/10 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-slate-100">{exam.title}</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold uppercase">
                  Upcoming
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>{exam.durationMinutes || 60} mins</span>
                <span>•</span>
                <span>{exam.scheduledStartTime ? new Date(exam.scheduledStartTime).toLocaleString() : 'Date TBD'}</span>
              </div>
              <Link to={`/student/exams/${exam.examId}`} className="inline-flex items-center gap-2 text-sm text-sky-400 font-bold hover:text-sky-300">
                View Details <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
