import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, BarChart, Settings, Trash2, Globe, Lock, PlayCircle, Eye, AlertCircle, FileText, CheckSquare } from 'lucide-react';
import { getCourseById, getCourseStats, publishCourse, unpublishCourse, deleteCourse } from '@/services/api/coursesApi';
import type { Course } from '@/services/api/types/api';

export default function TeacherCourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    Promise.all([
      getCourseById(courseId).catch(() => null),
      getCourseStats(courseId).catch(() => null)
    ]).then(([courseData, statsData]) => {
      setCourse(courseData);
      setStats(statsData);
      setLoading(false);
    });
  }, [courseId]);

  const handlePublishToggle = async () => {
    if (!course || !courseId) return;
    setActionLoading(true);
    try {
      if (course.status === 'Published') {
        await unpublishCourse(courseId);
        setCourse({ ...course, status: 'Draft' });
      } else {
        await publishCourse(courseId);
        setCourse({ ...course, status: 'Published' });
      }
    } catch (err) {
      setError('Failed to update course status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!courseId) return;
    if (!window.confirm("Are you sure you want to delete this course? This action is irreversible.")) return;
    
    setActionLoading(true);
    try {
      await deleteCourse(courseId);
      navigate('/courses', { replace: true });
    } catch (err) {
      setError('Failed to delete course.');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold">Course Not Found</h2>
        <p className="text-muted-foreground mt-2">The course you are looking for does not exist or you do not have permission to view it.</p>
        <Link to="/courses" className="mt-6 text-primary hover:underline font-semibold">Back to Courses</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8 font-sans pb-24">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/courses" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Courses
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{course.title}</h1>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${course.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
              {course.status || 'Draft'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePublishToggle}
            disabled={actionLoading}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              course.status === 'Published' 
              ? 'bg-secondary text-foreground hover:bg-secondary/80' 
              : 'bg-emerald-500 text-emerald-50 hover:bg-emerald-600'
            }`}
          >
            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              course.status === 'Published' ? <><Lock className="w-4 h-4"/> Unpublish</> : <><Globe className="w-4 h-4"/> Publish Course</>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details & Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Course Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</label>
                <div className="mt-1 text-foreground font-medium">{course.title}</div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</label>
                <div className="mt-1 text-sm text-foreground/80 leading-relaxed">{course.description || 'No description provided.'}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Level</label>
                  <div className="mt-1 font-medium">{course.level || 'All Levels'}</div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</label>
                  <div className="mt-1 font-medium text-emerald-500">${course.price?.toFixed(2) || '0.00'}</div>
                </div>
              </div>
            </div>
            
            {/* Action Bar inside details */}
            <div className="mt-8 pt-6 border-t border-border flex gap-3">
              <button disabled className="px-4 py-2 bg-secondary text-foreground text-sm font-semibold rounded-xl opacity-50 cursor-not-allowed">
                Edit Details (Coming Soon)
              </button>
            </div>
          </div>
          
          <div className="bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm">
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-primary" />
              Curriculum & Materials
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Manage your course syllabus. Add video lessons, upload PDFs, and link exams directly to this course.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link 
                to={`/courses/${courseId}/materials/new?type=video`}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/60 hover:border-primary/50 transition-all group"
              >
                <PlayCircle className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold">Video Classes</span>
                <span className="text-xs text-muted-foreground mt-1">Add class links</span>
              </Link>
              <Link 
                to={`/courses/${courseId}/materials/new?type=pdf`}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/60 hover:border-primary/50 transition-all group"
              >
                <FileText className="w-6 h-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold">PDF Materials</span>
                <span className="text-xs text-muted-foreground mt-1">Upload resources</span>
              </Link>
              <Link 
                to="/teacher/exams/new"
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/60 hover:border-primary/50 transition-all group"
              >
                <CheckSquare className="w-6 h-6 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold">Create Exam</span>
                <span className="text-xs text-muted-foreground mt-1">Link an assessment</span>
              </Link>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border flex justify-end">
              <Link 
                to={`/courses/${courseId}/curriculum`}
                className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Manage Full Curriculum
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Analytics & Danger Zone */}
        <div className="space-y-8">
          {stats && (
            <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BarChart className="w-5 h-5 text-primary" />
                Performance Stats
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/50">
                  <span className="text-sm text-muted-foreground font-semibold">Enrolled</span>
                  <span className="font-bold text-foreground">{stats.enrolledStudents || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/50">
                  <span className="text-sm text-muted-foreground font-semibold">Revenue</span>
                  <span className="font-bold text-emerald-500">${stats.totalRevenue?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/50">
                  <span className="text-sm text-muted-foreground font-semibold">Avg Rating</span>
                  <span className="font-bold text-foreground">{stats.averageRating?.toFixed(1) || '0.0'} / 5</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-destructive/5 border border-destructive/20 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-destructive mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </h2>
            <p className="text-xs text-destructive/80 mb-4 leading-relaxed">
              Once you delete a course, there is no going back. All enrollments, statistics, and course materials will be permanently erased.
            </p>
            <button 
              onClick={handleDelete}
              disabled={actionLoading}
              className="w-full px-4 py-2.5 bg-destructive text-destructive-foreground text-sm font-semibold rounded-xl hover:bg-destructive/90 transition-colors"
            >
              {actionLoading ? 'Deleting...' : 'Delete Course'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
