import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Save, UploadCloud } from 'lucide-react';
import { createCourse } from '@/services/api/coursesApi';
import type { CreateCourseRequest } from '@/services/api/types/api';
import { useGoogleLogin } from '@react-oauth/google';

export default function TeacherCourseNew() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<number>(0);
  const [price, setPrice] = useState(0);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  const uploadToDrive = async (file: File, token: string): Promise<string> => {
    const metadata = {
      name: `Course_Thumbnail_${Date.now()}_${file.name}`,
      mimeType: file.type,
    };
    
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    const uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,webContentLink', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: form
    });
    
    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error('Drive upload failed:', errText);
      throw new Error('Failed to upload thumbnail to Google Drive.');
    }
    
    const data = await uploadRes.json();

    // Make file public
    await fetch(`https://www.googleapis.com/drive/v3/files/${data.id}/permissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: 'reader', type: 'anyone' })
    });

    return data.webViewLink || data.webContentLink;
  };

  const submitCourse = async (thumbnailUrl?: string) => {
    try {
      const payload: CreateCourseRequest = { 
        title, 
        description, 
        level, 
        price,
        thumbnailUrl
      };
      const newCourse = await createCourse(payload);
      navigate(`/courses/${newCourse.id || (newCourse as any).courseId}`, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create course. Please try again.');
      setLoading(false);
    }
  };

  const loginAndUpload = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/drive.file',
    onSuccess: async (tokenResponse) => {
      try {
        if (!thumbnailFile) return;
        const driveUrl = await uploadToDrive(thumbnailFile, tokenResponse.access_token);
        await submitCourse(driveUrl);
      } catch (err: any) {
        setError(err.message || 'Failed to upload image.');
        setLoading(false);
      }
    },
    onError: (err) => {
      console.error(err);
      setError('Google authentication failed. Cannot upload thumbnail.');
      setLoading(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return setError('Title is required.');
    
    setLoading(true);
    setError(null);
    
    if (thumbnailFile) {
      // Trigger Google OAuth popup to upload file
      loginAndUpload();
    } else {
      // Proceed without thumbnail
      submitCourse();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8 font-sans pb-24">
      <div>
        <Link to="/courses" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Courses
        </Link>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Create New Course</h1>
        <p className="text-muted-foreground mt-1">Start building your educational content.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 font-semibold">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Course Thumbnail</label>
          <div className="flex items-center gap-6">
            <div className="w-32 h-24 bg-secondary/50 border border-border rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 relative">
              {thumbnailPreview ? (
                <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
              ) : (
                <UploadCloud className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <input 
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">Upload an image. Will be saved to your Google Drive.</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Course Title *</label>
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="e.g. Advanced System Design"
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</label>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)}
            rows={4}
            placeholder="What will students learn?"
            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Level</label>
            <select
              value={level}
              onChange={e => setLevel(Number(e.target.value))}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none"
            >
              <option value={0}>Beginner (0)</option>
              <option value={1}>Intermediate (1)</option>
              <option value={2}>Advanced (2)</option>
              <option value={3}>All Levels (3)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price (USD)</label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              value={price} 
              onChange={e => setPrice(parseFloat(e.target.value) || 0)}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-border flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Course</>}
          </button>
        </div>
      </form>
    </div>
  );
}
