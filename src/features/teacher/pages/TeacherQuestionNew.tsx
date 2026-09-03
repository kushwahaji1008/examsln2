import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Plus, Trash2, Code, AlignLeft, CheckCircle2 } from 'lucide-react';
import { createQuestion } from '@/services/api/questionsApi';

export default function TeacherQuestionNew() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [questionText, setQuestionText] = useState('');
  const [marks, setMarks] = useState<number>(1);
  const [negativeMarks, setNegativeMarks] = useState<number>(0);
  const [type, setType] = useState<number>(0); // 0 = MCQ, 3 = ShortAnswer, 5 = Code
  
  const [options, setOptions] = useState([{ text: '', isCorrect: false }, { text: '', isCorrect: false }]);

  const handleAddOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return; // keep at least 2
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, field: 'text' | 'isCorrect', value: any) => {
    const newOptions = [...options];
    if (field === 'isCorrect' && type === 0) {
      // For MCQ, only one can be correct
      newOptions.forEach(o => o.isCorrect = false);
    }
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText) {
      setError("Question text is required.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const payload: any = {
        questionText,
        marks,
        negativeMarks: negativeMarks > 0 ? negativeMarks : null,
        type: type, // QuestionTypeEnum
      };

      if (type === 0) { // MCQ
        payload.options = options.map((o, i) => ({ text: o.text, isCorrect: o.isCorrect }));
        const correctOpt = payload.options.find((o: any) => o.isCorrect);
        if (correctOpt) {
          payload.correctAnswer = correctOpt.text; // simplification
        }
      }

      await createQuestion(payload);
      navigate('/teacher/questions');
    } catch (err: any) {
      setError(err.message || 'Failed to create question.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8 font-sans pb-24">
      <div>
        <Link to="/teacher/questions" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Question Bank
        </Link>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">New Question</h1>
        <p className="mt-2 text-sm text-muted-foreground">Draft a new question to be used in your exams.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Info */}
        <div className="bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground">Question Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setType(0)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                  type === 0 ? 'border-primary bg-primary/5 text-primary' : 'border-border/50 text-muted-foreground hover:border-border hover:bg-secondary'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" /> Multiple Choice
              </button>
              <button
                type="button"
                onClick={() => setType(3)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                  type === 3 ? 'border-primary bg-primary/5 text-primary' : 'border-border/50 text-muted-foreground hover:border-border hover:bg-secondary'
                }`}
              >
                <AlignLeft className="w-4 h-4" /> Short Answer
              </button>
              <button
                type="button"
                onClick={() => setType(5)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                  type === 5 ? 'border-primary bg-primary/5 text-primary' : 'border-border/50 text-muted-foreground hover:border-border hover:bg-secondary'
                }`}
              >
                <Code className="w-4 h-4" /> Code Challenge
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="questionText" className="text-sm font-bold text-foreground">Question Text</label>
            <textarea
              id="questionText"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
              rows={4}
              placeholder="E.g., What is the time complexity of binary search?"
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label htmlFor="marks" className="text-sm font-bold text-foreground">Marks</label>
              <input
                id="marks"
                type="number"
                min="0.5"
                step="0.5"
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
                required
                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="negativeMarks" className="text-sm font-bold text-foreground">Negative Marks</label>
              <input
                id="negativeMarks"
                type="number"
                min="0"
                step="0.1"
                value={negativeMarks}
                onChange={(e) => setNegativeMarks(Number(e.target.value))}
                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Options (Only for MCQ) */}
        {type === 0 && (
          <div className="bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Answer Options</h2>
              <button 
                type="button"
                onClick={handleAddOption}
                className="inline-flex items-center text-xs font-bold text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Option
              </button>
            </div>
            
            <div className="space-y-3">
              {options.map((opt, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${opt.isCorrect ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border/50 bg-secondary/30'}`}>
                  <button
                    type="button"
                    onClick={() => handleOptionChange(index, 'isCorrect', true)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      opt.isCorrect ? 'border-emerald-500 bg-emerald-500' : 'border-muted-foreground/30 hover:border-emerald-500/50'
                    }`}
                  >
                    {opt.isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                    className="flex-1 bg-transparent border-none text-sm font-medium focus:outline-none focus:ring-0 px-2 py-1"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Link
            to="/teacher/questions"
            className="px-5 py-3 rounded-xl text-sm font-bold bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 inline-flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Question
          </button>
        </div>
      </form>
    </div>
  );
}
