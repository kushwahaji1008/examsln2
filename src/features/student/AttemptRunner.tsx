import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getAttemptById, 
  getAttemptNavigation, 
  getAttemptQuestion, 
  submitAnswer, 
  markQuestionForReview, 
  unmarkQuestionForReview,
  submitAttempt,
  clearAnswer
} from '@/services/api/attemptsApi';
import { Loader2, AlertCircle, Clock, ChevronRight, ChevronLeft, Flag, CheckCircle2, Menu, X, Save } from 'lucide-react';
import type { ExamAttempt, AttemptNavigationState, Question, QuestionOption } from '@/services/api/types/api';

export default function AttemptRunner() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [navState, setNavState] = useState<AttemptNavigationState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  // Answer state for current question
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Initial load
  useEffect(() => {
    if (!attemptId) return;
    const init = async () => {
      try {
        const att = await getAttemptById(attemptId);
        setAttempt(att);
        setTimeLeft(att.remainingSeconds || 3600); // fallback 1h if missing
        
        if (att.status === 'Submitted' || att.status === 'ForceSubmitted' || att.status === 'Terminated') {
           navigate('/student/exams', { replace: true });
           return;
        }

        const nav = await getAttemptNavigation(attemptId);
        setNavState(nav);
        
        if (nav.questions && nav.questions.length > 0) {
          const currentId = nav.questions[nav.currentQuestionIndex]?.questionId || nav.questions[0].questionId;
          await loadQuestion(currentId);
        }
      } catch (err: any) {
        setError('Failed to initialize exam session.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [attemptId, navigate]);

  // Timer countdown
  useEffect(() => {
    if (!attempt || loading) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [attempt, loading]);

  const loadQuestion = async (questionId: string) => {
    if (!attemptId) return;
    setLoading(true);
    try {
      const q = await getAttemptQuestion(attemptId, questionId);
      setCurrentQuestion(q);
      
      // Pre-fill existing answers based on response format
      // Note: this assumes the API returns the student's current answer in the question object.
      // E.g., q.studentAnswer.selectedOption
      if (q.studentAnswer) {
        setSelectedOption(q.studentAnswer.selectedOption || null);
        setSelectedOptions(q.studentAnswer.selectedOptions || []);
        setTextAnswer(q.studentAnswer.textAnswer || '');
      } else {
        setSelectedOption(null);
        setSelectedOptions([]);
        setTextAnswer('');
      }

      // Update nav state to highlight current
      setNavState(prev => prev ? {
        ...prev,
        currentQuestionIndex: prev.questions.findIndex(x => x.questionId === questionId)
      } : prev);

    } catch (err) {
      setError('Failed to load question.');
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentAnswer = async () => {
    if (!attemptId || !currentQuestion) return;
    setIsSaving(true);
    try {
      await submitAnswer(attemptId, currentQuestion.questionId || currentQuestion.id, {
        selectedOption,
        selectedOptions: selectedOptions.length > 0 ? selectedOptions : undefined,
        textAnswer: textAnswer ? textAnswer : undefined
      });
      // Refresh nav state to show "answered"
      const nav = await getAttemptNavigation(attemptId);
      setNavState(nav);
    } catch (err) {
      // maybe show toast
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearAnswer = async () => {
    if (!attemptId || !currentQuestion) return;
    setIsSaving(true);
    try {
      await clearAnswer(attemptId, currentQuestion.questionId || currentQuestion.id);
      setSelectedOption(null);
      setSelectedOptions([]);
      setTextAnswer('');
      const nav = await getAttemptNavigation(attemptId);
      setNavState(nav);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    await saveCurrentAnswer();
    if (!navState || !currentQuestion) return;
    const currentIndex = navState.questions.findIndex(q => q.questionId === (currentQuestion.questionId || currentQuestion.id));
    if (currentIndex < navState.questions.length - 1) {
      await loadQuestion(navState.questions[currentIndex + 1].questionId);
    }
  };

  const handlePrev = async () => {
    await saveCurrentAnswer();
    if (!navState || !currentQuestion) return;
    const currentIndex = navState.questions.findIndex(q => q.questionId === (currentQuestion.questionId || currentQuestion.id));
    if (currentIndex > 0) {
      await loadQuestion(navState.questions[currentIndex - 1].questionId);
    }
  };

  const toggleReviewMark = async () => {
    if (!attemptId || !currentQuestion) return;
    const qId = currentQuestion.questionId || currentQuestion.id;
    const navQ = navState?.questions.find(q => q.questionId === qId);
    if (!navQ) return;
    
    const isMarked = navQ.status === 'marked_review' || navQ.status === 'answered_and_marked';
    
    try {
      if (isMarked) {
        await unmarkQuestionForReview(attemptId, qId);
      } else {
        await markQuestionForReview(attemptId, qId);
      }
      const nav = await getAttemptNavigation(attemptId);
      setNavState(nav);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitExam = async () => {
    if (!attemptId) return;
    if (!window.confirm("Are you sure you want to submit? You will not be able to change your answers.")) return;
    
    await saveCurrentAnswer();
    setLoading(true);
    try {
      await submitAttempt(attemptId);
      navigate('/student/exams', { replace: true });
    } catch (err) {
      setError('Failed to submit exam.');
      setLoading(false);
    }
  };

  const handleAutoSubmit = async () => {
    if (!attemptId) return;
    await saveCurrentAnswer();
    try {
      await submitAttempt(attemptId);
      navigate('/student/exams', { replace: true });
    } catch (err) {
      console.error("Auto submit failed", err);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading && !attempt) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8 max-w-md bg-destructive/10 rounded-3xl border border-destructive/20">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-xl font-bold text-destructive">Session Error</h2>
          <p className="text-sm text-destructive/80">{error || 'Session could not be loaded.'}</p>
          <button onClick={() => navigate('/student/exams')} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-xl text-sm font-semibold">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isMarked = navState?.questions[navState.currentQuestionIndex]?.status === 'marked_review' || navState?.questions[navState.currentQuestionIndex]?.status === 'answered_and_marked';

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background font-sans text-foreground select-none">
      
      {/* Top Header */}
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -ml-2 rounded-lg hover:bg-secondary text-muted-foreground lg:hidden">
            <Menu className="w-5 h-5" />
          </button>
          <div className="font-bold text-lg tracking-tight">Exam Session</div>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-sm font-bold border shadow-inner ${
            timeLeft < 300 ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse' : 'bg-secondary border-border text-foreground'
          }`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
          <button 
            onClick={handleSubmitExam}
            className="bg-destructive text-destructive-foreground px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-destructive/90 transition-all shadow-md"
          >
            End Exam
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full bg-secondary/20 relative z-0">
          {loading ? (
             <div className="flex-1 flex items-center justify-center">
               <Loader2 className="w-8 h-8 animate-spin text-primary" />
             </div>
          ) : currentQuestion ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar pb-32">
              <div className="max-w-4xl mx-auto space-y-8">
                
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                    Question {navState ? navState.currentQuestionIndex + 1 : 1} of {navState?.totalQuestions}
                  </div>
                  <div className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    Marks: <span className="text-foreground font-bold">{currentQuestion.marks || 1}</span>
                  </div>
                </div>

                <div className="bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <h2 className="text-lg sm:text-xl font-medium leading-relaxed mb-8">
                    {currentQuestion.questionText}
                  </h2>

                  {/* Options rendering based on type */}
                  <div className="space-y-3">
                    {currentQuestion.type === 'MultipleChoice' || currentQuestion.type === 'MCQ' || currentQuestion.type === 0 ? (
                      currentQuestion.options?.map((opt: QuestionOption) => (
                        <label 
                          key={opt.id || opt.optionId} 
                          className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            selectedOption === (opt.id || opt.optionId) 
                              ? 'border-primary bg-primary/5 shadow-sm' 
                              : 'border-border/50 bg-secondary/50 hover:border-border hover:bg-secondary'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            selectedOption === (opt.id || opt.optionId) ? 'border-primary' : 'border-muted-foreground/30'
                          }`}>
                            {selectedOption === (opt.id || opt.optionId) && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                          </div>
                          <span className="text-[15px] leading-snug">{opt.text}</span>
                        </label>
                      ))
                    ) : currentQuestion.type === 'Subjective' || currentQuestion.type === 'ShortAnswer' || currentQuestion.type === 3 ? (
                      <textarea
                        value={textAnswer}
                        onChange={(e) => setTextAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full h-48 bg-secondary/50 border border-border rounded-2xl p-4 text-[15px] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      />
                    ) : (
                      <div className="p-4 bg-amber-500/10 text-amber-500 rounded-xl text-sm font-medium">
                        Unsupported question type for preview renderer.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground font-medium">
              No questions found.
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t border-border shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-10">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              
              <div className="flex gap-2 sm:gap-4">
                <button 
                  onClick={toggleReviewMark}
                  disabled={loading || !currentQuestion}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isMarked 
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                    : 'bg-secondary text-foreground hover:bg-secondary/80 border border-transparent'
                  }`}
                >
                  <Flag className={`w-4 h-4 ${isMarked ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>
                <button 
                  onClick={handleClearAnswer}
                  disabled={loading || !currentQuestion || (!selectedOption && selectedOptions.length === 0 && !textAnswer)}
                  className="px-3 sm:px-4 py-2.5 bg-secondary text-foreground text-sm font-semibold rounded-xl hover:bg-secondary/80 transition-all disabled:opacity-50"
                >
                  Clear
                </button>
              </div>

              <div className="flex gap-2 sm:gap-4">
                <button 
                  onClick={handlePrev}
                  disabled={loading || !navState || navState.currentQuestionIndex === 0}
                  className="flex items-center gap-1 px-3 sm:px-5 py-2.5 bg-secondary text-foreground text-sm font-semibold rounded-xl hover:bg-secondary/80 transition-all disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                
                <button 
                  onClick={handleNext}
                  disabled={loading || !navState || navState.currentQuestionIndex === navState.totalQuestions - 1}
                  className="flex items-center gap-1 px-4 sm:px-6 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <span>Next</span>
                      <ChevronRight className="w-5 h-5 -mr-1" />
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </main>

        {/* Sidebar Overlay (Mobile) */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar Navigation Grid */}
        <aside className={`absolute lg:relative right-0 top-0 bottom-0 w-72 bg-card border-l border-border shadow-2xl lg:shadow-none z-30 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0 lg:w-72'
        } ${!sidebarOpen && 'lg:hidden'}`}>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between lg:justify-center">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Question Navigator</h3>
              <button className="lg:hidden p-1 rounded-md hover:bg-secondary" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div className="grid grid-cols-5 gap-2">
                {navState?.questions.map((q, idx) => {
                  const isCurrent = navState.currentQuestionIndex === idx;
                  const isAnswered = q.status === 'answered' || q.status === 'answered_and_marked';
                  const isReview = q.status === 'marked_review' || q.status === 'answered_and_marked';
                  
                  return (
                    <button
                      key={q.questionId}
                      onClick={() => {
                        saveCurrentAnswer().then(() => loadQuestion(q.questionId));
                      }}
                      className={`relative aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                        isCurrent 
                        ? 'bg-primary text-primary-foreground shadow-md scale-110 z-10' 
                        : isAnswered && isReview
                        ? 'bg-amber-500 text-white'
                        : isReview
                        ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                        : isAnswered
                        ? 'bg-emerald-500 text-white'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {idx + 1}
                      {/* Indicator dot if answered and not active */}
                      {isAnswered && !isCurrent && !isReview && (
                        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full border-2 border-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Legend */}
            <div className="p-4 border-t border-border bg-secondary/20 space-y-2 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500 shrink-0" /> Answered
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30 shrink-0" /> Marked for Review
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-500 shrink-0" /> Answered & Marked
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-secondary shrink-0" /> Unanswered
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
