import React, { useState, useEffect } from 'react';
import { Search, Download, ExternalLink, Paperclip, Loader2, AlertCircle, BookOpen } from 'lucide-react';
import apiClient from '@/services/api/client';

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchResources = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClient.get('/api/v1/videos/courses').catch(() => ({ data: [] }));
        if (!isMounted) return;

        const coursesList = Array.isArray(res.data) ? res.data : [];
        const extracted: any[] = [];

        coursesList.forEach((course: any) => {
          if (Array.isArray(course.resources) && course.resources.length > 0) {
            course.resources.forEach((r: any, idx: number) => {
              extracted.push({
                id: r.id || `${course.courseId}-res-${idx}`,
                title: r.title || r.name || 'Study Material',
                course: course.title || 'Course',
                type: r.url?.startsWith('http') ? 'link' : 'pdf',
                url: r.url || '#',
                size: r.size || 'PDF Document'
              });
            });
          } else {
            // Include course syllabus or materials
            extracted.push({
              id: `course-${course.courseId}`,
              title: `${course.title} Syllabus & Reading Materials`,
              course: course.title,
              type: 'pdf',
              url: course.thumbnailUrl || '/IMG-20260825-WA6378.jpg',
              size: `${course.durationHours || 4}h course guide`
            });
          }
        });

        setResources(extracted);
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load study resources.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResources();

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = resources.filter(res => 
    res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8 font-sans text-slate-100 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground">Study Resources</h1>
        <p className="mt-2 text-sm text-slate-400">Access all your downloadable course materials, lecture notes, and guides.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
        <input 
          type="text" 
          placeholder="Search resources by title or course..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 pl-12 pr-4 py-3 text-sm text-primary-foreground placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 backdrop-blur-xl"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-sky-400">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <h3 className="text-lg font-bold text-primary-foreground mb-1">No resources found</h3>
          <p className="text-sm text-slate-500">Try adjusting your search filter or check enrolled courses.</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-border/10 bg-slate-900/80 backdrop-blur-xl overflow-hidden shadow-lg">
          <div className="divide-y divide-border/5">
            {filtered.map((res) => (
              <div key={res.id} className="flex items-center justify-between p-4 sm:p-6 hover:bg-slate-800/50 transition">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-sky-400 border border-border/5">
                    {res.type === 'link' ? <ExternalLink className="h-5 w-5" /> : <Paperclip className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-primary-foreground">{res.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="rounded-md bg-slate-800/90 px-2 py-0.5 border border-border/5 text-slate-300 font-medium">{res.course}</span>
                      {res.size && <span>{res.size}</span>}
                    </div>
                  </div>
                </div>
                
                <a 
                  href={res.url !== '#' ? res.url : undefined} 
                  download={res.type !== 'link'} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-sky-500 hover:text-primary-foreground transition shadow-sm"
                >
                  {res.type === 'link' ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}