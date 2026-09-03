import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, PlayCircle, Loader2, AlertCircle, Compass } from 'lucide-react';
import { getMyEnrolledCourses } from '@/services/api/enrollmentApi';
import type { Course } from '@/services/api/types/api';

export default function MyCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const myEnrolled = await getMyEnrolledCourses();
      setCourses(myEnrolled);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch your courses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8 font-sans text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground">My Courses</h1>
          <p className="mt-2 text-sm text-slate-400">Pick up right where you left off.</p>
        </div>
        <button onClick={() => navigate('/student/catalog')} className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-slate-700">
          Browse Catalog
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 text-primary">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p className="text-muted-foreground font-medium text-sm">Loading your courses...</p>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-12 px-6 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm">
          <AlertCircle className="w-8 h-8 mb-3" />
          <p className="font-semibold text-center">{error}</p>
          <button
            onClick={fetchEnrolledCourses}
            className="mt-4 px-5 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && courses.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-secondary/50 p-8">
          <div className="w-16 h-16 bg-background border border-border rounded-2xl flex items-center justify-center mx-auto mb-4">
             <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">No Enrolled Courses Yet</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            You haven't enrolled in any courses yet. Browse our catalog to start your learning journey!
          </p>
          <button
            onClick={() => navigate('/student/catalog')}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
          >
            <Compass className="w-4 h-4" /> Explore Course Catalog
          </button>
        </div>
      )}

      {!loading && !error && courses.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div key={course.courseId} className="group overflow-hidden rounded-3xl border border-border/10 bg-slate-900/80 backdrop-blur-xl transition hover:border-emerald-500/30">
              <div className="h-32 bg-slate-950 flex items-center justify-center border-b border-border/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition" />
                ) : (
                  <BookOpen className="h-10 w-10 text-sky-400" />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary-foreground leading-tight mb-1">{course.title}</h3>
                <p className="text-sm text-slate-400 mb-6 line-clamp-2">{course.description}</p>
                <button onClick={() => navigate(`/student/courses/${course.courseId}`)} className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 px-4 py-2.5 text-sm font-bold text-primary-foreground transition shadow-lg shadow-sky-500/20">
                  <PlayCircle className="h-4 w-4" /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
