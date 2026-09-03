import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Save, Layers } from 'lucide-react';
import { createSection } from '@/services/api/coursesApi';

export default function TeacherCourseSectionNew() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseId) return setError('Title is required.');
    
    setLoading(true);
    setError(null);
    
    try {
      await createSection(courseId, { 
        title,
        description,
        orderIndex: 0 
      });
      navigate(`/courses/${courseId}/curriculum`, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create section.');
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
          <Layers className="w-8 h-8 text-primary" />
          Add New Section
        </h1>
        <p className="text-muted-foreground mt-1">Organize your course content into modules or chapters.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 font-semibold">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Section Title *</label>
          <input 
             type="text" 
             value={title} 
             onChange={e => setTitle(e.target.value)}
            required
            autoFocus
            placeholder="e.g., Module 1: Introduction"
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description (Optional)</label>
          <textarea 
             value={description} 
             onChange={e => setDescription(e.target.value)}
            rows={3}
            placeholder="What will students learn in this section?"
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
          />
        </div>

        <div className="pt-6 border-t border-border flex justify-end">
          <button 
             type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Create Section</>}
          </button>
        </div>
      </form>
    </div>
  );
}
