import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
import apiClient from "@/services/api/client";
import { Clock, Target, Calendar, ArrowRight, ShieldAlert, Loader2, AlertCircle } from 'lucide-react';
import { getUpcomingExams, getActiveExams, getExams } from '@/services/api/examsApi';

interface Exam {
  id: string;
  title: string;
  durationMinutes: number;
  totalMarks: number;
  scheduledStartTime: string;
  settings?: {
    requireProctoring: boolean;
  };
}

export default function StudentExams() {
  const [activeTab, setActiveTab] = useState<'my-exams' | 'available'>('my-exams');
  
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        setError(null);
        // Toggle endpoint based on tab
        

          
        const data = activeTab === 'my-exams' ? await getUpcomingExams() : await getExams({ status: 'Published' });
        setExams(data);
      } catch (err: any) {
        console.error("Failed to fetch exams:", err);
        setError(err.response?.data?.message || 'Failed to load exams.');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [activeTab]);

  const handleRegister = async (examId: string) => {
    try {
      setRegisteringId(examId);
      // Backend route to register for an exam
      await apiClient.post(`/exams/${examId}/register`);
      alert("Successfully registered for exam!");
      setActiveTab('my-exams'); // Switch tab to show it
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to register. Please try again.");
    } finally {
      setRegisteringId(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Open Schedule";
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' 
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans pb-12">
      <PageHeader title="Exam Center" subtitle="Manage your upcoming assessments and view available certifications." />

      {/* Tabs */}
      <div className="flex p-1 bg-slate-900/90 border border-slate-800 rounded-2xl w-fit mb-6">
        <button 
          onClick={() => setActiveTab('my-exams')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'my-exams' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'}`}
        >
          My Exams
        </button>
        <button 
          onClick={() => setActiveTab('available')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'available' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Available Exams
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-sky-400">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="text-slate-400 font-medium">Loading {activeTab === 'my-exams' ? 'your' : 'available'} exams...</p>
        </div>
      )}

      {!loading && error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-center font-bold">
          <AlertCircle className="w-6 h-6 mx-auto mb-2" /> {error}
        </div>
      )}

      {!loading && !error && exams.length === 0 && (
        <div className="text-center py-20 bg-slate-900/80 border border-border/10 rounded-[2rem] text-slate-400">
          <Target className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <h3 className="text-lg font-bold text-primary-foreground mb-2">No exams found</h3>
          {activeTab === 'my-exams' ? (
            <button onClick={() => setActiveTab('available')} className="text-sky-400 font-bold hover:underline">Register for an exam</button>
          ) : (
            <p>There are no exams available at the moment.</p>
          )}
        </div>
      )}

      {/* List Layout for My Exams, Grid layout for Available Exams */}
      {!loading && !error && exams.length > 0 && (
        <div className={activeTab === 'my-exams' ? "grid gap-4" : "grid sm:grid-cols-2 gap-6"}>
          
          {exams.map(exam => (
            <div key={exam.examId} className={
              activeTab === 'my-exams' 
                ? "flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-slate-900/80 border border-border/10 rounded-[1.5rem] shadow-lg backdrop-blur-xl transition"
                : "flex flex-col bg-slate-900/80 border border-border/10 rounded-[2rem] p-6 shadow-lg backdrop-blur-xl hover:-translate-y-1 transition duration-300"
            }>
              
              <div className={activeTab === 'available' ? "flex-1 mb-6" : ""}>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-primary-foreground">{exam.title}</h3>
                  {exam.settings?.requireProctoring && activeTab === 'my-exams' && (
                    <span className="bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-rose-500/20 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Proctored
                    </span>
                  )}
                </div>
                
                <div className={`text-sm text-slate-400 ${activeTab === 'available' ? 'space-y-2 mt-4' : 'flex items-center gap-4'}`}>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-500" /> {formatDate(exam.scheduledStartTime)}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-500" /> {exam.durationMinutes} mins</span>
                  <span className="flex items-center gap-1.5"><Target className="w-4 h-4 text-slate-500" /> {exam.totalMarks} marks</span>
                </div>

                {exam.settings?.requireProctoring && activeTab === 'available' && (
                  <div className="flex items-center gap-2 text-sm text-rose-400 font-medium mt-4 p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                    <ShieldAlert className="w-4 h-4" /> Strictly Proctored
                  </div>
                )}
              </div>

              <div className={activeTab === 'available' ? "w-full" : "mt-4 sm:mt-0"}>
                {activeTab === 'my-exams' ? (
                  <Link to={`/student/exams/${exam.examId}`} className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-lg shadow-sky-500/20 whitespace-nowrap">
                    Enter Lobby <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button 
                    onClick={() => handleRegister(exam.examId)}
                    disabled={registeringId === exam.examId}
                    className="w-full text-center bg-sky-500 hover:bg-sky-400 text-primary-foreground py-3 rounded-xl text-sm font-bold transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {registeringId === exam.examId ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register Now'}
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}