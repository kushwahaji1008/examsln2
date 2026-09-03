import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { createExam } from '@/services/api/examsApi';
import { getAllCourses } from '@/services/api/coursesApi';
import type { CreateExamRequest, Course } from '@/services/api/types/api';

export default function TeacherExamNew() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingCourses, setFetchingCourses] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [type, setType] = useState<number>(0);
  const [courseId, setCourseId] = useState('');
  const [totalMarks, setTotalMarks] = useState(100);
  const [passingMarks, setPassingMarks] = useState(50);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const fetchedCourses = await getAllCourses();
        setCourses(fetchedCourses || []);
        if (fetchedCourses && fetchedCourses.length > 0) {
          const firstCourse = fetchedCourses[0];
          setCourseId(firstCourse.courseId || firstCourse.id);
        }
      } catch (err: any) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setFetchingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return setError('Title is required.');
    if (!courseId) return setError('Course selection is required.');
    
    setLoading(true);
    setError(null);
    
    try {
      const payload: CreateExamRequest = { 
        courseId: courseId.trim(),
        title, 
        description, 
        durationMinutes,
        scheduledStartTime: new Date().toISOString(),
        scheduledEndTime: new Date(Date.now() + 86400000 * 7).toISOString(), // + 7 days
        type,
        questionIds: [],
        settings: {
          randomizeQuestions: false,
          randomizeSections: false,
          allowReview: true,
          showResultsImmediately: true,
          requireProctoring: false,
          preventTabSwitch: false,
          enableAutoSubmit: true,
          gracePeriodMinutes: 0
        },
        grading: {
          enableNegativeMarking: false,
          negativeMarkingPercentage: 0,
          sectionalPassMarksEnabled: false
        },
        totalMarks,
        passingMarks,
        allowedStudents: [],
        instructionsHtml: ''
      };
      const newExam = await createExam(payload);
      navigate(`/teacher/exams/${newExam.examId || newExam.id}`, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create exam. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8 font-sans pb-24">
      <div>
        <Link to="/teacher/exams" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Exams
        </Link>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Create New Exam</h1>
        <p className="text-muted-foreground mt-1">Set up a new assessment for your students.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 font-semibold">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Exam Title *</label>
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="e.g. Midterm Assessment"
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</label>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)}
            rows={3}
            placeholder="Instructions or details about the exam..."
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Duration (Minutes)</label>
            <input 
              type="number" 
              min="1"
              value={durationMinutes} 
              onChange={e => setDurationMinutes(parseInt(e.target.value) || 60)}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Exam Type</label>
            <select
              value={type}
              onChange={e => setType(parseInt(e.target.value) || 0)}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none"
            >
              <option value={0}>MCQ (0)</option>
              <option value={1}>Subjective (1)</option>
              <option value={2}>Mixed (2)</option>
              <option value={3}>Code Evaluation (3)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Marks</label>
            <input 
              type="number" 
              min="1"
              value={totalMarks} 
              onChange={e => setTotalMarks(parseInt(e.target.value) || 100)}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Passing Marks</label>
            <input 
              type="number" 
              min="1"
              value={passingMarks} 
              onChange={e => setPassingMarks(parseInt(e.target.value) || 50)}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Course *</label>
          <div className="relative">
            <select 
               value={courseId} 
               onChange={e => setCourseId(e.target.value)}
               disabled={fetchingCourses || courses.length === 0}
               className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none"
            >
              {fetchingCourses ? (
                <option value="">Loading courses...</option>
              ) : courses.length === 0 ? (
                <option value="">No courses available</option>
              ) : (
                courses.map(course => (
                  <option key={course.courseId || course.id} value={course.courseId || course.id}>
                    {course.title}
                  </option>
                ))
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
          {courses.length === 0 && !fetchingCourses && (
             <p className="text-xs text-destructive mt-1">You must create a course before creating an exam.</p>
          )}
        </div>

        <div className="pt-6 border-t border-border flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Create Exam</>}
          </button>
        </div>
      </form>
    </div>
  );
}
