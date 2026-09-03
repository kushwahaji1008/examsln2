const fs = require('fs');
let content = fs.readFileSync('src/features/student/pages/ResultView.tsx', 'utf8');

const importStr = "import { useParams, Link } from 'react-router-dom';";
const newImports = "import { useParams, Link } from 'react-router-dom';\nimport { getAttemptById, getAttemptQuestions } from '@/services/api/attemptsApi';\nimport { Loader2, AlertCircle } from 'lucide-react';";
content = content.replace(importStr, newImports);

const compStart = "export default function ResultView() {";
const newState = `
  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!attemptId) return;
        const [att, qs] = await Promise.all([
          getAttemptById(attemptId),
          getAttemptQuestions(attemptId)
        ]);
        if (isMounted) {
          setAttempt(att);
          setQuestions(qs);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load result.');
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [attemptId]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="flex items-center gap-3 p-6 bg-destructive/10 border border-destructive/20 rounded-3xl text-destructive text-sm">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <span>{error || 'Attempt not found.'}</span>
        </div>
      </div>
    );
  }

  const score = attempt.totalMarksScored != null && attempt.totalMarksPossible != null && attempt.totalMarksPossible > 0
    ? Math.round((attempt.totalMarksScored / attempt.totalMarksPossible) * 100)
    : 0;
  
  const isPassing = attempt.passed || score >= 50; // default pass is 50% if not specified

  const totalCorrect = questions.filter(q => q.isCorrect).length;
  const totalIncorrect = questions.filter(q => !q.isCorrect && q.userAnswer).length;
  const unattempted = questions.filter(q => !q.userAnswer).length;

  const durationSec = attempt.submittedAt && attempt.startedAt 
    ? Math.floor((new Date(attempt.submittedAt).getTime() - new Date(attempt.startedAt).getTime()) / 1000)
    : 0;
  
  const timeTaken = durationSec > 0 
    ? \`\${Math.floor(durationSec / 60)}m \${durationSec % 60}s\`
    : 'N/A';

  const metrics = [
    { label: 'Total Correct', value: totalCorrect, color: 'text-emerald-500' },
    { label: 'Total Incorrect', value: totalIncorrect, color: 'text-rose-500' },
    { label: 'Unattempted', value: unattempted, color: 'text-amber-500' },
    { label: 'Time Taken', value: timeTaken, color: 'text-sky-500' },
  ];
`;

content = content.replace("export default function ResultView() {\n  const { attemptId } = useParams();\n  const [activeTab, setActiveTab] = useState<'summary' | 'review' | 'certificate'>('summary');\n\n  // Mock Result Data\n  const score = 85;\n  const passingScore = 70;\n  const isPassing = score >= passingScore;\n\n  const metrics = [\n    { label: 'Total Correct', value: 42, color: 'text-emerald-500' },\n    { label: 'Total Incorrect', value: 5, color: 'text-rose-500' },\n    { label: 'Unattempted', value: 3, color: 'text-amber-500' },\n    { label: 'Time Taken', value: '45m 12s', color: 'text-sky-500' },\n  ];\n\n  const questions = [\n    { id: 1, text: 'What is the primary key in a relational database?', userAns: 'A unique identifier', correctAns: 'A unique identifier', isCorrect: true, explanation: 'A primary key uniquely identifies each record in a table.' },\n    { id: 2, text: 'Which SQL statement is used to extract data from a database?', userAns: 'EXTRACT', correctAns: 'SELECT', isCorrect: false, explanation: 'The SELECT statement is used to select data from a database.' },\n  ];", "export default function ResultView() {\n  const { attemptId } = useParams();\n  const [activeTab, setActiveTab] = useState<'summary' | 'review' | 'certificate'>('summary');\n" + newState);

// replace map elements
content = content.replace(/q\.id/g, "q.id || q.questionId || idx");
content = content.replace(/q\.text/g, "q.questionText || q.text");
content = content.replace(/q\.userAns/g, "q.userAnswer");
content = content.replace(/q\.correctAns/g, "q.correctAnswer || (q.correctOptions && q.correctOptions.join(', ')) || 'N/A'");

fs.writeFileSync('src/features/student/pages/ResultView.tsx', content);
