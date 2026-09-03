import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ChevronLeft, ChevronRight, Clock, ShieldAlert, Flag, Send, 
  CheckCircle2, AlertCircle, Loader2, Maximize, Minimize, HelpCircle
} from 'lucide-react';
import { getAttemptById, getAttemptQuestions, submitAnswer, submitAttempt } from '@/services/api/attemptsApi';

export default function ActiveExam() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  
  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  // Fetch attempt and questions
  useEffect(() => {
    let isMounted = true;
    const fetchExamData = async () => {
      try {
        setLoading(true);
        const [attemptData, questionsData] = await Promise.all([
          getAttemptById(attemptId!),
          getAttemptQuestions(attemptId!)
        ]);
        
        if (!isMounted) return;
        setAttempt(attemptData);
        setQuestions(questionsData);
        setTimeLeft(attemptData.remainingSeconds || 0);
        
        // Populate initial answers (assuming backend doesn't return user answers in this endpoint, or if it does, map them)
        const initialAnswers: Record<string, any> = {};
        questionsData.forEach(q => {
           if (q.userAnswer) {
              initialAnswers[q.id || q.questionId] = q.userAnswer;
           }
        });
        setAnswers(initialAnswers);
        
      } catch (err: any) {
        if (isMounted) setError(err.response?.data?.message || 'Failed to load exam data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    if (attemptId) {
      fetchExamData();
    }
    return () => { isMounted = false; };
  }, [attemptId]);

  // Timer
  useEffect(() => {
    if (!loading && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerId);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [loading, timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const handleOptionChange = async (questionId: string, optionId: string, isMultiple: boolean) => {
    setAnswers(prev => {
      const updated = { ...prev };
      if (isMultiple) {
        let current = (updated[questionId] as string[]) || [];
        if (current.includes(optionId)) {
          current = current.filter(id => id !== optionId);
        } else {
          current = [...current, optionId];
        }
        updated[questionId] = current;
      } else {
        updated[questionId] = optionId;
      }
      
      // Auto-save in background
      saveAnswer(questionId, updated[questionId]);
      
      return updated;
    });
  };

  const saveAnswer = async (questionId: string, answer: any) => {
    try {
      const payload: any = {};
      if (Array.isArray(answer)) {
        payload.selectedOptions = answer;
      } else {
        payload.selectedOption = answer;
      }
      await submitAnswer(attemptId!, questionId, payload);
    } catch (e) {
      console.error("Failed to save answer", e);
    }
  };

  const handleSubmitExam = async () => {
    if (!window.confirm("Are you sure you want to submit your exam? You cannot change your answers after submission.")) return;
    
    setSubmitting(true);
    try {
      await submitAttempt(attemptId!);
      toast.success('Exam submitted successfully!');
      navigate(`/student/results/${attemptId}`);
    } catch (err: any) {
      toast.error("Failed to submit exam: " + (err.response?.data?.message || err.message));
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = async () => {
    toast.error("Time is up! Your exam will be submitted automatically.", { duration: 5000 });
    setSubmitting(true);
    try {
      await submitAttempt(attemptId!);
      toast.success('Exam submitted automatically!');
      navigate(`/student/results/${attemptId}`);
    } catch (err: any) {
      navigate(`/student/results/${attemptId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-3 font-semibold text-muted-foreground">Preparing your exam...</span>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background p-6">
        <div className="max-w-md w-full bg-card p-8 rounded-3xl border border-border text-center shadow-lg">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Exam Error</h2>
          <p className="text-muted-foreground mb-6">{error || 'Attempt not found.'}</p>
          <button onClick={() => navigate('/student/exams')} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold w-full hover:bg-primary/90">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isMultiple = currentQuestion?.type === 'MultipleChoice' || currentQuestion?.type === 1;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="font-bold text-lg text-foreground line-clamp-1">{attempt.examTitle || 'Exam Attempt'}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-sm border ${timeLeft < 300 ? 'bg-destructive/10 text-destructive border-destructive/20 animate-pulse' : 'bg-secondary text-foreground border-border'}`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
          <button 
            onClick={handleSubmitExam}
            disabled={submitting}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-emerald-50 px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Finish</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-7xl mx-auto w-full">
        
        {/* Left: Question Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col">
          {currentQuestion ? (
            <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-sm font-semibold text-muted-foreground">
                  {currentQuestion.marks} {currentQuestion.marks === 1 ? 'Mark' : 'Marks'}
                </span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug mb-8">
                {currentQuestion.questionText}
              </h2>

              <div className="space-y-3 mb-8 flex-1">
                {currentQuestion.options?.map((opt: any, idx: number) => {
                  const optId = opt.id || opt.optionId;
                  const isSelected = isMultiple 
                    ? (answers[currentQuestion.id || currentQuestion.questionId] as string[])?.includes(optId)
                    : answers[currentQuestion.id || currentQuestion.questionId] === optId;
                  
                  return (
                    <label 
                      key={optId || idx}
                      className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                          : 'border-border bg-card hover:bg-secondary/50 hover:border-border/80'
                      }`}
                    >
                      <div className="flex-shrink-0 mr-4">
                        {isMultiple ? (
                          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                            isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground bg-transparent'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                        ) : (
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected ? 'border-primary' : 'border-muted-foreground'
                          }`}>
                            {isSelected && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                          </div>
                        )}
                      </div>
                      <input 
                        type={isMultiple ? "checkbox" : "radio"}
                        className="hidden"
                        checked={isSelected}
                        onChange={() => handleOptionChange(currentQuestion.id || currentQuestion.questionId, optId, isMultiple)}
                      />
                      <span className="text-base text-foreground font-medium">{opt.text}</span>
                    </label>
                  );
                })}
              </div>

              {/* Bottom Nav */}
              <div className="flex items-center justify-between pt-6 border-t border-border mt-auto">
                <button
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground font-semibold hover:bg-secondary disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" /> Previous
                </button>
                <button
                  onClick={() => {
                    if (currentIndex === questions.length - 1) {
                      handleSubmitExam();
                    } else {
                      setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1));
                    }
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                  {currentIndex === questions.length - 1 ? 'Finish Exam' : 'Next'} <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              No questions found for this exam.
            </div>
          )}
        </div>

        {/* Right: Palette / Overview */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-card p-4 sm:p-6 overflow-y-auto">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Question Palette
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const qId = q.id || q.questionId;
              const hasAnswer = answers[qId] && (Array.isArray(answers[qId]) ? (answers[qId] as string[]).length > 0 : true);
              const isActive = idx === currentIndex;
              
              return (
                <button
                  key={qId}
                  onClick={() => setCurrentIndex(idx)}
                  className={`
                    w-full aspect-square flex items-center justify-center rounded-lg text-sm font-bold border transition-all
                    ${isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                    ${hasAnswer 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-secondary text-foreground border-border hover:bg-secondary/80'
                    }
                  `}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          
          <div className="mt-8 space-y-3 text-sm font-medium">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-primary border-primary"></div>
              <span className="text-foreground">Answered</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-secondary border border-border"></div>
              <span className="text-muted-foreground">Unanswered</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
