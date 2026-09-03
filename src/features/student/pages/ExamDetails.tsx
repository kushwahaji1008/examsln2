import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, ShieldAlert, Monitor, Video, Mic, Loader2, AlertCircle } from 'lucide-react';
import { startExam, getExamAttempts } from '@/services/api/attemptsApi';
import { getExam } from '@/services/api/examsApi';
import { useParams } from 'react-router-dom';

export default function ExamDetails() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [exam, setExam] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  React.useEffect(() => {
    if (!examId) return;
    getExam(examId).then(setExam).catch(console.error).finally(() => setFetching(false));
  }, [examId]);
  const [agreed, setAgreed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    if (!agreed) return;
    setLoading(true);
    setError(null);
    try {
      const attempt = await startExam({ examId: examId as string });
      navigate(`/attempts/${attempt.attemptId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to start exam.');
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex h-[calc(100vh-5rem)] w-full items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  if (!exam) return <div className="p-8 text-center text-destructive">Exam not found</div>;

  return (
    <div className="max-w-4xl mx-auto font-sans py-8 p-4">
      {error && (
        <div className="mb-4 flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-[2rem] p-8 text-primary-foreground mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <div className="relative z-10">
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-500/30 mb-4 inline-block">
            {exam.type || 'Assessment'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">{exam.title}</h1>
          <p className="text-slate-400">Please read all instructions carefully before beginning your attempt.</p>
          
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Duration</div>
                <div className="font-bold">{exam.durationMinutes} Minutes</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Passing Marks</div>
                <div className="font-bold">0 / 100</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Rules and Instructions */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-border/10 rounded-[2rem] p-8 shadow-lg backdrop-blur-xl">
            <h2 className="text-xl font-bold text-primary-foreground mb-4 border-b border-slate-800 pb-4">Exam Instructions</h2>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="bg-slate-800 text-sky-400 border border-slate-700 rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">1</span>
                <span>The timer will begin immediately upon clicking "Start Exam". You cannot pause the timer once started.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-slate-800 text-sky-400 border border-slate-700 rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">2</span>
                <span>There is a <strong>-0.5 negative mark</strong> for every incorrect multiple-choice answer.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-slate-800 text-sky-400 border border-slate-700 rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">3</span>
                <span>Ensure you have a stable internet connection. If disconnected, your answers will auto-save, but the timer will continue running.</span>
              </li>
            </ul>
          </div>

          {/* AI Proctoring Warning */}
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-[2rem] p-8">
            <div className="flex items-center gap-3 mb-4 text-rose-400">
              <ShieldAlert className="w-6 h-6" />
              <h2 className="text-lg font-bold">Strict Proctoring Enabled</h2>
            </div>
            <p className="text-sm text-rose-300/80 mb-4">This exam uses AI-driven proctoring to ensure academic integrity. The following will be monitored:</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-900/90 rounded-xl p-3 text-center border border-rose-500/20 shadow-sm">
                <Monitor className="w-5 h-5 text-rose-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-slate-300">Screen Lock</span>
              </div>
              <div className="bg-slate-900/90 rounded-xl p-3 text-center border border-rose-500/20 shadow-sm">
                <Video className="w-5 h-5 text-rose-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-slate-300">Webcam</span>
              </div>
              <div className="bg-slate-900/90 rounded-xl p-3 text-center border border-rose-500/20 shadow-sm">
                <Mic className="w-5 h-5 text-rose-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-slate-300">Microphone</span>
              </div>
            </div>
          </div>
        </div>

        {/* Start Action Box */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-border/10 rounded-[2rem] p-6 shadow-lg backdrop-blur-xl sticky top-24">
            <h3 className="text-lg font-bold text-primary-foreground mb-4">Ready to begin?</h3>
            
            <label className="flex items-start gap-3 mb-6 cursor-pointer group">
              <div className="relative flex items-start">
                <input type="checkbox" className="peer sr-only" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <div className="w-5 h-5 border-2 border-slate-700 rounded bg-slate-950 peer-checked:bg-sky-500 peer-checked:border-sky-500 transition flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100" />
                </div>
              </div>
              <span className="text-xs text-slate-400 leading-tight pt-0.5 group-hover:text-slate-200 transition">
                I agree to the honor code and consent to webcam/screen monitoring during this session.
              </span>
            </label>
            
            <button 
              onClick={handleStart}
              disabled={!agreed}
              className="w-full py-4 rounded-xl bg-sky-500 text-primary-foreground font-bold text-sm hover:bg-sky-400 transition shadow-lg shadow-sky-500/30 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Start Exam Now'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}