import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  PlayCircle, CheckCircle2, FileText, Sparkles, Lock, Award, 
  Loader2, AlertCircle, ArrowLeft, Video, HelpCircle, 
  ClipboardCheck, ExternalLink, 
  ChevronDown, BookOpen, Check
} from 'lucide-react';

import type { 
  Course, CurriculumItem, 
  CourseOverviewDto, CourseAccessDto
} from '@/services/api/types/api';
import { 
  getCourseById, getCourseOverview, checkCourseAccess, 
  addStoredEnrolledCourse 
} from '@/services/api/coursesApi';
import CourseCheckoutModal from '@/features/courses/components/CourseCheckoutModal';

export default function StudentCourseDetails() {
  const { courseId } = useParams();

  const [course, setCourse] = useState<Course | null>(null);
  const [overview, setOverview] = useState<CourseOverviewDto | null>(null);
  const [access, setAccess] = useState<CourseAccessDto | null>(null);
  
  const [activeItem, setActiveItem] = useState<CurriculumItem | null>(null);
  const [completedItemIds, setCompletedItemIds] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Checkout modal
  const [showCheckout, setShowCheckout] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [accessRequested, setAccessRequested] = useState(false);

  const handleDirectAction = async () => {
    if (!course || !courseId) return;
    setEnrolling(true);
    try {
      if (course.price === 0 || course.isFree) {
        addStoredEnrolledCourse(courseId);
        setSuccessToast("Successfully enrolled! You can now access all course materials.");
        loadData();
      } else {
        await new Promise(res => setTimeout(res, 800));
        setAccessRequested(true);
        setSuccessToast("Access request sent to instructor!");
      }
      setTimeout(() => setSuccessToast(null), 5000);
    } finally {
      setEnrolling(false);
    }
  };
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Quiz state
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Assignment state
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);
  const [assignmentText, setAssignmentText] = useState('');

  const loadData = useCallback(async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      setError(null);

      const [courseData, overviewData, accessData] = await Promise.all([
        getCourseById(courseId),
        getCourseOverview(courseId),
        checkCourseAccess(courseId),
      ]);

      if (courseData) {
        setCourse(courseData);
        setOverview(overviewData);
        setAccess(accessData);

        // Auto-select first lesson
        const firstSection = courseData.sections?.[0];
        const firstLesson = firstSection?.items?.[0];
        
        if (firstLesson) {
          setActiveItem(firstLesson);
        }

        // Expand all sections initially
        const expandedMap: Record<string, boolean> = {};
        courseData.sections?.forEach((s) => {
          expandedMap[s.id] = true;
        });
        setExpandedSections(expandedMap);

        // Mock some completed items for demonstration
        if (firstLesson && accessData.hasAccess) {
          setCompletedItemIds([firstLesson.id]);
        }
      } else {
        setError('Course not found.');
      }
    } catch (err: any) {
      console.error('Failed to load course details:', err);
      setError(err.message || 'Failed to load course details.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const markComplete = (itemId: string) => {
    if (!completedItemIds.includes(itemId)) {
      setCompletedItemIds(prev => [...prev, itemId]);
    }
    // Simulate next item selection
    if (course?.sections) {
      let foundCurrent = false;
      for (const section of course.sections) {
        if (!section.items) continue;
        for (const item of section.items) {
          if (foundCurrent) {
            setActiveItem(item);
            setQuizSelectedOption(null);
            setQuizSubmitted(false);
            setAssignmentSubmitted(false);
            setAssignmentText('');
            return;
          }
          if (item.itemId === itemId) {
            foundCurrent = true;
          }
        }
      }
    }
  };

  const handleEnrollSuccess = () => {
    setShowCheckout(false);
    
    // Explicitly add to local storage if API is mock
    if (courseId) {
      addStoredEnrolledCourse(courseId);
    }

    setSuccessToast("Successfully enrolled! You can now access all course materials.");
    setTimeout(() => setSuccessToast(null), 5000);
    
    // Hard refresh to ensure access data is re-evaluated correctly
    loadData();
  };

  const getIconForType = (type: number | string) => {
    // 0: Video, 1: Document, 2: Quiz, 3: Assignment
    const t = Number(type);
    if (t === 0) return <Video className="w-4 h-4" />;
    if (t === 1) return <FileText className="w-4 h-4" />;
    if (t === 2) return <HelpCircle className="w-4 h-4" />;
    if (t === 3) return <ClipboardCheck className="w-4 h-4" />;
    return <PlayCircle className="w-4 h-4" />;
  };

  const getTypeLabel = (type: number | string) => {
    const t = Number(type);
    if (t === 0) return 'Video';
    if (t === 1) return 'Document';
    if (t === 2) return 'Quiz';
    if (t === 3) return 'Assignment';
    return 'Lesson';
  };

  const totalCurriculumItems = useMemo(() => {
    if (!course?.sections) return 0;
    return course.sections.reduce((acc, section) => acc + (section.items?.length || 0), 0);
  }, [course]);

  const progressPercentage = useMemo(() => {
    if (totalCurriculumItems === 0) return 0;
    return Math.round((completedItemIds.length / totalCurriculumItems) * 100);
  }, [completedItemIds, totalCurriculumItems]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-primary">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="text-muted-foreground font-medium text-sm">Loading course player and curriculum...</p>
      </div>
    );
  }

  if (error || !course || !overview) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 text-center max-w-md">
          <AlertCircle className="w-10 h-10 mb-3 mx-auto text-destructive" />
          <p className="font-bold text-destructive">{error || 'Failed to load course'}</p>
          <Link to="/student/courses" className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const hasAccess = access?.hasAccess || false;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-50 text-emerald-700 font-semibold text-sm px-4 py-3 rounded-2xl border border-emerald-200 shadow-xl animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <Link 
          to="/student/courses" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Curriculum
        </Link>
        {hasAccess && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground">
              Progress: {progressPercentage}%
            </span>
            <div className="w-32 h-2.5 bg-secondary rounded-full overflow-hidden border border-border">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Course Hero Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary text-muted-foreground border border-border">
              {course.category || 'Curriculum'}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary text-muted-foreground border border-border">
              {course.level || 'All Levels'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">{course.title}</h1>
          <p className="text-sm text-muted-foreground">Instructor: <span className="font-medium text-foreground">{course.instructorName || 'Lead Educator'}</span></p>
        </div>
        
        <div className="flex gap-4 items-center flex-wrap sm:flex-nowrap">
          <div className="p-4 rounded-xl bg-secondary border border-border text-center min-w-[100px]">
            <div className="text-xl font-bold text-foreground">{course.sections?.length || 0}</div>
            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Modules</div>
          </div>
          <div className="p-4 rounded-xl bg-secondary border border-border text-center min-w-[100px]">
            <div className="text-xl font-bold text-foreground">{totalCurriculumItems}</div>
            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Lessons</div>
          </div>
          {!hasAccess && (
            <div className="flex gap-3 self-start sm:self-auto">
              {(course?.price === 0 || course?.isFree) ? (
                <button 
                  onClick={handleDirectAction}
                  disabled={enrolling}
                  className="flex items-center gap-2 px-6 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition shadow-sm disabled:opacity-50"
                >
                  {enrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Join Directly
                </button>
              ) : accessRequested ? (
                 <button 
                  disabled
                  className="flex items-center gap-2 px-6 py-4 rounded-xl bg-secondary text-muted-foreground text-sm font-bold shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" /> Access Requested
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => setShowCheckout(true)}
                    className="flex items-center gap-2 px-6 py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold transition shadow-sm"
                  >
                    <Lock className="w-4 h-4" /> Purchase Course
                  </button>
                  <button 
                    onClick={handleDirectAction}
                    disabled={enrolling}
                    className="flex items-center gap-2 px-6 py-4 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border text-sm font-bold transition shadow-sm disabled:opacity-50"
                  >
                    {enrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Request Access
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
        {/* Main Content Area (Player / Details) */}
        <div className="space-y-8 order-1 lg:order-2">
          
          {/* Active Item Player */}
          {hasAccess && activeItem ? (
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
              
              {/* Media Player Area */}
              <div className="aspect-video bg-black flex items-center justify-center relative">
                {activeItem.type === 0 ? (
                  activeItem.contentUrl ? (
                    <video 
                      src={activeItem.contentUrl} 
                      controls 
                      className="w-full h-full object-cover"
                      poster={course.thumbnailUrl || undefined}
                    >
                      <source src={activeItem.contentUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="text-center p-8 text-white space-y-4">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto backdrop-blur-md border border-white/20">
                        <PlayCircle className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{activeItem.title}</h4>
                        <p className="text-sm text-white/70 mt-1">Video stream placeholder</p>
                      </div>
                    </div>
                  )
                ) : activeItem.type === 1 || activeItem.type === 'document' ? (
                  activeItem.contentUrl ? (
                    <iframe 
                      src={activeItem.contentUrl} 
                      className="w-full h-full border-none bg-white"
                      title={activeItem.title}
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex flex-col items-center justify-center p-10 text-center space-y-4 border-b border-border">
                      <FileText className="w-12 h-12 text-primary" />
                      <div>
                        <h3 className="font-bold text-xl text-foreground">{activeItem.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">Document placeholder</p>
                      </div>
                    </div>
                  )
                ) : activeItem.type === 2 || activeItem.type === 'quiz' ? (
                  <div className="w-full h-full bg-card flex flex-col items-center justify-center p-8 space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="font-bold text-xl text-foreground">{activeItem.title}</h3>
                      <p className="text-sm text-muted-foreground">Knowledge Assessment Quiz</p>
                      {activeItem.contentUrl && (
                        <div className="mt-4 pb-2">
                           <a href={activeItem.contentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition shadow-sm">
                             <ExternalLink className="w-4 h-4" /> Take Exam
                           </a>
                        </div>
                      )}
                    </div>
                    <div className="w-full max-w-lg p-6 rounded-2xl bg-secondary border border-border space-y-4 text-left">
                      <p className="text-sm font-semibold text-foreground">
                        Question 1: Which of the following is the primary objective of this module?
                      </p>
                      <div className="space-y-2.5">
                        {['Understanding core principles', 'Advanced troubleshooting', 'Basic definitions', 'None of the above'].map((opt, idx) => (
                          <button 
                            key={idx}
                            onClick={() => !quizSubmitted && setQuizSelectedOption(idx)}
                            className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition ${
                              quizSelectedOption === idx 
                                ? 'bg-primary/10 border-primary text-primary' 
                                : 'bg-background border-border text-muted-foreground hover:border-muted-foreground/50'
                            } ${quizSubmitted ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                          >
                            <span className="font-bold text-muted-foreground mr-3">{String.fromCharCode(65 + idx)}.</span>
                            {opt}
                          </button>
                        ))}
                      </div>
                      {!quizSubmitted ? (
                        <button 
                          disabled={quizSelectedOption === null}
                          onClick={() => setQuizSelectedOption !== null && setQuizSubmitted(true)}
                          className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-sm disabled:opacity-50 transition mt-4"
                        >
                          Submit Answer
                        </button>
                      ) : (
                        <div className="w-full py-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-sm text-center flex items-center justify-center gap-2 mt-4">
                          <CheckCircle2 className="w-4 h-4" /> Correct Answer
                        </div>
                      )}
                    </div>
                  </div>
                ) : activeItem.type === 3 ? (
                  <div className="w-full h-full bg-card flex flex-col items-center justify-center p-8 space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="font-bold text-xl text-foreground">{activeItem.title}</h3>
                      <p className="text-sm text-muted-foreground">Practical Capstone Assignment</p>
                    </div>
                    <div className="w-full max-w-lg p-6 rounded-2xl bg-secondary border border-border space-y-4 text-left">
                      <p className="text-sm text-foreground leading-relaxed font-medium">
                        Please review the specifications detailed in the previous lesson and submit your deployment configuration below for automated review.
                      </p>
                      <textarea 
                        value={assignmentText}
                        onChange={(e) => setAssignmentText(e.target.value)}
                        disabled={assignmentSubmitted}
                        placeholder="Paste your configuration or answers here..."
                        className="w-full h-32 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition resize-none disabled:opacity-60"
                      />
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-muted-foreground font-mono">
                          {assignmentText.length} chars
                        </span>
                        {!assignmentSubmitted ? (
                          <button 
                            disabled={assignmentText.length < 10}
                            onClick={() => setAssignmentSubmitted(true)}
                            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-sm disabled:opacity-50 transition"
                          >
                            Submit Assignment
                          </button>
                        ) : (
                          <div className="px-6 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-sm flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Submitted
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-white text-center">Unsupported content type.</div>
                )}
              </div>

              {/* Item Info Footer */}
              <div className="p-6 bg-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">{activeItem.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{activeItem.description || course.description}</p>
                </div>
                <button 
                  onClick={() => markComplete(activeItem.id)}
                  disabled={completedItemIds.includes(activeItem.id)}
                  className={`shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition ${
                    completedItemIds.includes(activeItem.id)
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
                  }`}
                >
                  {completedItemIds.includes(activeItem.id) ? (
                    <><CheckCircle2 className="w-4 h-4" /> Completed</>
                  ) : (
                    'Mark as Complete'
                  )}
                </button>
              </div>

              {/* Interactive Tabs (Module 4) */}
              <div className="bg-card border-t border-border">
                <div className="flex overflow-x-auto border-b border-border">
                  {['Notes', 'Bookmarks', 'Comments / Q&A'].map((tab, idx) => (
                    <button key={tab} className={`shrink-0 px-6 py-4 text-sm font-semibold border-b-2 transition ${idx === 0 ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'}`}>
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <textarea 
                      placeholder="Type your notes here... (Timestamps will be attached automatically)"
                      className="w-full h-24 bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                     <button className="px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg shadow-sm transition hover:bg-primary/90">Save Note</button>
                  </div>
                </div>
              </div>
            </div>
          ) : !hasAccess ? (
            <div className="rounded-2xl border border-border bg-card shadow-sm p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary border border-border rounded-2xl flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Enrollment Required</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                You must enroll in this course to access the curriculum materials, video lectures, and assessments.
              </p>
              {(course?.price === 0 || course?.isFree) ? (
                <button 
                  onClick={handleDirectAction}
                  disabled={enrolling}
                  className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-sm transition disabled:opacity-50"
                >
                  {enrolling ? 'Joining...' : 'Join Directly'}
                </button>
              ) : (
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowCheckout(true)}
                    className="px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-sm transition"
                  >
                    Purchase Course
                  </button>
                  {accessRequested ? (
                    <button disabled className="px-8 py-3 rounded-xl bg-secondary text-muted-foreground font-bold text-sm shadow-sm">
                      Requested
                    </button>
                  ) : (
                    <button 
                      onClick={handleDirectAction}
                      disabled={enrolling}
                      className="px-8 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border font-bold text-sm shadow-sm transition disabled:opacity-50"
                    >
                      {enrolling ? 'Requesting...' : 'Request Access'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card shadow-sm p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary border border-border rounded-2xl flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-base font-semibold text-foreground">Select a lesson from the curriculum sidebar.</p>
            </div>
          )}

          {/* Overview Info */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-8 shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-3">About This Course</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{overview.description}</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  What You'll Learn
                </h4>
                <ul className="space-y-3">
                  {overview.learningOutcomes?.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-foreground">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{outcome}</span>
                    </li>
                  ))}
                  {(!overview.learningOutcomes || overview.learningOutcomes.length === 0) && (
                    <li className="text-sm text-muted-foreground italic">Comprehensive subject mastery.</li>
                  )}
                </ul>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Prerequisites</h4>
                  <p className="text-sm text-foreground">{overview.prerequisites}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Instructor Bio</h4>
                  <p className="text-sm text-foreground">{overview.instructorBio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Curriculum */}
        <div className="lg:sticky lg:top-6 order-2 lg:order-1">
          <div className="rounded-2xl border border-border bg-card shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-bold text-base text-foreground">Course Curriculum</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {completedItemIds.length} of {totalCurriculumItems} completed
                </p>
              </div>
              <Award className={`w-8 h-8 ${progressPercentage === 100 ? 'text-amber-500' : 'text-muted-foreground/30'}`} />
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {course.sections?.map((section, sIdx) => (
                <div key={section.sectionId} className="rounded-xl border border-border bg-secondary overflow-hidden">
                  <button 
                    onClick={() => toggleSection(section.sectionId)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-secondary/80 transition-colors"
                  >
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Module {sIdx + 1}
                      </div>
                      <h4 className="font-bold text-sm text-foreground truncate mt-1">
                        {section.title}
                      </h4>
                    </div>
                    <ChevronDown 
                      className={`w-4 h-4 text-muted-foreground transition-transform ${
                        expandedSections[section.sectionId] ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>

                  {expandedSections[section.sectionId] && section.items && section.items.length > 0 && (
                    <div className="p-2 space-y-1 bg-card border-t border-border">
                      {section.items.map((item, iIdx) => {
                        const isCompleted = completedItemIds.includes(item.itemId);
                        const isActive = activeItem?.id === item.itemId;
                        
                        return (
                          <button
                            key={item.itemId}
                            onClick={() => hasAccess && setActiveItem(item)}
                            disabled={!hasAccess}
                            className={`w-full flex items-center justify-between p-3 rounded-lg text-left text-sm transition-all ${
                              isActive 
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'text-foreground hover:bg-secondary'
                            } ${!hasAccess ? 'opacity-70 cursor-not-allowed' : ''}`}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className={`shrink-0 ${
                                isCompleted ? 'text-emerald-500' : isActive ? 'text-primary' : 'text-muted-foreground'
                              }`}>
                                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : getIconForType(item.type)}
                              </div>
                              <span className="truncate">{item.title}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-2 shrink-0">
                              {!hasAccess && (
                                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                              )}
                              <span className="text-[10px] font-semibold text-muted-foreground uppercase bg-secondary px-2 py-0.5 rounded">
                                {getTypeLabel(item.type)}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {(!course.sections || course.sections.length === 0) && (
                <div className="pt-4 pb-2 text-center space-y-2">
                  <p className="text-sm font-medium text-foreground">Curriculum is being prepared.</p>
                  <p className="text-xs text-muted-foreground">Modules and lessons will appear here soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCheckout && (
        <CourseCheckoutModal 
          course={course}
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleEnrollSuccess}
        />
      )}
    </div>
  );
}
