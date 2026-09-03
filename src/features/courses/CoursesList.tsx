import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { BookOpen, Loader2, CheckCircle2 } from 'lucide-react';
import type { Course, PaymentReceipt } from '@/services/api/types/api';
import { getAllCourses, getStoredEnrolledIds } from '@/services/api/coursesApi';
import { getMyEnrolledCourses } from '@/services/api/enrollmentApi';
import CourseCard from './components/CourseCard';
import CourseCheckoutModal from './components/CourseCheckoutModal';

export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCourseForCheckout, setSelectedCourseForCheckout] = useState<Course | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    setEnrolledIds(getStoredEnrolledIds());
    getMyEnrolledCourses().then((myCourses) => {
      setEnrolledIds(myCourses.map(c => c.courseId).filter(Boolean) as string[]);
    }).catch(console.error);
    getAllCourses()
      .then((data) => setCourses(data))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const handleEnrollSuccess = () => {
    if (!selectedCourseForCheckout) return;
    setEnrolledIds((prev) => [...prev, selectedCourseForCheckout.id]);
    setSuccessToast(`Enrolled in "${selectedCourseForCheckout.title}" successfully!`);
    setSelectedCourseForCheckout(null);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans pb-16">
      
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-50 text-emerald-700 font-semibold text-sm px-4 py-3 rounded-2xl border border-emerald-200 shadow-xl animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successToast}</span>
        </div>
      )}

      <PageHeader 
        title="Public Course Catalog" 
        subtitle="Explore verified curriculum pathways, interactive lessons, and professional certifications." 
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-primary">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p className="text-muted-foreground font-medium text-sm">Loading course catalog...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-secondary/50 p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-background border border-border rounded-2xl flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="font-bold text-lg text-foreground mb-1">No courses available at this time.</p>
          <p className="text-sm text-muted-foreground max-w-sm">Courses from the central registry will appear here automatically when they are published.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.courseId}
              course={course}
              isEnrolled={enrolledIds.includes(course.courseId)}
              onEnrollClick={setSelectedCourseForCheckout}
              viewDetailsUrl={`/courses/${course.courseId}`}
            />
          ))}
        </div>
      )}

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
