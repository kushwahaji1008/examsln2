import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, BookOpen } from 'lucide-react';

interface ActiveCourse {
  id: string;
  title: string;
  currentChapter: string;
  progressPercentage: number;
  timeLeft: string;
}

interface ContinueLearningProps {
  course?: ActiveCourse | null;
}

export default function ContinueLearning({ course }: ContinueLearningProps) {
  const navigate = useNavigate();

  if (!course) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-medium text-foreground mb-2">Ready to start?</h2>
        <p className="text-muted-foreground mb-6">You don't have any active courses yet. Browse the catalog to begin learning.</p>
        <button 
          onClick={() => navigate('/student/courses?tab=all')}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 relative overflow-hidden group shadow-sm">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Continue Learning</h2>
        <span className="text-sm font-medium text-primary">{course.progressPercentage}% Complete</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center relative z-10">
        <div className="h-32 w-full sm:w-48 shrink-0 rounded-2xl bg-secondary flex items-center justify-center border border-border">
          <PlayCircle className="h-10 w-10 text-muted-foreground" />
        </div>

        <div className="flex-1 space-y-4 w-full">
          <div>
            <h3 className="text-xl font-medium text-foreground">{course.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Currently on: <span className="text-foreground">{course.currentChapter}</span>
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div 
                className="h-full rounded-full bg-primary transition-all duration-1000"
                style={{ width: `${course.progressPercentage}%` }}
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{course.timeLeft} left in this module</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate(`/student/courses/${course.courseId}`)}
          className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium transition hover:bg-primary/90"
        >
          <PlayCircle className="h-4 w-4" />
          Resume
        </button>
      </div>
    </div>
  );
}