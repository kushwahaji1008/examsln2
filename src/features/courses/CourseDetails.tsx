import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
import { ArrowLeft, BookOpen, Loader2, CheckCircle2, PlayCircle, Star, Video, FileText, ChevronDown } from 'lucide-react';
import type { Course, CourseOverviewDto } from '@/services/api/types/api';
import { getCourseById, getCourseOverview } from '@/services/api/coursesApi';
import CourseCheckoutModal from './components/CourseCheckoutModal';

export default function PublicCourseDetails() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [overview, setOverview] = useState<CourseOverviewDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!courseId) return;
    Promise.all([getCourseById(courseId), getCourseOverview(courseId)])
      .then(([c, o]) => {
        setCourse(c);
        setOverview(o);
        
        // Expand first section by default
        if (c?.sections && c.sections.length > 0) {
          setExpandedSections({ [c.sections[0].id]: true });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-primary">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-sm font-medium text-muted-foreground">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto p-12 text-center text-muted-foreground font-sans">
        <div className="w-16 h-16 bg-secondary border border-border rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="font-bold text-lg text-foreground">Course not found.</p>
        <Link to="/courses" className="inline-flex items-center gap-2 mt-4 text-primary hover:underline font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </Link>
      </div>
    );
  }

  const isFree = course.price === 0 || course.isFree;
  
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans pb-16">
      <div className="flex items-center gap-4">
        <Link to="/courses" className="p-2.5 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <PageHeader title={course.title} subtitle="Comprehensive curriculum overview and learning syllabus." />
      </div>

      {/* Main Course Hero Card */}
      <div className="rounded-2xl border border-border bg-card shadow-sm flex flex-col md:flex-row overflow-hidden">
        
        {/* Left side: Thumbnail / Info */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary text-muted-foreground border border-border">
                {course.category || 'General'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary text-muted-foreground border border-border">
                {course.level || 'All Levels'}
              </span>
              <div className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 text-xs ml-auto">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{(course.averageRating || 4.9).toFixed(1)}</span>
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
              {course.title}
            </h1>
            
            <p className="text-base text-muted-foreground leading-relaxed">
              {course.description || overview?.description || 'Learn the foundational concepts and advanced techniques in this comprehensive curriculum.'}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-foreground font-medium">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  {course.instructorName ? course.instructorName.charAt(0) : 'I'}
                </div>
                <span>Instructor: {course.instructorName || 'Platform Educator'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                {course.sections?.reduce((acc, sec) => acc + (sec.items?.length || sec.lectures?.length || 0), 0) || 0} Lessons
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side: Pricing & Action */}
        <div className="w-full md:w-80 bg-secondary/50 p-6 md:p-8 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-border text-center space-y-6">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Enrollment</div>
            <div className="text-4xl font-extrabold text-foreground">
              {isFree ? 'FREE' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(course.discountPrice || course.price || 0)}
            </div>
            {!isFree && course.discountPrice && course.price && course.discountPrice < course.price && (
              <div className="text-sm text-muted-foreground line-through">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(course.price)}
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setShowCheckout(true)}
            className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md transition"
          >
            {isFree ? 'Enroll Now for Free' : 'Purchase Course'}
          </button>
          
          <ul className="text-xs text-muted-foreground space-y-2 text-left w-full mt-4">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Full lifetime access</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Access on mobile and TV</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Certificate of completion</li>
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-8">
        
        {/* Left Column: Syllabus & About */}
        <div className="space-y-8">
          
          {/* Syllabus Section */}
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-foreground">Course Syllabus</h2>
            <div className="space-y-4">
              {course.sections && course.sections.length > 0 ? (
                course.sections.map((section, idx) => {
    const secId = section.id || section.sectionId || String(idx);
    return (
      <div key={secId} className="rounded-xl border border-border bg-background overflow-hidden">
                    <button 
                      onClick={() => toggleSection(secId)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-secondary text-muted-foreground font-bold text-sm flex items-center justify-center">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-foreground">{section.title}</h3>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {section.items?.length || section.lectures?.length || 0} items
                          </div>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedSections[secId] ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedSections[secId] && (
                      <div className="border-t border-border bg-secondary/30 p-2 space-y-1">
                        {(section.items || section.lectures || []).map((item: any, iIdx: number) => (
                          <div key={item.id || item.itemId || iIdx} className="flex items-center justify-between p-3 rounded-lg text-sm bg-background border border-border/50">
                            <div className="flex items-center gap-3">
                              {item.type === 0 || item.type === 'video' ? <Video className="w-4 h-4 text-muted-foreground" /> : <FileText className="w-4 h-4 text-muted-foreground" />}
                              <span className="text-foreground font-medium">{item.title}</span>
                            </div>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider bg-secondary px-2 py-1 rounded">
                              {item.type === 0 || item.type === 'video' ? 'Video' : 'Document'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
              ) : (
                <div className="p-8 text-center border border-dashed border-border rounded-xl bg-secondary/50">
                  <p className="text-sm font-semibold text-foreground">Syllabus is being prepared.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Overview Meta */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6 sticky top-6">
            <div>
              <h3 className="font-bold text-foreground mb-2">Prerequisites</h3>
              <p className="text-sm text-muted-foreground">
                {overview?.prerequisites || 'No prior knowledge required. Just a willingness to learn.'}
              </p>
            </div>
            <div className="w-full h-px bg-border" />
            <div>
              <h3 className="font-bold text-foreground mb-2">Instructor Bio</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {overview?.instructorBio || 'An industry professional dedicated to teaching high-quality, practical skills.'}
              </p>
            </div>
            <div className="w-full h-px bg-border" />
            <div>
              <h3 className="font-bold text-foreground mb-3">Key Outcomes</h3>
              <ul className="space-y-2">
                {overview?.learningOutcomes?.map((outcome, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
                {(!overview?.learningOutcomes || overview.learningOutcomes.length === 0) && (
                  <li className="text-sm text-muted-foreground italic">Master the core concepts of this subject.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showCheckout && (
        <CourseCheckoutModal 
          course={course}
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}
