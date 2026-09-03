import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ExamPreview {
  id: string;
  title: string;
  date: string;
  duration: number;
}

interface UpcomingExamsProps {
  exams?: ExamPreview[];
}

export default function UpcomingExams({ exams = [] }: UpcomingExamsProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Upcoming Exams</h2>
        <button 
          onClick={() => navigate('/student/exams')}
          className="text-sm font-medium text-primary hover:text-primary/80 transition"
        >
          View All
        </button>
      </div>

      {exams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-500/50 mb-3" />
          <p className="text-sm font-medium text-foreground">You're all caught up!</p>
          <p className="text-xs text-muted-foreground mt-1">No pending exams scheduled.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {exams.map((exam) => (
            <div 
              key={exam.examId}
              className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-secondary p-4 transition hover:shadow-sm hover:border-primary/30"
            >
              <div>
                <h3 className="font-medium text-foreground">{exam.title}</h3>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </span>
                  <span>•</span>
                  <span>{exam.duration} mins</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate(`/student/exams/${exam.examId}`)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-card border border-border py-2 text-sm font-medium text-foreground transition group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary"
              >
                <span>View Details</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}