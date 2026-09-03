import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';

interface MiniExam {
  id: string;
  title: string;
  dueDate: string;
}

interface ExamsListProps {
  exams: MiniExam[];
  title?: string;
}

export default function ExamsList({ exams, title = "Active Assessments" }: ExamsListProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-3xl border border-border/10 bg-slate-900/80 p-6 backdrop-blur-xl">
      <h2 className="text-lg font-bold text-primary-foreground mb-6 flex items-center gap-2">
        <FileText className="h-5 w-5 text-emerald-400" />
        {title}
      </h2>

      {exams.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">No exams available.</p>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => (
            <div 
              key={exam.examId}
              className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/50 p-4 transition hover:bg-slate-800"
            >
              <div>
                <h3 className="font-semibold text-slate-200">{exam.title}</h3>
                <p className="text-xs text-slate-500 mt-1">Due: {exam.dueDate}</p>
              </div>
              <button 
                onClick={() => navigate(`/student/exam/${exam.examId}`)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition group-hover:bg-sky-500 group-hover:text-primary-foreground"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}