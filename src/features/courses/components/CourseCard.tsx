import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, BookOpen, Layers, 
  CheckCircle2, PlayCircle, GraduationCap
} from 'lucide-react';
import type { Course } from '@/services/api/types/api';

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
  onEnrollClick?: (course: Course) => void;
  viewDetailsUrl?: string;
}

export default function CourseCard({ course, isEnrolled, onEnrollClick, viewDetailsUrl }: CourseCardProps) {
  const [imageError, setImageError] = useState(false);

  const hasValidThumbnail = course.thumbnailUrl && !imageError;

  const formatPrice = (price?: number) => {
    if (price === undefined || price === 0) return 'FREE';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };

  const isFree = !course.price || course.price === 0;
  const detailsPath = viewDetailsUrl || `/student/courses/${course.courseId}`;
  const totalLectures = course.sections?.reduce((acc, sec) => acc + (sec.lectures?.length || sec.items?.length || 0), 0) || 0;

  return (
    <div className="group relative flex flex-col h-full rounded-2xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-md">
      
      {/* Thumbnail Area */}
      <div className="relative h-48 w-full bg-secondary flex-shrink-0">
        {hasValidThumbnail ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src="/IMG-20260825-WA6378.jpg"
            alt={course.title || 'Course Thumbnail'}
            className="w-full h-full object-cover"
          />
        )}

        {/* Floating Overlay Tags */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-background text-foreground shadow-sm">
            {course.level || 'All Levels'}
          </span>
          {isEnrolled && (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 shadow-sm flex items-center gap-1 border border-emerald-100">
              <CheckCircle2 className="w-3 h-3" /> Enrolled
            </span>
          )}
        </div>

        <div className="absolute top-4 right-4 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-background shadow-sm">
            {isFree ? (
              <span className="text-xs font-bold text-foreground">FREE</span>
            ) : course.discountPrice && course.discountPrice > 0 && course.discountPrice < course.price ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground line-through">
                  {formatPrice(course.price)}
                </span>
                <span className="text-xs font-bold text-foreground">
                  {formatPrice(course.discountPrice)}
                </span>
              </div>
            ) : (
              <span className="text-xs font-bold text-foreground">
                {formatPrice(course.price)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
        
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-muted-foreground uppercase tracking-wider truncate max-w-[180px]">
              {course.category || 'General'}
            </span>
            <div className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{(course.averageRating || 4.9).toFixed(1)}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {course.description || 'Comprehensive exam preparation curriculum with verified syllabus and lessons.'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Flat Metadata Row */}
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-foreground/70" />
              <span>{course.sections?.length || 1} {course.sections?.length === 1 ? 'Module' : 'Modules'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-foreground/70" />
              <span>{totalLectures} Lessons</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-foreground/70" />
              <span>{course.enrollmentCount || 0} Students</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isEnrolled ? (
              <Link
                to={detailsPath}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-colors"
              >
                <PlayCircle className="w-4 h-4" /> Continue Learning
              </Link>
            ) : (
              <>
                <Link
                  to={detailsPath}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-sm font-semibold transition-colors"
                >
                  View Syllabus
                </Link>
                {onEnrollClick ? (
                  <button
                    type="button"
                    onClick={() => onEnrollClick(course)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold transition-colors shadow-sm"
                  >
                    {isFree ? 'Join Free' : 'Purchase Course'}
                  </button>
                ) : (
                  <Link
                    to={detailsPath}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold transition-colors shadow-sm"
                  >
                    {isFree ? 'Join Free' : 'Purchase Course'}
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
