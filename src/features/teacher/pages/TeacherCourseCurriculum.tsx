import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Loader2, ArrowLeft, Plus, Edit2, Trash2, Move, AlertCircle, PlayCircle, 
  FileText, CheckSquare, Save, X, GripVertical
} from 'lucide-react';
import { getCourseSections, createSection, deleteSection, updateSection } from '@/services/api/coursesApi';
import { createCurriculumItem, deleteCurriculumItem } from '@/services/api/coursesApi2';
import { getCourseById } from '@/services/api/coursesApi';
import type { Course, ExamSection } from '@/services/api/types/api';

export default function TeacherCourseCurriculum() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New section state
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // New item state (tied to a specific section)
  const [addingItemToSection, setAddingItemToSection] = useState<string | null>(null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemType, setNewItemType] = useState<number>(0); // 0=Video, 1=Quiz, etc.
  const [newItemUrl, setNewItemUrl] = useState('');

  useEffect(() => {
    if (!courseId) return;
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [courseData, sectionsData] = await Promise.all([
        getCourseById(courseId!),
        getCourseSections(courseId!)
      ]);
      setCourse(courseData);
      setSections(sectionsData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch curriculum.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = async () => {
    if (!newSectionTitle.trim() || !courseId) return;
    setActionLoading(true);
    try {
      await createSection(courseId, { title: newSectionTitle });
      setNewSectionTitle('');
      setIsAddingSection(false);
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to create section.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!courseId || !window.confirm("Delete this section and all its contents?")) return;
    try {
      await deleteSection(courseId, sectionId);
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete section.');
    }
  };

  const handleAddItem = async (sectionId: string) => {
    if (!newItemTitle.trim() || !courseId) return;
    setActionLoading(true);
    try {
      await createCurriculumItem(courseId, sectionId, { 
        title: newItemTitle,
        type: newItemType as any,
        contentUrl: newItemUrl || undefined,
        isFreePreview: false,
        durationSeconds: 0
      });
      setNewItemTitle('');
      setNewItemUrl('');
      setAddingItemToSection(null);
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to add item.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteItem = async (sectionId: string, itemId: string) => {
    if (!courseId || !window.confirm("Delete this item?")) return;
    try {
      await deleteCurriculumItem(courseId, sectionId, itemId);
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete item.');
    }
  };

  const getItemIcon = (type: any) => {
    if (type === 'Video' || type === 0) return <PlayCircle className="w-4 h-4" />;
    if (type === 'Quiz' || type === 2) return <CheckSquare className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold text-destructive">Course Not Found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8 font-sans pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to={`/courses/${courseId}`} className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Course Details
          </Link>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Curriculum</h1>
          <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
            Managing curriculum for: <span className="font-bold text-foreground">{course.title}</span>
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-6">
        {sections.length === 0 ? (
          <div className="text-center p-12 bg-card border border-dashed border-border rounded-3xl">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-bold">Your curriculum is empty</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">Start by adding a section (e.g., "Introduction", "Module 1").</p>
            <button 
              onClick={() => setIsAddingSection(true)}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add First Section
            </button>
          </div>
        ) : (
          sections.map((section, sIdx) => {
            const secId = section.id || section.sectionId || sIdx;
            return (
              <div key={secId} className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
                
                {/* Section Header */}
                <div className="bg-secondary/30 p-4 sm:p-5 flex items-center justify-between border-b border-border/50 group">
                  <div className="flex items-center gap-3">
                    <button className="cursor-grab p-1 text-muted-foreground/50 hover:text-foreground hover:bg-secondary rounded">
                      <GripVertical className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-sm text-primary uppercase tracking-wide">Section {sIdx + 1}:</span>
                    <h3 className="text-base font-bold text-foreground">{section.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDeleteSection(secId)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Section Items */}
                <div className="p-4 sm:p-6 space-y-3">
                  {(!section.items || section.items.length === 0) ? (
                    <div className="text-center p-6 bg-secondary/20 border border-dashed border-border/50 rounded-2xl text-sm text-muted-foreground">
                      No items in this section yet.
                    </div>
                  ) : (
                    section.items.map((item: any, iIdx: number) => {
                      const itemId = item.id || item.itemId || iIdx;
                      return (
                        <div key={itemId} className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-2xl hover:border-border transition-colors group">
                          <div className="flex items-center gap-3">
                            <button className="cursor-grab p-1 text-muted-foreground/30 hover:text-foreground">
                              <GripVertical className="w-4 h-4" />
                            </button>
                            <div className={`p-2 rounded-lg ${item.type === 0 || item.type === 'Video' ? 'bg-sky-500/10 text-sky-500' : 'bg-amber-500/10 text-amber-500'}`}>
                              {getItemIcon(item.type)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground">{item.title}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                <span>{item.type === 0 || item.type === 'Video' ? 'Video Lesson' : item.type === 2 || item.type === 'Quiz' ? 'Quiz / Assessment' : 'Document / PDF'}</span>
                                {item.contentUrl && <span className="text-sky-500 truncate max-w-[200px]" title={item.contentUrl}>• {item.contentUrl}</span>}
                                {item.isFreePreview && <span className="bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">Free Preview</span>}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteItem(secId, itemId)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Add Item Trigger / Form */}
                  {addingItemToSection === secId ? (
                    <div className="p-4 bg-secondary/20 border border-primary/20 rounded-2xl space-y-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <select 
                            value={newItemType}
                            onChange={(e) => setNewItemType(Number(e.target.value))}
                            className="bg-background border border-border rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option value={0}>Video Lesson</option>
                            <option value={2}>Quiz / Assessment</option>
                            <option value={1}>Document / PDF</option>
                          </select>
                          <input 
                            type="text" 
                            autoFocus
                            placeholder="E.g., Introduction to Neural Networks" 
                            value={newItemTitle}
                            onChange={(e) => setNewItemTitle(e.target.value)}
                            className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <input 
                            type="text" 
                            placeholder={newItemType === 0 ? "Video URL (e.g. YouTube, Vimeo)" : newItemType === 2 ? "Exam/Quiz URL or ID" : "Document PDF Link"} 
                            value={newItemUrl}
                            onChange={(e) => setNewItemUrl(e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                          <p className="text-xs text-muted-foreground ml-1">Optional. Provide a link to the content.</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setAddingItemToSection(null); setNewItemTitle(''); setNewItemUrl(''); }}
                          className="px-4 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:bg-secondary transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleAddItem(secId)}
                          disabled={!newItemTitle.trim() || actionLoading}
                          className="px-4 py-2 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                          {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                          Save Item
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setAddingItemToSection(secId)}
                      className="w-full flex items-center justify-center gap-2 p-3 mt-2 rounded-2xl border-2 border-dashed border-border/50 text-sm font-bold text-muted-foreground hover:text-foreground hover:border-border hover:bg-secondary/30 transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Curriculum Item
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Section Trigger / Form */}
      {sections.length > 0 && (
        <div className="pt-4">
          {isAddingSection ? (
            <div className="bg-card border border-primary/20 shadow-lg shadow-primary/5 p-5 rounded-3xl flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                autoFocus
                placeholder="E.g., Module 2: Advanced Topics" 
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => { setIsAddingSection(false); setNewSectionTitle(''); }}
                  className="px-5 py-3 rounded-xl text-sm font-bold bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddSection}
                  disabled={!newSectionTitle.trim() || actionLoading}
                  className="px-5 py-3 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Section
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsAddingSection(true)}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-3xl border-2 border-dashed border-border text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/30 hover:border-primary/50 transition-all"
            >
              <Plus className="w-5 h-5" /> Add New Section
            </button>
          )}
        </div>
      )}

    </div>
  );
}
