import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, Save, FilePlus2, PlayCircle, FileText, HelpCircle } from 'lucide-react';
import { getCourseSections } from '@/services/api/coursesApi';
import { createCurriculumItem } from '@/services/api/coursesApi2';

export default function TeacherCourseMaterialNew() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [fetchingSections, setFetchingSections] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [sections, setSections] = useState<any[]>([]);
  const [sectionId, setSectionId] = useState('');
  
  // Try to read material type from query params (e.g. ?type=video or ?type=pdf)
  const searchParams = new URLSearchParams(location.search);
  const initialTypeStr = searchParams.get('type');
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState<number>(initialTypeStr === 'pdf' ? 1 : initialTypeStr === 'quiz' ? 2 : 0); // 0=Video, 1=Doc, 2=Quiz
  const [url, setUrl] = useState('');
  
  useEffect(() => {
    const fetchSections = async () => {
      if (!courseId) return;
      try {
        const sectionsData = await getCourseSections(courseId);
        setSections(sectionsData || []);
        if (sectionsData && sectionsData.length > 0) {
          setSectionId(sectionsData[0].id || sectionsData[0].sectionId);
        }
      } catch (err: any) {
        console.error("Failed to fetch sections:", err);
      } finally {
        setFetchingSections(false);
      }
    };
    fetchSections();
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseId || !sectionId) return setError('Title and Section are required.');
    
    setLoading(true);
    setError(null);
    
    try {
      await createCurriculumItem(courseId, sectionId, {
        title,
        type,
        contentUrl: url,
        durationMinutes: 0,
        orderIndex: 0
      });
      navigate(`/courses/${courseId}/curriculum`, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to add material.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8 font-sans pb-24">
      <div>
        <Link to={`/courses/${courseId}/curriculum`} className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Curriculum
        </Link>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
          <FilePlus2 className="w-8 h-8 text-primary" />
          Add Course Material
        </h1>
        <p className="text-muted-foreground mt-1">Add videos, PDFs, or other resources to a course section.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 font-semibold">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Section *</label>
          <div className="relative">
            <select 
               value={sectionId} 
               onChange={e => setSectionId(e.target.value)}
               disabled={fetchingSections || sections.length === 0}
               className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none"
            >
              {fetchingSections ? (
                <option value="">Loading sections...</option>
              ) : sections.length === 0 ? (
                <option value="">No sections available</option>
              ) : (
                sections.map(sec => (
                  <option key={sec.id || sec.sectionId} value={sec.id || sec.sectionId}>
                    {sec.title}
                  </option>
                ))
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
          {sections.length === 0 && !fetchingSections && (
             <div className="mt-2 text-sm text-destructive">
               You must <Link to={`/courses/${courseId}/sections/new`} className="underline font-semibold">create a section</Link> before adding materials.
             </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Material Type *</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setType(0)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${type === 0 ? 'bg-primary/10 border-primary text-primary' : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary'}`}
            >
              <PlayCircle className="w-5 h-5 mb-1" />
              <span className="text-xs font-semibold">Video</span>
            </button>
            <button
              type="button"
              onClick={() => setType(1)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${type === 1 ? 'bg-blue-500/10 border-blue-500 text-blue-500' : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary'}`}
            >
              <FileText className="w-5 h-5 mb-1" />
              <span className="text-xs font-semibold">Document (PDF)</span>
            </button>
            <button
              type="button"
              onClick={() => setType(2)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${type === 2 ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary'}`}
            >
              <HelpCircle className="w-5 h-5 mb-1" />
              <span className="text-xs font-semibold">Quiz</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title *</label>
          <input 
             type="text" 
             value={title} 
             onChange={e => setTitle(e.target.value)}
            required
            placeholder={type === 0 ? "e.g., Lesson 1: Basics" : type === 1 ? "e.g., Chapter 1 Notes (PDF)" : "e.g., Module 1 Quiz"}
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resource URL (Optional)</label>
          <input 
             type="url" 
             value={url} 
             onChange={e => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        <div className="pt-6 border-t border-border flex justify-end">
          <button 
             type="submit"
            disabled={loading || sections.length === 0}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Add Material</>}
          </button>
        </div>
      </form>
    </div>
  );
}
