import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Users, ArrowRight } from 'lucide-react';

interface RecommendedCourse {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  thumbnailUrl?: string;
}

interface RecommendedCoursesProps {
  courses?: RecommendedCourse[];
}

export default function RecommendedCourses({ courses = [] }: RecommendedCoursesProps) {
  const navigate = useNavigate();

  if (courses.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Recommended for you</h2>
        <button 
          onClick={() => navigate('/student/courses?tab=all')}
          className="text-sm font-semibold text-primary hover:text-primary/80 transition flex items-center gap-1"
        >
          View Catalog <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div 
            key={course.courseId}
            className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:-translate-y-1"
            onClick={() => navigate(`/student/courses/${course.courseId}`)}
          >
            {/* Thumbnail Area */}
            <div className="aspect-video w-full bg-secondary relative overflow-hidden">
              {course.thumbnailUrl ? (
                <img src={course.thumbnailUrl} alt={course.title} className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition duration-300" />
              ) : (
                <img src="/IMG-20260825-WA6378.jpg" alt={course.title} className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition duration-300" />
              )}
            </div>

            {/* Content Area */}
            <div className="p-5">
              <h3 className="font-semibold text-foreground line-clamp-2 leading-snug mb-2 group-hover:text-primary transition">
                {course.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">{course.instructor}</p>
              
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-500" />
                  {(course.rating || 0).toFixed(1)}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {course.students.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}