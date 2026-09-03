import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, BookOpen, Loader2, AlertCircle, 
  Compass, GraduationCap, CheckCircle2, 
  Sparkles, Flame
} from 'lucide-react';
import type { Course } from '@/services/api/types/api';
import { 
  getAllCourses, getFeaturedCourses, getPopularCourses, 
  getStoredEnrolledIds 
} from '@/services/api/coursesApi';
import { getMyEnrolledCourses } from '@/services/api/enrollmentApi';
import CourseCard from '@/features/courses/components/CourseCard';
import CourseCheckoutModal from '@/features/courses/components/CourseCheckoutModal';

export default function StudentCourses() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Tab state synced with URL search params (defaults to 'all' for complete catalog display)
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'enrolled' | 'all' | 'featured' | 'popular'>(
    tabParam === 'enrolled' ? 'enrolled' : 'all'
  );

  useEffect(() => {
    if (tabParam === 'enrolled' || tabParam === 'all' || tabParam === 'featured' || tabParam === 'popular') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Checkout modal
  const [selectedCourseForCheckout, setSelectedCourseForCheckout] = useState<Course | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [enrollingMap, setEnrollingMap] = useState<Record<string, boolean>>({});
  const [requestedMap, setRequestedMap] = useState<Record<string, boolean>>({});

  const handleEnrollAction = async (course: Course) => {
    if (course.price === 0 || course.isFree) {
      setEnrollingMap(prev => ({ ...prev, [course.courseId]: true }));
      try {
        
        addStoredEnrolledCourse(course.courseId);
        fetchData(); // Refresh list to get enrolled status
        setSuccessToast("Successfully enrolled! You can now access the course materials.");
        setTimeout(() => setSuccessToast(null), 5000);
      } finally {
        setEnrollingMap(prev => ({ ...prev, [course.courseId]: false }));
      }
    } else {
      // Just open the checkout modal if it's paid
      setSelectedCourseForCheckout(course);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [courses, featured, popular] = await Promise.all([
        getAllCourses(),
        getFeaturedCourses(),
        getPopularCourses(),
      ]);

      // Show all and every course returned from https://exams.tryasp.net/api/v1/courses
      setAllCourses(courses);
      setFeaturedCourses(featured);
      setPopularCourses(popular);

      // Load enrolled courses from API
      let enrolled = getStoredEnrolledIds();
      try {
        const myEnrolled = await getMyEnrolledCourses();
        enrolled = myEnrolled.map(c => c.courseId).filter(Boolean) as string[];
      } catch (e) {
        console.error('Failed to fetch enrolled courses', e);
      }
      setEnrolledIds(enrolled);
      
    } catch (err: any) {
      console.error('Failed to load courses:', err);
      setError(err.message || 'Failed to connect to the course server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (tab: 'enrolled' | 'all' | 'featured' | 'popular') => {
    setActiveTab(tab);
    setSearchParams({ tab });
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSearchQuery('');
  };

  // Determine which list of courses to filter based on tab
  const getBaseCourses = () => {
    switch (activeTab) {
      case 'featured': return featuredCourses;
      case 'popular': return popularCourses;
      case 'enrolled': return allCourses.filter(c => enrolledIds.includes(c.id) || enrolledIds.includes(c.courseId || ''));
      case 'all':
      default: return allCourses;
    }
  };

  const displayedCourses = useMemo(() => {
    let filtered = getBaseCourses();

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.instructorName?.toLowerCase().includes(q)
      );
    }

    if (selectedLevel !== 'All') {
      filtered = filtered.filter((c) => c.level === selectedLevel);
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }

    return filtered;
  }, [getBaseCourses, searchQuery, selectedLevel, selectedCategory]);

  const categories = useMemo(() => {
    const base = getBaseCourses();
    const cats = Array.from(new Set(base.map((c) => c.category || 'General')));
    return ['All', ...cats.sort()];
  }, [getBaseCourses]);

  const handleEnrollSuccess = () => {
    setSelectedCourseForCheckout(null);
    fetchData(); // Refresh to update enrollment status
    setSuccessToast("Successfully enrolled! You can now access the course materials.");
    setTimeout(() => setSuccessToast(null), 5000);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-16 font-sans">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-2xl border border-emerald-200 shadow-xl animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Curriculum Pathways
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Explore active exam preparation courses, structured syllabuses, video modules, and verified tests.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-secondary p-3 rounded-2xl border border-border text-xs">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-foreground">
              {allCourses.length} Total {allCourses.length === 1 ? 'Course' : 'Courses'}
            </div>
            <div className="text-[11px] text-muted-foreground">{enrolledIds.length} Enrolled</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Main Tabs */}
          <div className="flex flex-wrap gap-2 p-1 rounded-xl bg-secondary border border-border inline-flex">
            <button
              onClick={() => handleTabChange('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'all'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Compass className="w-4 h-4" />
              All Courses ({allCourses.length})
            </button>
            <button
              onClick={() => handleTabChange('enrolled')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'enrolled'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              My Enrolled ({allCourses.filter(c => enrolledIds.includes(c.id) || enrolledIds.includes(c.courseId || '')).length})
            </button>
            <button
              onClick={() => handleTabChange('featured')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'featured'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Featured
            </button>
            <button
              onClick={() => handleTabChange('popular')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'popular'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Flame className="w-4 h-4" />
              Popular
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search courses, instructors, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-card pl-9 pr-4 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground transition"
            />
          </div>
        </div>

        {/* Secondary Category & Level Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground outline-none focus:border-primary transition"
          >
            <option value="All">All Skill Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 text-primary">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p className="text-muted-foreground font-medium text-sm">Loading course catalog...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-12 px-6 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm">
          <AlertCircle className="w-8 h-8 mb-3" />
          <p className="font-semibold text-center">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-5 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && displayedCourses.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-secondary/50 p-8">
          <div className="w-16 h-16 bg-background border border-border rounded-2xl flex items-center justify-center mx-auto mb-4">
             <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            {activeTab === 'enrolled' ? 'No Enrolled Courses Yet' : 'No courses found'}
          </h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            {activeTab === 'enrolled'
              ? 'You have not enrolled in any courses yet. Browse our catalog to start your learning journey!'
              : 'Try adjusting your search query or selecting a different category filter.'}
          </p>
          {activeTab === 'enrolled' && (
            <button
              onClick={() => handleTabChange('all')}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              <Compass className="w-4 h-4" /> Explore Course Catalog
            </button>
          )}
        </div>
      )}

      {/* Courses Grid */}
      {!loading && !error && displayedCourses.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedCourses.map((course) => {
            const isEnrolled = enrolledIds.includes(course.courseId);
            return (
              <CourseCard
                key={course.courseId}
                course={course}
                isEnrolled={isEnrolled}
                onEnrollClick={handleEnrollAction}
                viewDetailsUrl={`/student/courses/${course.courseId}`}
              />
            );
          })}
        </div>
      )}

      {/* Checkout / Payment Modal */}
      {selectedCourseForCheckout && (
        <CourseCheckoutModal
          course={selectedCourseForCheckout}
          isOpen={!!selectedCourseForCheckout}
          onClose={() => setSelectedCourseForCheckout(null)}
          onSuccess={handleEnrollSuccess}
        />
      )}
    </div>
  );
}
