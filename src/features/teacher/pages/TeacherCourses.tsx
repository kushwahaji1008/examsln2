import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { getAllCourses } from '@/services/api/coursesApi';
import type { Course } from '@/services/api/types/api';
import PageHeader from '@/components/ui/PageHeader';

export default function TeacherCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllCourses()
      .then((data) => setCourses(data))
      .catch((err) => setError('Failed to load courses.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans pb-16 p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Manage Courses</h1>
          <p className="text-muted-foreground mt-1">Create and manage your educational content.</p>
        </div>
        <Link 
          to="/courses/new" 
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>New Course</span>
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {courses.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-border rounded-2xl bg-secondary/50">
          <BookOpen className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-foreground">No courses yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Create your first course to get started.</p>
          <Link 
            to="/courses/new" 
            className="mt-4 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Course</span>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div key={course.courseId} className="group relative flex flex-col rounded-3xl bg-card p-4 sm:p-5 ring-1 ring-border/50 shadow-sm transition hover:shadow-md hover:ring-border/80">
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground leading-tight line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${course.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {course.status || 'Draft'}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {course.level}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {course.description}
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                <div className="text-sm font-semibold text-foreground">
                  ${course.price?.toFixed(2)}
                </div>
                <Link 
                  to={`/courses/${course.courseId}`}
                  className="px-4 py-2 bg-secondary text-foreground text-sm font-semibold rounded-xl hover:bg-secondary/80 transition-colors"
                >
                  Manage
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
